import json
import random
import string
from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import (
    LedgerTransactionType,
    MasterOrderStatus,
    PaymentMethod,
    PaymentStatus,
    SubOrderStatus,
    UserRole,
)
from app.common.pagination import PaginatedResponse, PaginationParams
from app.core.config import settings
from app.core.exceptions import (
    BadRequestException,
    ForbiddenException,
    InsufficientStockException,
    InvalidStateTransitionException,
    NotFoundException,
)
from app.models.order import Order, OrderItem, SubOrder
from app.models.user import User
from app.models.vendor import Vendor
from app.repositories.address_repo import AddressRepository
from app.repositories.cart_repo import CartRepository
from app.repositories.ledger_repo import LedgerRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.order import (
    CheckoutRequest,
    OrderResponse,
    SubOrderFulfillmentUpdate,
    SubOrderResponse,
)


def generate_order_number() -> str:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    random_str = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{timestamp}-{random_str}"


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)
        self.address_repo = AddressRepository(db)
        self.ledger_repo = LedgerRepository(db)

    async def checkout(self, user: User, req: CheckoutRequest) -> Order:
        # 1. Retrieve cart
        cart = await self.cart_repo.get_cart(user_id=user.id)
        if not cart or not cart.items:
            raise BadRequestException("Your cart is empty. Please add products before checking out.")

        # 2. Resolve shipping address snapshot
        address_dict = None
        if req.shipping_address_id:
            addr = await self.address_repo.get_user_address(req.shipping_address_id, user.id)
            if not addr:
                raise NotFoundException("Shipping address", req.shipping_address_id)
            address_dict = {
                "recipient_name": addr.recipient_name,
                "phone": addr.phone,
                "street_address": addr.street_address,
                "unit": addr.unit,
                "city": addr.city,
                "state": addr.state,
                "postal_code": addr.postal_code,
                "country": addr.country,
            }
        elif req.shipping_address:
            address_dict = req.shipping_address.model_dump()
            # Optionally save for user
            address_to_save = req.shipping_address.model_dump()
            address_to_save["user_id"] = user.id
            await self.address_repo.create(address_to_save)
        else:
            # Fallback to user's default address
            addresses = await self.address_repo.get_by_user(user.id)
            default_addr = next((a for a in addresses if a.is_default), addresses[0] if addresses else None)
            if not default_addr:
                raise BadRequestException("Please provide a shipping address for checkout.")
            address_dict = {
                "recipient_name": default_addr.recipient_name,
                "phone": default_addr.phone,
                "street_address": default_addr.street_address,
                "unit": default_addr.unit,
                "city": default_addr.city,
                "state": default_addr.state,
                "postal_code": default_addr.postal_code,
                "country": default_addr.country,
            }

        # 3. Lock variants and validate stock
        vendor_items_map = defaultdict(list)
        total_subtotal = 0.0

        for item in cart.items:
            # Row lock variant for concurrency safety
            variant = await self.product_repo.get_variant_by_id(item.variant_id, for_update=True)
            if not variant or not variant.is_active:
                raise BadRequestException(f"Product variant for '{item.product.title}' is no longer available.")

            if variant.stock_quantity < item.quantity:
                raise InsufficientStockException(variant.product.title, variant.stock_quantity, item.quantity)

            line_total = round(variant.price * item.quantity, 2)
            total_subtotal += line_total

            vendor_items_map[variant.product.vendor_id].append({
                "variant": variant,
                "product": variant.product,
                "vendor": variant.product.vendor,
                "quantity": item.quantity,
                "unit_price": variant.price,
                "total_price": line_total,
            })

        # Calculate Master Order totals
        total_shipping_fee = len(vendor_items_map) * settings.DEFAULT_FLAT_SHIPPING_FEE
        tax_amount = round(total_subtotal * (settings.DEFAULT_TAX_PERCENTAGE / 100.0), 2)
        grand_total = round(total_subtotal + tax_amount + total_shipping_fee, 2)

        # 4. Create Master Order
        order_number = generate_order_number()
        master_order = Order(
            order_number=order_number,
            user_id=user.id,
            subtotal=total_subtotal,
            tax_amount=tax_amount,
            shipping_fee=total_shipping_fee,
            discount_amount=0.0,
            total_amount=grand_total,
            shipping_address_json=json.dumps(address_dict),
            payment_method=req.payment_method,
            payment_status=PaymentStatus.PAID if req.payment_method == PaymentMethod.TEST_PAYMENT else PaymentStatus.PENDING,
            status=MasterOrderStatus.CONFIRMED if req.payment_method == PaymentMethod.TEST_PAYMENT else MasterOrderStatus.PENDING,
        )
        self.db.add(master_order)
        await self.db.flush()

        # 5. Create Vendor Sub-Orders and Order Items, Decrement Stock, Record Ledger
        sub_order_seq = 1
        for v_id, items_list in vendor_items_map.items():
            vendor = items_list[0]["vendor"]
            vendor_subtotal = sum(i["total_price"] for i in items_list)
            vendor_shipping = settings.DEFAULT_FLAT_SHIPPING_FEE
            
            # Commission calculation
            comm_rate = vendor.commission_rate if vendor.commission_rate is not None else settings.DEFAULT_PLATFORM_COMMISSION_PERCENTAGE
            platform_commission = round(vendor_subtotal * (comm_rate / 100.0), 2)
            vendor_payout = round(vendor_subtotal - platform_commission + vendor_shipping, 2)

            sub_order_number = f"{order_number}-{sub_order_seq}"
            sub_order_seq += 1

            sub_order = SubOrder(
                master_order_id=master_order.id,
                vendor_id=v_id,
                sub_order_number=sub_order_number,
                subtotal=vendor_subtotal,
                vendor_shipping_fee=vendor_shipping,
                platform_commission_amount=platform_commission,
                vendor_payout_amount=vendor_payout,
                status=SubOrderStatus.AWAITING_FULFILLMENT,
                notes=req.notes,
            )
            self.db.add(sub_order)
            await self.db.flush()

            # Create line items & decrement stock
            for i_data in items_list:
                var = i_data["variant"]
                order_item = OrderItem(
                    sub_order_id=sub_order.id,
                    product_id=i_data["product"].id,
                    variant_id=var.id,
                    product_title=i_data["product"].title,
                    variant_title=var.title,
                    sku=var.sku,
                    unit_price=i_data["unit_price"],
                    quantity=i_data["quantity"],
                    total_price=i_data["total_price"],
                )
                self.db.add(order_item)

                # Deduct inventory
                var.stock_quantity -= i_data["quantity"]

            # Record in Vendor Ledger
            await self.ledger_repo.record_transaction(
                vendor_id=v_id,
                transaction_type=LedgerTransactionType.CREDIT_SALE,
                amount=vendor_payout,
                sub_order_id=sub_order.id,
                reference_id=sub_order_number,
                description=f"Earnings from Sub-Order {sub_order_number} (Sale: ${vendor_subtotal:.2f}, Fee: -${platform_commission:.2f}, Shipping: +${vendor_shipping:.2f})",
            )

        # 6. Record Status History
        await self.order_repo.add_status_history(
            order_id=master_order.id,
            from_status="NONE",
            to_status=master_order.status.value,
            user_id=user.id,
            note=f"Order placed via {req.payment_method.value}",
        )

        # 7. Clear cart
        await self.cart_repo.clear_cart(cart.id)

        return await self.order_repo.get_by_id_with_relations(master_order.id)

    async def get_user_orders(self, user_id: str, params: PaginationParams) -> PaginatedResponse[OrderResponse]:
        orders, total = await self.order_repo.list_orders_by_user(user_id, skip=params.offset, limit=params.page_size)
        dtos = [self._format_order(o) for o in orders]
        return PaginatedResponse.create(dtos, total, params)

    async def get_order_by_id(self, order_id: str, user: User) -> OrderResponse:
        order = await self.order_repo.get_by_id_with_relations(order_id)
        if not order:
            raise NotFoundException("Order", order_id)

        # Access check: Customer who placed order, Admin, or Seller who has a sub-order
        if user.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN) and order.user_id != user.id:
            if user.vendor_profile:
                has_sub_order = any(so.vendor_id == user.vendor_profile.id for so in order.sub_orders)
                if not has_sub_order:
                    raise ForbiddenException("You do not have access to this order")
            else:
                raise ForbiddenException("You do not have access to this order")

        return self._format_order(order)

    async def list_vendor_sub_orders(
        self, vendor: Vendor, status: Optional[SubOrderStatus], params: PaginationParams
    ) -> PaginatedResponse[SubOrderResponse]:
        sub_orders, total = await self.order_repo.list_sub_orders_by_vendor(
            vendor_id=vendor.id, status=status, skip=params.offset, limit=params.page_size
        )
        dtos = [self._format_sub_order(so) for so in sub_orders]
        return PaginatedResponse.create(dtos, total, params)

    async def update_sub_order_fulfillment(
        self, sub_order_id: str, vendor: Vendor, data: SubOrderFulfillmentUpdate
    ) -> SubOrderResponse:
        sub_order = await self.order_repo.get_sub_order_by_id(sub_order_id)
        if not sub_order:
            raise NotFoundException("Sub-Order", sub_order_id)

        if sub_order.vendor_id != vendor.id:
            raise ForbiddenException("You can only fulfill sub-orders belonging to your store")

        old_status = sub_order.status.value
        sub_order.status = data.status
        if data.shipping_carrier:
            sub_order.shipping_carrier = data.shipping_carrier
        if data.tracking_number:
            sub_order.tracking_number = data.tracking_number
        if data.notes:
            sub_order.notes = data.notes

        # Add history
        await self.order_repo.add_status_history(
            order_id=sub_order.master_order_id,
            sub_order_id=sub_order.id,
            user_id=vendor.user_id,
            from_status=old_status,
            to_status=data.status.value,
            note=f"Carrier: {data.shipping_carrier or 'N/A'}, Tracking: {data.tracking_number or 'N/A'}",
        )

        # Check if master order status needs progression
        master_order = await self.order_repo.get_by_id_with_relations(sub_order.master_order_id)
        if master_order:
            all_delivered = all(so.status == SubOrderStatus.DELIVERED for so in master_order.sub_orders)
            any_shipped = any(so.status in (SubOrderStatus.SHIPPED, SubOrderStatus.DELIVERED) for so in master_order.sub_orders)

            if all_delivered:
                master_order.status = MasterOrderStatus.COMPLETED
            elif any_shipped:
                master_order.status = MasterOrderStatus.PARTIALLY_SHIPPED

        await self.db.flush()
        return self._format_sub_order(sub_order)

    async def cancel_order(self, order_id: str, user: User, reason: Optional[str] = None) -> OrderResponse:
        order = await self.order_repo.get_by_id_with_relations(order_id)
        if not order:
            raise NotFoundException("Order", order_id)

        if user.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN) and order.user_id != user.id:
            raise ForbiddenException("You can only cancel your own orders")

        if order.status in (MasterOrderStatus.COMPLETED, MasterOrderStatus.CANCELLED):
            raise BadRequestException(f"Cannot cancel order in '{order.status.value}' state.")

        # If any sub-order is already shipped, customer cannot cancel directly
        any_shipped = any(so.status in (SubOrderStatus.SHIPPED, SubOrderStatus.DELIVERED) for so in order.sub_orders)
        if any_shipped and user.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise BadRequestException("Order has already been dispatched and cannot be cancelled.")

        # Restore inventory and cancel sub-orders
        for sub_order in order.sub_orders:
            sub_order.status = SubOrderStatus.CANCELLED
            for item in sub_order.items:
                variant = await self.product_repo.get_variant_by_id(item.variant_id)
                if variant:
                    variant.stock_quantity += item.quantity

            # Debit vendor ledger for refund
            await self.ledger_repo.record_transaction(
                vendor_id=sub_order.vendor_id,
                transaction_type=LedgerTransactionType.DEBIT_PAYOUT,
                amount=sub_order.vendor_payout_amount,
                sub_order_id=sub_order.id,
                reference_id=f"REFUND-{sub_order.sub_order_number}",
                description=f"Debit refund for cancelled Sub-Order {sub_order.sub_order_number}",
            )

        old_status = order.status.value
        order.status = MasterOrderStatus.CANCELLED
        order.payment_status = PaymentStatus.REFUNDED

        await self.order_repo.add_status_history(
            order_id=order.id,
            user_id=user.id,
            from_status=old_status,
            to_status=MasterOrderStatus.CANCELLED.value,
            note=f"Cancellation Reason: {reason or 'Customer requested cancellation'}",
        )

        await self.db.flush()
        return self._format_order(order)

    def _format_sub_order(self, so: SubOrder) -> SubOrderResponse:
        return SubOrderResponse(
            id=so.id,
            master_order_id=so.master_order_id,
            vendor_id=so.vendor_id,
            vendor_name=so.vendor.store_name if so.vendor else None,
            sub_order_number=so.sub_order_number,
            subtotal=so.subtotal,
            vendor_shipping_fee=so.vendor_shipping_fee,
            platform_commission_amount=so.platform_commission_amount,
            vendor_payout_amount=so.vendor_payout_amount,
            status=so.status,
            shipping_carrier=so.shipping_carrier,
            tracking_number=so.tracking_number,
            notes=so.notes,
            items=[
                {
                    "id": i.id,
                    "product_id": i.product_id,
                    "variant_id": i.variant_id,
                    "product_title": i.product_title,
                    "variant_title": i.variant_title,
                    "sku": i.sku,
                    "unit_price": i.unit_price,
                    "quantity": i.quantity,
                    "total_price": i.total_price,
                }
                for i in (so.items or [])
            ],
            created_at=so.created_at,
            updated_at=so.updated_at,
        )

    def _format_order(self, order: Order) -> OrderResponse:
        sub_order_dtos = [self._format_sub_order(so) for so in order.sub_orders]

        return OrderResponse(
            id=order.id,
            order_number=order.order_number,
            user_id=order.user_id,
            subtotal=order.subtotal,
            tax_amount=order.tax_amount,
            shipping_fee=order.shipping_fee,
            discount_amount=order.discount_amount,
            total_amount=order.total_amount,
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            status=order.status,
            shipping_address_json=order.shipping_address_json,
            sub_orders=sub_order_dtos,
            status_history=[
                {
                    "id": h.id,
                    "from_status": h.from_status,
                    "to_status": h.to_status,
                    "note": h.note,
                    "created_at": h.created_at,
                }
                for h in (order.status_history or [])
            ],
            created_at=order.created_at,
            updated_at=order.updated_at,
        )

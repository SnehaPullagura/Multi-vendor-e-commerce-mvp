from collections import defaultdict
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import BadRequestException, InsufficientStockException, NotFoundException
from app.models.cart import Cart
from app.repositories.cart_repo import CartRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.cart import CartItemCreate, CartItemResponse, CartResponse, VendorCartGroup


class CartService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)

    async def get_formatted_cart(self, user_id: Optional[str] = None, session_id: Optional[str] = None) -> CartResponse:
        cart = await self.cart_repo.get_or_create_cart(user_id=user_id, session_id=session_id)
        
        # Group items by vendor
        vendor_groups_map = defaultdict(lambda: {"items": [], "subtotal": 0.0, "store_name": ""})
        total_items = 0
        subtotal = 0.0

        item_responses = []
        for item in cart.items:
            variant = item.variant
            product = variant.product
            vendor = product.vendor

            unit_price = variant.price
            total_price = unit_price * item.quantity
            img_url = variant.images[0].image_url if variant.images else (product.images[0].image_url if product.images else None)

            item_dto = CartItemResponse(
                id=item.id,
                cart_id=cart.id,
                product_id=product.id,
                variant_id=variant.id,
                quantity=item.quantity,
                unit_price=unit_price,
                total_price=total_price,
                product_title=product.title,
                variant_title=variant.title,
                sku=variant.sku,
                image_url=img_url,
                vendor_id=vendor.id,
                vendor_name=vendor.store_name,
            )
            item_responses.append(item_dto)

            # Accumulate
            group = vendor_groups_map[vendor.id]
            group["store_name"] = vendor.store_name
            group["items"].append(item_dto)
            group["subtotal"] += total_price

            total_items += item.quantity
            subtotal += total_price

        # Build vendor groups with shipping
        vendor_groups = []
        estimated_shipping = 0.0
        for v_id, g_data in vendor_groups_map.items():
            # Flat shipping fee per vendor
            v_shipping = settings.DEFAULT_FLAT_SHIPPING_FEE if g_data["items"] else 0.0
            estimated_shipping += v_shipping

            vendor_groups.append(
                VendorCartGroup(
                    vendor_id=v_id,
                    store_name=g_data["store_name"],
                    items=g_data["items"],
                    subtotal=round(g_data["subtotal"], 2),
                    estimated_shipping=round(v_shipping, 2),
                )
            )

        estimated_tax = round(subtotal * (settings.DEFAULT_TAX_PERCENTAGE / 100.0), 2)
        grand_total = round(subtotal + estimated_tax + estimated_shipping, 2)

        return CartResponse(
            id=cart.id,
            user_id=cart.user_id,
            session_id=cart.session_id,
            items=item_responses,
            vendor_groups=vendor_groups,
            total_items=total_items,
            subtotal=round(subtotal, 2),
            estimated_tax=estimated_tax,
            estimated_shipping=round(estimated_shipping, 2),
            grand_total=grand_total,
        )

    async def add_item(self, data: CartItemCreate, user_id: Optional[str] = None, session_id: Optional[str] = None) -> CartResponse:
        variant = await self.product_repo.get_variant_by_id(data.variant_id)
        if not variant or not variant.is_active:
            raise NotFoundException("Product variant", data.variant_id)

        # Check stock availability
        cart = await self.cart_repo.get_or_create_cart(user_id=user_id, session_id=session_id)
        existing_item = await self.cart_repo.get_cart_item(cart.id, data.variant_id)
        current_qty = existing_item.quantity if existing_item else 0
        total_requested = current_qty + data.quantity

        if variant.stock_quantity < total_requested:
            raise InsufficientStockException(variant.product.title, variant.stock_quantity, total_requested)

        await self.cart_repo.add_or_update_item(
            cart_id=cart.id,
            product_id=variant.product_id,
            variant_id=variant.id,
            quantity=data.quantity,
            unit_price=variant.price,
        )

        return await self.get_formatted_cart(user_id=user_id, session_id=session_id)

    async def update_item_quantity(self, item_id: str, quantity: int, user_id: Optional[str] = None, session_id: Optional[str] = None) -> CartResponse:
        cart = await self.cart_repo.get_cart(user_id=user_id, session_id=session_id)
        if not cart:
            raise NotFoundException("Cart")

        item = next((i for i in cart.items if i.id == item_id), None)
        if not item:
            raise NotFoundException("Cart item", item_id)

        variant = await self.product_repo.get_variant_by_id(item.variant_id)
        if not variant or variant.stock_quantity < quantity:
            raise InsufficientStockException(item.product.title, variant.stock_quantity if variant else 0, quantity)

        item.quantity = quantity
        await self.db.flush()

        return await self.get_formatted_cart(user_id=user_id, session_id=session_id)

    async def remove_item(self, item_id: str, user_id: Optional[str] = None, session_id: Optional[str] = None) -> CartResponse:
        cart = await self.cart_repo.get_cart(user_id=user_id, session_id=session_id)
        if not cart:
            raise NotFoundException("Cart")

        await self.cart_repo.remove_item(item_id, cart.id)
        return await self.get_formatted_cart(user_id=user_id, session_id=session_id)

    async def clear_cart(self, user_id: Optional[str] = None, session_id: Optional[str] = None) -> None:
        cart = await self.cart_repo.get_cart(user_id=user_id, session_id=session_id)
        if cart:
            await self.cart_repo.clear_cart(cart.id)

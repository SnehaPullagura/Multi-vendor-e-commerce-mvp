from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import SubOrderStatus
from app.common.pagination import PaginatedResponse, PaginationParams
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.order import (
    CheckoutRequest,
    OrderCancelRequest,
    OrderResponse,
    SubOrderFulfillmentUpdate,
    SubOrderResponse,
)
from app.services.order_service import OrderService

router = APIRouter()


@router.post("/checkout", response_model=ApiResponse[OrderResponse], status_code=status.HTTP_201_CREATED)
async def checkout(
    req: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Complete checkout, generate master order and vendor sub-orders atomically."""
    service = OrderService(db)
    order = await service.checkout(current_user, req)
    formatted = service._format_order(order)
    return ApiResponse.ok(formatted, message="Order placed successfully")


@router.get("", response_model=ApiResponse[PaginatedResponse[OrderResponse]])
async def get_my_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve order history for the authenticated customer."""
    service = OrderService(db)
    params = PaginationParams(page=page, page_size=page_size)
    orders = await service.get_user_orders(current_user.id, params)
    return ApiResponse.ok(orders)


@router.get("/vendor/sub-orders", response_model=ApiResponse[PaginatedResponse[SubOrderResponse]])
async def get_vendor_sub_orders(
    status: Optional[SubOrderStatus] = Query(None, description="Filter sub-orders by fulfillment status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve fulfillment sub-orders assigned to the authenticated seller's store."""
    service = OrderService(db)
    params = PaginationParams(page=page, page_size=page_size)
    sub_orders = await service.list_vendor_sub_orders(vendor, status, params)
    return ApiResponse.ok(sub_orders)


@router.put("/vendor/sub-orders/{sub_order_id}/fulfillment", response_model=ApiResponse[SubOrderResponse])
async def update_sub_order_fulfillment(
    sub_order_id: str,
    data: SubOrderFulfillmentUpdate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Update fulfillment status (e.g. PACKED, SHIPPED, DELIVERED) and tracking details for a vendor sub-order."""
    service = OrderService(db)
    updated = await service.update_sub_order_fulfillment(sub_order_id, vendor, data)
    return ApiResponse.ok(updated, message="Sub-order fulfillment status updated")


@router.get("/{order_id}", response_model=ApiResponse[OrderResponse])
async def get_order_by_id(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed order receipt with sub-orders and tracking timeline."""
    service = OrderService(db)
    order = await service.get_order_by_id(order_id, current_user)
    return ApiResponse.ok(order)


@router.post("/{order_id}/cancel", response_model=ApiResponse[OrderResponse])
async def cancel_order(
    order_id: str,
    req: Optional[OrderCancelRequest] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cancel an eligible order and automatically restore product inventory."""
    service = OrderService(db)
    reason = req.reason if req else None
    cancelled = await service.cancel_order(order_id, current_user, reason)
    return ApiResponse.ok(cancelled, message="Order cancelled and stock restored")

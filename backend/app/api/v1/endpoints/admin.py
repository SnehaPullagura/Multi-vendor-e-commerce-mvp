from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import MasterOrderStatus, UserRole, VendorStatus
from app.common.pagination import PaginatedResponse, PaginationParams
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.repositories.order_repo import OrderRepository
from app.repositories.user_repo import UserRepository
from app.schemas.admin import PlatformStatsResponse
from app.schemas.order import OrderResponse
from app.schemas.user import UserResponse
from app.schemas.vendor import VendorResponse, VendorStatusUpdate
from app.services.admin_service import AdminService
from app.services.order_service import OrderService
from app.services.vendor_service import VendorService

router = APIRouter()


@router.get("/stats", response_model=ApiResponse[PlatformStatsResponse])
async def get_platform_overview_stats(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve platform-wide KPI metrics, GMV, total commissions, and counts."""
    service = AdminService(db)
    stats = await service.get_platform_stats()
    return ApiResponse.ok(stats)


@router.get("/vendors", response_model=ApiResponse[List[VendorResponse]])
async def list_all_vendors_admin(
    status: Optional[VendorStatus] = Query(None, description="Filter by KYC review status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List vendors for moderation and KYC approval."""
    service = VendorService(db)
    vendors = await service.list_vendors(status=status, skip=skip, limit=limit)
    return ApiResponse.ok([VendorResponse.model_validate(v) for v in vendors])


@router.put("/vendors/{vendor_id}/status", response_model=ApiResponse[VendorResponse])
async def update_vendor_kyc_status(
    vendor_id: str,
    data: VendorStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Approve, Suspend, or Reject a seller's store."""
    service = VendorService(db)
    updated = await service.update_status(vendor_id, data)
    return ApiResponse.ok(VendorResponse.model_validate(updated), message=f"Vendor status set to {data.status.value}")


@router.get("/orders", response_model=ApiResponse[PaginatedResponse[OrderResponse]])
async def list_all_platform_orders(
    status: Optional[MasterOrderStatus] = Query(None, description="Filter by order status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all customer orders across all vendors on the platform."""
    order_repo = OrderRepository(db)
    order_service = OrderService(db)
    params = PaginationParams(page=page, page_size=page_size)
    orders, total = await order_repo.list_all_orders_admin(status=status, skip=params.offset, limit=params.page_size)
    dtos = [order_service._format_order(o) for o in orders]
    return ApiResponse.ok(PaginatedResponse.create(dtos, total, params))


@router.get("/users", response_model=ApiResponse[List[UserResponse]])
async def list_all_users(
    role: Optional[UserRole] = Query(None),
    is_active: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List registered users with role and status filters."""
    user_repo = UserRepository(db)
    users = await user_repo.list_users(role=role, is_active=is_active, skip=skip, limit=limit)
    return ApiResponse.ok([UserResponse.model_validate(u) for u in users])


@router.put("/users/{user_id}/toggle-active", response_model=ApiResponse[UserResponse])
async def toggle_user_active(
    user_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Activate or deactivate a user account."""
    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise NotFoundException("User", user_id)
    user.is_active = not user.is_active
    await db.flush()
    return ApiResponse.ok(UserResponse.model_validate(user), message="User status updated")

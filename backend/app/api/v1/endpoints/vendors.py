from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import VendorStatus
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_vendor
from app.models.vendor import Vendor
from app.schemas.vendor import VendorProfileUpdate, VendorPublicResponse, VendorResponse
from app.services.vendor_service import VendorService

router = APIRouter()


@router.get("/me", response_model=ApiResponse[VendorResponse])
async def get_my_vendor_profile(vendor: Vendor = Depends(get_current_vendor)):
    """Get the authenticated seller's store profile."""
    return ApiResponse.ok(VendorResponse.model_validate(vendor))


@router.put("/me", response_model=ApiResponse[VendorResponse])
async def update_my_vendor_profile(
    data: VendorProfileUpdate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Update the authenticated seller's store profile."""
    service = VendorService(db)
    updated = await service.update_profile(vendor, data)
    return ApiResponse.ok(VendorResponse.model_validate(updated), message="Store profile updated")


@router.get("/store/{slug}", response_model=ApiResponse[VendorPublicResponse])
async def get_public_vendor_store(slug: str, db: AsyncSession = Depends(get_db)):
    """Get public store profile for a vendor."""
    service = VendorService(db)
    vendor = await service.get_by_slug(slug)
    return ApiResponse.ok(VendorPublicResponse.model_validate(vendor))


@router.get("", response_model=ApiResponse[List[VendorPublicResponse]])
async def list_public_vendors(
    status: Optional[VendorStatus] = VendorStatus.APPROVED,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List approved vendors for marketplace discovery."""
    service = VendorService(db)
    vendors = await service.list_vendors(status=status, skip=skip, limit=limit)
    return ApiResponse.ok([VendorPublicResponse.model_validate(v) for v in vendors])

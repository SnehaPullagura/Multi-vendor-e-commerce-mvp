from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin, get_current_user, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.promotion import PromotionCreate, PromotionResponse, ValidateCouponRequest, ValidateCouponResponse
from app.services.promotion_service import PromotionService

router = APIRouter()

@router.get("/active", response_model=ApiResponse[List[PromotionResponse]])
async def list_active_promotions(vendor_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    service = PromotionService(db)
    promos = await service.repo.list_active_promotions(vendor_id=vendor_id)
    return ApiResponse.ok([PromotionResponse.model_validate(p) for p in promos])

@router.post("/validate-coupon", response_model=ApiResponse[ValidateCouponResponse])
async def validate_coupon(req: ValidateCouponRequest, user: Optional[User] = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = PromotionService(db)
    result = await service.validate_coupon(req, user=user)
    return ApiResponse.ok(result)

@router.post("", response_model=ApiResponse[PromotionResponse], status_code=status.HTTP_201_CREATED)
async def create_promotion(data: PromotionCreate, vendor: Vendor = Depends(get_current_vendor), db: AsyncSession = Depends(get_db)):
    service = PromotionService(db)
    created = await service.create_promotion(data, vendor=vendor)
    return ApiResponse.ok(PromotionResponse.model_validate(created), message="Promotion created successfully")

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.rma import ReturnRequestCreate, ReturnRequestResponse
from app.services.rma_service import RMAService

router = APIRouter()

@router.get("/my-returns", response_model=ApiResponse[List[ReturnRequestResponse]])
async def list_my_returns(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = RMAService(db)
    returns = await service.repo.list_by_user(user.id)
    return ApiResponse.ok([ReturnRequestResponse.model_validate(r) for r in returns])

@router.get("/vendor-returns", response_model=ApiResponse[List[ReturnRequestResponse]])
async def list_vendor_returns(vendor: Vendor = Depends(get_current_vendor), db: AsyncSession = Depends(get_db)):
    service = RMAService(db)
    returns = await service.repo.list_by_vendor(vendor.id)
    return ApiResponse.ok([ReturnRequestResponse.model_validate(r) for r in returns])

@router.post("", response_model=ApiResponse[ReturnRequestResponse], status_code=status.HTTP_201_CREATED)
async def create_return_request(vendor_id: str, data: ReturnRequestCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = RMAService(db)
    created = await service.create_return_request(user, vendor_id, data)
    return ApiResponse.ok(ReturnRequestResponse.model_validate(created), message="Return request submitted")

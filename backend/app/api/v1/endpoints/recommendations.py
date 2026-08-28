from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/frequently-bought-together/{product_id}", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_frequently_bought_together(
    product_id: str,
    limit: int = Query(4, ge=1, le=10),
    db: AsyncSession = Depends(get_db)
):
    service = RecommendationService(db)
    items = await service.get_frequently_bought_together(product_id, limit=limit)
    return ApiResponse.ok(items)

@router.get("/personalized", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_personalized_recommendations(
    limit: int = Query(8, ge=1, le=20),
    user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = RecommendationService(db)
    user_id = user.id if user else "guest"
    items = await service.get_personalized_recommendations(user_id, limit=limit)
    return ApiResponse.ok(items)

@router.get("/trending", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_trending_products(
    days: int = Query(7, ge=1, le=30),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    service = RecommendationService(db)
    items = await service.get_trending_products(days=days, limit=limit)
    return ApiResponse.ok(items)

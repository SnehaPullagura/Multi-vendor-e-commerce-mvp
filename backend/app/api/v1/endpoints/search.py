from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.pagination import PaginatedResponse, PaginationParams
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.schemas.product import ProductResponse
from app.services.search_service import SearchService

router = APIRouter()


@router.get("", response_model=ApiResponse[PaginatedResponse[ProductResponse]])
async def search_products(
    q: Optional[str] = Query(None, description="Search keyword in title, description, or brand"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    vendor_id: Optional[str] = Query(None, description="Filter by vendor ID"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    is_featured: Optional[bool] = Query(None, description="Filter featured products"),
    sort_by: Optional[str] = Query("newest", description="Sorting: newest, price_asc, price_desc, title_asc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Faceted search and discovery endpoint for marketplace catalog."""
    service = SearchService(db)
    params = PaginationParams(page=page, page_size=page_size)
    results = await service.search_products(
        category_id=category_id,
        vendor_id=vendor_id,
        query_str=q,
        min_price=min_price,
        max_price=max_price,
        brand=brand,
        is_featured=is_featured,
        sort_by=sort_by,
        params=params,
    )
    return ApiResponse.ok(results)

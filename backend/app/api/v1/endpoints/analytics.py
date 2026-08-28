"""Analytics API endpoints for vendor and platform-wide metrics."""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin, get_current_vendor
from app.models.vendor import Vendor
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/vendor-revenue", response_model=ApiResponse)
async def get_vendor_revenue(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Get revenue analytics for the authenticated vendor."""
    service = AnalyticsService(db)
    sd = datetime.fromisoformat(start_date) if start_date else None
    ed = datetime.fromisoformat(end_date) if end_date else None
    data = await service.calculate_vendor_revenue(vendor.id, sd, ed)
    return ApiResponse.ok(data)


@router.get("/platform-gmv", response_model=ApiResponse)
async def get_platform_gmv(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    admin=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get platform-wide GMV metrics. Admin only."""
    service = AnalyticsService(db)
    sd = datetime.fromisoformat(start_date) if start_date else None
    ed = datetime.fromisoformat(end_date) if end_date else None
    data = await service.get_platform_gmv(sd, ed)
    return ApiResponse.ok(data)


@router.get("/top-products", response_model=ApiResponse)
async def get_top_products(
    limit: int = Query(10, ge=1, le=100),
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Get top-selling products for the authenticated vendor."""
    service = AnalyticsService(db)
    data = await service.get_top_products(vendor.id, limit=limit)
    return ApiResponse.ok(data)


@router.get("/order-trends", response_model=ApiResponse)
async def get_order_trends(
    granularity: str = Query("daily"),
    days: int = Query(30, ge=1, le=365),
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Get order volume trends over time for the authenticated vendor."""
    service = AnalyticsService(db)
    data = await service.get_order_volume_trends(vendor.id, granularity=granularity, days=days)
    return ApiResponse.ok(data)


@router.get("/category-breakdown", response_model=ApiResponse)
async def get_category_breakdown(
    admin=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get revenue breakdown by product category. Admin only."""
    service = AnalyticsService(db)
    data = await service.get_category_breakdown()
    return ApiResponse.ok(data)


@router.get("/conversion-funnel", response_model=ApiResponse)
async def get_conversion_funnel(
    admin=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get cart-to-order conversion funnel metrics. Admin only."""
    service = AnalyticsService(db)
    data = await service.get_conversion_funnel_metrics()
    return ApiResponse.ok(data)

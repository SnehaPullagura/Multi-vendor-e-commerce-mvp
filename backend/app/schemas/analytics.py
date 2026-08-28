"""Pydantic schemas for analytics response data."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class VendorRevenueResponse(BaseModel):
    vendor_id: str
    order_count: int
    gross_revenue: float
    total_commission: float
    net_revenue: float
    average_order_value: float
    period: Dict[str, Optional[str]]


class PlatformGMVResponse(BaseModel):
    total_orders: int
    gmv: float
    average_order_value: float
    growth_percentage: float
    previous_period_gmv: float


class TopProductResponse(BaseModel):
    product_id: str
    product_title: str
    units_sold: int
    total_revenue: float
    order_count: int


class OrderTrendDataPoint(BaseModel):
    period: str
    orders: int
    revenue: float


class CategoryBreakdownItem(BaseModel):
    category: str
    item_count: int
    revenue: float
    units_sold: int
    revenue_share_pct: float


class ConversionFunnelResponse(BaseModel):
    total_carts_created: int
    total_orders_placed: int
    cart_to_order_conversion_rate: float
    estimated_cart_abandonment_rate: float

"""Pydantic schemas for the shipping management module."""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ShipmentCreate(BaseModel):
    sub_order_id: str
    carrier: str
    tracking_number: Optional[str] = None
    weight_oz: Optional[float] = None
    dimensions_length: Optional[float] = None
    dimensions_width: Optional[float] = None
    dimensions_height: Optional[float] = None
    signature_required: bool = False


class ShipmentStatusUpdateResponse(BaseModel):
    id: str
    status: str
    location: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ShipmentResponse(BaseModel):
    id: str
    sub_order_id: str
    vendor_id: str
    carrier: str
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    status: str
    shipped_at: Optional[datetime] = None
    estimated_delivery_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    shipping_cost: Decimal
    weight_oz: Optional[float] = None
    signature_required: bool
    created_at: datetime
    status_updates: List[ShipmentStatusUpdateResponse] = []
    model_config = ConfigDict(from_attributes=True)


class ShippingRateResponse(BaseModel):
    carrier: str
    service_level: str
    base_rate: float
    weight_surcharge: float
    fuel_surcharge_pct: float
    total_rate: float
    estimated_days: str


class DeliveryEstimateResponse(BaseModel):
    carrier: str
    origin_zip: str
    destination_zip: str
    estimated_min_date: str
    estimated_max_date: str
    business_days_range: str

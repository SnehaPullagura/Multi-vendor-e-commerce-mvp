from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class WarehouseCreate(BaseModel):
    name: str
    code: str
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str = "United States"
    is_primary: bool = False


class WarehouseResponse(WarehouseCreate):
    id: str
    vendor_id: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


class StockAdjustmentRequest(BaseModel):
    warehouse_id: str
    variant_id: str
    quantity_change: int
    movement_type: str = "ADJUSTMENT"
    reason: str
    reference_id: Optional[str] = None


class WarehouseStockResponse(BaseModel):
    id: str
    warehouse_id: str
    warehouse_name: Optional[str] = None
    variant_id: str
    sku: Optional[str] = None
    product_title: Optional[str] = None
    quantity_on_hand: int
    quantity_reserved: int
    quantity_available: int
    reorder_threshold: int
    bin_location: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

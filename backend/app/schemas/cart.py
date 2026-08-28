from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class CartItemCreate(BaseModel):
    variant_id: str
    quantity: int = Field(default=1, gt=0)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemResponse(BaseModel):
    id: str
    cart_id: str
    product_id: str
    variant_id: str
    quantity: int
    unit_price: float
    total_price: float
    product_title: str
    variant_title: str
    sku: str
    image_url: Optional[str] = None
    vendor_id: str
    vendor_name: str

    model_config = ConfigDict(from_attributes=True)


class VendorCartGroup(BaseModel):
    vendor_id: str
    store_name: str
    items: List[CartItemResponse]
    subtotal: float
    estimated_shipping: float


class CartResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    items: List[CartItemResponse] = []
    vendor_groups: List[VendorCartGroup] = []
    total_items: int = 0
    subtotal: float = 0.0
    estimated_tax: float = 0.0
    estimated_shipping: float = 0.0
    grand_total: float = 0.0

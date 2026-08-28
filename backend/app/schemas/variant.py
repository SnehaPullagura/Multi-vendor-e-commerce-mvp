from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ProductImageBase(BaseModel):
    image_url: str
    is_primary: bool = False
    display_order: int = 0
    variant_id: Optional[str] = None


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageResponse(ProductImageBase):
    id: str
    product_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VariantBase(BaseModel):
    sku: str = Field(min_length=2)
    title: str = Field(min_length=1)  # e.g., "Default" or "Blue / Large"
    price: float = Field(gt=0)
    cost_price: Optional[float] = None
    stock_quantity: int = Field(ge=0, default=0)
    low_stock_threshold: int = Field(ge=0, default=5)
    attributes_json: Optional[str] = None  # e.g., '{"size": "XL", "color": "Navy"}'
    is_active: bool = True


class VariantCreate(VariantBase):
    pass


class VariantUpdate(BaseModel):
    sku: Optional[str] = None
    title: Optional[str] = None
    price: Optional[float] = None
    cost_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    attributes_json: Optional[str] = None
    is_active: Optional[bool] = None


class VariantResponse(VariantBase):
    id: str
    product_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

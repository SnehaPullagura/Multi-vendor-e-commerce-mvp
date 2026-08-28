from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.common.enums import ProductStatus
from app.schemas.variant import ProductImageResponse, VariantCreate, VariantResponse
from app.schemas.category import CategoryResponse
from app.schemas.vendor import VendorPublicResponse


class ProductBase(BaseModel):
    title: str = Field(min_length=2)
    slug: str
    description: str
    brand: Optional[str] = None
    base_price: float = Field(gt=0)
    category_id: str
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class ProductCreate(BaseModel):
    title: str = Field(min_length=2)
    slug: Optional[str] = None
    description: str
    brand: Optional[str] = None
    base_price: float = Field(gt=0)
    category_id: str
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    variants: Optional[List[VariantCreate]] = None
    images: Optional[List[str]] = None  # URLs


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    base_price: Optional[float] = None
    category_id: Optional[str] = None
    status: Optional[ProductStatus] = None
    is_featured: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class ProductStatusUpdate(BaseModel):
    status: ProductStatus


class ProductResponse(BaseModel):
    id: str
    vendor_id: str
    category_id: str
    title: str
    slug: str
    description: str
    brand: Optional[str] = None
    base_price: float
    status: ProductStatus
    is_featured: bool
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    variants: List[VariantResponse] = []
    images: List[ProductImageResponse] = []
    category: Optional[CategoryResponse] = None
    vendor: Optional[VendorPublicResponse] = None

    model_config = ConfigDict(from_attributes=True)

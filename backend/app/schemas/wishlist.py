from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class WishlistItemCreate(BaseModel):
    product_id: str
    product_variant_id: Optional[str] = None
    notes: Optional[str] = None


class WishlistItemResponse(BaseModel):
    id: str
    product_id: str
    product_title: Optional[str] = None
    product_variant_id: Optional[str] = None
    variant_title: Optional[str] = None
    added_price: Decimal
    current_price: Optional[Decimal] = None
    in_stock: bool = True
    notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class WishlistResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    is_public: bool
    share_token: str
    items: List[WishlistItemResponse] = []
    model_config = ConfigDict(from_attributes=True)

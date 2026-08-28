from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class PromotionRuleCreate(BaseModel):
    rule_type: str
    target_id: Optional[str] = None
    rule_value: Optional[str] = None
    is_inclusive: bool = True


class PromotionRuleResponse(PromotionRuleCreate):
    id: str
    model_config = ConfigDict(from_attributes=True)


class CouponCreate(BaseModel):
    code: str
    is_single_use: bool = False
    expires_at: Optional[datetime] = None


class CouponResponse(CouponCreate):
    id: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


class PromotionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    discount_type: str = "PERCENTAGE"
    discount_value: Decimal = Field(gt=0)
    scope: str = "PLATFORM_WIDE"
    min_order_amount: Decimal = Decimal("0.00")
    max_discount_amount: Optional[Decimal] = None
    usage_limit: Optional[int] = None
    per_user_limit: int = 1
    is_stackable: bool = False
    starts_at: datetime
    ends_at: datetime
    banner_url: Optional[str] = None
    coupons: List[CouponCreate] = []
    rules: List[PromotionRuleCreate] = []


class PromotionResponse(BaseModel):
    id: str
    vendor_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    slug: str
    discount_type: str
    discount_value: Decimal
    scope: str
    min_order_amount: Decimal
    max_discount_amount: Optional[Decimal] = None
    usage_limit: Optional[int] = None
    usage_count: int
    per_user_limit: int
    is_stackable: bool
    is_active: bool
    starts_at: datetime
    ends_at: datetime
    banner_url: Optional[str] = None
    coupons: List[CouponResponse] = []
    rules: List[PromotionRuleResponse] = []
    model_config = ConfigDict(from_attributes=True)


class ValidateCouponRequest(BaseModel):
    code: str
    subtotal: Decimal
    vendor_ids: List[str] = []
    category_ids: List[str] = []


class ValidateCouponResponse(BaseModel):
    is_valid: bool
    discount_amount: Decimal
    message: str
    promotion: Optional[PromotionResponse] = None

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.common.enums import VendorStatus


class VendorBase(BaseModel):
    store_name: str = Field(min_length=2)
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    business_email: EmailStr
    phone: str
    tax_id: Optional[str] = None
    bank_account_details: Optional[str] = None
    status: VendorStatus = VendorStatus.PENDING_REVIEW
    commission_rate: float = 10.0
    rating: float = 5.0


class VendorProfileUpdate(BaseModel):
    store_name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    business_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    tax_id: Optional[str] = None
    bank_account_details: Optional[str] = None


class VendorStatusUpdate(BaseModel):
    status: VendorStatus
    rejection_reason: Optional[str] = None
    commission_rate: Optional[float] = None


class VendorResponse(VendorBase):
    id: str
    user_id: str
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VendorPublicResponse(BaseModel):
    id: str
    store_name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    rating: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

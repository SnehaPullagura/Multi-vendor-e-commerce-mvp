from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.common.enums import AddressType


class AddressBase(BaseModel):
    recipient_name: str = Field(min_length=2)
    phone: str = Field(min_length=5)
    street_address: str = Field(min_length=3)
    unit: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "United States"
    address_type: AddressType = AddressType.SHIPPING
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    recipient_name: Optional[str] = None
    phone: Optional[str] = None
    street_address: Optional[str] = None
    unit: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    address_type: Optional[AddressType] = None
    is_default: Optional[bool] = None


class AddressResponse(AddressBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

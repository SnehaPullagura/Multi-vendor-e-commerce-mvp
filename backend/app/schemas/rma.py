from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ReturnItemRequest(BaseModel):
    order_item_id: str
    quantity: int


class ReturnRequestCreate(BaseModel):
    sub_order_id: str
    reason_category: str
    customer_notes: Optional[str] = None
    items: List[ReturnItemRequest]


class ReturnItemResponse(BaseModel):
    id: str
    order_item_id: str
    product_title: Optional[str] = None
    variant_title: Optional[str] = None
    quantity: int
    refund_amount: Decimal
    model_config = ConfigDict(from_attributes=True)


class ReturnRequestResponse(BaseModel):
    id: str
    rma_number: str
    sub_order_id: str
    user_id: str
    vendor_id: str
    vendor_name: Optional[str] = None
    status: str
    reason_category: str
    customer_notes: Optional[str] = None
    vendor_notes: Optional[str] = None
    return_tracking_number: Optional[str] = None
    return_carrier: Optional[str] = None
    total_refund_amount: Decimal
    restocking_fee: Decimal
    created_at: datetime
    items: List[ReturnItemResponse] = []
    model_config = ConfigDict(from_attributes=True)

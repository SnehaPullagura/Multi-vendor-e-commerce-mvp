from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.common.enums import MasterOrderStatus, PaymentMethod, PaymentStatus, SubOrderStatus
from app.schemas.address import AddressCreate


class CheckoutRequest(BaseModel):
    shipping_address_id: Optional[str] = None
    shipping_address: Optional[AddressCreate] = None
    payment_method: PaymentMethod = PaymentMethod.TEST_PAYMENT
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    variant_id: str
    product_title: str
    variant_title: str
    sku: str
    unit_price: float
    quantity: int
    total_price: float

    model_config = ConfigDict(from_attributes=True)


class SubOrderResponse(BaseModel):
    id: str
    master_order_id: str
    vendor_id: str
    vendor_name: Optional[str] = None
    sub_order_number: str
    subtotal: float
    vendor_shipping_fee: float
    platform_commission_amount: float
    vendor_payout_amount: float
    status: SubOrderStatus
    shipping_carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderStatusHistoryResponse(BaseModel):
    id: str
    from_status: str
    to_status: str
    note: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    subtotal: float
    tax_amount: float
    shipping_fee: float
    discount_amount: float
    total_amount: float
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    status: MasterOrderStatus
    shipping_address_json: str
    sub_orders: List[SubOrderResponse] = []
    status_history: List[OrderStatusHistoryResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubOrderFulfillmentUpdate(BaseModel):
    status: SubOrderStatus
    shipping_carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None


class OrderCancelRequest(BaseModel):
    reason: Optional[str] = None

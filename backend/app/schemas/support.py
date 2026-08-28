from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TicketMessageCreate(BaseModel):
    message_text: str
    is_internal_note: bool = False


class TicketMessageResponse(BaseModel):
    id: str
    sender_user_id: str
    sender_name: Optional[str] = None
    sender_role: str
    message_text: str
    is_internal_note: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SupportTicketCreate(BaseModel):
    subject: str
    category: str = "ORDER_INQUIRY"
    priority: str = "MEDIUM"
    vendor_id: Optional[str] = None
    order_id: Optional[str] = None
    initial_message: str


class SupportTicketResponse(BaseModel):
    id: str
    ticket_number: str
    user_id: str
    user_name: Optional[str] = None
    vendor_id: Optional[str] = None
    vendor_name: Optional[str] = None
    order_id: Optional[str] = None
    subject: str
    category: str
    priority: str
    status: str
    created_at: datetime
    messages: List[TicketMessageResponse] = []
    model_config = ConfigDict(from_attributes=True)

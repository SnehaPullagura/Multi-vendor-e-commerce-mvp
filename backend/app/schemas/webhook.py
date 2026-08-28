"""Pydantic schemas for webhook management module."""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class WebhookCreate(BaseModel):
    url: str
    events: List[str]
    description: Optional[str] = None


class WebhookResponse(BaseModel):
    id: str
    vendor_id: str
    url: str
    events: str
    description: Optional[str] = None
    is_active: bool
    failure_count: int
    last_triggered_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class WebhookDeliveryResponse(BaseModel):
    id: str
    webhook_id: str
    event_type: str
    status: str
    attempt_number: int
    response_status: Optional[int] = None
    response_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

"""Webhook registration and delivery tracking models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Webhook(Base):
    __tablename__ = "webhooks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False, index=True)
    url = Column(Text, nullable=False)
    secret = Column(String(64), nullable=False)
    events = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    failure_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=5)
    last_triggered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vendor = relationship("Vendor", backref="webhooks")
    deliveries = relationship("WebhookDelivery", back_populates="webhook", order_by="WebhookDelivery.created_at.desc()")


class WebhookDelivery(Base):
    __tablename__ = "webhook_deliveries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    webhook_id = Column(String(36), ForeignKey("webhooks.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)
    payload = Column(Text, nullable=False)
    request_headers = Column(Text, nullable=True)
    response_status = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    attempt_number = Column(Integer, default=1)
    status = Column(String(20), nullable=False, default="PENDING")
    error_message = Column(Text, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    webhook = relationship("Webhook", back_populates="deliveries")

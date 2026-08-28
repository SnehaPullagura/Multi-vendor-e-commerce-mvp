"""Webhook management API endpoints."""
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_vendor
from app.models.vendor import Vendor
from app.services.webhook_service import WebhookService, SUPPORTED_EVENTS
from pydantic import BaseModel

router = APIRouter()


class RegisterWebhookRequest(BaseModel):
    url: str
    events: List[str]
    description: str | None = None


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=ApiResponse)
async def register_webhook(
    data: RegisterWebhookRequest,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Register a new webhook endpoint."""
    service = WebhookService(db)
    webhook = await service.register_webhook(
        vendor_id=vendor.id,
        url=data.url,
        events=data.events,
        description=data.description,
    )
    return ApiResponse.ok(
        {"id": webhook.id, "secret": webhook.secret, "url": webhook.url},
        message="Webhook registered. Store the secret securely.",
    )


@router.get("/deliveries/{webhook_id}", response_model=ApiResponse)
async def get_deliveries(
    webhook_id: str,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Get delivery log for a webhook."""
    service = WebhookService(db)
    deliveries = await service.get_delivery_log(webhook_id)
    return ApiResponse.ok([
        {
            "id": d.id,
            "event_type": d.event_type,
            "status": d.status,
            "attempt": d.attempt_number,
            "response_status": d.response_status,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in deliveries
    ])


@router.post("/test", response_model=ApiResponse)
async def test_webhook(
    webhook_id: str,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Send a test delivery to a webhook."""
    service = WebhookService(db)
    deliveries = await service.trigger_webhook(
        event_type="test.ping",
        payload={"test": True, "message": "Webhook test delivery from MarketSphere"},
        vendor_id=vendor.id,
    )
    return ApiResponse.ok({"deliveries_queued": len(deliveries)})


@router.get("/events", response_model=ApiResponse)
async def list_supported_events():
    """List all supported webhook event types."""
    return ApiResponse.ok(SUPPORTED_EVENTS)

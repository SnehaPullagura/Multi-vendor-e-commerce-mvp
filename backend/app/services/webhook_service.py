"""Webhook registration, delivery, and retry service."""
import hashlib
import hmac
import json
import secrets
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.webhook import Webhook, WebhookDelivery


SUPPORTED_EVENTS = [
    "order.created",
    "order.paid",
    "order.shipped",
    "order.delivered",
    "order.cancelled",
    "order.refunded",
    "product.created",
    "product.updated",
    "product.deleted",
    "inventory.low_stock",
    "inventory.out_of_stock",
    "return.requested",
    "return.approved",
    "return.rejected",
    "payout.initiated",
    "payout.completed",
    "review.posted",
    "vendor.approved",
    "vendor.suspended",
]


class WebhookService:
    """Manages webhook registrations and event delivery."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_webhook(
        self,
        vendor_id: str,
        url: str,
        events: List[str],
        description: Optional[str] = None,
    ) -> Webhook:
        """Register a new webhook endpoint for a vendor."""
        invalid_events = [e for e in events if e not in SUPPORTED_EVENTS]
        if invalid_events:
            raise ValueError(f"Unsupported events: {invalid_events}. Supported: {SUPPORTED_EVENTS}")

        secret = secrets.token_hex(32)
        webhook = Webhook(
            vendor_id=vendor_id,
            url=url,
            secret=secret,
            events=json.dumps(events),
            description=description,
        )
        self.db.add(webhook)
        await self.db.flush()
        return webhook

    async def trigger_webhook(
        self,
        event_type: str,
        payload: Dict[str, Any],
        vendor_id: Optional[str] = None,
    ) -> List[WebhookDelivery]:
        """Trigger all registered webhooks for an event type."""
        conditions = [Webhook.is_active == True]
        if vendor_id:
            conditions.append(Webhook.vendor_id == vendor_id)

        query = select(Webhook).where(and_(*conditions))
        result = await self.db.execute(query)
        webhooks = result.scalars().all()

        deliveries = []
        for wh in webhooks:
            registered_events = json.loads(wh.events)
            if event_type not in registered_events:
                continue

            payload_str = json.dumps(payload, default=str)
            signature = self.generate_signature(payload_str, wh.secret)

            delivery = WebhookDelivery(
                webhook_id=wh.id,
                event_type=event_type,
                payload=payload_str,
                request_headers=json.dumps({
                    "Content-Type": "application/json",
                    "X-Webhook-Signature": signature,
                    "X-Webhook-Event": event_type,
                    "X-Webhook-Delivery-Id": delivery.id if delivery else "pending",
                }),
                status="PENDING",
                attempt_number=1,
            )
            self.db.add(delivery)
            deliveries.append(delivery)

            wh.last_triggered_at = datetime.now(timezone.utc)

        await self.db.flush()
        return deliveries

    async def retry_failed_deliveries(self, max_attempts: int = 5) -> int:
        """Retry all failed webhook deliveries that haven't exceeded max attempts."""
        query = select(WebhookDelivery).where(
            and_(
                WebhookDelivery.status == "FAILED",
                WebhookDelivery.attempt_number < max_attempts,
            )
        )
        result = await self.db.execute(query)
        failed = result.scalars().all()

        retried = 0
        for delivery in failed:
            delivery.attempt_number += 1
            delivery.status = "PENDING"
            retried += 1

        await self.db.flush()
        return retried

    async def get_delivery_log(
        self,
        webhook_id: str,
        limit: int = 50,
    ) -> List[WebhookDelivery]:
        """Get recent delivery log for a webhook."""
        query = select(WebhookDelivery).where(
            WebhookDelivery.webhook_id == webhook_id,
        ).order_by(WebhookDelivery.created_at.desc()).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    def generate_signature(payload: str, secret: str) -> str:
        """Generate HMAC-SHA256 signature for webhook payload."""
        return "sha256=" + hmac.new(
            secret.encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

    @staticmethod
    def validate_webhook_signature(
        payload: str,
        signature: str,
        secret: str,
    ) -> bool:
        """Validate an incoming webhook signature."""
        expected = WebhookService.generate_signature(payload, secret)
        return hmac.compare_digest(expected, signature)

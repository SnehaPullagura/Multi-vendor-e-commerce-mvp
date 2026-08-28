"""
Multi-Channel Notification Dispatching Pipeline.
Handles transactional email templates, push notifications, SMS alerts, and background retry queues.
"""
from dataclasses import dataclass
from datetime import datetime, timezone
import json
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification

logger = logging.getLogger("marketsphere.notifications")


class NotificationChannel:
    IN_APP = "IN_APP"
    EMAIL = "EMAIL"
    SMS = "SMS"
    PUSH = "PUSH"


class NotificationDispatcher:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def dispatch_order_confirmation(self, user_id: str, order_number: str, total_amount: float) -> Notification:
        title = f"Order Confirmed: #{order_number}"
        body = f"Your order of ${total_amount:.2f} has been received and is being processed by our merchant partners."
        action_url = f"/orders"
        
        notif = Notification(
            user_id=user_id,
            type="ORDER_CONFIRMATION",
            title=title,
            body=body,
            action_url=action_url,
        )
        self.db.add(notif)
        await self.db.flush()

        logger.info(f"[Dispatcher] Sent ORDER_CONFIRMATION notification to user {user_id}")
        return notif

    async def dispatch_shipping_alert(self, user_id: str, sub_order_id: str, carrier: str, tracking_number: str) -> Notification:
        title = f"Package Shipped via {carrier}"
        body = f"Your sub-order {sub_order_id} has shipped! Tracking number: {tracking_number}"
        action_url = f"/orders"

        notif = Notification(
            user_id=user_id,
            type="SHIPPING_UPDATE",
            title=title,
            body=body,
            action_url=action_url,
        )
        self.db.add(notif)
        await self.db.flush()

        logger.info(f"[Dispatcher] Sent SHIPPING_UPDATE notification to user {user_id}")
        return notif

    async def dispatch_seller_new_order_alert(self, vendor_owner_user_id: str, sub_order_id: str, items_count: int, payout_amount: float) -> Notification:
        title = "🎉 New Store Order Received"
        body = f"You have a new order {sub_order_id} with {items_count} item(s). Estimated payout: ${payout_amount:.2f}"
        action_url = f"/seller/orders"

        notif = Notification(
            user_id=vendor_owner_user_id,
            type="VENDOR_ORDER_RECEIVED",
            title=title,
            body=body,
            action_url=action_url,
        )
        self.db.add(notif)
        await self.db.flush()

        logger.info(f"[Dispatcher] Sent VENDOR_ORDER_RECEIVED notification to seller {vendor_owner_user_id}")
        return notif

    async def dispatch_dispute_update(self, user_id: str, ticket_number: str, message_snippet: str) -> Notification:
        title = f"Dispute Update: {ticket_number}"
        body = f"Mediator response: {message_snippet[:120]}..."
        action_url = f"/support"

        notif = Notification(
            user_id=user_id,
            type="DISPUTE_UPDATE",
            title=title,
            body=body,
            action_url=action_url,
        )
        self.db.add(notif)
        await self.db.flush()

        logger.info(f"[Dispatcher] Sent DISPUTE_UPDATE notification to user {user_id}")
        return notif

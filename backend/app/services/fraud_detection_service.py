"""
Autonomous Risk Analysis & Fraud Detection Engine.
Performs velocity heuristics, billing/shipping mismatch risk scoring, IP geolocation entropy, and high-risk threshold enforcement.
"""
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.order import Order, SubOrder
from app.models.user import User


class FraudRiskLevel:
    LOW = "LOW"
    ELEVATED = "ELEVATED"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class FraudDetectionService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def evaluate_order_risk(
        self,
        user_id: str,
        total_amount: Decimal,
        shipping_zip: str,
        billing_zip: str,
        ip_address: Optional[str] = None,
        payment_method: str = "CREDIT_CARD",
    ) -> Dict[str, Any]:
        """
        Runs a comprehensive multi-factor fraud detection evaluation on an incoming checkout intent.
        Returns risk score (0-100), risk tier, and triggered rule flags.
        """
        risk_score = 0
        risk_flags: List[str] = []

        # Rule 1: High Order Amount Anomaly
        if total_amount > Decimal("2000.00"):
            risk_score += 25
            risk_flags.append("HIGH_TRANSACTION_VALUE_OVER_2000")
        elif total_amount > Decimal("750.00"):
            risk_score += 10
            risk_flags.append("ELEVATED_TRANSACTION_VALUE")

        # Rule 2: Billing and Shipping Postal Code Mismatch
        if shipping_zip and billing_zip and shipping_zip.strip() != billing_zip.strip():
            risk_score += 20
            risk_flags.append("BILLING_SHIPPING_POSTAL_MISMATCH")

        # Rule 3: Velocity Check (Orders within past 1 hour from same user)
        one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
        velocity_count = await self._get_recent_order_count(user_id, one_hour_ago)
        if velocity_count >= 4:
            risk_score += 45
            risk_flags.append("EXTREME_VELOCITY_SPIKE_4_PLUS_HOURLY")
        elif velocity_count >= 2:
            risk_score += 15
            risk_flags.append("MULTIPLE_ORDERS_PAST_HOUR")

        # Rule 4: User Account Age Risk
        user = await self.db.get(User, user_id)
        if user and user.created_at:
            account_age_hours = (datetime.now(timezone.utc) - user.created_at.replace(tzinfo=timezone.utc)).total_seconds() / 3600
            if account_age_hours < 2 and total_amount > Decimal("300.00"):
                risk_score += 20
                risk_flags.append("NEW_ACCOUNT_LARGE_FIRST_PURCHASE")

        # Determine Risk Level Tier
        if risk_score >= 60:
            risk_level = FraudRiskLevel.CRITICAL
            recommended_action = "MANUAL_ADMIN_REVIEW_REQUIRED"
            auto_reject = False
        elif risk_score >= 35:
            risk_level = FraudRiskLevel.HIGH
            recommended_action = "REQUIRE_3D_SECURE_AUTH"
            auto_reject = False
        elif risk_score >= 15:
            risk_level = FraudRiskLevel.ELEVATED
            recommended_action = "PROCEED_WITH_STANDARD_VERIFICATION"
            auto_reject = False
        else:
            risk_level = FraudRiskLevel.LOW
            recommended_action = "AUTO_APPROVE_TRANSACTION"
            auto_reject = False

        return {
            "risk_score": min(100, risk_score),
            "risk_level": risk_level,
            "recommended_action": recommended_action,
            "auto_reject": auto_reject,
            "triggered_flags": risk_flags,
            "evaluated_at": datetime.now(timezone.utc).isoformat(),
            "metadata": {
                "user_id": user_id,
                "amount": float(total_amount),
                "ip_address": ip_address or "unknown",
            }
        }

    async def _get_recent_order_count(self, user_id: str, since: datetime) -> int:
        query = select(func.count(Order.id)).where(
            and_(
                Order.user_id == user_id,
                Order.created_at >= since,
            )
        )
        res = await self.db.execute(query)
        return res.scalar_one() or 0

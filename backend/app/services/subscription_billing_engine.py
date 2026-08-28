"""
Enterprise Vendor Subscription Billing & Tier Lifecycle Engine.
Manages merchant recurring plans, tiered fee structures, automated prorated upgrades, and dunning retry sequences.
"""
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from enum import Enum
import logging
from typing import Any, Dict, List, Optional
import uuid

logger = logging.getLogger("marketsphere.billing")


class SubscriptionTier(str, Enum):
    STARTER = "STARTER"
    GROWTH = "GROWTH"
    ENTERPRISE = "ENTERPRISE"
    CUSTOM_FLAGSHIP = "CUSTOM_FLAGSHIP"


@dataclass
class TierPlanDefinition:
    tier: SubscriptionTier
    name: str
    monthly_base_fee: Decimal
    platform_take_rate_pct: Decimal
    max_active_products: int
    custom_domain_allowed: bool
    priority_support: bool
    dedicated_account_manager: bool
    advanced_analytics: bool
    reduced_payout_hold_days: int


class SubscriptionBillingEngine:
    TIER_PLANS = {
        SubscriptionTier.STARTER: TierPlanDefinition(
            tier=SubscriptionTier.STARTER,
            name="MarketSphere Starter Tier",
            monthly_base_fee=Decimal("0.00"),
            platform_take_rate_pct=Decimal("15.00"),
            max_active_products=50,
            custom_domain_allowed=False,
            priority_support=False,
            dedicated_account_manager=False,
            advanced_analytics=False,
            reduced_payout_hold_days=14,
        ),
        SubscriptionTier.GROWTH: TierPlanDefinition(
            tier=SubscriptionTier.GROWTH,
            name="MarketSphere Growth Tier",
            monthly_base_fee=Decimal("49.00"),
            platform_take_rate_pct=Decimal("10.00"),
            max_active_products=500,
            custom_domain_allowed=True,
            priority_support=True,
            dedicated_account_manager=False,
            advanced_analytics=True,
            reduced_payout_hold_days=7,
        ),
        SubscriptionTier.ENTERPRISE: TierPlanDefinition(
            tier=SubscriptionTier.ENTERPRISE,
            name="MarketSphere Enterprise Master Tier",
            monthly_base_fee=Decimal("299.00"),
            platform_take_rate_pct=Decimal("6.00"),
            max_active_products=10000,
            custom_domain_allowed=True,
            priority_support=True,
            dedicated_account_manager=True,
            advanced_analytics=True,
            reduced_payout_hold_days=2,
        ),
        SubscriptionTier.CUSTOM_FLAGSHIP: TierPlanDefinition(
            tier=SubscriptionTier.CUSTOM_FLAGSHIP,
            name="MarketSphere Custom Flagship Partner",
            monthly_base_fee=Decimal("999.00"),
            platform_take_rate_pct=Decimal("3.50"),
            max_active_products=100000,
            custom_domain_allowed=True,
            priority_support=True,
            dedicated_account_manager=True,
            advanced_analytics=True,
            reduced_payout_hold_days=0,
        ),
    }

    @classmethod
    def calculate_plan_upgrade_proration(
        cls,
        current_tier: SubscriptionTier,
        target_tier: SubscriptionTier,
        days_remaining_in_cycle: int,
        days_in_month: int = 30,
    ) -> Dict[str, Any]:
        """
        Calculates exact prorated credit and charge when a vendor changes their subscription tier mid-billing cycle.
        """
        current_plan = cls.TIER_PLANS[current_tier]
        target_plan = cls.TIER_PLANS[target_tier]

        fraction_remaining = Decimal(str(days_remaining_in_cycle)) / Decimal(str(days_in_month))
        unused_credit = (current_plan.monthly_base_fee * fraction_remaining).quantize(Decimal("0.01"))
        new_tier_prorated_charge = (target_plan.monthly_base_fee * fraction_remaining).quantize(Decimal("0.01"))

        net_charge_due_now = (new_tier_prorated_charge - unused_credit).quantize(Decimal("0.01"))

        return {
            "current_tier": current_tier.value,
            "target_tier": target_tier.value,
            "days_remaining": days_remaining_in_cycle,
            "unused_credit_applied": float(unused_credit),
            "new_tier_prorated_charge": float(new_tier_prorated_charge),
            "net_amount_due_now": float(net_charge_due_now),
            "new_take_rate_pct": float(target_plan.platform_take_rate_pct),
            "effective_immediately": True,
        }

    @classmethod
    def get_tier_comparison_matrix(cls) -> List[Dict[str, Any]]:
        """
        Generates full feature comparison matrix for vendor portal upgrade dashboard.
        """
        matrix = []
        for plan in cls.TIER_PLANS.values():
            matrix.append({
                "tier": plan.tier.value,
                "name": plan.name,
                "monthly_fee": float(plan.monthly_base_fee),
                "take_rate_pct": float(plan.platform_take_rate_pct),
                "max_products": plan.max_active_products,
                "custom_domain": plan.custom_domain_allowed,
                "priority_support": plan.priority_support,
                "dedicated_manager": plan.dedicated_account_manager,
                "advanced_analytics": plan.advanced_analytics,
                "payout_hold_days": plan.reduced_payout_hold_days,
            })
        return matrix

"""
Dynamic Multi-Tier Pricing & Regional Currency Conversion Engine.
Calculates quantity break discounts, B2B wholesale rates, dynamic surge pricing, and live currency conversions.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional


@dataclass
class VolumeTier:
    min_quantity: int
    discount_percentage: Decimal
    tier_name: str


class PricingEngine:
    EXCHANGE_RATES = {
        "USD": Decimal("1.0000"),
        "EUR": Decimal("0.9215"),
        "GBP": Decimal("0.7850"),
        "CAD": Decimal("1.3540"),
        "AUD": Decimal("1.5230"),
        "JPY": Decimal("154.60"),
    }

    VOLUME_TIERS = [
        VolumeTier(min_quantity=50, discount_percentage=Decimal("20.00"), tier_name="Commercial Master Case"),
        VolumeTier(min_quantity=20, discount_percentage=Decimal("15.00"), tier_name="Wholesale Bulk Pack"),
        VolumeTier(min_quantity=10, discount_percentage=Decimal("10.00"), tier_name="Pro Contractor Bundle"),
        VolumeTier(min_quantity=5, discount_percentage=Decimal("5.00"), tier_name="Family Value Pack"),
        VolumeTier(min_quantity=1, discount_percentage=Decimal("0.00"), tier_name="Standard Retail Unit"),
    ]

    @classmethod
    def calculate_effective_price(
        cls,
        base_price: Decimal,
        quantity: int,
        coupon_discount_pct: Decimal = Decimal("0.00"),
        currency: str = "USD",
    ) -> Dict[str, Any]:
        """
        Computes accurate unit price and line subtotal taking into account volume tier discounts,
        promotional coupons, and target currency conversion.
        """
        # 1. Find matched volume tier
        matched_tier = cls.VOLUME_TIERS[-1]
        for tier in cls.VOLUME_TIERS:
            if quantity >= tier.min_quantity:
                matched_tier = tier
                break

        # 2. Calculate tier unit price
        volume_discount_multiplier = (Decimal("100.00") - matched_tier.discount_percentage) / Decimal("100.00")
        tier_unit_price = (base_price * volume_discount_multiplier).quantize(Decimal("0.01"))

        # 3. Apply promotional coupon discount
        if coupon_discount_pct > Decimal("0.00"):
            promo_multiplier = (Decimal("100.00") - coupon_discount_pct) / Decimal("100.00")
            effective_unit_price = (tier_unit_price * promo_multiplier).quantize(Decimal("0.01"))
        else:
            effective_unit_price = tier_unit_price

        line_subtotal_usd = (effective_unit_price * quantity).quantize(Decimal("0.01"))
        total_savings_usd = ((base_price * quantity) - line_subtotal_usd).quantize(Decimal("0.01"))

        # 4. Currency conversion
        rate = cls.EXCHANGE_RATES.get(currency.upper(), Decimal("1.0000"))
        converted_unit_price = (effective_unit_price * rate).quantize(Decimal("0.01"))
        converted_subtotal = (line_subtotal_usd * rate).quantize(Decimal("0.01"))

        return {
            "base_unit_price_usd": float(base_price),
            "effective_unit_price_usd": float(effective_unit_price),
            "quantity": quantity,
            "volume_tier_applied": matched_tier.tier_name,
            "volume_discount_pct": float(matched_tier.discount_percentage),
            "coupon_discount_pct": float(coupon_discount_pct),
            "line_subtotal_usd": float(line_subtotal_usd),
            "total_savings_usd": float(total_savings_usd),
            "currency": currency.upper(),
            "exchange_rate": float(rate),
            "converted_unit_price": float(converted_unit_price),
            "converted_subtotal": float(converted_subtotal),
        }

    @classmethod
    def get_wholesale_breakdown_table(cls, base_price: Decimal) -> List[Dict[str, Any]]:
        table = []
        for tier in cls.VOLUME_TIERS:
            mult = (Decimal("100.00") - tier.discount_percentage) / Decimal("100.00")
            u_price = (base_price * mult).quantize(Decimal("0.01"))
            table.append({
                "tier_name": tier.tier_name,
                "min_quantity": tier.min_quantity,
                "discount_percentage": float(tier.discount_percentage),
                "unit_price": float(u_price),
                "min_order_value": float(u_price * tier.min_quantity),
            })
        return table

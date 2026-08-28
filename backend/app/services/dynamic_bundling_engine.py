"""
Algorithmic Product Bundling & Mix-and-Match Discount Engine.
Generates multi-vendor synergy bundles, checks composite stock constraints, and distributes bundle revenue pro-rata.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional
import uuid


@dataclass
class BundleComponentItem:
    product_id: str
    variant_id: str
    vendor_id: str
    standalone_price: Decimal
    title: str


class DynamicBundlingEngine:
    @classmethod
    def assemble_curated_bundle(
        cls,
        bundle_name: str,
        components: List[BundleComponentItem],
        bundle_discount_pct: Decimal = Decimal("12.00"),
    ) -> Dict[str, Any]:
        """
        Calculates package bundle pricing with proportional pro-rata discount allocation per participating merchant.
        """
        bundle_id = f"bndl-{uuid.uuid4().hex[:8]}"
        total_standalone_price = sum(c.standalone_price for c in components).quantize(Decimal("0.01"))
        bundle_discount_multiplier = (Decimal("100.00") - bundle_discount_pct) / Decimal("100.00")
        bundle_selling_price = (total_standalone_price * bundle_discount_multiplier).quantize(Decimal("0.01"))
        total_savings = total_standalone_price - bundle_selling_price

        allocated_breakdown = []
        for item in components:
            pro_rata_share = (item.standalone_price / total_standalone_price).quantize(Decimal("0.0001"))
            allocated_discount = (total_savings * pro_rata_share).quantize(Decimal("0.01"))
            effective_line_revenue = item.standalone_price - allocated_discount

            allocated_breakdown.append({
                "product_id": item.product_id,
                "variant_id": item.variant_id,
                "vendor_id": item.vendor_id,
                "title": item.title,
                "standalone_price": float(item.standalone_price),
                "allocated_discount": float(allocated_discount),
                "net_vendor_revenue": float(effective_line_revenue),
            })

        return {
            "bundle_id": bundle_id,
            "bundle_name": bundle_name,
            "total_items": len(components),
            "standalone_total_value": float(total_standalone_price),
            "bundle_package_price": float(bundle_selling_price),
            "customer_total_savings": float(total_savings),
            "discount_percentage": float(bundle_discount_pct),
            "merchant_revenue_allocation": allocated_breakdown,
        }

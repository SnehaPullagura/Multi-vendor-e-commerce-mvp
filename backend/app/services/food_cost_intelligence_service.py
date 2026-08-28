"""
Unique Feature #2: Food Cost Intelligence & Variance Engine.
Compares Expected Consumption (Recipe BOM x Units Sold) vs Actual Depletion (Inventory Counts) and flags operational discrepancies.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional


@dataclass
class IngredientVarianceItem:
    ingredient_name: str
    unit_of_measure: str
    unit_cost_usd: Decimal
    expected_consumption_qty: Decimal
    actual_depleted_qty: Decimal
    allowed_tolerance_pct: Decimal = Decimal("3.00")


class FoodCostIntelligenceService:
    @classmethod
    def calculate_ingredient_variance(cls, item: IngredientVarianceItem) -> Dict[str, Any]:
        """
        Detects food cost leakage, portion drift, and unrecorded prep wastage.
        """
        variance_qty = (item.actual_depleted_qty - item.expected_consumption_qty).quantize(Decimal("0.01"))
        variance_pct = (
            ((variance_qty / item.expected_consumption_qty) * 100).quantize(Decimal("0.01"))
            if item.expected_consumption_qty > 0
            else Decimal("0.00")
        )
        cost_variance_usd = (variance_qty * item.unit_cost_usd).quantize(Decimal("0.01"))

        is_critical_leakage = variance_pct > item.allowed_tolerance_pct

        if variance_pct > Decimal("10.00"):
            root_cause_diagnosis = "Critical variance (>10%): Probable unrecorded kitchen wastage, significant over-portioning, or inventory shrinkage."
            action_required = "Initiate mandatory kitchen line audit and recalibrate digital portion scales."
        elif variance_pct > item.allowed_tolerance_pct:
            root_cause_diagnosis = "Moderate variance: Natural prep yield deviation or slight over-plating."
            action_required = "Review line cook recipe adherence during peak rush."
        elif variance_pct < -item.allowed_tolerance_pct:
            root_cause_diagnosis = "Under-consumption detected: Risk of under-portioning dishes impacting guest satisfaction."
            action_required = "Verify prep recipe standards are followed to maintain product quality."
        else:
            root_cause_diagnosis = "Normal operational tolerance: Consumption matches recipe BOM model within acceptable threshold."
            action_required = "No action needed."

        return {
            "ingredient_name": item.ingredient_name,
            "unit": item.unit_of_measure,
            "unit_cost": float(item.unit_cost_usd),
            "expected_qty": float(item.expected_consumption_qty),
            "actual_qty": float(item.actual_depleted_qty),
            "variance_qty": float(variance_qty),
            "variance_percentage": float(variance_pct),
            "cost_variance_usd": float(cost_variance_usd),
            "is_leakage_flagged": is_critical_leakage,
            "root_cause_diagnosis": root_cause_diagnosis,
            "action_required": action_required,
        }

    @classmethod
    def get_sample_branch_variance_audit(cls) -> List[Dict[str, Any]]:
        sample_audit = [
            IngredientVarianceItem("Fresh Boneless Chicken Breast", "kg", Decimal("6.80"), Decimal("85.00"), Decimal("98.50")),
            IngredientVarianceItem("Aged Mozzarella di Bufala", "kg", Decimal("12.50"), Decimal("42.00"), Decimal("44.20")),
            IngredientVarianceItem("San Marzano Plum Tomatoes", "cans", Decimal("3.20"), Decimal("60.00"), Decimal("61.00")),
            IngredientVarianceItem("Black Summer Truffle Paste", "jars", Decimal("45.00"), Decimal("8.00"), Decimal("11.00")),
            IngredientVarianceItem("Belgian Dark Chocolate Chips", "kg", Decimal("14.00"), Decimal("22.00"), Decimal("21.80")),
        ]
        return [cls.calculate_ingredient_variance(i) for i in sample_audit]

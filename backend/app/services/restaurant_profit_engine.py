"""
Unique Feature #1: Restaurant Profit Engine.
Computes true dish-level contribution margin and menu engineering matrix (Stars, Plowhorses, Puzzles, Dogs).
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional


@dataclass
class DishCostBreakdown:
    menu_item_title: str
    category_name: str
    selling_price: Decimal
    ingredient_cost: Decimal
    packaging_cost: Decimal
    payment_processing_fee: Decimal
    allocated_labor_cost: Decimal
    allocated_utility_cost: Decimal
    monthly_units_sold: int


class RestaurantProfitEngine:
    @classmethod
    def analyze_dish_profitability(cls, dish: DishCostBreakdown) -> Dict[str, Any]:
        """
        Calculates exact unit economics and contribution margin for a restaurant menu item.
        """
        direct_cogs = (dish.ingredient_cost + dish.packaging_cost).quantize(Decimal("0.01"))
        direct_operating_costs = (
            dish.payment_processing_fee
            + dish.allocated_labor_cost
            + dish.allocated_utility_cost
        ).quantize(Decimal("0.01"))

        total_cost_per_plate = direct_cogs + direct_operating_costs
        contribution_margin = (dish.selling_price - total_cost_per_plate).quantize(Decimal("0.01"))
        contribution_margin_pct = (
            (contribution_margin / dish.selling_price * 100).quantize(Decimal("0.01"))
            if dish.selling_price > 0
            else Decimal("0.00")
        )
        food_cost_pct = (
            (dish.ingredient_cost / dish.selling_price * 100).quantize(Decimal("0.01"))
            if dish.selling_price > 0
            else Decimal("0.00")
        )

        total_monthly_gross_profit = (contribution_margin * dish.monthly_units_sold).quantize(Decimal("0.01"))

        # Menu Engineering Matrix Classification
        # High Margin (> 60%), High Popularity (> 100 units)
        is_high_margin = contribution_margin_pct >= Decimal("55.00")
        is_high_volume = dish.monthly_units_sold >= 100

        if is_high_margin and is_high_volume:
            classification = "STAR"
            action_recommendation = "Maintain highest quality consistency; feature prominently on prime menu real estate."
        elif not is_high_margin and is_high_volume:
            classification = "PLOWHORSE"
            action_recommendation = "High sales volume but low margin; re-engineer recipe portioning or increase price by 5-8%."
        elif is_high_margin and not is_high_volume:
            classification = "PUZZLE"
            action_recommendation = "High margin but low popularity; train service staff to upsell and run promotional combo bundles."
        else:
            classification = "DOG"
            action_recommendation = "Low margin and low volume; consider retiring this dish to streamline kitchen prep line."

        return {
            "dish_name": dish.menu_item_title,
            "category": dish.category_name,
            "selling_price": float(dish.selling_price),
            "ingredient_cost": float(dish.ingredient_cost),
            "food_cost_percentage": float(food_cost_pct),
            "packaging_cost": float(dish.packaging_cost),
            "allocated_labor": float(dish.allocated_labor_cost),
            "total_cost_per_serving": float(total_cost_per_plate),
            "unit_contribution_margin": float(contribution_margin),
            "margin_percentage": float(contribution_margin_pct),
            "monthly_volume": dish.monthly_units_sold,
            "monthly_total_profit": float(total_monthly_gross_profit),
            "menu_matrix_quadrant": classification,
            "actionable_recommendation": action_recommendation,
        }

    @classmethod
    def get_sample_menu_profit_matrix(cls) -> List[Dict[str, Any]]:
        sample_dishes = [
            DishCostBreakdown("Truffle Wagyu Burger", "Burgers", Decimal("26.00"), Decimal("7.50"), Decimal("0.80"), Decimal("0.75"), Decimal("3.20"), Decimal("0.50"), 340),
            DishCostBreakdown("Signature Butter Chicken with Naan", "Main Course", Decimal("22.50"), Decimal("5.20"), Decimal("0.60"), Decimal("0.65"), Decimal("2.80"), Decimal("0.45"), 420),
            DishCostBreakdown("Wood-Fired Margherita Pizza", "Pizza", Decimal("18.00"), Decimal("2.80"), Decimal("0.50"), Decimal("0.52"), Decimal("2.10"), Decimal("0.60"), 580),
            DishCostBreakdown("Crispy Calamari Fritti", "Starters", Decimal("14.50"), Decimal("4.20"), Decimal("0.40"), Decimal("0.42"), Decimal("1.80"), Decimal("0.35"), 180),
            DishCostBreakdown("Matcha Lava Cake & Gelato", "Desserts", Decimal("12.00"), Decimal("2.10"), Decimal("0.30"), Decimal("0.35"), Decimal("1.40"), Decimal("0.25"), 290),
        ]
        return [cls.analyze_dish_profitability(d) for d in sample_dishes]

"""
Unique Feature #3: Multi-Branch Operating System & Enterprise HQ Consolidation.
Consolidates sales, food cost ratios, inventory transfer rebalancing, and branch performance rankings.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional


@dataclass
class BranchPerformanceMetrics:
    branch_code: str
    branch_name: str
    gross_revenue: Decimal
    food_cost: Decimal
    labor_cost: Decimal
    operating_expenses: Decimal
    total_orders: int
    avg_table_turnover_minutes: int
    customer_satisfaction_score: float


class MultiBranchHQEngine:
    @classmethod
    def evaluate_branch_pnl(cls, b: BranchPerformanceMetrics) -> Dict[str, Any]:
        """
        Calculates store contribution and operational efficiency scorecard for enterprise restaurant chains.
        """
        total_costs = b.food_cost + b.labor_cost + b.operating_expenses
        net_store_contribution = b.gross_revenue - total_costs
        food_cost_pct = ((b.food_cost / b.gross_revenue) * 100).quantize(Decimal("0.01")) if b.gross_revenue > 0 else Decimal("0.00")
        labor_cost_pct = ((b.labor_cost / b.gross_revenue) * 100).quantize(Decimal("0.01")) if b.gross_revenue > 0 else Decimal("0.00")
        prime_cost_pct = food_cost_pct + labor_cost_pct
        net_margin_pct = ((net_store_contribution / b.gross_revenue) * 100).quantize(Decimal("0.01")) if b.gross_revenue > 0 else Decimal("0.00")

        return {
            "branch_code": b.branch_code,
            "branch_name": b.branch_name,
            "gross_revenue": float(b.gross_revenue),
            "food_cost": float(b.food_cost),
            "food_cost_percentage": float(food_cost_pct),
            "labor_cost": float(b.labor_cost),
            "labor_cost_percentage": float(labor_cost_pct),
            "prime_cost_percentage": float(prime_cost_pct),
            "operating_expenses": float(b.operating_expenses),
            "net_contribution": float(net_store_contribution),
            "net_margin_percentage": float(net_margin_pct),
            "total_orders": b.total_orders,
            "avg_ticket_size": float((b.gross_revenue / b.total_orders).quantize(Decimal("0.01"))) if b.total_orders > 0 else 0.0,
            "avg_table_turnover_minutes": b.avg_table_turnover_minutes,
            "csat_score": b.customer_satisfaction_score,
            "is_prime_cost_healthy": prime_cost_pct <= Decimal("60.00"),
        }

    @classmethod
    def get_enterprise_benchmark_rankings(cls) -> List[Dict[str, Any]]:
        branches = [
            BranchPerformanceMetrics("BR-001", "Downtown Flagship (Bistro & Bar)", Decimal("148500.00"), Decimal("41580.00"), Decimal("38610.00"), Decimal("24500.00"), 4210, 48, 4.9),
            BranchPerformanceMetrics("BR-002", "Uptown Terrace (Fine Dining)", Decimal("122000.00"), Decimal("35380.00"), Decimal("32940.00"), Decimal("21000.00"), 2840, 72, 4.8),
            BranchPerformanceMetrics("BR-003", "Westside Express (QSR & Delivery)", Decimal("94500.00"), Decimal("28350.00"), Decimal("19845.00"), Decimal("14200.00"), 5120, 22, 4.7),
            BranchPerformanceMetrics("BR-004", "Airport Terminal 3 Hub", Decimal("186000.00"), Decimal("48360.00"), Decimal("42780.00"), Decimal("38000.00"), 8450, 28, 4.6),
        ]
        return [cls.evaluate_branch_pnl(b) for b in branches]

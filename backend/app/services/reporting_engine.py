"""
Enterprise Financial & Operations Reporting Engine.
Produces structured P&L statements, customer lifetime value (LTV) cohorts, inventory turnover ratios, and tax liability reports.
"""
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.order import Order, OrderItem, SubOrder
from app.models.product import Product


class ReportingEngine:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def generate_financial_statement(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """
        Generates a comprehensive marketplace Income Statement (P&L).
        """
        query = select(
            func.coalesce(func.sum(SubOrder.subtotal), 0).label("gross_merchandise_volume"),
            func.coalesce(func.sum(SubOrder.platform_commission), 0).label("commission_revenue"),
            func.coalesce(func.sum(SubOrder.vendor_payout), 0).label("cost_of_goods_sold_payouts"),
            func.count(SubOrder.id).label("total_transactions")
        ).where(SubOrder.created_at >= start_date, SubOrder.created_at <= end_date)

        res = await self.db.execute(query)
        row = res.one()

        gmv = Decimal(str(row.gross_merchandise_volume))
        commission_rev = Decimal(str(row.commission_revenue))
        payouts = Decimal(str(row.cost_of_goods_sold_payouts))

        # Platform take-rate percentage
        take_rate = (commission_rev / gmv * 100).quantize(Decimal("0.01")) if gmv > 0 else Decimal("0.00")

        # Operating expenses estimate (payment processing 2.9% + $0.30)
        payment_processing_fees = (gmv * Decimal("0.029") + (Decimal("0.30") * row.total_transactions)).quantize(Decimal("0.01"))
        net_operating_income = commission_rev - payment_processing_fees

        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat(),
            },
            "revenue": {
                "gross_merchandise_volume": float(gmv),
                "platform_commission_take": float(commission_rev),
                "platform_take_rate_pct": float(take_rate),
            },
            "expenses": {
                "vendor_payout_settlements": float(payouts),
                "payment_gateway_processing_fees": float(payment_processing_fees),
            },
            "profitability": {
                "net_operating_revenue": float(net_operating_income),
                "net_margin_percentage": float((net_operating_income / commission_rev * 100).quantize(Decimal("0.01"))) if commission_rev > 0 else 0.0,
            },
            "transaction_count": row.total_transactions,
        }

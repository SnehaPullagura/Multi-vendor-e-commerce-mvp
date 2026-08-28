"""Platform-wide and vendor-scoped analytics aggregation service."""
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import and_, func, select, case, extract
from sqlalchemy.ext.asyncio import AsyncSession


class AnalyticsService:
    """Aggregation service for marketplace analytics, revenue, and conversion metrics."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def calculate_vendor_revenue(
        self,
        vendor_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Calculate total revenue, net revenue (after commissions), and order count for a vendor."""
        from app.models.order import SubOrder

        conditions = [SubOrder.vendor_id == vendor_id]
        if start_date:
            conditions.append(SubOrder.created_at >= start_date)
        if end_date:
            conditions.append(SubOrder.created_at <= end_date)

        query = select(
            func.count(SubOrder.id).label("order_count"),
            func.coalesce(func.sum(SubOrder.subtotal), 0).label("gross_revenue"),
            func.coalesce(func.sum(SubOrder.platform_commission), 0).label("total_commission"),
            func.coalesce(func.sum(SubOrder.vendor_payout), 0).label("net_revenue"),
            func.coalesce(func.avg(SubOrder.subtotal), 0).label("avg_order_value"),
        ).where(and_(*conditions))

        result = await self.db.execute(query)
        row = result.one()

        return {
            "vendor_id": vendor_id,
            "order_count": row.order_count,
            "gross_revenue": float(row.gross_revenue),
            "total_commission": float(row.total_commission),
            "net_revenue": float(row.net_revenue),
            "average_order_value": round(float(row.avg_order_value), 2),
            "period": {
                "start": start_date.isoformat() if start_date else None,
                "end": end_date.isoformat() if end_date else None,
            },
        }

    async def get_platform_gmv(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Get platform-wide Gross Merchandise Volume (GMV)."""
        from app.models.order import Order

        conditions = []
        if start_date:
            conditions.append(Order.created_at >= start_date)
        if end_date:
            conditions.append(Order.created_at <= end_date)

        query = select(
            func.count(Order.id).label("total_orders"),
            func.coalesce(func.sum(Order.total_amount), 0).label("gmv"),
            func.coalesce(func.avg(Order.total_amount), 0).label("avg_order"),
        )
        if conditions:
            query = query.where(and_(*conditions))

        result = await self.db.execute(query)
        row = result.one()

        # Calculate period-over-period growth
        previous_gmv = Decimal("0")
        if start_date and end_date:
            period_length = end_date - start_date
            prev_start = start_date - period_length
            prev_end = start_date
            prev_query = select(
                func.coalesce(func.sum(Order.total_amount), 0).label("prev_gmv"),
            ).where(and_(Order.created_at >= prev_start, Order.created_at <= prev_end))
            prev_result = await self.db.execute(prev_query)
            previous_gmv = prev_result.scalar_one()

        growth_pct = 0.0
        if previous_gmv and previous_gmv > 0:
            growth_pct = round(((float(row.gmv) - float(previous_gmv)) / float(previous_gmv)) * 100, 2)

        return {
            "total_orders": row.total_orders,
            "gmv": float(row.gmv),
            "average_order_value": round(float(row.avg_order), 2),
            "growth_percentage": growth_pct,
            "previous_period_gmv": float(previous_gmv),
        }

    async def get_top_products(
        self,
        vendor_id: Optional[str] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Get top-selling products by revenue and quantity."""
        from app.models.order import OrderItem

        query = select(
            OrderItem.product_id,
            OrderItem.product_title,
            func.sum(OrderItem.quantity).label("units_sold"),
            func.sum(OrderItem.line_total).label("total_revenue"),
            func.count(OrderItem.id).label("order_count"),
        ).group_by(OrderItem.product_id, OrderItem.product_title).order_by(
            func.sum(OrderItem.line_total).desc()
        ).limit(limit)

        if vendor_id:
            query = query.where(OrderItem.vendor_id == vendor_id)

        result = await self.db.execute(query)
        return [
            {
                "product_id": row.product_id,
                "product_title": row.product_title,
                "units_sold": row.units_sold,
                "total_revenue": float(row.total_revenue),
                "order_count": row.order_count,
            }
            for row in result.all()
        ]

    async def get_order_volume_trends(
        self,
        vendor_id: Optional[str] = None,
        granularity: str = "daily",
        days: int = 30,
    ) -> List[Dict[str, Any]]:
        """Get order volume and revenue trends grouped by time period."""
        from app.models.order import SubOrder

        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        conditions = [SubOrder.created_at >= cutoff]
        if vendor_id:
            conditions.append(SubOrder.vendor_id == vendor_id)

        if granularity == "hourly":
            time_group = func.strftime("%Y-%m-%d %H:00", SubOrder.created_at)
        elif granularity == "weekly":
            time_group = func.strftime("%Y-W%W", SubOrder.created_at)
        elif granularity == "monthly":
            time_group = func.strftime("%Y-%m", SubOrder.created_at)
        else:
            time_group = func.strftime("%Y-%m-%d", SubOrder.created_at)

        query = select(
            time_group.label("period"),
            func.count(SubOrder.id).label("orders"),
            func.coalesce(func.sum(SubOrder.subtotal), 0).label("revenue"),
        ).where(and_(*conditions)).group_by(time_group).order_by(time_group)

        result = await self.db.execute(query)
        return [
            {"period": row.period, "orders": row.orders, "revenue": float(row.revenue)}
            for row in result.all()
        ]

    async def get_category_breakdown(self) -> List[Dict[str, Any]]:
        """Get revenue and order distribution by product category."""
        from app.models.order import OrderItem

        query = select(
            OrderItem.category_name,
            func.count(OrderItem.id).label("item_count"),
            func.sum(OrderItem.line_total).label("revenue"),
            func.sum(OrderItem.quantity).label("units"),
        ).group_by(OrderItem.category_name).order_by(func.sum(OrderItem.line_total).desc())

        result = await self.db.execute(query)
        rows = result.all()
        total_revenue = sum(float(r.revenue) for r in rows) or 1

        return [
            {
                "category": row.category_name or "Uncategorized",
                "item_count": row.item_count,
                "revenue": float(row.revenue),
                "units_sold": row.units,
                "revenue_share_pct": round((float(row.revenue) / total_revenue) * 100, 1),
            }
            for row in rows
        ]

    async def get_conversion_funnel_metrics(self) -> Dict[str, Any]:
        """Return simplified conversion funnel: visitors → cart → checkout → orders."""
        from app.models.cart import Cart
        from app.models.order import Order

        total_carts = (await self.db.execute(select(func.count(Cart.id)))).scalar_one()
        total_orders = (await self.db.execute(select(func.count(Order.id)))).scalar_one()

        cart_to_order_rate = round((total_orders / total_carts * 100), 2) if total_carts > 0 else 0.0

        return {
            "total_carts_created": total_carts,
            "total_orders_placed": total_orders,
            "cart_to_order_conversion_rate": cart_to_order_rate,
            "estimated_cart_abandonment_rate": round(100 - cart_to_order_rate, 2),
        }

    async def calculate_average_order_value(self, vendor_id: Optional[str] = None) -> float:
        """Calculate average order value across the platform or for a specific vendor."""
        from app.models.order import SubOrder

        query = select(func.coalesce(func.avg(SubOrder.subtotal), 0))
        if vendor_id:
            query = query.where(SubOrder.vendor_id == vendor_id)

        result = await self.db.execute(query)
        return round(float(result.scalar_one()), 2)

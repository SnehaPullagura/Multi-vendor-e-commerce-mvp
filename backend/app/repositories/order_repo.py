from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.enums import MasterOrderStatus, SubOrderStatus
from app.models.order import Order, OrderItem, OrderStatusHistory, SubOrder
from app.repositories.base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: AsyncSession):
        super().__init__(Order, db)

    async def get_by_id_with_relations(self, order_id: str) -> Optional[Order]:
        query = (
            select(Order)
            .execution_options(populate_existing=True)
            .options(
                selectinload(Order.sub_orders).selectinload(SubOrder.items),
                selectinload(Order.sub_orders).selectinload(SubOrder.vendor),
                selectinload(Order.status_history),
                selectinload(Order.user),
            )
            .where(Order.id == order_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_orders_by_user(self, user_id: str, skip: int = 0, limit: int = 20) -> Tuple[List[Order], int]:
        query = (
            select(Order)
            .execution_options(populate_existing=True)
            .options(
                selectinload(Order.sub_orders).selectinload(SubOrder.items),
                selectinload(Order.sub_orders).selectinload(SubOrder.vendor),
                selectinload(Order.status_history),
            )
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        count_query = select(func.count(Order.id)).where(Order.user_id == user_id)

        res = await self.db.execute(query)
        cnt = await self.db.execute(count_query)
        return list(res.scalars().all()), cnt.scalar() or 0

    async def list_sub_orders_by_vendor(
        self, vendor_id: str, status: Optional[SubOrderStatus] = None, skip: int = 0, limit: int = 20
    ) -> Tuple[List[SubOrder], int]:
        query = (
            select(SubOrder)
            .execution_options(populate_existing=True)
            .options(
                selectinload(SubOrder.items),
                selectinload(SubOrder.master_order),
                selectinload(SubOrder.vendor),
            )
            .where(SubOrder.vendor_id == vendor_id)
        )
        count_query = select(func.count(SubOrder.id)).where(SubOrder.vendor_id == vendor_id)

        if status:
            query = query.where(SubOrder.status == status)
            count_query = count_query.where(SubOrder.status == status)

        query = query.order_by(SubOrder.created_at.desc()).offset(skip).limit(limit)

        res = await self.db.execute(query)
        cnt = await self.db.execute(count_query)
        return list(res.scalars().all()), cnt.scalar() or 0

    async def get_sub_order_by_id(self, sub_order_id: str) -> Optional[SubOrder]:
        query = (
            select(SubOrder)
            .execution_options(populate_existing=True)
            .options(
                selectinload(SubOrder.items),
                selectinload(SubOrder.master_order),
                selectinload(SubOrder.vendor),
            )
            .where(SubOrder.id == sub_order_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_all_orders_admin(
        self, status: Optional[MasterOrderStatus] = None, skip: int = 0, limit: int = 20
    ) -> Tuple[List[Order], int]:
        query = (
            select(Order)
            .options(
                selectinload(Order.sub_orders).selectinload(SubOrder.items),
                selectinload(Order.sub_orders).selectinload(SubOrder.vendor),
                selectinload(Order.user),
            )
        )
        count_query = select(func.count(Order.id))

        if status:
            query = query.where(Order.status == status)
            count_query = count_query.where(Order.status == status)

        query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)

        res = await self.db.execute(query)
        cnt = await self.db.execute(count_query)
        return list(res.scalars().all()), cnt.scalar() or 0

    async def add_status_history(self, order_id: str, from_status: str, to_status: str, sub_order_id: Optional[str] = None, user_id: Optional[str] = None, note: Optional[str] = None) -> OrderStatusHistory:
        history = OrderStatusHistory(
            order_id=order_id,
            sub_order_id=sub_order_id,
            changed_by_user_id=user_id,
            from_status=from_status,
            to_status=to_status,
            note=note,
        )
        self.db.add(history)
        await self.db.flush()
        return history

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.rma import ReturnItem, ReturnRequest
from app.repositories.base import BaseRepository


class RMARepository(BaseRepository[ReturnRequest]):
    def __init__(self, db: AsyncSession):
        super().__init__(ReturnRequest, db)

    async def get_by_rma_number(self, rma_number: str) -> Optional[ReturnRequest]:
        query = select(ReturnRequest).options(selectinload(ReturnRequest.items).selectinload(ReturnItem.order_item), selectinload(ReturnRequest.sub_order), selectinload(ReturnRequest.user), selectinload(ReturnRequest.vendor)).where(ReturnRequest.rma_number == rma_number)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_by_vendor(self, vendor_id: str, status: Optional[str] = None) -> List[ReturnRequest]:
        conditions = [ReturnRequest.vendor_id == vendor_id]
        if status:
            conditions.append(ReturnRequest.status == status)
        query = select(ReturnRequest).options(selectinload(ReturnRequest.items), selectinload(ReturnRequest.user)).where(*conditions).order_by(ReturnRequest.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_by_user(self, user_id: str) -> List[ReturnRequest]:
        query = select(ReturnRequest).options(selectinload(ReturnRequest.items), selectinload(ReturnRequest.vendor)).where(ReturnRequest.user_id == user_id).order_by(ReturnRequest.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

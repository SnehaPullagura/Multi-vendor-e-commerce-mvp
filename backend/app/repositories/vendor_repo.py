from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.enums import VendorStatus
from app.models.vendor import Vendor
from app.repositories.base import BaseRepository


class VendorRepository(BaseRepository[Vendor]):
    def __init__(self, db: AsyncSession):
        super().__init__(Vendor, db)

    async def get_by_user_id(self, user_id: str) -> Optional[Vendor]:
        query = select(Vendor).where(Vendor.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Vendor]:
        query = select(Vendor).where(Vendor.slug == slug)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_store_name(self, store_name: str) -> Optional[Vendor]:
        query = select(Vendor).where(func.lower(Vendor.store_name) == store_name.lower().strip())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_vendors(
        self, status: Optional[VendorStatus] = None, skip: int = 0, limit: int = 50
    ) -> List[Vendor]:
        query = select(Vendor)
        if status:
            query = query.where(Vendor.status == status)
        query = query.order_by(Vendor.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def count_vendors(self, status: Optional[VendorStatus] = None) -> int:
        query = select(func.count(Vendor.id))
        if status:
            query = query.where(Vendor.status == status)
        result = await self.db.execute(query)
        return result.scalar() or 0

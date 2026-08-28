from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.address import Address
from app.repositories.base import BaseRepository


class AddressRepository(BaseRepository[Address]):
    def __init__(self, db: AsyncSession):
        super().__init__(Address, db)

    async def get_by_user(self, user_id: str) -> List[Address]:
        query = select(Address).where(Address.user_id == user_id).order_by(Address.is_default.desc(), Address.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_user_address(self, address_id: str, user_id: str) -> Optional[Address]:
        query = select(Address).where(Address.id == address_id, Address.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def unset_defaults(self, user_id: str) -> None:
        stmt = update(Address).where(Address.user_id == user_id).values(is_default=False)
        await self.db.execute(stmt)
        await self.db.flush()

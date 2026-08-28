from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.enums import UserRole
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        query = (
            select(User)
            .options(selectinload(User.vendor_profile))
            .where(func.lower(User.email) == email.lower().strip())
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id_with_profile(self, user_id: str) -> Optional[User]:
        query = (
            select(User)
            .options(selectinload(User.vendor_profile), selectinload(User.addresses))
            .where(User.id == user_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_users(
        self, role: Optional[UserRole] = None, is_active: Optional[bool] = None, skip: int = 0, limit: int = 50
    ) -> List[User]:
        query = select(User)
        if role:
            query = query.where(User.role == role)
        if is_active is not None:
            query = query.where(User.is_active == is_active)
        query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def count_users(self, role: Optional[UserRole] = None) -> int:
        query = select(func.count(User.id))
        if role:
            query = query.where(User.role == role)
        result = await self.db.execute(query)
        return result.scalar() or 0

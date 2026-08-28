from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.category import Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, db: AsyncSession):
        super().__init__(Category, db)

    async def get_by_slug(self, slug: str) -> Optional[Category]:
        query = (
            select(Category)
            .options(selectinload(Category.children), selectinload(Category.parent))
            .where(Category.slug == slug)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_tree(self) -> List[Category]:
        # Fetch root categories with children preloaded
        query = (
            select(Category)
            .options(selectinload(Category.children).selectinload(Category.children))
            .where(Category.parent_id == None, Category.is_active == True)
            .order_by(Category.display_order.asc(), Category.name.asc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_all_active(self) -> List[Category]:
        query = select(Category).where(Category.is_active == True).order_by(Category.display_order.asc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

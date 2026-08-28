from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: AsyncSession):
        super().__init__(Notification, db)

    async def get_user_notifications(self, user_id: str, limit: int = 30) -> List[Notification]:
        query = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc()).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def mark_all_read(self, user_id: str) -> int:
        notifications = await self.get_user_notifications(user_id)
        count = 0
        for n in notifications:
            if not n.is_read:
                n.is_read = True
                count += 1
        await self.db.flush()
        return count

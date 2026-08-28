from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.repositories.notification_repo import NotificationRepository


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = NotificationRepository(db)

    async def send_notification(self, user_id: str, notif_type: str, title: str, body: str, action_url: Optional[str] = None) -> Notification:
        notif = Notification(user_id=user_id, type=notif_type, title=title, body=body, action_url=action_url)
        self.db.add(notif)
        await self.db.flush()
        return notif

    async def get_user_notifications(self, user_id: str) -> List[Notification]:
        return await self.repo.get_user_notifications(user_id)

    async def mark_all_read(self, user_id: str) -> int:
        return await self.repo.mark_all_read(user_id)

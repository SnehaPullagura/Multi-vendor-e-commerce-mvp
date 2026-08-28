from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.support import SupportTicket, TicketMessage
from app.repositories.base import BaseRepository


class SupportRepository(BaseRepository[SupportTicket]):
    def __init__(self, db: AsyncSession):
        super().__init__(SupportTicket, db)

    async def get_by_ticket_number(self, number: str) -> Optional[SupportTicket]:
        query = select(SupportTicket).options(selectinload(SupportTicket.messages).selectinload(TicketMessage.sender), selectinload(SupportTicket.user), selectinload(SupportTicket.vendor)).where(SupportTicket.ticket_number == number)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_by_user(self, user_id: str) -> List[SupportTicket]:
        query = select(SupportTicket).options(selectinload(SupportTicket.messages)).where(SupportTicket.user_id == user_id).order_by(SupportTicket.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_by_vendor(self, vendor_id: str) -> List[SupportTicket]:
        query = select(SupportTicket).options(selectinload(SupportTicket.messages), selectinload(SupportTicket.user)).where(SupportTicket.vendor_id == vendor_id).order_by(SupportTicket.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def add_message(self, ticket_id: str, sender_id: str, sender_role: str, text: str, is_internal: bool = False) -> TicketMessage:
        msg = TicketMessage(ticket_id=ticket_id, sender_user_id=sender_id, sender_role=sender_role, message_text=text, is_internal_note=is_internal)
        self.db.add(msg)
        await self.db.flush()
        return msg

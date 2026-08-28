from datetime import datetime
import random
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.support import SupportTicket, TicketMessage
from app.models.user import User
from app.repositories.support_repo import SupportRepository
from app.schemas.support import SupportTicketCreate


class SupportService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = SupportRepository(db)

    async def create_ticket(self, user: User, data: SupportTicketCreate) -> SupportTicket:
        t_num = f"TICK-{datetime.now().strftime('%Y%m')}-{random.randint(1000, 9999)}"
        ticket = SupportTicket(
            ticket_number=t_num,
            user_id=user.id,
            vendor_id=data.vendor_id,
            order_id=data.order_id,
            subject=data.subject,
            category=data.category,
            priority=data.priority,
            status="OPEN",
        )
        self.db.add(ticket)
        await self.db.flush()

        msg = TicketMessage(
            ticket_id=ticket.id,
            sender_user_id=user.id,
            sender_role=user.role.value if hasattr(user.role, "value") else str(user.role),
            message_text=data.initial_message,
        )
        self.db.add(msg)
        await self.db.flush()
        return ticket

    async def post_reply(self, ticket_id: str, user: User, text: str, is_internal: bool = False) -> TicketMessage:
        role = user.role.value if hasattr(user.role, "value") else str(user.role)
        return await self.repo.add_message(ticket_id, user.id, role, text, is_internal)

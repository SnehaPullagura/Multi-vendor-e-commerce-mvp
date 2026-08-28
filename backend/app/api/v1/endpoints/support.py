from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.support import SupportTicketCreate, SupportTicketResponse, TicketMessageCreate, TicketMessageResponse
from app.services.support_service import SupportService

router = APIRouter()

@router.get("/my-tickets", response_model=ApiResponse[List[SupportTicketResponse]])
async def get_my_tickets(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = SupportService(db)
    tickets = await service.repo.list_by_user(user.id)
    return ApiResponse.ok([SupportTicketResponse.model_validate(t) for t in tickets])

@router.get("/vendor-tickets", response_model=ApiResponse[List[SupportTicketResponse]])
async def get_vendor_tickets(vendor: Vendor = Depends(get_current_vendor), db: AsyncSession = Depends(get_db)):
    service = SupportService(db)
    tickets = await service.repo.list_by_vendor(vendor.id)
    return ApiResponse.ok([SupportTicketResponse.model_validate(t) for t in tickets])

@router.post("", response_model=ApiResponse[SupportTicketResponse], status_code=status.HTTP_201_CREATED)
async def create_support_ticket(data: SupportTicketCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = SupportService(db)
    ticket = await service.create_ticket(user, data)
    return ApiResponse.ok(SupportTicketResponse.model_validate(ticket), message="Support ticket opened")

@router.post("/{ticket_id}/reply", response_model=ApiResponse[TicketMessageResponse])
async def reply_support_ticket(ticket_id: str, data: TicketMessageCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = SupportService(db)
    msg = await service.post_reply(ticket_id, user, data.message_text, data.is_internal_note)
    return ApiResponse.ok(TicketMessageResponse.model_validate(msg), message="Reply sent")

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.services.notification_service import NotificationService

router = APIRouter()

@router.get("", response_model=ApiResponse[List[NotificationResponse]])
async def get_notifications(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = NotificationService(db)
    items = await service.get_user_notifications(user.id)
    return ApiResponse.ok([NotificationResponse.model_validate(n) for n in items])

@router.post("/read-all", response_model=ApiResponse[dict])
async def mark_all_read(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = NotificationService(db)
    count = await service.mark_all_read(user.id)
    return ApiResponse.ok({"marked_count": count})

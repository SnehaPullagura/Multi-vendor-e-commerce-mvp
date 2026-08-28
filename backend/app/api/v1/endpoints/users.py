from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import ChangePasswordRequest, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=ApiResponse[UserResponse])
@router.get("/profile", response_model=ApiResponse[UserResponse])
async def get_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Retrieve full user profile with linked vendor/address metadata."""
    service = UserService(db)
    user = await service.get_profile(current_user.id)
    return ApiResponse.ok(UserResponse.model_validate(user))


@router.put("/profile", response_model=ApiResponse[UserResponse])
async def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user profile information."""
    service = UserService(db)
    updated = await service.update_profile(current_user, data)
    return ApiResponse.ok(UserResponse.model_validate(updated), message="Profile updated")


@router.post("/change-password", response_model=ApiResponse[dict])
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change current user account password."""
    service = UserService(db)
    await service.change_password(current_user, data)
    return ApiResponse.ok({}, message="Password updated successfully")

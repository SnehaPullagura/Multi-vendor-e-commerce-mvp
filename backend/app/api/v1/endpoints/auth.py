from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    RegisterCustomerRequest,
    RegisterSellerRequest,
    TokenResponse,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register/customer", response_model=ApiResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
async def register_customer(req: RegisterCustomerRequest, db: AsyncSession = Depends(get_db)):
    """Register a new customer account."""
    service = AuthService(db)
    result = await service.register_customer(req)
    return ApiResponse.ok(result, message="Customer registered successfully")


@router.post("/register/seller", response_model=ApiResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
async def register_seller(req: RegisterSellerRequest, db: AsyncSession = Depends(get_db)):
    """Register a new seller account with store profile."""
    service = AuthService(db)
    result = await service.register_seller(req)
    return ApiResponse.ok(result, message="Seller registered successfully. Store is pending approval.")


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and obtain JWT tokens."""
    service = AuthService(db)
    result = await service.login(req)
    return ApiResponse.ok(result, message="Login successful")


@router.post("/refresh", response_model=ApiResponse[TokenResponse])
async def refresh_token(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Generate a new access token using a valid refresh token."""
    service = AuthService(db)
    result = await service.refresh_token(req)
    return ApiResponse.ok(result, message="Token refreshed")


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return ApiResponse.ok(UserResponse.model_validate(current_user))

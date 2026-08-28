from typing import Callable, List, Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.enums import UserRole, VendorStatus
from app.core.database import get_db
from app.core.exceptions import ForbiddenException, NotFoundException, UnauthorizedException
from app.core.security import decode_token
from app.models.user import User
from app.models.vendor import Vendor

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not auth or not auth.credentials:
        raise UnauthorizedException("Authentication required")
    
    payload = decode_token(auth.credentials)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Invalid or expired access token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Malformed token payload")
    
    query = (
        select(User)
        .options(selectinload(User.vendor_profile))
        .where(User.id == user_id, User.is_active == True)
    )
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise UnauthorizedException("User account not found or disabled")
    
    return user


async def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    if not auth or not auth.credentials:
        return None
    try:
        return await get_current_user(auth, db)
    except Exception:
        return None


def require_roles(*allowed_roles: UserRole) -> Callable:
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != UserRole.SUPER_ADMIN:
            raise ForbiddenException(
                f"Action requires one of the following roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker


async def get_current_vendor(
    current_user: User = Depends(require_roles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db),
) -> Vendor:
    # If user is Admin/SuperAdmin, check if they have a vendor profile or raise if not acting as vendor
    if current_user.vendor_profile:
        vendor = current_user.vendor_profile
        if vendor.status == VendorStatus.SUSPENDED:
            raise ForbiddenException("Your vendor account has been suspended. Please contact support.")
        if vendor.status == VendorStatus.REJECTED:
            raise ForbiddenException("Your vendor registration was rejected.")
        return vendor
    
    query = select(Vendor).where(Vendor.user_id == current_user.id)
    result = await db.execute(query)
    vendor = result.scalar_one_or_none()
    
    if not vendor:
        raise NotFoundException("Vendor profile not found for this user account")
    
    return vendor


async def get_current_admin(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
) -> User:
    return current_user


async def get_cart_identifier(
    current_user: Optional[User] = Depends(get_current_user_optional),
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID"),
) -> dict:
    if current_user:
        return {"user_id": current_user.id, "session_id": None}
    if not x_session_id:
        import uuid
        x_session_id = str(uuid.uuid4())
    return {"user_id": None, "session_id": x_session_id}

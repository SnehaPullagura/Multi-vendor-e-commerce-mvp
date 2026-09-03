from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import UserRole, VendorStatus
from app.core.exceptions import ConflictException, UnauthorizedException
from app.core.security import create_access_token, create_refresh_token, decode_token, get_password_hash, verify_password
from app.models.user import User
from app.models.vendor import Vendor
from app.repositories.user_repo import UserRepository
from app.repositories.vendor_repo import VendorRepository
from app.schemas.auth import LoginRequest, RefreshTokenRequest, RegisterCustomerRequest, RegisterSellerRequest, TokenResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.vendor_repo = VendorRepository(db)

    async def register_customer(self, req: RegisterCustomerRequest) -> TokenResponse:
        existing = await self.user_repo.get_by_email(req.email)
        if existing:
            raise ConflictException("A user with this email address already exists")

        user = await self.user_repo.create({
            "email": req.email.lower().strip(),
            "password_hash": get_password_hash(req.password),
            "full_name": req.full_name.strip(),
            "phone": req.phone.strip() if req.phone else None,
            "role": UserRole.CUSTOMER,
            "is_active": True,
            "is_verified": False,
        })

        access_token = create_access_token(user.id, {"role": user.role.value, "email": user.email})
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role,
            full_name=user.full_name,
            email=user.email,
        )

    async def register_seller(self, req: RegisterSellerRequest) -> TokenResponse:
        existing_user = await self.user_repo.get_by_email(req.email)
        if existing_user:
            raise ConflictException("A user with this email address already exists")

        existing_store = await self.vendor_repo.get_by_store_name(req.store_name)
        if existing_store:
            raise ConflictException("Store name is already taken. Please choose another name.")

        user = await self.user_repo.create({
            "email": req.email.lower().strip(),
            "password_hash": get_password_hash(req.password),
            "full_name": req.full_name.strip(),
            "phone": req.phone.strip(),
            "role": UserRole.SELLER,
            "is_active": True,
            "is_verified": False,
        })

        store_slug = slugify(req.store_name.strip())
        if await self.vendor_repo.get_by_slug(store_slug):
            raise ConflictException("A store with this name or web handle already exists. Please choose a unique store name.")

        vendor = await self.vendor_repo.create({
            "user_id": user.id,
            "store_name": req.store_name.strip(),
            "slug": store_slug,
            "description": req.store_description.strip() if req.store_description else None,
            "business_email": req.email.lower().strip(),
            "phone": req.phone.strip(),
            "tax_id": req.tax_id.strip() if req.tax_id else None,
            "bank_account_details": req.bank_account_details.strip() if req.bank_account_details else None,
            "status": VendorStatus.PENDING_REVIEW,
        })

        access_token = create_access_token(user.id, {"role": user.role.value, "email": user.email, "vendor_id": vendor.id})
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role,
            full_name=user.full_name,
            email=user.email,
        )

    async def login(self, req: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(req.email)
        if not user or not verify_password(req.password, user.password_hash):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Your account has been deactivated. Please contact support.")

        claims = {"role": user.role.value, "email": user.email}
        if user.vendor_profile:
            claims["vendor_id"] = user.vendor_profile.id

        access_token = create_access_token(user.id, claims)
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role,
            full_name=user.full_name,
            email=user.email,
        )

    async def refresh_token(self, req: RefreshTokenRequest) -> TokenResponse:
        payload = decode_token(req.refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid or expired refresh token")

        user_id = payload.get("sub")
        user = await self.user_repo.get_by_id_with_profile(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")

        claims = {"role": user.role.value, "email": user.email}
        if user.vendor_profile:
            claims["vendor_id"] = user.vendor_profile.id

        new_access_token = create_access_token(user.id, claims)
        new_refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            user_id=user.id,
            role=user.role,
            full_name=user.full_name,
            email=user.email,
        )

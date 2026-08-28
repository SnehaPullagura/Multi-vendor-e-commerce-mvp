from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException, UnauthorizedException
from app.core.security import get_password_hash, verify_password
from app.models.address import Address
from app.models.user import User
from app.repositories.address_repo import AddressRepository
from app.repositories.user_repo import UserRepository
from app.schemas.address import AddressCreate, AddressUpdate
from app.schemas.user import ChangePasswordRequest, UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.address_repo = AddressRepository(db)

    async def get_profile(self, user_id: str) -> User:
        user = await self.user_repo.get_by_id_with_profile(user_id)
        if not user:
            raise NotFoundException("User", user_id)
        return user

    async def update_profile(self, user: User, data: UserUpdate) -> User:
        update_data = data.model_dump(exclude_unset=True)
        return await self.user_repo.update(user, update_data)

    async def change_password(self, user: User, data: ChangePasswordRequest) -> None:
        if not verify_password(data.old_password, user.password_hash):
            raise BadRequestException("Incorrect old password")
        
        user.password_hash = get_password_hash(data.new_password)
        await self.db.flush()

    # Address Management
    async def list_addresses(self, user_id: str) -> List[Address]:
        return await self.address_repo.get_by_user(user_id)

    async def create_address(self, user_id: str, data: AddressCreate) -> Address:
        if data.is_default:
            await self.address_repo.unset_defaults(user_id)

        address_dict = data.model_dump()
        address_dict["user_id"] = user_id
        
        # If this is the user's first address, make it default automatically
        existing = await self.address_repo.get_by_user(user_id)
        if not existing:
            address_dict["is_default"] = True

        return await self.address_repo.create(address_dict)

    async def update_address(self, address_id: str, user_id: str, data: AddressUpdate) -> Address:
        address = await self.address_repo.get_user_address(address_id, user_id)
        if not address:
            raise NotFoundException("Address", address_id)

        if data.is_default:
            await self.address_repo.unset_defaults(user_id)

        return await self.address_repo.update(address, data.model_dump(exclude_unset=True))

    async def delete_address(self, address_id: str, user_id: str) -> None:
        address = await self.address_repo.get_user_address(address_id, user_id)
        if not address:
            raise NotFoundException("Address", address_id)
        await self.address_repo.delete(address)

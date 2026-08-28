from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.address import AddressCreate, AddressResponse, AddressUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("", response_model=ApiResponse[List[AddressResponse]])
async def list_user_addresses(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """List all saved addresses for current user."""
    service = UserService(db)
    addresses = await service.list_addresses(current_user.id)
    return ApiResponse.ok([AddressResponse.model_validate(a) for a in addresses])


@router.post("", response_model=ApiResponse[AddressResponse], status_code=status.HTTP_201_CREATED)
async def create_address(
    data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a new address to user account."""
    service = UserService(db)
    created = await service.create_address(current_user.id, data)
    return ApiResponse.ok(AddressResponse.model_validate(created), message="Address created")


@router.put("/{address_id}", response_model=ApiResponse[AddressResponse])
async def update_address(
    address_id: str,
    data: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing address."""
    service = UserService(db)
    updated = await service.update_address(address_id, current_user.id, data)
    return ApiResponse.ok(AddressResponse.model_validate(updated), message="Address updated")


@router.delete("/{address_id}", response_model=ApiResponse[dict])
async def delete_address(
    address_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an address."""
    service = UserService(db)
    await service.delete_address(address_id, current_user.id)
    return ApiResponse.ok({}, message="Address deleted")

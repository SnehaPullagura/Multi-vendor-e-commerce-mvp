from typing import List, Optional
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import VendorStatus
from app.core.exceptions import ConflictException, NotFoundException
from app.models.vendor import Vendor
from app.repositories.vendor_repo import VendorRepository
from app.schemas.vendor import VendorProfileUpdate, VendorStatusUpdate


class VendorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.vendor_repo = VendorRepository(db)

    async def get_by_user_id(self, user_id: str) -> Vendor:
        vendor = await self.vendor_repo.get_by_user_id(user_id)
        if not vendor:
            raise NotFoundException("Vendor profile for user", user_id)
        return vendor

    async def get_by_slug(self, slug: str) -> Vendor:
        vendor = await self.vendor_repo.get_by_slug(slug)
        if not vendor:
            raise NotFoundException("Vendor store", slug)
        return vendor

    async def update_profile(self, vendor: Vendor, data: VendorProfileUpdate) -> Vendor:
        update_data = data.model_dump(exclude_unset=True)
        if "store_name" in update_data and update_data["store_name"]:
            new_name = update_data["store_name"].strip()
            if new_name.lower() != vendor.store_name.lower():
                existing = await self.vendor_repo.get_by_store_name(new_name)
                if existing:
                    raise ConflictException("Store name is already in use")
                update_data["slug"] = slugify(new_name)

        return await self.vendor_repo.update(vendor, update_data)

    async def list_vendors(self, status: Optional[VendorStatus] = None, skip: int = 0, limit: int = 50) -> List[Vendor]:
        return await self.vendor_repo.list_vendors(status=status, skip=skip, limit=limit)

    async def update_status(self, vendor_id: str, data: VendorStatusUpdate) -> Vendor:
        vendor = await self.vendor_repo.get_by_id(vendor_id)
        if not vendor:
            raise NotFoundException("Vendor", vendor_id)
        
        update_dict = {"status": data.status}
        if data.rejection_reason is not None:
            update_dict["rejection_reason"] = data.rejection_reason
        if data.commission_rate is not None:
            update_dict["commission_rate"] = data.commission_rate

        return await self.vendor_repo.update(vendor, update_dict)

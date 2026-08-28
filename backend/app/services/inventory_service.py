from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.inventory import Warehouse, WarehouseStock
from app.repositories.inventory_repo import InventoryRepository
from app.schemas.inventory import StockAdjustmentRequest, WarehouseCreate


class InventoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = InventoryRepository(db)

    async def create_warehouse(self, vendor_id: str, data: WarehouseCreate) -> Warehouse:
        wh = Warehouse(
            vendor_id=vendor_id,
            name=data.name,
            code=data.code,
            contact_name=data.contact_name,
            contact_phone=data.contact_phone,
            street_address=data.street_address,
            city=data.city,
            state=data.state,
            postal_code=data.postal_code,
            country=data.country,
            is_primary=data.is_primary,
        )
        self.db.add(wh)
        await self.db.flush()
        return wh

    async def list_warehouses(self, vendor_id: str) -> List[Warehouse]:
        return await self.repo.get_vendor_warehouses(vendor_id)

    async def adjust_stock(self, req: StockAdjustmentRequest) -> WarehouseStock:
        return await self.repo.update_stock_quantity(
            warehouse_id=req.warehouse_id,
            variant_id=req.variant_id,
            change=req.quantity_change,
            movement_type=req.movement_type,
            reason=req.reason,
            ref_id=req.reference_id,
        )

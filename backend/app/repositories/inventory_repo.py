from typing import List, Optional
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.inventory import StockMovementLog, Warehouse, WarehouseStock
from app.repositories.base import BaseRepository


class InventoryRepository(BaseRepository[Warehouse]):
    def __init__(self, db: AsyncSession):
        super().__init__(Warehouse, db)

    async def get_vendor_warehouses(self, vendor_id: str) -> List[Warehouse]:
        query = select(Warehouse).options(selectinload(Warehouse.stocks).selectinload(WarehouseStock.variant)).where(Warehouse.vendor_id == vendor_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_stock(self, warehouse_id: str, variant_id: str) -> Optional[WarehouseStock]:
        query = select(WarehouseStock).where(WarehouseStock.warehouse_id == warehouse_id, WarehouseStock.variant_id == variant_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update_stock_quantity(self, warehouse_id: str, variant_id: str, change: int, movement_type: str, reason: str, ref_id: Optional[str] = None) -> WarehouseStock:
        stock = await self.get_stock(warehouse_id, variant_id)
        if not stock:
            stock = WarehouseStock(warehouse_id=warehouse_id, variant_id=variant_id, quantity_on_hand=max(0, change), quantity_available=max(0, change))
            self.db.add(stock)
            await self.db.flush()
        else:
            stock.quantity_on_hand += change
            stock.quantity_available = stock.quantity_on_hand - stock.quantity_reserved
            await self.db.flush()

        log = StockMovementLog(variant_id=variant_id, warehouse_id=warehouse_id, movement_type=movement_type, quantity_change=change, quantity_after=stock.quantity_on_hand, reference_id=ref_id, reason=reason)
        self.db.add(log)
        await self.db.flush()
        return stock

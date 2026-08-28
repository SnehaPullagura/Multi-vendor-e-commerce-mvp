from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_vendor
from app.models.vendor import Vendor
from app.schemas.inventory import StockAdjustmentRequest, WarehouseCreate, WarehouseResponse, WarehouseStockResponse
from app.services.inventory_service import InventoryService

router = APIRouter()

@router.get("/warehouses", response_model=ApiResponse[List[WarehouseResponse]])
async def list_warehouses(vendor: Vendor = Depends(get_current_vendor), db: AsyncSession = Depends(get_db)):
    service = InventoryService(db)
    whs = await service.list_warehouses(vendor.id)
    return ApiResponse.ok([WarehouseResponse.model_validate(w) for w in whs])

@router.post("/warehouses", response_model=ApiResponse[WarehouseResponse], status_code=status.HTTP_201_CREATED)
async def create_warehouse(data: WarehouseCreate, vendor: Vendor = Depends(get_current_vendor), db: AsyncSession = Depends(get_db)):
    service = InventoryService(db)
    wh = await service.create_warehouse(vendor.id, data)
    return ApiResponse.ok(WarehouseResponse.model_validate(wh), message="Warehouse created")

@router.post("/adjust-stock", response_model=ApiResponse[dict])
async def adjust_stock(req: StockAdjustmentRequest, vendor: Vendor = Depends(get_current_vendor), db: AsyncSession = Depends(get_db)):
    service = InventoryService(db)
    await service.adjust_stock(req)
    return ApiResponse.ok({"message": "Stock adjusted successfully"})

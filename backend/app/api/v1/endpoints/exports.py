from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_vendor
from app.models.vendor import Vendor
from app.services.export_import_service import ExportImportService

router = APIRouter()

@router.get("/products/csv")
async def export_products_csv(
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db)
):
    service = ExportImportService(db)
    csv_str = await service.export_vendor_products_csv(vendor.id)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=products_{vendor.slug}.csv"}
    )

@router.post("/products/csv/import", response_model=ApiResponse)
async def import_products_csv(
    file: UploadFile = File(...),
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db)
):
    content = await file.read()
    service = ExportImportService(db)
    result = await service.validate_and_import_products_csv(vendor.id, content.decode("utf-8"))
    return ApiResponse.ok(result, message="Import batch processed")

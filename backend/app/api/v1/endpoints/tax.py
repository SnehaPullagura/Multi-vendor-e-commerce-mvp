"""Tax calculation and configuration API endpoints."""
from decimal import Decimal
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.services.tax_service import TaxService
from pydantic import BaseModel

router = APIRouter()


class TaxItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int = 1


class TaxCalculationRequest(BaseModel):
    items: List[TaxItem]
    shipping_state: str
    shipping_country: str = "US"
    shipping_amount: float = 0.0
    user_id: str | None = None


@router.post("/calculate", response_model=ApiResponse)
async def calculate_tax(
    req: TaxCalculationRequest,
    db: AsyncSession = Depends(get_db),
):
    """Calculate applicable tax for items shipped to a specific address."""
    service = TaxService(db)
    items = [{"id": i.id, "name": i.name, "price": i.price, "quantity": i.quantity} for i in req.items]
    result = await service.calculate_tax(
        items=items,
        shipping_state=req.shipping_state,
        shipping_country=req.shipping_country,
        shipping_amount=Decimal(str(req.shipping_amount)),
        user_id=req.user_id,
    )
    return ApiResponse.ok(result)


@router.get("/rates", response_model=ApiResponse)
async def get_tax_rates(
    state: str = Query(..., min_length=2, max_length=2),
    country: str = Query("US"),
    db: AsyncSession = Depends(get_db),
):
    """Get tax rates for a specific jurisdiction."""
    service = TaxService(db)
    rates = await service.get_tax_rates_for_jurisdiction(state, country)
    return ApiResponse.ok(rates)


@router.get("/report", response_model=ApiResponse)
async def get_tax_report(
    admin=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get tax collection summary report. Admin only."""
    service = TaxService(db)
    report = await service.get_tax_summary_report()
    return ApiResponse.ok(report)

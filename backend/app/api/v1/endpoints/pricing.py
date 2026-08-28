from decimal import Decimal
from typing import Any, Dict, List
from fastapi import APIRouter, Query
from app.common.responses import ApiResponse
from app.services.pricing_engine import PricingEngine
from pydantic import BaseModel

router = APIRouter()

class PriceQuoteRequest(BaseModel):
    base_price: float
    quantity: int
    coupon_discount_pct: float = 0.0
    currency: str = "USD"

@router.post("/quote", response_model=ApiResponse[Dict[str, Any]])
async def get_price_quote(req: PriceQuoteRequest):
    result = PricingEngine.calculate_effective_price(
        base_price=Decimal(str(req.base_price)),
        quantity=req.quantity,
        coupon_discount_pct=Decimal(str(req.coupon_discount_pct)),
        currency=req.currency,
    )
    return ApiResponse.ok(result)

@router.get("/wholesale-tiers", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_wholesale_tiers(base_price: float = Query(100.0, gt=0)):
    tiers = PricingEngine.get_wholesale_breakdown_table(Decimal(str(base_price)))
    return ApiResponse.ok(tiers)

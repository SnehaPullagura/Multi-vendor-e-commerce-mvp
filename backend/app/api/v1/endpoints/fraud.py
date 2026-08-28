from decimal import Decimal
from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin, get_current_user
from app.models.user import User
from app.services.fraud_detection_service import FraudDetectionService
from pydantic import BaseModel

router = APIRouter()

class RiskEvaluationRequest(BaseModel):
    total_amount: float
    shipping_zip: str
    billing_zip: str
    ip_address: str = "127.0.0.1"
    payment_method: str = "CREDIT_CARD"

@router.post("/evaluate", response_model=ApiResponse[Dict[str, Any]])
async def evaluate_risk(
    req: RiskEvaluationRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = FraudDetectionService(db)
    result = await service.evaluate_order_risk(
        user_id=user.id,
        total_amount=Decimal(str(req.total_amount)),
        shipping_zip=req.shipping_zip,
        billing_zip=req.billing_zip,
        ip_address=req.ip_address,
        payment_method=req.payment_method,
    )
    return ApiResponse.ok(result)

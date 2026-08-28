from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import PayoutStatus
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.ledger import (
    PayoutRequestCreate,
    PayoutRequestResponse,
    PayoutRequestUpdate,
    VendorFinanceSummary,
)
from app.services.ledger_service import LedgerService

router = APIRouter()


@router.get("/summary", response_model=ApiResponse[VendorFinanceSummary])
async def get_my_finance_summary(
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve the authenticated seller's live balance, commission cuts, and transaction history."""
    service = LedgerService(db)
    summary = await service.get_vendor_summary(vendor)
    return ApiResponse.ok(summary)


@router.post("/payouts", response_model=ApiResponse[PayoutRequestResponse], status_code=status.HTTP_201_CREATED)
async def request_payout(
    data: PayoutRequestCreate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Submit a withdrawal payout request from seller's available balance."""
    service = LedgerService(db)
    payout = await service.request_payout(vendor, data)
    return ApiResponse.ok(PayoutRequestResponse.model_validate(payout), message="Payout requested successfully")


@router.get("/payouts", response_model=ApiResponse[List[PayoutRequestResponse]])
async def list_my_payout_requests(
    status: Optional[PayoutStatus] = None,
    skip: int = 0,
    limit: int = 50,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """List payout withdrawal history for the seller."""
    service = LedgerService(db)
    payouts = await service.list_payouts(vendor_id=vendor.id, status=status, skip=skip, limit=limit)
    return ApiResponse.ok([PayoutRequestResponse.model_validate(p) for p in payouts])


# Admin settlement endpoint
@router.put("/payouts/{payout_id}/settle", response_model=ApiResponse[PayoutRequestResponse])
async def settle_payout_request(
    payout_id: str,
    data: PayoutRequestUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Process and settle a vendor payout request (Admin only)."""
    service = LedgerService(db)
    processed = await service.process_payout(payout_id, data)
    return ApiResponse.ok(PayoutRequestResponse.model_validate(processed), message="Payout processed")

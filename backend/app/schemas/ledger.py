from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.common.enums import LedgerTransactionType, PayoutStatus


class LedgerEntryResponse(BaseModel):
    id: str
    vendor_id: str
    sub_order_id: Optional[str] = None
    transaction_type: LedgerTransactionType
    amount: float
    balance_after: float
    reference_id: Optional[str] = None
    description: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PayoutRequestCreate(BaseModel):
    amount: float = Field(gt=0)
    notes: Optional[str] = None


class PayoutRequestUpdate(BaseModel):
    status: PayoutStatus
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None


class PayoutRequestResponse(BaseModel):
    id: str
    vendor_id: str
    amount: float
    status: PayoutStatus
    processed_at: Optional[datetime] = None
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VendorFinanceSummary(BaseModel):
    current_balance: float
    total_sales_revenue: float
    total_commission_paid: float
    total_withdrawn: float
    pending_payout: float
    recent_transactions: List[LedgerEntryResponse] = []

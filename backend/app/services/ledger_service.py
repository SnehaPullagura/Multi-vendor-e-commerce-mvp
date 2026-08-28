from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import LedgerTransactionType, PayoutStatus
from app.core.exceptions import BadRequestException, NotFoundException
from app.models.ledger import PayoutRequest
from app.models.vendor import Vendor
from app.repositories.ledger_repo import LedgerRepository
from app.schemas.ledger import PayoutRequestCreate, PayoutRequestUpdate, VendorFinanceSummary


class LedgerService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ledger_repo = LedgerRepository(db)

    async def get_vendor_summary(self, vendor: Vendor) -> VendorFinanceSummary:
        stats = await self.ledger_repo.get_vendor_finance_stats(vendor.id)
        return VendorFinanceSummary(**stats)

    async def request_payout(self, vendor: Vendor, data: PayoutRequestCreate) -> PayoutRequest:
        balance = await self.ledger_repo.get_current_balance(vendor.id)
        if data.amount > balance:
            raise BadRequestException(
                f"Requested payout amount (${data.amount:.2f}) exceeds current available balance (${balance:.2f})."
            )

        payout = await self.ledger_repo.create_payout_request(
            vendor_id=vendor.id,
            amount=data.amount,
            notes=data.notes,
        )
        return payout

    async def list_payouts(
        self, vendor_id: Optional[str] = None, status: Optional[PayoutStatus] = None, skip: int = 0, limit: int = 50
    ) -> List[PayoutRequest]:
        return await self.ledger_repo.list_payout_requests(vendor_id=vendor_id, status=status, skip=skip, limit=limit)

    async def process_payout(self, payout_id: str, data: PayoutRequestUpdate) -> PayoutRequest:
        payout = await self.ledger_repo.get_payout_by_id(payout_id)
        if not payout:
            raise NotFoundException("Payout Request", payout_id)

        if payout.status != PayoutStatus.REQUESTED:
            raise BadRequestException(f"Payout is already in '{payout.status.value}' state.")

        payout.status = data.status
        payout.processed_at = datetime.now(timezone.utc)
        if data.transaction_ref:
            payout.transaction_ref = data.transaction_ref
        if data.notes:
            payout.notes = data.notes

        if data.status == PayoutStatus.SETTLED:
            # Record debit in vendor ledger
            await self.ledger_repo.record_transaction(
                vendor_id=payout.vendor_id,
                transaction_type=LedgerTransactionType.DEBIT_PAYOUT,
                amount=payout.amount,
                reference_id=data.transaction_ref or f"PAYOUT-{payout.id[:8]}",
                description=f"Settled vendor payout withdrawal #{payout.id[:8]}",
            )

        await self.db.flush()
        return payout

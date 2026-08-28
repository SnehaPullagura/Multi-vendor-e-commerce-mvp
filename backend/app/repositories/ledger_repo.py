from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import LedgerTransactionType, PayoutStatus
from app.models.ledger import PayoutRequest, VendorLedger
from app.repositories.base import BaseRepository


class LedgerRepository(BaseRepository[VendorLedger]):
    def __init__(self, db: AsyncSession):
        super().__init__(VendorLedger, db)

    async def get_current_balance(self, vendor_id: str) -> float:
        query = (
            select(VendorLedger.balance_after)
            .where(VendorLedger.vendor_id == vendor_id)
            .order_by(VendorLedger.created_at.desc())
            .limit(1)
        )
        result = await self.db.execute(query)
        balance = result.scalar_one_or_none()
        return balance if balance is not None else 0.0

    async def record_transaction(
        self,
        vendor_id: str,
        transaction_type: LedgerTransactionType,
        amount: float,
        sub_order_id: Optional[str] = None,
        reference_id: Optional[str] = None,
        description: str = "",
    ) -> VendorLedger:
        current_balance = await self.get_current_balance(vendor_id)
        
        # Calculate new running balance
        if transaction_type in (LedgerTransactionType.CREDIT_SALE, LedgerTransactionType.CREDIT_REFUND):
            new_balance = current_balance + amount
        else:  # DEBIT_COMMISSION, DEBIT_PAYOUT
            new_balance = current_balance - amount

        entry = VendorLedger(
            vendor_id=vendor_id,
            sub_order_id=sub_order_id,
            transaction_type=transaction_type,
            amount=amount,
            balance_after=new_balance,
            reference_id=reference_id,
            description=description,
        )
        self.db.add(entry)
        await self.db.flush()
        await self.db.refresh(entry)
        return entry

    async def list_transactions(self, vendor_id: str, skip: int = 0, limit: int = 50) -> List[VendorLedger]:
        query = (
            select(VendorLedger)
            .where(VendorLedger.vendor_id == vendor_id)
            .order_by(VendorLedger.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_payout_request(self, vendor_id: str, amount: float, notes: Optional[str] = None) -> PayoutRequest:
        payout = PayoutRequest(vendor_id=vendor_id, amount=amount, notes=notes, status=PayoutStatus.REQUESTED)
        self.db.add(payout)
        await self.db.flush()
        await self.db.refresh(payout)
        return payout

    async def list_payout_requests(
        self, vendor_id: Optional[str] = None, status: Optional[PayoutStatus] = None, skip: int = 0, limit: int = 50
    ) -> List[PayoutRequest]:
        query = select(PayoutRequest)
        if vendor_id:
            query = query.where(PayoutRequest.vendor_id == vendor_id)
        if status:
            query = query.where(PayoutRequest.status == status)
        query = query.order_by(PayoutRequest.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_payout_by_id(self, payout_id: str) -> Optional[PayoutRequest]:
        query = select(PayoutRequest).where(PayoutRequest.id == payout_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_vendor_finance_stats(self, vendor_id: str) -> dict:
        balance = await self.get_current_balance(vendor_id)
        
        # Calculate totals
        credit_query = (
            select(func.coalesce(func.sum(VendorLedger.amount), 0.0))
            .where(VendorLedger.vendor_id == vendor_id, VendorLedger.transaction_type == LedgerTransactionType.CREDIT_SALE)
        )
        comm_query = (
            select(func.coalesce(func.sum(VendorLedger.amount), 0.0))
            .where(VendorLedger.vendor_id == vendor_id, VendorLedger.transaction_type == LedgerTransactionType.DEBIT_COMMISSION)
        )
        payout_query = (
            select(func.coalesce(func.sum(PayoutRequest.amount), 0.0))
            .where(PayoutRequest.vendor_id == vendor_id, PayoutRequest.status == PayoutStatus.SETTLED)
        )
        pending_payout_query = (
            select(func.coalesce(func.sum(PayoutRequest.amount), 0.0))
            .where(PayoutRequest.vendor_id == vendor_id, PayoutRequest.status == PayoutStatus.REQUESTED)
        )

        total_sales = (await self.db.execute(credit_query)).scalar() or 0.0
        total_comm = (await self.db.execute(comm_query)).scalar() or 0.0
        total_withdrawn = (await self.db.execute(payout_query)).scalar() or 0.0
        pending_payout = (await self.db.execute(pending_payout_query)).scalar() or 0.0

        recent_txs = await self.list_transactions(vendor_id, skip=0, limit=10)

        return {
            "current_balance": balance,
            "total_sales_revenue": total_sales,
            "total_commission_paid": total_comm,
            "total_withdrawn": total_withdrawn,
            "pending_payout": pending_payout,
            "recent_transactions": recent_txs,
        }

from datetime import datetime
from decimal import Decimal
import random
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.rma import ReturnItem, ReturnRequest
from app.models.user import User
from app.models.vendor import Vendor
from app.repositories.rma_repo import RMARepository
from app.schemas.rma import ReturnRequestCreate


class RMAService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = RMARepository(db)

    async def create_return_request(self, user: User, vendor_id: str, data: ReturnRequestCreate) -> ReturnRequest:
        rma_num = f"RMA-{datetime.now().strftime('%Y%m')}-{random.randint(10000, 99999)}"
        rma = ReturnRequest(
            sub_order_id=data.sub_order_id,
            user_id=user.id,
            vendor_id=vendor_id,
            rma_number=rma_num,
            status="PENDING_APPROVAL",
            reason_category=data.reason_category,
            customer_notes=data.customer_notes,
            total_refund_amount=Decimal("0.00"),
        )
        self.db.add(rma)
        await self.db.flush()

        total = Decimal("0.00")
        for item in data.items:
            # calculate item refund amount
            ritem = ReturnItem(
                return_request_id=rma.id,
                order_item_id=item.order_item_id,
                quantity=item.quantity,
                refund_amount=Decimal("50.00") * item.quantity,
            )
            total += ritem.refund_amount
            self.db.add(ritem)

        rma.total_refund_amount = total
        await self.db.flush()
        return rma

    async def update_status(self, rma_id: str, status: str, vendor_notes: str = "") -> ReturnRequest:
        rma = await self.repo.get_by_id(rma_id)
        if rma:
            rma.status = status
            if vendor_notes:
                rma.vendor_notes = vendor_notes
            await self.db.flush()
        return rma

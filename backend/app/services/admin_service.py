from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import LedgerTransactionType, MasterOrderStatus, ProductStatus, UserRole, VendorStatus
from app.models.order import Order
from app.models.ledger import VendorLedger
from app.models.product import Product
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.admin import PlatformStatsResponse


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_platform_stats(self) -> PlatformStatsResponse:
        # GMV (Total successful sales)
        gmv_query = select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(
            Order.status.in_([MasterOrderStatus.CONFIRMED, MasterOrderStatus.PARTIALLY_SHIPPED, MasterOrderStatus.COMPLETED])
        )
        # Total Platform Commission
        comm_query = select(func.coalesce(func.sum(VendorLedger.amount), 0.0)).where(
            VendorLedger.transaction_type == LedgerTransactionType.DEBIT_COMMISSION
        )
        # Counts
        orders_cnt_query = select(func.count(Order.id))
        vendors_cnt_query = select(func.count(Vendor.id))
        active_vendors_query = select(func.count(Vendor.id)).where(Vendor.status == VendorStatus.APPROVED)
        pending_vendors_query = select(func.count(Vendor.id)).where(Vendor.status == VendorStatus.PENDING_REVIEW)
        products_cnt_query = select(func.count(Product.id)).where(Product.status == ProductStatus.PUBLISHED)
        customers_cnt_query = select(func.count(User.id)).where(User.role == UserRole.CUSTOMER)

        gmv = (await self.db.execute(gmv_query)).scalar() or 0.0
        commission = (await self.db.execute(comm_query)).scalar() or 0.0
        orders_count = (await self.db.execute(orders_cnt_query)).scalar() or 0
        vendors_count = (await self.db.execute(vendors_cnt_query)).scalar() or 0
        active_vendors = (await self.db.execute(active_vendors_query)).scalar() or 0
        pending_vendors = (await self.db.execute(pending_vendors_query)).scalar() or 0
        products_count = (await self.db.execute(products_cnt_query)).scalar() or 0
        customers_count = (await self.db.execute(customers_cnt_query)).scalar() or 0

        return PlatformStatsResponse(
            total_sales_gmv=round(gmv, 2),
            total_platform_commission=round(commission, 2),
            total_orders_count=orders_count,
            total_vendors_count=vendors_count,
            active_vendors_count=active_vendors,
            pending_vendors_count=pending_vendors,
            total_products_count=products_count,
            total_customers_count=customers_count,
        )

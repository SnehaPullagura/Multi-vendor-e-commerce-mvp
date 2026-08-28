from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.promotion import Coupon, CouponUsage, FlashSale, FlashSaleItem, Promotion, PromotionRule
from app.repositories.base import BaseRepository


class PromotionRepository(BaseRepository[Promotion]):
    def __init__(self, db: AsyncSession):
        super().__init__(Promotion, db)

    async def get_by_slug(self, slug: str) -> Optional[Promotion]:
        query = select(Promotion).options(selectinload(Promotion.coupons), selectinload(Promotion.rules), selectinload(Promotion.vendor)).where(Promotion.slug == slug)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_active_promotions(self, vendor_id: Optional[str] = None) -> List[Promotion]:
        now = datetime.now(timezone.utc)
        conditions = [Promotion.is_active == True, Promotion.starts_at <= now, Promotion.ends_at >= now]
        if vendor_id:
            conditions.append(or_(Promotion.vendor_id == vendor_id, Promotion.scope == "PLATFORM_WIDE"))
        else:
            conditions.append(Promotion.scope == "PLATFORM_WIDE")

        query = select(Promotion).options(selectinload(Promotion.rules), selectinload(Promotion.vendor)).where(and_(*conditions)).order_by(Promotion.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_coupon_by_code(self, code: str) -> Optional[Coupon]:
        query = select(Coupon).options(selectinload(Coupon.promotion).selectinload(Promotion.rules), selectinload(Coupon.usages)).where(Coupon.code == code.upper().strip(), Coupon.is_active == True)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def count_coupon_usages_by_user(self, coupon_id: str, user_id: str) -> int:
        query = select(CouponUsage).where(CouponUsage.coupon_id == coupon_id, CouponUsage.user_id == user_id)
        result = await self.db.execute(query)
        return len(result.scalars().all())

    async def record_coupon_usage(self, coupon_id: str, user_id: str, order_id: str, discount_amount: float) -> CouponUsage:
        usage = CouponUsage(coupon_id=coupon_id, user_id=user_id, order_id=order_id, discount_applied=discount_amount)
        self.db.add(usage)
        await self.db.flush()
        return usage

    async def get_active_flash_sales(self) -> List[FlashSale]:
        now = datetime.now(timezone.utc)
        query = select(FlashSale).options(selectinload(FlashSale.items).selectinload(FlashSaleItem.variant)).where(FlashSale.is_active == True, FlashSale.starts_at <= now, FlashSale.ends_at >= now)
        result = await self.db.execute(query)
        return list(result.scalars().all())

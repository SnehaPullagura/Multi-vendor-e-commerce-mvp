from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.promotion import Coupon, Promotion, PromotionRule
from app.models.user import User
from app.models.vendor import Vendor
from app.repositories.promotion_repo import PromotionRepository
from app.schemas.promotion import PromotionCreate, ValidateCouponRequest, ValidateCouponResponse


class PromotionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = PromotionRepository(db)

    async def create_promotion(self, data: PromotionCreate, vendor: Optional[Vendor] = None) -> Promotion:
        slug = data.title.lower().replace(" ", "-").replace("/", "-") + "-" + str(int(datetime.now().timestamp()))
        promo = Promotion(
            vendor_id=vendor.id if vendor else None,
            title=data.title,
            description=data.description,
            slug=slug,
            discount_type=data.discount_type,
            discount_value=data.discount_value,
            scope=data.scope if not vendor else "VENDOR_STORE",
            min_order_amount=data.min_order_amount,
            max_discount_amount=data.max_discount_amount,
            usage_limit=data.usage_limit,
            per_user_limit=data.per_user_limit,
            is_stackable=data.is_stackable,
            starts_at=data.starts_at,
            ends_at=data.ends_at,
            banner_url=data.banner_url,
        )
        self.db.add(promo)
        await self.db.flush()

        for c in data.coupons:
            coupon = Coupon(promotion_id=promo.id, code=c.code.upper().strip(), is_single_use=c.is_single_use, expires_at=c.expires_at)
            self.db.add(coupon)

        for r in data.rules:
            rule = PromotionRule(promotion_id=promo.id, rule_type=r.rule_type, target_id=r.target_id, rule_value=r.rule_value, is_inclusive=r.is_inclusive)
            self.db.add(rule)

        await self.db.flush()
        return promo

    async def validate_coupon(self, req: ValidateCouponRequest, user: Optional[User] = None) -> ValidateCouponResponse:
        coupon = await self.repo.get_coupon_by_code(req.code)
        if not coupon or not coupon.is_active:
            return ValidateCouponResponse(is_valid=False, discount_amount=Decimal("0.00"), message="Invalid or expired coupon code.")

        promo = coupon.promotion
        now = datetime.now(timezone.utc)
        if promo.starts_at > now or promo.ends_at < now:
            return ValidateCouponResponse(is_valid=False, discount_amount=Decimal("0.00"), message="This promotional campaign has ended.")

        if req.subtotal < promo.min_order_amount:
            return ValidateCouponResponse(is_valid=False, discount_amount=Decimal("0.00"), message=f"Minimum order subtotal of ${promo.min_order_amount} required.")

        if user:
            usage_count = await self.repo.count_coupon_usages_by_user(coupon.id, user.id)
            if usage_count >= promo.per_user_limit:
                return ValidateCouponResponse(is_valid=False, discount_amount=Decimal("0.00"), message="You have already redeemed this coupon the maximum allowed times.")

        discount = Decimal("0.00")
        if promo.discount_type == "PERCENTAGE":
            discount = (req.subtotal * promo.discount_value) / Decimal("100.00")
            if promo.max_discount_amount and discount > promo.max_discount_amount:
                discount = promo.max_discount_amount
        elif promo.discount_type == "FIXED_AMOUNT":
            discount = min(req.subtotal, promo.discount_value)

        return ValidateCouponResponse(is_valid=True, discount_amount=discount, message=f"Coupon applied: ${discount:.2f} savings!", promotion=promo)

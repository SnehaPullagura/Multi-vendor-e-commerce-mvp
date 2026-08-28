import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class DiscountType(str):
    PERCENTAGE = "PERCENTAGE"
    FIXED_AMOUNT = "FIXED_AMOUNT"
    BUY_X_GET_Y = "BUY_X_GET_Y"
    FREE_SHIPPING = "FREE_SHIPPING"


class PromotionScope(str):
    PLATFORM_WIDE = "PLATFORM_WIDE"
    VENDOR_STORE = "VENDOR_STORE"
    CATEGORY = "CATEGORY"
    PRODUCT = "PRODUCT"


class Promotion(Base):
    __tablename__ = "promotions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    discount_type: Mapped[str] = mapped_column(String(50), default="PERCENTAGE", nullable=False)
    discount_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    scope: Mapped[str] = mapped_column(String(50), default="PLATFORM_WIDE", nullable=False)
    min_order_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    max_discount_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    usage_limit: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    usage_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    per_user_limit: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_stackable: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    banner_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    coupons: Mapped[List["Coupon"]] = relationship("Coupon", back_populates="promotion", cascade="all, delete-orphan", lazy="selectin")
    rules: Mapped[List["PromotionRule"]] = relationship("PromotionRule", back_populates="promotion", cascade="all, delete-orphan", lazy="selectin")
    vendor: Mapped[Optional["Vendor"]] = relationship("Vendor", lazy="selectin")


class Coupon(Base):
    __tablename__ = "coupons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    promotion_id: Mapped[str] = mapped_column(String(36), ForeignKey("promotions.id", ondelete="CASCADE"), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    is_single_use: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    assigned_user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    promotion: Mapped["Promotion"] = relationship("Promotion", back_populates="coupons", lazy="selectin")
    usages: Mapped[List["CouponUsage"]] = relationship("CouponUsage", back_populates="coupon", cascade="all, delete-orphan", lazy="selectin")


class CouponUsage(Base):
    __tablename__ = "coupon_usages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    coupon_id: Mapped[str] = mapped_column(String(36), ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    discount_applied: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    used_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    coupon: Mapped["Coupon"] = relationship("Coupon", back_populates="usages", lazy="selectin")


class PromotionRule(Base):
    __tablename__ = "promotion_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    promotion_id: Mapped[str] = mapped_column(String(36), ForeignKey("promotions.id", ondelete="CASCADE"), nullable=False, index=True)
    rule_type: Mapped[str] = mapped_column(String(50), nullable=False)  # CATEGORY, PRODUCT, MIN_QTY, USER_GROUP
    target_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)  # Category ID or Product ID
    rule_value: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_inclusive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    promotion: Mapped["Promotion"] = relationship("Promotion", back_populates="rules", lazy="selectin")


class FlashSale(Base):
    __tablename__ = "flash_sales"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    banner_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    items: Mapped[List["FlashSaleItem"]] = relationship("FlashSaleItem", back_populates="flash_sale", cascade="all, delete-orphan", lazy="selectin")


class FlashSaleItem(Base):
    __tablename__ = "flash_sale_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flash_sale_id: Mapped[str] = mapped_column(String(36), ForeignKey("flash_sales.id", ondelete="CASCADE"), nullable=False, index=True)
    product_variant_id: Mapped[str] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False, index=True)
    flash_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    allocated_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    sold_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    order_limit_per_customer: Mapped[int] = mapped_column(Integer, default=2, nullable=False)

    flash_sale: Mapped["FlashSale"] = relationship("FlashSale", back_populates="items", lazy="selectin")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant", lazy="selectin")

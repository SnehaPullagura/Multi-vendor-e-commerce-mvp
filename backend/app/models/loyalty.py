"""
Customer Loyalty Programs, Tiers & Points Ledger Domain.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class LoyaltyTierLevel(str, Enum):
    BRONZE = "BRONZE"
    SILVER = "SILVER"
    GOLD = "GOLD"
    PLATINUM_VIP = "PLATINUM_VIP"


class CustomerLoyaltyAccount(Base):
    __tablename__ = "customer_loyalty_accounts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), nullable=False, unique=True)
    card_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    tier_level: Mapped[LoyaltyTierLevel] = mapped_column(SQLEnum(LoyaltyTierLevel), default=LoyaltyTierLevel.BRONZE)
    current_points_balance: Mapped[int] = mapped_column(Integer, default=0)
    lifetime_points_earned: Mapped[int] = mapped_column(Integer, default=0)
    cashback_balance_usd: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    transactions: Mapped[List["LoyaltyPointsTransaction"]] = relationship("LoyaltyPointsTransaction", back_populates="account", cascade="all, delete-orphan")


class LoyaltyPointsTransaction(Base):
    __tablename__ = "loyalty_points_transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_loyalty_accounts.id"), nullable=False)
    transaction_type: Mapped[str] = mapped_column(String(50), nullable=False)  # EARNED_DINE_IN, REDEEMED_DISCOUNT, BONUS_BIRTHDAY
    points_delta: Mapped[int] = mapped_column(Integer, nullable=False)
    order_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    description: Mapped[str] = mapped_column(String(255), default="Points movement")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    account: Mapped["CustomerLoyaltyAccount"] = relationship("CustomerLoyaltyAccount", back_populates="transactions")

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.enums import LedgerTransactionType, PayoutStatus
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.vendor import Vendor
    from app.models.order import SubOrder


class VendorLedger(Base):
    """Immutable financial ledger tracking all debits and credits for vendors."""
    __tablename__ = "vendor_ledger"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), index=True, nullable=False)
    sub_order_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("sub_orders.id", ondelete="SET NULL"), nullable=True, index=True)
    transaction_type: Mapped[LedgerTransactionType] = mapped_column(SQLEnum(LedgerTransactionType), nullable=False, index=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    balance_after: Mapped[float] = mapped_column(Float, nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="ledger_entries")
    sub_order: Mapped[Optional["SubOrder"]] = relationship("SubOrder", back_populates="ledger_entries")


class PayoutRequest(Base):
    """Vendor payout withdrawal request and settlement status."""
    __tablename__ = "payout_requests"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[PayoutStatus] = mapped_column(SQLEnum(PayoutStatus), default=PayoutStatus.REQUESTED, nullable=False, index=True)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    transaction_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="payout_requests")

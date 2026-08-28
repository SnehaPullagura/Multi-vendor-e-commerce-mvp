from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Enum as SQLEnum, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.enums import VendorStatus
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product
    from app.models.order import SubOrder
    from app.models.ledger import VendorLedger, PayoutRequest


class Vendor(Base):
    __tablename__ = "vendors"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    store_name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    banner_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    business_email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bank_account_details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[VendorStatus] = mapped_column(SQLEnum(VendorStatus), default=VendorStatus.PENDING_REVIEW, nullable=False, index=True)
    commission_rate: Mapped[float] = mapped_column(Float, default=10.0, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="vendor_profile", lazy="selectin")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="vendor", cascade="all, delete-orphan", lazy="selectin")
    sub_orders: Mapped[List["SubOrder"]] = relationship("SubOrder", back_populates="vendor", lazy="selectin")
    ledger_entries: Mapped[List["VendorLedger"]] = relationship("VendorLedger", back_populates="vendor", cascade="all, delete-orphan", lazy="selectin")
    payout_requests: Mapped[List["PayoutRequest"]] = relationship("PayoutRequest", back_populates="vendor", cascade="all, delete-orphan", lazy="selectin")

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class ReturnRequest(Base):
    __tablename__ = "return_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sub_order_id: Mapped[str] = mapped_column(String(36), ForeignKey("sub_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False, index=True)
    rma_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING_APPROVAL", nullable=False)  # PENDING_APPROVAL, APPROVED, REJECTED, SHIPPED_BACK, RECEIVED, REFUNDED
    reason_category: Mapped[str] = mapped_column(String(100), nullable=False)  # DEFECTIVE, WRONG_ITEM, NOT_AS_DESCRIBED, CHANGED_MIND
    customer_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    vendor_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    return_tracking_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    return_carrier: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    total_refund_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    restocking_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    is_replacement_requested: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    sub_order: Mapped["SubOrder"] = relationship("SubOrder", lazy="selectin")
    user: Mapped["User"] = relationship("User", lazy="selectin")
    vendor: Mapped["Vendor"] = relationship("Vendor", lazy="selectin")
    items: Mapped[List["ReturnItem"]] = relationship("ReturnItem", back_populates="return_request", cascade="all, delete-orphan", lazy="selectin")


class ReturnItem(Base):
    __tablename__ = "return_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    return_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("return_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    order_item_id: Mapped[str] = mapped_column(String(36), ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    refund_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    condition_on_receipt: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    return_request: Mapped["ReturnRequest"] = relationship("ReturnRequest", back_populates="items", lazy="selectin")
    order_item: Mapped["OrderItem"] = relationship("OrderItem", lazy="selectin")

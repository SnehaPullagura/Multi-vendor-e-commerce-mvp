import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    vendor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="SET NULL"), nullable=True, index=True)
    order_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("orders.id", ondelete="SET NULL"), nullable=True, index=True)
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="ORDER_INQUIRY", nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, URGENT
    status: Mapped[str] = mapped_column(String(30), default="OPEN", index=True, nullable=False)  # OPEN, IN_PROGRESS, WAITING_FOR_USER, RESOLVED, CLOSED
    assigned_admin_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id], lazy="selectin")
    vendor: Mapped[Optional["Vendor"]] = relationship("Vendor", lazy="selectin")
    messages: Mapped[List["TicketMessage"]] = relationship("TicketMessage", back_populates="ticket", cascade="all, delete-orphan", lazy="selectin")


class TicketMessage(Base):
    __tablename__ = "ticket_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id: Mapped[str] = mapped_column(String(36), ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_role: Mapped[str] = mapped_column(String(30), nullable=False)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_internal_note: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    ticket: Mapped["SupportTicket"] = relationship("SupportTicket", back_populates="messages", lazy="selectin")
    sender: Mapped["User"] = relationship("User", lazy="selectin")

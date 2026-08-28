"""
Kitchen Display System (KDS), Kitchen Stations & KOT Routing Entities.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class KOTStatus(str, Enum):
    QUEUED = "QUEUED"
    IN_PREP = "IN_PREP"
    READY_FOR_PICKUP = "READY_FOR_PICKUP"
    SERVED = "SERVED"
    RE_FIRED = "RE_FIRED"
    CANCELLED = "CANCELLED"


class KitchenStation(Base):
    __tablename__ = "kitchen_stations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_branches.id"), nullable=False)
    station_name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "Grill", "Pizza", "Bar", "Wok"
    station_code: Mapped[str] = mapped_column(String(20), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class KitchenOrderTicket(Base):
    __tablename__ = "kitchen_order_tickets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    kot_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    order_id: Mapped[str] = mapped_column(String(36), nullable=False)
    table_number: Mapped[str] = mapped_column(String(20), default="Takeaway")
    station_id: Mapped[str] = mapped_column(String(36), ForeignKey("kitchen_stations.id"), nullable=False)
    status: Mapped[KOTStatus] = mapped_column(SQLEnum(KOTStatus), default=KOTStatus.QUEUED)
    priority: Mapped[str] = mapped_column(String(20), default="NORMAL")
    server_name: Mapped[str] = mapped_column(String(100), default="Staff")
    special_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    prep_started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ready_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    items: Mapped[List["KOTItem"]] = relationship("KOTItem", back_populates="kot", cascade="all, delete-orphan")


class KOTItem(Base):
    __tablename__ = "kot_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    kot_id: Mapped[str] = mapped_column(String(36), ForeignKey("kitchen_order_tickets.id"), nullable=False)
    dish_name: Mapped[str] = mapped_column(String(200), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    modifiers: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    kot: Mapped["KitchenOrderTicket"] = relationship("KitchenOrderTicket", back_populates="items")

"""
Floors, Dining Areas, Tables, and Live Seating Sessions.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class TableStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    RESERVED = "RESERVED"
    CLEANING = "CLEANING"
    OUT_OF_SERVICE = "OUT_OF_SERVICE"


class DiningFloor(Base):
    __tablename__ = "dining_floors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_branches.id"), nullable=False)
    floor_name: Mapped[str] = mapped_column(String(100), nullable=False)
    floor_number: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tables: Mapped[List["DiningTable"]] = relationship("DiningTable", back_populates="floor", cascade="all, delete-orphan")


class DiningTable(Base):
    __tablename__ = "dining_tables"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    floor_id: Mapped[str] = mapped_column(String(36), ForeignKey("dining_floors.id"), nullable=False)
    table_number: Mapped[str] = mapped_column(String(20), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=4)
    status: Mapped[TableStatus] = mapped_column(SQLEnum(TableStatus), default=TableStatus.AVAILABLE)
    qr_code_token: Mapped[str] = mapped_column(String(100), unique=True, default=lambda: str(uuid.uuid4()))
    pos_x: Mapped[int] = mapped_column(Integer, default=0)
    pos_y: Mapped[int] = mapped_column(Integer, default=0)
    shape: Mapped[str] = mapped_column(String(20), default="RECTANGLE")
    current_order_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    floor: Mapped["DiningFloor"] = relationship("DiningFloor", back_populates="tables")

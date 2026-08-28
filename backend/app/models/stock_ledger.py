"""
Ledger-Driven Stock Balance, Batch Numbering & Inventory Movements.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class StockMovementType(str, Enum):
    PURCHASE_RECEIPT = "PURCHASE_RECEIPT"
    RECIPE_CONSUMPTION = "RECIPE_CONSUMPTION"
    BRANCH_TRANSFER_OUT = "BRANCH_TRANSFER_OUT"
    BRANCH_TRANSFER_IN = "BRANCH_TRANSFER_IN"
    WASTAGE_WRITE_OFF = "WASTAGE_WRITE_OFF"
    PHYSICAL_COUNT_ADJUSTMENT = "PHYSICAL_COUNT_ADJUSTMENT"
    RETURN_TO_SUPPLIER = "RETURN_TO_SUPPLIER"


class RestaurantStockLedger(Base):
    __tablename__ = "restaurant_stock_ledgers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id: Mapped[str] = mapped_column(String(36), nullable=False)
    ingredient_id: Mapped[str] = mapped_column(String(36), nullable=False)
    ingredient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    movement_type: Mapped[StockMovementType] = mapped_column(SQLEnum(StockMovementType), nullable=False)
    quantity_change: Mapped[float] = mapped_column(Float, nullable=False)
    balance_after: Mapped[float] = mapped_column(Float, nullable=False)
    unit_of_measure: Mapped[str] = mapped_column(String(20), default="kg")
    batch_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    expiry_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    unit_cost: Mapped[float] = mapped_column(Float, default=0.0)
    total_valuation_change: Mapped[float] = mapped_column(Float, default=0.0)
    reference_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # PO id, Order id, Wastage id
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Warehouse(Base):
    __tablename__ = "warehouses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    contact_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    street_address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(100), default="United States", nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    vendor: Mapped["Vendor"] = relationship("Vendor", lazy="selectin")
    stocks: Mapped[List["WarehouseStock"]] = relationship("WarehouseStock", back_populates="warehouse", cascade="all, delete-orphan", lazy="selectin")


class WarehouseStock(Base):
    __tablename__ = "warehouse_stocks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    warehouse_id: Mapped[str] = mapped_column(String(36), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_id: Mapped[str] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity_on_hand: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    quantity_reserved: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    quantity_available: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reorder_threshold: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    reorder_quantity: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    bin_location: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    warehouse: Mapped["Warehouse"] = relationship("Warehouse", back_populates="stocks", lazy="selectin")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant", lazy="selectin")


class StockMovementLog(Base):
    __tablename__ = "stock_movement_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    variant_id: Mapped[str] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False, index=True)
    warehouse_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True)
    movement_type: Mapped[str] = mapped_column(String(50), nullable=False)  # INBOUND, OUTBOUND_ORDER, RETURN, ADJUSTMENT, TRANSFER
    quantity_change: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_after: Mapped[int] = mapped_column(Integer, nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    performed_by_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    variant: Mapped["ProductVariant"] = relationship("ProductVariant", lazy="selectin")

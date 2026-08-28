"""
Kitchen Equipment Asset Registry & Preventative Maintenance Work Orders.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class AssetCondition(str, Enum):
    OPTIMAL = "OPTIMAL"
    OPERATIONAL_FAIR = "OPERATIONAL_FAIR"
    MAINTENANCE_REQUIRED = "MAINTENANCE_REQUIRED"
    OUT_OF_ORDER = "OUT_OF_ORDER"
    DECOMMISSIONED = "DECOMMISSIONED"


class RestaurantAsset(Base):
    __tablename__ = "restaurant_assets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id: Mapped[str] = mapped_column(String(36), nullable=False)
    asset_tag: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    asset_name: Mapped[str] = mapped_column(String(200), nullable=False)  # e.g. "Rational iCombi Pro 10-Pan Combi Oven"
    category: Mapped[str] = mapped_column(String(100), default="Kitchen Equipment")
    serial_number: Mapped[str] = mapped_column(String(100), nullable=False)
    purchase_price: Mapped[float] = mapped_column(Float, default=0.0)
    installation_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    warranty_expiry_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    condition: Mapped[AssetCondition] = mapped_column(SQLEnum(AssetCondition), default=AssetCondition.OPTIMAL)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class MaintenanceWorkOrder(Base):
    __tablename__ = "maintenance_work_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    asset_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_assets.id"), nullable=False)
    work_order_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    issue_summary: Mapped[str] = mapped_column(String(255), nullable=False)
    maintenance_type: Mapped[str] = mapped_column(String(50), default="PREVENTATIVE")  # PREVENTATIVE, EMERGENCY_REPAIR, CALIBRATION
    cost_total: Mapped[float] = mapped_column(Float, default=0.0)
    technician_name: Mapped[str] = mapped_column(String(100), default="Authorized Service Tech")
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    asset: Mapped["RestaurantAsset"] = relationship("RestaurantAsset")

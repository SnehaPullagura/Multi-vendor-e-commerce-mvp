"""
Wastage Logs, Shrinkage Categorization & Variance Tracking.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import uuid


class WastageReason(str, Enum):
    SPOILAGE = "SPOILAGE"
    EXPIRY = "EXPIRY"
    OVER_PRODUCTION = "OVER_PRODUCTION"
    PREPARATION_WASTE = "PREPARATION_WASTE"
    DAMAGED = "DAMAGED"
    COOKING_ERROR = "COOKING_ERROR"
    CUSTOMER_RETURN = "CUSTOMER_RETURN"
    OTHER = "OTHER"


class RestaurantWastageLog(Base):
    __tablename__ = "restaurant_wastage_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id: Mapped[str] = mapped_column(String(36), nullable=False)
    ingredient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit_of_measure: Mapped[str] = mapped_column(String(20), default="kg")
    cost_impact: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[WastageReason] = mapped_column(SQLEnum(WastageReason), default=WastageReason.PREPARATION_WASTE)
    reported_by_user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

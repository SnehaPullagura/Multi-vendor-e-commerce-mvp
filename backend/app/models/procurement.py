"""
Procurement Pipeline: Suppliers, Purchase Orders, Goods Receipt Notes (GRN).
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class PurchaseOrderStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED_FOR_APPROVAL = "SUBMITTED_FOR_APPROVAL"
    APPROVED = "APPROVED"
    TRANSMITTED_TO_VENDOR = "TRANSMITTED_TO_VENDOR"
    PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED"
    FULLY_RECEIVED = "FULLY_RECEIVED"
    CANCELLED = "CANCELLED"


class RestaurantSupplier(Base):
    __tablename__ = "restaurant_suppliers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    supplier_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    payment_terms_days: Mapped[int] = mapped_column(Integer, default=30)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=2)
    quality_score_rating: Mapped[float] = mapped_column(Float, default=4.8)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class RestaurantPurchaseOrder(Base):
    __tablename__ = "restaurant_purchase_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    po_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    branch_id: Mapped[str] = mapped_column(String(36), nullable=False)
    supplier_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_suppliers.id"), nullable=False)
    status: Mapped[PurchaseOrderStatus] = mapped_column(SQLEnum(PurchaseOrderStatus), default=PurchaseOrderStatus.DRAFT)
    subtotal: Mapped[float] = mapped_column(Float, default=0.0)
    tax_amount: Mapped[float] = mapped_column(Float, default=0.0)
    grand_total: Mapped[float] = mapped_column(Float, default=0.0)
    expected_delivery_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    supplier: Mapped["RestaurantSupplier"] = relationship("RestaurantSupplier")
    items: Mapped[List["PurchaseOrderItem"]] = relationship("PurchaseOrderItem", back_populates="po", cascade="all, delete-orphan")


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    po_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_purchase_orders.id"), nullable=False)
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    quantity_ordered: Mapped[float] = mapped_column(Float, nullable=False)
    quantity_received: Mapped[float] = mapped_column(Float, default=0.0)
    unit_of_measure: Mapped[str] = mapped_column(String(20), default="kg")
    unit_price: Mapped[float] = mapped_column(Float, default=0.0)
    line_total: Mapped[float] = mapped_column(Float, default=0.0)

    po: Mapped["RestaurantPurchaseOrder"] = relationship("RestaurantPurchaseOrder", back_populates="items")

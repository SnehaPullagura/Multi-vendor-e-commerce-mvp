from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Enum as SQLEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.enums import MasterOrderStatus, PaymentMethod, PaymentStatus, SubOrderStatus
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.vendor import Vendor
    from app.models.product import Product
    from app.models.variant import ProductVariant
    from app.models.ledger import VendorLedger


class Order(Base):
    """Master Order representing the customer's overall checkout."""
    __tablename__ = "orders"

    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    # Financial snapshot
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    shipping_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)

    # Address snapshot stored as JSON string
    shipping_address_json: Mapped[str] = mapped_column(Text, nullable=False)
    billing_address_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Status & Payment
    payment_method: Mapped[PaymentMethod] = mapped_column(SQLEnum(PaymentMethod), default=PaymentMethod.TEST_PAYMENT, nullable=False)
    payment_status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    status: Mapped[MasterOrderStatus] = mapped_column(SQLEnum(MasterOrderStatus), default=MasterOrderStatus.PENDING, nullable=False, index=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="orders", lazy="selectin")
    sub_orders: Mapped[List["SubOrder"]] = relationship("SubOrder", back_populates="master_order", cascade="all, delete-orphan", lazy="selectin")
    status_history: Mapped[List["OrderStatusHistory"]] = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan", lazy="selectin")


class SubOrder(Base):
    """Vendor-specific Sub-Order allowing each vendor to independently manage fulfillment."""
    __tablename__ = "sub_orders"

    master_order_id: Mapped[str] = mapped_column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="RESTRICT"), index=True, nullable=False)
    sub_order_number: Mapped[str] = mapped_column(String(60), unique=True, index=True, nullable=False)

    # Financials for this specific vendor
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    vendor_shipping_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    platform_commission_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    vendor_payout_amount: Mapped[float] = mapped_column(Float, nullable=False)

    # Fulfillment status & Shipping Info
    status: Mapped[SubOrderStatus] = mapped_column(SQLEnum(SubOrderStatus), default=SubOrderStatus.AWAITING_FULFILLMENT, nullable=False, index=True)
    shipping_carrier: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    tracking_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    master_order: Mapped["Order"] = relationship("Order", back_populates="sub_orders", lazy="selectin")
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="sub_orders", lazy="selectin")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="sub_order", cascade="all, delete-orphan", lazy="selectin")
    ledger_entries: Mapped[List["VendorLedger"]] = relationship("VendorLedger", back_populates="sub_order", lazy="selectin")

    @property
    def vendor_name(self) -> Optional[str]:
        return self.vendor.store_name if self.vendor else None


class OrderItem(Base):
    """Specific line item within a vendor sub-order."""
    __tablename__ = "order_items"

    sub_order_id: Mapped[str] = mapped_column(String(36), ForeignKey("sub_orders.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="RESTRICT"), index=True, nullable=False)
    variant_id: Mapped[str] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="RESTRICT"), index=True, nullable=False)
    
    # Immutable line-item snapshot
    product_title: Mapped[str] = mapped_column(String(255), nullable=False)
    variant_title: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[str] = mapped_column(String(100), nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)

    # Relationships
    sub_order: Mapped["SubOrder"] = relationship("SubOrder", back_populates="items", lazy="selectin")
    product: Mapped["Product"] = relationship("Product", lazy="selectin")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant", back_populates="order_items", lazy="selectin")


class OrderStatusHistory(Base):
    """Audit log of order state transitions."""
    __tablename__ = "order_status_history"

    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    sub_order_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("sub_orders.id", ondelete="CASCADE"), nullable=True, index=True)
    changed_by_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    from_status: Mapped[str] = mapped_column(String(50), nullable=False)
    to_status: Mapped[str] = mapped_column(String(50), nullable=False)
    note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="status_history", lazy="selectin")

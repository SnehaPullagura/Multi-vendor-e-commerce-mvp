from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.image import ProductImage
    from app.models.cart import CartItem
    from app.models.order import OrderItem


class ProductVariant(Base):
    __tablename__ = "product_variants"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    sku: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)  # e.g., "Default" or "Large / Navy Blue"
    price: Mapped[float] = mapped_column(Float, nullable=False)
    cost_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    low_stock_threshold: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    attributes_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Store JSON e.g. {"size": "L", "color": "Navy"}
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants", lazy="selectin")
    images: Mapped[List["ProductImage"]] = relationship("ProductImage", back_populates="variant", lazy="selectin")
    cart_items: Mapped[List["CartItem"]] = relationship("CartItem", back_populates="variant", lazy="selectin")
    order_items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="variant", lazy="selectin")

from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product
    from app.models.variant import ProductVariant


class Cart(Base):
    __tablename__ = "carts"

    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=True)
    session_id: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="cart", lazy="selectin")
    items: Mapped[List["CartItem"]] = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan", lazy="selectin")


class CartItem(Base):
    __tablename__ = "cart_items"

    cart_id: Mapped[str] = mapped_column(String(36), ForeignKey("carts.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    variant_id: Mapped[str] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), index=True, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)

    # Relationships
    cart: Mapped["Cart"] = relationship("Cart", back_populates="items", lazy="selectin")
    product: Mapped["Product"] = relationship("Product", lazy="selectin")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant", back_populates="cart_items", lazy="selectin")

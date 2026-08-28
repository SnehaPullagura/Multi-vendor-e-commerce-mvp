import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Wishlist(Base):
    __tablename__ = "wishlists"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), default="My Wishlist", nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    share_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, default=lambda: uuid.uuid4().hex)

    # Relationships
    user: Mapped["User"] = relationship("User", lazy="selectin")
    items: Mapped[List["WishlistItem"]] = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan", lazy="selectin")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    wishlist_id: Mapped[str] = mapped_column(String(36), ForeignKey("wishlists.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    product_variant_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    added_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=1, nullable=False)  # 1: Normal, 2: High, 3: Urgent
    notes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    wishlist: Mapped["Wishlist"] = relationship("Wishlist", back_populates="items", lazy="selectin")
    product: Mapped["Product"] = relationship("Product", lazy="selectin")
    variant: Mapped[Optional["ProductVariant"]] = relationship("ProductVariant", lazy="selectin")

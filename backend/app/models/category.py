from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.product import Product


class Category(Base):
    __tablename__ = "categories"

    parent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Self-referential hierarchy
    parent: Mapped[Optional["Category"]] = relationship("Category", remote_side="Category.id", back_populates="children", lazy="selectin")
    children: Mapped[List["Category"]] = relationship("Category", back_populates="parent", cascade="all, delete-orphan", lazy="selectin")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="category", lazy="selectin")

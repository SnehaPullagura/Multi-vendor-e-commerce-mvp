from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, Enum as SQLEnum, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.enums import ProductStatus
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.vendor import Vendor
    from app.models.category import Category
    from app.models.variant import ProductVariant
    from app.models.image import ProductImage


class Product(Base):
    __tablename__ = "products"

    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), index=True, nullable=False)
    category_id: Mapped[str] = mapped_column(String(36), ForeignKey("categories.id", ondelete="RESTRICT"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    base_price: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[ProductStatus] = mapped_column(SQLEnum(ProductStatus), default=ProductStatus.DRAFT, nullable=False, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    meta_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="products", lazy="selectin")
    category: Mapped["Category"] = relationship("Category", back_populates="products", lazy="selectin")
    variants: Mapped[List["ProductVariant"]] = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan", lazy="selectin")
    images: Mapped[List["ProductImage"]] = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", lazy="selectin")

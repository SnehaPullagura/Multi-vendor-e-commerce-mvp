from typing import TYPE_CHECKING, Optional
from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.variant import ProductVariant


class ProductImage(Base):
    __tablename__ = "product_images"

    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    variant_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="images")
    variant: Mapped[Optional["ProductVariant"]] = relationship("ProductVariant", back_populates="images")

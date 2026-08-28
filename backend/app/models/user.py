from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, Enum as SQLEnum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.enums import UserRole
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.address import Address
    from app.models.vendor import Vendor
    from app.models.cart import Cart
    from app.models.order import Order


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.CUSTOMER, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    addresses: Mapped[List["Address"]] = relationship("Address", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    vendor_profile: Mapped[Optional["Vendor"]] = relationship("Vendor", back_populates="user", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    cart: Mapped[Optional["Cart"]] = relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    orders: Mapped[List["Order"]] = relationship("Order", back_populates="user", cascade="all, delete-orphan", lazy="selectin")

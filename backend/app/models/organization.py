"""
Organization, Brand, Branch, and Department Entity Domain.
Represents multi-tier enterprise restaurant hierarchies.
"""
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class RestaurantOrganization(Base):
    __tablename__ = "restaurant_organizations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    legal_name: Mapped[str] = mapped_column(String(250), nullable=False)
    tax_identifier: Mapped[str] = mapped_column(String(100), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    brands: Mapped[List["RestaurantBrand"]] = relationship("RestaurantBrand", back_populates="organization", cascade="all, delete-orphan")


class RestaurantBrand(Base):
    __tablename__ = "restaurant_brands"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_organizations.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    cuisine_type: Mapped[str] = mapped_column(String(100), default="Multi-Cuisine")
    logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    organization: Mapped["RestaurantOrganization"] = relationship("RestaurantOrganization", back_populates="brands")
    branches: Mapped[List["RestaurantBranch"]] = relationship("RestaurantBranch", back_populates="brand", cascade="all, delete-orphan")


class RestaurantBranch(Base):
    __tablename__ = "restaurant_branches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_brands.id"), nullable=False)
    branch_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address_line_1: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(30), nullable=False)
    seating_capacity: Mapped[int] = mapped_column(Integer, default=60)
    operating_hours: Mapped[dict] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    brand: Mapped["RestaurantBrand"] = relationship("RestaurantBrand", back_populates="branches")

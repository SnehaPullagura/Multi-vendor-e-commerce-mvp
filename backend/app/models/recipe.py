"""
Recipe Bill of Materials (BOM), Ingredient Mapping & Yield Calculator.
"""
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import uuid


class RecipeBOM(Base):
    __tablename__ = "recipe_boms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    menu_item_title: Mapped[str] = mapped_column(String(200), nullable=False)
    menu_item_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    yield_servings: Mapped[int] = mapped_column(Integer, default=1)
    preparation_instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    prep_time_minutes: Mapped[int] = mapped_column(Integer, default=15)
    total_cost_per_serving: Mapped[float] = mapped_column(Float, default=0.0)
    waste_percentage: Mapped[float] = mapped_column(Float, default=5.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    items: Mapped[List["RecipeItem"]] = relationship("RecipeItem", back_populates="recipe", cascade="all, delete-orphan")


class RecipeItem(Base):
    __tablename__ = "recipe_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipe_id: Mapped[str] = mapped_column(String(36), ForeignKey("recipe_boms.id"), nullable=False)
    ingredient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    ingredient_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit_of_measure: Mapped[str] = mapped_column(String(20), default="grams")
    unit_cost: Mapped[float] = mapped_column(Float, default=0.0)
    line_cost: Mapped[float] = mapped_column(Float, default=0.0)

    recipe: Mapped["RecipeBOM"] = relationship("RecipeBOM", back_populates="items")

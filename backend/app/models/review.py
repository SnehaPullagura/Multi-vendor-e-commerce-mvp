import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_item_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("order_items.id", ondelete="SET NULL"), nullable=True, unique=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1 to 5
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_verified_purchase: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    helpful_votes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unhelpful_votes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sentiment_score: Mapped[Optional[float]] = mapped_column(nullable=True)

    # Relationships
    product: Mapped["Product"] = relationship("Product", lazy="selectin")
    user: Mapped["User"] = relationship("User", lazy="selectin")
    images: Mapped[List["ReviewImage"]] = relationship("ReviewImage", back_populates="review", cascade="all, delete-orphan", lazy="selectin")
    reply: Mapped[Optional["VendorReviewReply"]] = relationship("VendorReviewReply", back_populates="review", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    votes: Mapped[List["ReviewVote"]] = relationship("ReviewVote", back_populates="review", cascade="all, delete-orphan", lazy="selectin")


class ReviewImage(Base):
    __tablename__ = "review_images"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    review: Mapped["Review"] = relationship("Review", back_populates="images", lazy="selectin")


class VendorReviewReply(Base):
    __tablename__ = "vendor_review_replies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False, unique=True)
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False, index=True)
    reply_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    review: Mapped["Review"] = relationship("Review", back_populates="reply", lazy="selectin")
    vendor: Mapped["Vendor"] = relationship("Vendor", lazy="selectin")


class ReviewVote(Base):
    __tablename__ = "review_votes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_helpful: Mapped[bool] = mapped_column(Boolean, nullable=False)

    review: Mapped["Review"] = relationship("Review", back_populates="votes", lazy="selectin")

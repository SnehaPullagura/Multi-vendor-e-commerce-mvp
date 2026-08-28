from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ReviewImageResponse(BaseModel):
    id: str
    image_url: str
    display_order: int
    model_config = ConfigDict(from_attributes=True)


class VendorReplyResponse(BaseModel):
    id: str
    reply_text: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    title: str = Field(min_length=3, max_length=200)
    content: str = Field(min_length=10)
    image_urls: List[str] = []


class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: str
    user_name: Optional[str] = None
    rating: int
    title: str
    content: str
    is_verified_purchase: bool
    helpful_votes: int
    unhelpful_votes: int
    created_at: datetime
    images: List[ReviewImageResponse] = []
    reply: Optional[VendorReplyResponse] = None
    model_config = ConfigDict(from_attributes=True)


class ReviewSummaryResponse(BaseModel):
    average_rating: float
    total_reviews: int
    distribution: dict

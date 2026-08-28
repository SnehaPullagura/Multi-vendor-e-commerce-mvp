from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewSummaryResponse, VendorReplyResponse
from app.services.review_service import ReviewService

router = APIRouter()

@router.get("/product/{product_id}", response_model=ApiResponse[List[ReviewResponse]])
async def get_product_reviews(product_id: str, page: int = Query(1, ge=1), db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    reviews, _ = await service.get_reviews(product_id, page=page)
    res = []
    for r in reviews:
        item = ReviewResponse(
            id=r.id,
            product_id=r.product_id,
            user_id=r.user_id,
            user_name=r.user.full_name if r.user else "Customer",
            rating=r.rating,
            title=r.title,
            content=r.content,
            is_verified_purchase=r.is_verified_purchase,
            helpful_votes=r.helpful_votes,
            unhelpful_votes=r.unhelpful_votes,
            created_at=r.created_at,
            images=[img for img in r.images] if hasattr(r, "images") else [],
            reply=r.reply if hasattr(r, "reply") else None,
        )
        res.append(item)
    return ApiResponse.ok(res)

@router.get("/product/{product_id}/summary", response_model=ApiResponse[ReviewSummaryResponse])
async def get_review_summary(product_id: str, db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    summary = await service.get_summary(product_id)
    return ApiResponse.ok(ReviewSummaryResponse(**summary))

@router.post("", response_model=ApiResponse[ReviewResponse], status_code=status.HTTP_201_CREATED)
async def create_review(data: ReviewCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    created = await service.create_review(user, data)
    return ApiResponse.ok(ReviewResponse(
        id=created.id,
        product_id=created.product_id,
        user_id=created.user_id,
        user_name=user.full_name,
        rating=created.rating,
        title=created.title,
        content=created.content,
        is_verified_purchase=created.is_verified_purchase,
        helpful_votes=0,
        unhelpful_votes=0,
        created_at=created.created_at,
    ), message="Review posted successfully")

@router.post("/{review_id}/vote", response_model=ApiResponse[dict])
async def vote_review(review_id: str, is_helpful: bool, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    await service.repo.add_vote(review_id, user.id, is_helpful)
    return ApiResponse.ok({"message": "Feedback recorded"})

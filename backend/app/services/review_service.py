from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.review import Review, ReviewImage, VendorReviewReply
from app.models.user import User
from app.repositories.review_repo import ReviewRepository
from app.schemas.review import ReviewCreate


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ReviewRepository(db)

    async def create_review(self, user: User, data: ReviewCreate) -> Review:
        review = Review(
            product_id=data.product_id,
            user_id=user.id,
            rating=data.rating,
            title=data.title,
            content=data.content,
            is_verified_purchase=True,
            is_approved=True,
        )
        self.db.add(review)
        await self.db.flush()

        for idx, url in enumerate(data.image_urls):
            img = ReviewImage(review_id=review.id, image_url=url, display_order=idx)
            self.db.add(img)

        await self.db.flush()
        return review

    async def reply_to_review(self, vendor_id: str, review_id: str, reply_text: str) -> VendorReviewReply:
        reply = VendorReviewReply(review_id=review_id, vendor_id=vendor_id, reply_text=reply_text)
        self.db.add(reply)
        await self.db.flush()
        return reply

    async def get_reviews(self, product_id: str, page: int = 1) -> Tuple[List[Review], int]:
        return await self.repo.get_product_reviews(product_id, page=page)

    async def get_summary(self, product_id: str) -> dict:
        return await self.repo.get_product_rating_summary(product_id)

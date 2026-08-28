from typing import List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.review import Review, ReviewImage, ReviewVote, VendorReviewReply
from app.repositories.base import BaseRepository


class ReviewRepository(BaseRepository[Review]):
    def __init__(self, db: AsyncSession):
        super().__init__(Review, db)

    async def get_product_reviews(self, product_id: str, page: int = 1, page_size: int = 10) -> Tuple[List[Review], int]:
        offset = (page - 1) * page_size
        query = select(Review).options(selectinload(Review.user), selectinload(Review.images), selectinload(Review.reply)).where(Review.product_id == product_id, Review.is_approved == True).order_by(Review.created_at.desc()).offset(offset).limit(page_size)
        count_query = select(func.count(Review.id)).where(Review.product_id == product_id, Review.is_approved == True)
        result = await self.db.execute(query)
        total = (await self.db.execute(count_query)).scalar_one()
        return list(result.scalars().all()), total

    async def get_product_rating_summary(self, product_id: str) -> dict:
        query = select(Review.rating, func.count(Review.id)).where(Review.product_id == product_id, Review.is_approved == True).group_by(Review.rating)
        result = await self.db.execute(query)
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        total_reviews = 0
        sum_rating = 0
        for rating, count in result.all():
            distribution[rating] = count
            total_reviews += count
            sum_rating += rating * count
        average_rating = round(sum_rating / total_reviews, 2) if total_reviews > 0 else 0.0
        return {"average_rating": average_rating, "total_reviews": total_reviews, "distribution": distribution}

    async def add_vote(self, review_id: str, user_id: str, is_helpful: bool) -> ReviewVote:
        existing = await self.db.execute(select(ReviewVote).where(ReviewVote.review_id == review_id, ReviewVote.user_id == user_id))
        vote = existing.scalar_one_or_none()
        if vote:
            vote.is_helpful = is_helpful
        else:
            vote = ReviewVote(review_id=review_id, user_id=user_id, is_helpful=is_helpful)
            self.db.add(vote)
        await self.db.flush()
        # Recount
        h_count = (await self.db.execute(select(func.count(ReviewVote.id)).where(ReviewVote.review_id == review_id, ReviewVote.is_helpful == True))).scalar_one()
        un_count = (await self.db.execute(select(func.count(ReviewVote.id)).where(ReviewVote.review_id == review_id, ReviewVote.is_helpful == False))).scalar_one()
        rev = await self.get_by_id(review_id)
        if rev:
            rev.helpful_votes = h_count
            rev.unhelpful_votes = un_count
            await self.db.flush()
        return vote

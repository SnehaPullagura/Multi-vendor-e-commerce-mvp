from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.wishlist import Wishlist, WishlistItem
from app.repositories.wishlist_repo import WishlistRepository
from app.schemas.wishlist import WishlistItemCreate


class WishlistService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = WishlistRepository(db)

    async def get_or_create(self, user_id: str) -> Wishlist:
        return await self.repo.get_user_wishlist(user_id)

    async def add_item(self, user_id: str, data: WishlistItemCreate, current_price: float = 0.0) -> WishlistItem:
        wishlist = await self.repo.get_user_wishlist(user_id)
        return await self.repo.add_item(wishlist.id, data.product_id, data.product_variant_id, current_price, data.notes)

    async def remove_item(self, user_id: str, item_id: str) -> bool:
        return await self.repo.remove_item(item_id)

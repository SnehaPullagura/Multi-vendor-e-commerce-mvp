from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.wishlist import Wishlist, WishlistItem
from app.repositories.base import BaseRepository


class WishlistRepository(BaseRepository[Wishlist]):
    def __init__(self, db: AsyncSession):
        super().__init__(Wishlist, db)

    async def get_user_wishlist(self, user_id: str) -> Wishlist:
        query = select(Wishlist).options(selectinload(Wishlist.items).selectinload(WishlistItem.product).selectinload(WishlistItem.variant)).where(Wishlist.user_id == user_id)
        result = await self.db.execute(query)
        wishlist = result.scalar_one_or_none()
        if not wishlist:
            wishlist = Wishlist(user_id=user_id, title="My Wishlist")
            self.db.add(wishlist)
            await self.db.flush()
            await self.db.refresh(wishlist, ["items"])
        return wishlist

    async def get_by_share_token(self, token: str) -> Optional[Wishlist]:
        query = select(Wishlist).options(selectinload(Wishlist.items).selectinload(WishlistItem.product)).where(Wishlist.share_token == token, Wishlist.is_public == True)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def add_item(self, wishlist_id: str, product_id: str, variant_id: Optional[str], price: float, notes: Optional[str] = None) -> WishlistItem:
        existing = await self.db.execute(select(WishlistItem).where(WishlistItem.wishlist_id == wishlist_id, WishlistItem.product_id == product_id, WishlistItem.product_variant_id == variant_id))
        item = existing.scalar_one_or_none()
        if not item:
            item = WishlistItem(wishlist_id=wishlist_id, product_id=product_id, product_variant_id=variant_id, added_price=price, notes=notes)
            self.db.add(item)
            await self.db.flush()
        return item

    async def remove_item(self, item_id: str) -> bool:
        item = await self.db.get(WishlistItem, item_id)
        if item:
            await self.db.delete(item)
            await self.db.flush()
            return True
        return False

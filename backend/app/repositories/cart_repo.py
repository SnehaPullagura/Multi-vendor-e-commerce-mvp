from typing import Optional
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.variant import ProductVariant
from app.repositories.base import BaseRepository


class CartRepository(BaseRepository[Cart]):
    def __init__(self, db: AsyncSession):
        super().__init__(Cart, db)

    async def get_cart(self, user_id: Optional[str] = None, session_id: Optional[str] = None) -> Optional[Cart]:
        query = (
            select(Cart)
            .execution_options(populate_existing=True)
            .options(
                selectinload(Cart.items)
                .selectinload(CartItem.variant)
                .selectinload(ProductVariant.product)
                .selectinload(Product.vendor),
                selectinload(Cart.items)
                .selectinload(CartItem.variant)
                .selectinload(ProductVariant.product)
                .selectinload(Product.images),
                selectinload(Cart.items)
                .selectinload(CartItem.variant)
                .selectinload(ProductVariant.images),
            )
        )
        if user_id:
            query = query.where(Cart.user_id == user_id)
        elif session_id:
            query = query.where(Cart.session_id == session_id)
        else:
            return None

        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_or_create_cart(self, user_id: Optional[str] = None, session_id: Optional[str] = None) -> Cart:
        cart = await self.get_cart(user_id=user_id, session_id=session_id)
        if not cart:
            cart = Cart(user_id=user_id, session_id=session_id)
            self.db.add(cart)
            await self.db.flush()
            # Fetch again to populate relationships
            cart = await self.get_cart(user_id=user_id, session_id=session_id)
        return cart

    async def get_cart_item(self, cart_id: str, variant_id: str) -> Optional[CartItem]:
        query = select(CartItem).where(CartItem.cart_id == cart_id, CartItem.variant_id == variant_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def add_or_update_item(self, cart_id: str, product_id: str, variant_id: str, quantity: int, unit_price: float) -> CartItem:
        item = await self.get_cart_item(cart_id, variant_id)
        if item:
            item.quantity += quantity
            item.unit_price = unit_price
        else:
            item = CartItem(
                cart_id=cart_id,
                product_id=product_id,
                variant_id=variant_id,
                quantity=quantity,
                unit_price=unit_price,
            )
            self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        self.db.expire_all()
        return item

    async def remove_item(self, item_id: str, cart_id: str) -> bool:
        stmt = delete(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart_id)
        result = await self.db.execute(stmt)
        await self.db.flush()
        return result.rowcount > 0

    async def clear_cart(self, cart_id: str) -> None:
        stmt = delete(CartItem).where(CartItem.cart_id == cart_id)
        await self.db.execute(stmt)
        await self.db.flush()

    async def merge_guest_cart(self, session_id: str, user_id: str) -> None:
        guest_cart = await self.get_cart(session_id=session_id)
        if not guest_cart or not guest_cart.items:
            return
        
        user_cart = await self.get_or_create_cart(user_id=user_id)
        for g_item in guest_cart.items:
            await self.add_or_update_item(
                cart_id=user_cart.id,
                product_id=g_item.product_id,
                variant_id=g_item.variant_id,
                quantity=g_item.quantity,
                unit_price=g_item.unit_price,
            )
        
        # Clear and delete guest cart
        await self.clear_cart(guest_cart.id)
        await self.db.delete(guest_cart)
        await self.db.flush()

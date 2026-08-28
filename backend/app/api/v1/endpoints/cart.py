from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_cart_identifier
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse
from app.services.cart_service import CartService

router = APIRouter()


@router.get("", response_model=ApiResponse[CartResponse])
async def get_cart(
    cart_id_info: dict = Depends(get_cart_identifier),
    db: AsyncSession = Depends(get_db),
):
    """Get the current customer's cart with multi-vendor breakdown."""
    service = CartService(db)
    cart = await service.get_formatted_cart(
        user_id=cart_id_info["user_id"],
        session_id=cart_id_info["session_id"],
    )
    return ApiResponse.ok(cart)


@router.post("/items", response_model=ApiResponse[CartResponse], status_code=status.HTTP_201_CREATED)
async def add_item_to_cart(
    data: CartItemCreate,
    cart_id_info: dict = Depends(get_cart_identifier),
    db: AsyncSession = Depends(get_db),
):
    """Add a product variant to the cart."""
    service = CartService(db)
    cart = await service.add_item(
        data=data,
        user_id=cart_id_info["user_id"],
        session_id=cart_id_info["session_id"],
    )
    return ApiResponse.ok(cart, message="Item added to cart")


@router.put("/items/{item_id}", response_model=ApiResponse[CartResponse])
async def update_cart_item(
    item_id: str,
    data: CartItemUpdate,
    cart_id_info: dict = Depends(get_cart_identifier),
    db: AsyncSession = Depends(get_db),
):
    """Update quantity of an item in the cart."""
    service = CartService(db)
    cart = await service.update_item_quantity(
        item_id=item_id,
        quantity=data.quantity,
        user_id=cart_id_info["user_id"],
        session_id=cart_id_info["session_id"],
    )
    return ApiResponse.ok(cart, message="Cart updated")


@router.delete("/items/{item_id}", response_model=ApiResponse[CartResponse])
async def remove_cart_item(
    item_id: str,
    cart_id_info: dict = Depends(get_cart_identifier),
    db: AsyncSession = Depends(get_db),
):
    """Remove an item from the cart."""
    service = CartService(db)
    cart = await service.remove_item(
        item_id=item_id,
        user_id=cart_id_info["user_id"],
        session_id=cart_id_info["session_id"],
    )
    return ApiResponse.ok(cart, message="Item removed")


@router.delete("", response_model=ApiResponse[dict])
async def clear_cart(
    cart_id_info: dict = Depends(get_cart_identifier),
    db: AsyncSession = Depends(get_db),
):
    """Clear all items in the cart."""
    service = CartService(db)
    await service.clear_cart(
        user_id=cart_id_info["user_id"],
        session_id=cart_id_info["session_id"],
    )
    return ApiResponse.ok({}, message="Cart cleared")

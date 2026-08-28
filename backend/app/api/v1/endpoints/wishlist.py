from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.wishlist import WishlistResponse, WishlistItemCreate, WishlistItemResponse
from app.services.wishlist_service import WishlistService

router = APIRouter()

@router.get("", response_model=ApiResponse[WishlistResponse])
async def get_my_wishlist(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = WishlistService(db)
    wishlist = await service.get_or_create(user.id)
    items = []
    for i in wishlist.items:
        items.append(WishlistItemResponse(
            id=i.id,
            product_id=i.product_id,
            product_title=i.product.title if i.product else "Product",
            product_variant_id=i.product_variant_id,
            variant_title=i.variant.title if i.variant else "Standard",
            added_price=i.added_price,
            current_price=i.variant.price if i.variant else i.added_price,
            in_stock=True,
            notes=i.notes,
        ))
    return ApiResponse.ok(WishlistResponse(
        id=wishlist.id,
        user_id=wishlist.user_id,
        title=wishlist.title,
        description=wishlist.description,
        is_public=wishlist.is_public,
        share_token=wishlist.share_token,
        items=items,
    ))

@router.post("/items", response_model=ApiResponse[dict])
async def add_to_wishlist(data: WishlistItemCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = WishlistService(db)
    await service.add_item(user.id, data)
    return ApiResponse.ok({"message": "Item added to wishlist"})

@router.delete("/items/{item_id}", response_model=ApiResponse[dict])
async def remove_from_wishlist(item_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = WishlistService(db)
    await service.remove_item(user.id, item_id)
    return ApiResponse.ok({"message": "Item removed from wishlist"})

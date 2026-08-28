from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import ProductStatus
from app.common.pagination import PaginatedResponse, PaginationParams
from app.models.product import Product
from app.repositories.product_repo import ProductRepository
from app.schemas.product import ProductResponse


class SearchService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.product_repo = ProductRepository(db)

    async def search_products(
        self,
        category_id: Optional[str] = None,
        vendor_id: Optional[str] = None,
        query_str: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        is_featured: Optional[bool] = None,
        sort_by: Optional[str] = "newest",
        params: PaginationParams = PaginationParams(),
    ) -> PaginatedResponse[ProductResponse]:
        products, total = await self.product_repo.list_products(
            category_id=category_id,
            vendor_id=vendor_id,
            status=ProductStatus.PUBLISHED,
            search_query=query_str,
            min_price=min_price,
            max_price=max_price,
            brand=brand,
            is_featured=is_featured,
            sort_by=sort_by,
            skip=params.offset,
            limit=params.page_size,
        )

        pydantic_products = [ProductResponse.model_validate(p) for p in products]
        return PaginatedResponse.create(pydantic_products, total, params)

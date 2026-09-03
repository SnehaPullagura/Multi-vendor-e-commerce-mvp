from typing import List, Optional, Tuple
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.enums import ProductStatus
from app.models.category import Category
from app.models.image import ProductImage
from app.models.product import Product
from app.models.variant import ProductVariant
from app.models.vendor import Vendor
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self, db: AsyncSession):
        super().__init__(Product, db)

    async def get_by_id_with_relations(self, product_id: str) -> Optional[Product]:
        query = (
            select(Product)
            .execution_options(populate_existing=True)
            .options(
                selectinload(Product.variants).selectinload(ProductVariant.images),
                selectinload(Product.images),
                selectinload(Product.category),
                selectinload(Product.vendor),
            )
            .where(Product.id == product_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Product]:
        query = (
            select(Product)
            .execution_options(populate_existing=True)
            .options(
                selectinload(Product.variants).selectinload(ProductVariant.images),
                selectinload(Product.images),
                selectinload(Product.category),
                selectinload(Product.vendor),
            )
            .where(Product.slug == slug)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_products(
        self,
        category_id: Optional[str] = None,
        vendor_id: Optional[str] = None,
        status: Optional[ProductStatus] = None,
        search_query: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        is_featured: Optional[bool] = None,
        sort_by: Optional[str] = "newest",  # newest, price_asc, price_desc, title_asc
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Product], int]:
        query = (
            select(Product)
            .execution_options(populate_existing=True)
            .options(
                selectinload(Product.variants).selectinload(ProductVariant.images),
                selectinload(Product.images),
                selectinload(Product.category),
                selectinload(Product.vendor),
            )
        )
        count_query = select(func.count(Product.id))

        filters = []
        if category_id:
            # Match category by ID or Slug (e.g. "electronics", "audio", or UUID)
            cat_result = await self.db.execute(
                select(Category).where(
                    or_(
                        Category.id == category_id,
                        Category.slug == category_id,
                        Category.name.ilike(category_id),
                    )
                )
            )
            matched_cat = cat_result.scalar_one_or_none()
            if matched_cat:
                # Find all child subcategories of this category
                children_result = await self.db.execute(
                    select(Category.id).where(Category.parent_id == matched_cat.id)
                )
                child_ids = list(children_result.scalars().all())
                target_cat_ids = [matched_cat.id] + child_ids
                filters.append(Product.category_id.in_(target_cat_ids))
            else:
                filters.append(Product.category_id == category_id)

        if vendor_id:
            filters.append(Product.vendor_id == vendor_id)
        if status:
            filters.append(Product.status == status)
        if is_featured is not None:
            filters.append(Product.is_featured == is_featured)
        if brand:
            filters.append(func.lower(Product.brand) == brand.lower().strip())
        if min_price is not None:
            filters.append(Product.base_price >= min_price)
        if max_price is not None:
            filters.append(Product.base_price <= max_price)
        if search_query:
            term = f"%{search_query.strip()}%"
            filters.append(
                or_(
                    Product.title.ilike(term),
                    Product.description.ilike(term),
                    Product.brand.ilike(term),
                )
            )

        if filters:
            query = query.where(*filters)
            count_query = count_query.where(*filters)

        # Sorting
        if sort_by == "price_asc":
            query = query.order_by(Product.base_price.asc())
        elif sort_by == "price_desc":
            query = query.order_by(Product.base_price.desc())
        elif sort_by == "title_asc":
            query = query.order_by(Product.title.asc())
        else:  # newest default
            query = query.order_by(Product.created_at.desc())

        query = query.offset(skip).limit(limit)

        products_result = await self.db.execute(query)
        total_result = await self.db.execute(count_query)

        return list(products_result.scalars().all()), total_result.scalar() or 0

    # Variant specific helper methods
    async def get_variant_by_id(self, variant_id: str, for_update: bool = False) -> Optional[ProductVariant]:
        query = (
            select(ProductVariant)
            .execution_options(populate_existing=True)
            .options(
                selectinload(ProductVariant.product).selectinload(Product.vendor),
                selectinload(ProductVariant.images),
            )
            .where(ProductVariant.id == variant_id)
        )
        if for_update and "sqlite" not in str(self.db.bind.url):
            query = query.with_for_update()
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_variant_by_sku(self, sku: str) -> Optional[ProductVariant]:
        query = select(ProductVariant).where(ProductVariant.sku == sku.strip())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_variant(self, attributes: dict) -> ProductVariant:
        variant = ProductVariant(**attributes)
        self.db.add(variant)
        await self.db.flush()
        await self.db.refresh(variant)
        return variant

    async def add_image(self, attributes: dict) -> ProductImage:
        image = ProductImage(**attributes)
        self.db.add(image)
        await self.db.flush()
        await self.db.refresh(image)
        return image

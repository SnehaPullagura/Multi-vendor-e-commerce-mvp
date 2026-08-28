from typing import List, Optional
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import ProductStatus
from app.core.exceptions import BadRequestException, ConflictException, ForbiddenException, NotFoundException
from app.models.category import Category
from app.models.product import Product
from app.models.variant import ProductVariant
from app.models.vendor import Vendor
from app.repositories.category_repo import CategoryRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.product import ProductCreate, ProductResponse, ProductStatusUpdate, ProductUpdate
from app.schemas.variant import ProductImageResponse, VariantCreate, VariantResponse, VariantUpdate
from app.schemas.vendor import VendorPublicResponse


class CatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.category_repo = CategoryRepository(db)
        self.product_repo = ProductRepository(db)

    # Categories
    async def get_category_tree(self) -> List[Category]:
        return await self.category_repo.get_tree()

    async def get_category_by_slug(self, slug: str) -> Category:
        cat = await self.category_repo.get_by_slug(slug)
        if not cat:
            raise NotFoundException("Category", slug)
        return cat

    async def create_category(self, data: CategoryCreate) -> Category:
        slug = data.slug or slugify(data.name)
        existing = await self.category_repo.get_by_slug(slug)
        if existing:
            raise ConflictException(f"Category slug '{slug}' already exists")

        cat_dict = data.model_dump()
        cat_dict["slug"] = slug
        return await self.category_repo.create(cat_dict)

    async def update_category(self, category_id: str, data: CategoryUpdate) -> Category:
        cat = await self.category_repo.get_by_id(category_id)
        if not cat:
            raise NotFoundException("Category", category_id)

        update_dict = data.model_dump(exclude_unset=True)
        if "name" in update_dict and not update_dict.get("slug"):
            update_dict["slug"] = slugify(update_dict["name"])

        return await self.category_repo.update(cat, update_dict)

    async def delete_category(self, category_id: str) -> None:
        cat = await self.category_repo.get_by_id(category_id)
        if not cat:
            raise NotFoundException("Category", category_id)
        await self.category_repo.delete(cat)

    # Products
    async def get_product_by_id(self, product_id: str) -> Product:
        product = await self.product_repo.get_by_id_with_relations(product_id)
        if not product:
            raise NotFoundException("Product", product_id)
        return product

    async def get_product_by_slug(self, slug: str) -> Product:
        product = await self.product_repo.get_by_slug(slug)
        if not product:
            raise NotFoundException("Product", slug)
        return product

    async def create_product(self, vendor: Vendor, data: ProductCreate) -> Product:
        # Check category existence
        cat = await self.category_repo.get_by_id(data.category_id)
        if not cat:
            raise NotFoundException("Category", data.category_id)

        # Generate unique slug
        base_slug = data.slug or slugify(data.title)
        slug = base_slug
        counter = 1
        while await self.product_repo.get_by_slug(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1

        product_data = {
            "vendor_id": vendor.id,
            "category_id": data.category_id,
            "title": data.title.strip(),
            "slug": slug,
            "description": data.description,
            "brand": data.brand.strip() if data.brand else None,
            "base_price": data.base_price,
            "status": ProductStatus.PUBLISHED,  # For MVP, auto-publish or set to DRAFT
            "is_featured": data.is_featured,
            "meta_title": data.meta_title,
            "meta_description": data.meta_description,
        }

        product = await self.product_repo.create(product_data)

        # Handle Variants
        if data.variants and len(data.variants) > 0:
            for v_data in data.variants:
                # Check SKU uniqueness
                existing_sku = await self.product_repo.get_variant_by_sku(v_data.sku)
                if existing_sku:
                    raise ConflictException(f"SKU '{v_data.sku}' is already in use")

                v_dict = v_data.model_dump()
                v_dict["product_id"] = product.id
                await self.product_repo.create_variant(v_dict)
        else:
            # Create a default variant
            default_sku = f"{vendor.slug[:4].upper()}-{product.slug[:8].upper()}-DEF"
            # Ensure unique
            counter = 1
            check_sku = default_sku
            while await self.product_repo.get_variant_by_sku(check_sku):
                check_sku = f"{default_sku}-{counter}"
                counter += 1

            await self.product_repo.create_variant({
                "product_id": product.id,
                "sku": check_sku,
                "title": "Default",
                "price": product.base_price,
                "stock_quantity": 50,  # Default stock for MVP
                "low_stock_threshold": 5,
                "is_active": True,
            })

        # Handle Images
        if data.images:
            for idx, img_url in enumerate(data.images):
                await self.product_repo.add_image({
                    "product_id": product.id,
                    "image_url": img_url,
                    "is_primary": idx == 0,
                    "display_order": idx,
                })

        await self.db.flush()
        fresh_product = await self.get_product_by_id(product.id)
        return fresh_product

    def format_product(self, p: Product) -> ProductResponse:
        return ProductResponse(
            id=p.id,
            vendor_id=p.vendor_id,
            category_id=p.category_id,
            title=p.title,
            slug=p.slug,
            description=p.description,
            brand=p.brand,
            base_price=p.base_price,
            status=p.status,
            is_featured=p.is_featured,
            meta_title=p.meta_title,
            meta_description=p.meta_description,
            created_at=p.created_at,
            updated_at=p.updated_at,
            variants=[
                VariantResponse(
                    id=v.id,
                    product_id=v.product_id,
                    sku=v.sku,
                    title=v.title,
                    price=v.price,
                    cost_price=v.cost_price,
                    stock_quantity=v.stock_quantity,
                    low_stock_threshold=v.low_stock_threshold,
                    attributes_json=v.attributes_json,
                    is_active=v.is_active,
                    created_at=v.created_at,
                    updated_at=v.updated_at,
                )
                for v in (p.variants or [])
            ],
            images=[
                ProductImageResponse(
                    id=img.id,
                    product_id=img.product_id,
                    variant_id=img.variant_id,
                    image_url=img.image_url,
                    is_primary=img.is_primary,
                    display_order=img.display_order,
                    created_at=img.created_at,
                )
                for img in (p.images or [])
            ],
            category=CategoryResponse.model_validate(p.category) if p.category else None,
            vendor=VendorPublicResponse.model_validate(p.vendor) if p.vendor else None,
        )

    async def update_product(self, product_id: str, vendor: Optional[Vendor], data: ProductUpdate) -> Product:
        product = await self.get_product_by_id(product_id)
        if vendor and product.vendor_id != vendor.id:
            raise ForbiddenException("You can only modify products belonging to your own store")

        update_dict = data.model_dump(exclude_unset=True)
        if "title" in update_dict and not update_dict.get("slug"):
            update_dict["slug"] = slugify(update_dict["title"])

        return await self.product_repo.update(product, update_dict)

    async def update_product_status(self, product_id: str, data: ProductStatusUpdate) -> Product:
        product = await self.get_product_by_id(product_id)
        return await self.product_repo.update(product, {"status": data.status})

    # Variant Management
    async def add_variant(self, product_id: str, vendor: Vendor, data: VariantCreate) -> ProductVariant:
        product = await self.get_product_by_id(product_id)
        if product.vendor_id != vendor.id:
            raise ForbiddenException("You cannot add variants to another vendor's product")

        existing_sku = await self.product_repo.get_variant_by_sku(data.sku)
        if existing_sku:
            raise ConflictException(f"SKU '{data.sku}' already exists")

        v_dict = data.model_dump()
        v_dict["product_id"] = product_id
        return await self.product_repo.create_variant(v_dict)

    async def update_variant(self, variant_id: str, vendor: Vendor, data: VariantUpdate) -> ProductVariant:
        variant = await self.product_repo.get_variant_by_id(variant_id)
        if not variant:
            raise NotFoundException("Variant", variant_id)

        if variant.product.vendor_id != vendor.id:
            raise ForbiddenException("You cannot update variants belonging to another vendor")

        update_dict = data.model_dump(exclude_unset=True)
        if "sku" in update_dict and update_dict["sku"] != variant.sku:
            existing = await self.product_repo.get_variant_by_sku(update_dict["sku"])
            if existing:
                raise ConflictException(f"SKU '{update_dict['sku']}' already exists")

        for k, v in update_dict.items():
            setattr(variant, k, v)
        await self.db.flush()
        await self.db.refresh(variant)
        return variant

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.pagination import PaginatedResponse, PaginationParams
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_vendor
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.product import ProductCreate, ProductResponse, ProductStatusUpdate, ProductUpdate
from app.schemas.variant import VariantCreate, VariantResponse, VariantUpdate
from app.services.catalog_service import CatalogService
from app.services.search_service import SearchService

router = APIRouter()


@router.get("/list", response_model=ApiResponse[PaginatedResponse[ProductResponse]])
@router.get("", response_model=ApiResponse[PaginatedResponse[ProductResponse]])
async def list_products(
    q: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    vendor_id: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    brand: Optional[str] = Query(None),
    is_featured: Optional[bool] = Query(None),
    sort_by: Optional[str] = Query("newest"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List and search marketplace products with pagination and faceted filters."""
    service = SearchService(db)
    params = PaginationParams(page=page, page_size=page_size)
    results = await service.search_products(
        category_id=category_id,
        vendor_id=vendor_id,
        query_str=q,
        min_price=min_price,
        max_price=max_price,
        brand=brand,
        is_featured=is_featured,
        sort_by=sort_by,
        params=params,
    )
    return ApiResponse.ok(results)


@router.get("/{id_or_slug}", response_model=ApiResponse[ProductResponse])
async def get_product_details(id_or_slug: str, db: AsyncSession = Depends(get_db)):
    """Retrieve full product details including variants, images, category, and vendor info."""
    service = CatalogService(db)
    try:
        product = await service.get_product_by_id(id_or_slug)
    except Exception:
        product = await service.get_product_by_slug(id_or_slug)
    return ApiResponse.ok(service.format_product(product))


@router.post("", response_model=ApiResponse[ProductResponse], status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Create a new product in the authenticated seller's store."""
    service = CatalogService(db)
    created = await service.create_product(vendor, data)
    return ApiResponse.ok(service.format_product(created), message="Product created successfully")


@router.put("/{product_id}", response_model=ApiResponse[ProductResponse])
async def update_product(
    product_id: str,
    data: ProductUpdate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing product."""
    service = CatalogService(db)
    updated = await service.update_product(product_id, vendor, data)
    return ApiResponse.ok(service.format_product(updated), message="Product updated")


@router.patch("/{product_id}/status", response_model=ApiResponse[ProductResponse])
async def update_product_status(
    product_id: str,
    data: ProductStatusUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update product lifecycle status (DRAFT / PUBLISHED / ARCHIVED)."""
    service = CatalogService(db)
    updated = await service.update_product_status(product_id, data)
    return ApiResponse.ok(service.format_product(updated), message="Product status updated")


@router.post("/{product_id}/variants", response_model=ApiResponse[VariantResponse], status_code=status.HTTP_201_CREATED)
async def add_product_variant(
    product_id: str,
    data: VariantCreate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Add a variant (SKU, price, stock) to a product."""
    service = CatalogService(db)
    variant = await service.add_variant(product_id, vendor, data)
    return ApiResponse.ok(VariantResponse.model_validate(variant), message="Variant added")


@router.put("/variants/{variant_id}", response_model=ApiResponse[VariantResponse])
async def update_product_variant(
    variant_id: str,
    data: VariantUpdate,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Update variant price, stock quantity, or attributes."""
    service = CatalogService(db)
    variant = await service.update_variant(variant_id, vendor, data)
    return ApiResponse.ok(VariantResponse.model_validate(variant), message="Variant updated")

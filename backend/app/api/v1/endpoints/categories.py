from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryTreeResponse, CategoryUpdate
from app.services.catalog_service import CatalogService

router = APIRouter()


@router.get("", response_model=ApiResponse[List[CategoryResponse]])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Retrieve list of all active categories."""
    service = CatalogService(db)
    categories = await service.category_repo.list_all_active()
    return ApiResponse.ok([CategoryResponse.model_validate(c) for c in categories])


@router.get("/tree", response_model=ApiResponse[List[CategoryTreeResponse]])
async def get_category_tree(db: AsyncSession = Depends(get_db)):
    """Retrieve full hierarchical category tree for navigation."""
    service = CatalogService(db)
    tree = await service.get_category_tree()
    return ApiResponse.ok([CategoryTreeResponse.model_validate(c) for c in tree])


@router.get("/{slug}", response_model=ApiResponse[CategoryResponse])
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """Retrieve category details by slug."""
    service = CatalogService(db)
    cat = await service.get_category_by_slug(slug)
    return ApiResponse.ok(CategoryResponse.model_validate(cat))


@router.post("", response_model=ApiResponse[CategoryResponse], status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new category (Admin only)."""
    service = CatalogService(db)
    created = await service.create_category(data)
    return ApiResponse.ok(CategoryResponse.model_validate(created), message="Category created")


@router.put("/{category_id}", response_model=ApiResponse[CategoryResponse])
async def update_category(
    category_id: str,
    data: CategoryUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update category details (Admin only)."""
    service = CatalogService(db)
    updated = await service.update_category(category_id, data)
    return ApiResponse.ok(CategoryResponse.model_validate(updated), message="Category updated")


@router.delete("/{category_id}", response_model=ApiResponse[dict])
async def delete_category(
    category_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a category (Admin only)."""
    service = CatalogService(db)
    await service.delete_category(category_id)
    return ApiResponse.ok({}, message="Category deleted")

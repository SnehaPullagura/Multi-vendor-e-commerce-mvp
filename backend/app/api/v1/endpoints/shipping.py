"""Shipping management API endpoints."""
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_vendor
from app.models.vendor import Vendor
from app.services.shipping_service import ShippingService
from pydantic import BaseModel

router = APIRouter()


class CreateShipmentRequest(BaseModel):
    sub_order_id: str
    carrier: str
    tracking_number: str | None = None
    weight_oz: float | None = None
    signature_required: bool = False


class BulkShipRequest(BaseModel):
    shipment_ids: List[str]
    carrier: str
    tracking_numbers: List[str]


class TrackingUpdateRequest(BaseModel):
    status: str
    location: str | None = None
    description: str | None = None


@router.post("/shipments", status_code=status.HTTP_201_CREATED, response_model=ApiResponse)
async def create_shipment(
    data: CreateShipmentRequest,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Create a new shipment for a sub-order."""
    service = ShippingService(db)
    shipment = await service.create_shipment(
        sub_order_id=data.sub_order_id,
        vendor_id=vendor.id,
        carrier=data.carrier,
        tracking_number=data.tracking_number,
        weight_oz=data.weight_oz,
        signature_required=data.signature_required,
    )
    return ApiResponse.ok({"id": shipment.id, "status": shipment.status}, message="Shipment created")


@router.put("/shipments/{shipment_id}/tracking", response_model=ApiResponse)
async def update_tracking(
    shipment_id: str,
    data: TrackingUpdateRequest,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Update shipment tracking status."""
    service = ShippingService(db)
    shipment = await service.update_tracking_status(
        shipment_id=shipment_id,
        new_status=data.status,
        location=data.location,
        description=data.description,
    )
    return ApiResponse.ok({"id": shipment.id, "status": shipment.status})


@router.get("/shipments/pending", response_model=ApiResponse)
async def list_pending_shipments(
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """List pending shipments for the authenticated vendor."""
    service = ShippingService(db)
    pending = await service.list_pending_shipments(vendor.id)
    return ApiResponse.ok([
        {"id": s.id, "sub_order_id": s.sub_order_id, "carrier": s.carrier, "status": s.status}
        for s in pending
    ])


@router.post("/shipments/bulk-ship", response_model=ApiResponse)
async def bulk_ship(
    data: BulkShipRequest,
    vendor: Vendor = Depends(get_current_vendor),
    db: AsyncSession = Depends(get_db),
):
    """Bulk mark shipments as shipped with tracking numbers."""
    service = ShippingService(db)
    updated = await service.bulk_mark_shipped(data.shipment_ids, data.carrier, data.tracking_numbers)
    return ApiResponse.ok({"updated_count": len(updated)})


@router.get("/shipping-rates", response_model=ApiResponse)
async def get_rates(
    weight_oz: float = 16.0,
    destination_zone: str = "US",
    db: AsyncSession = Depends(get_db),
):
    """Get available shipping rates for given package weight."""
    service = ShippingService(db)
    rates = await service.get_shipping_rates(weight_oz, destination_zone)
    return ApiResponse.ok(rates)

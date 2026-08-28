"""Shipping management service for carrier integration and tracking."""
import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.shipping import Shipment, ShipmentStatusUpdate, ShippingRate


CARRIER_TRACKING_URLS = {
    "USPS": "https://tools.usps.com/go/TrackConfirmAction?tLabels={}",
    "FEDEX": "https://www.fedex.com/fedextrack/?trknbr={}",
    "UPS": "https://www.ups.com/track?tracknum={}",
    "DHL": "https://www.dhl.com/en/express/tracking.html?AWB={}",
    "AMAZON_LOGISTICS": "https://track.amazon.com/tracking/{}",
}

SHIPMENT_STATUS_MACHINE = {
    "PENDING": ["LABEL_CREATED", "CANCELLED"],
    "LABEL_CREATED": ["PICKED_UP", "CANCELLED"],
    "PICKED_UP": ["IN_TRANSIT"],
    "IN_TRANSIT": ["OUT_FOR_DELIVERY", "EXCEPTION", "RETURNED_TO_SENDER"],
    "OUT_FOR_DELIVERY": ["DELIVERED", "EXCEPTION", "RETURNED_TO_SENDER"],
    "EXCEPTION": ["IN_TRANSIT", "RETURNED_TO_SENDER", "DELIVERED"],
    "DELIVERED": [],
    "CANCELLED": [],
    "RETURNED_TO_SENDER": [],
}


class ShippingService:
    """Manages shipments, tracking updates, and rate calculations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_shipment(
        self,
        sub_order_id: str,
        vendor_id: str,
        carrier: str,
        tracking_number: Optional[str] = None,
        weight_oz: Optional[float] = None,
        signature_required: bool = False,
    ) -> Shipment:
        """Create a new shipment for a sub-order."""
        tracking_url = None
        if tracking_number and carrier in CARRIER_TRACKING_URLS:
            tracking_url = CARRIER_TRACKING_URLS[carrier].format(tracking_number)

        shipment = Shipment(
            sub_order_id=sub_order_id,
            vendor_id=vendor_id,
            carrier=carrier,
            tracking_number=tracking_number,
            tracking_url=tracking_url,
            status="LABEL_CREATED" if tracking_number else "PENDING",
            weight_oz=weight_oz,
            signature_required=signature_required,
            shipped_at=datetime.now(timezone.utc) if tracking_number else None,
        )
        self.db.add(shipment)
        await self.db.flush()

        if tracking_number:
            update = ShipmentStatusUpdate(
                shipment_id=shipment.id,
                status="LABEL_CREATED",
                description=f"Shipping label created with {carrier}. Tracking: {tracking_number}",
            )
            self.db.add(update)
            await self.db.flush()

        return shipment

    async def update_tracking_status(
        self,
        shipment_id: str,
        new_status: str,
        location: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Shipment:
        """Update shipment status with validation against state machine."""
        shipment = await self.db.get(Shipment, shipment_id)
        if not shipment:
            raise ValueError(f"Shipment {shipment_id} not found")

        valid_transitions = SHIPMENT_STATUS_MACHINE.get(shipment.status, [])
        if new_status not in valid_transitions:
            raise ValueError(
                f"Invalid status transition: {shipment.status} → {new_status}. "
                f"Valid transitions: {valid_transitions}"
            )

        shipment.status = new_status
        if new_status == "DELIVERED":
            shipment.delivered_at = datetime.now(timezone.utc)
        elif new_status == "PICKED_UP":
            shipment.shipped_at = datetime.now(timezone.utc)

        update = ShipmentStatusUpdate(
            shipment_id=shipment.id,
            status=new_status,
            location=location,
            description=description or f"Status updated to {new_status}",
        )
        self.db.add(update)
        await self.db.flush()
        return shipment

    async def estimate_delivery(
        self,
        carrier: str,
        origin_zip: str,
        destination_zip: str,
    ) -> Dict[str, Any]:
        """Estimate delivery date based on carrier and zones."""
        zone_distance = abs(int(origin_zip[:3]) - int(destination_zip[:3]))

        if zone_distance < 50:
            min_days, max_days = 1, 3
        elif zone_distance < 200:
            min_days, max_days = 2, 5
        else:
            min_days, max_days = 3, 7

        if carrier == "FEDEX":
            min_days = max(1, min_days - 1)
            max_days = max(2, max_days - 1)
        elif carrier == "USPS":
            max_days += 1

        now = datetime.now(timezone.utc)
        return {
            "carrier": carrier,
            "origin_zip": origin_zip,
            "destination_zip": destination_zip,
            "estimated_min_date": (now + timedelta(days=min_days)).isoformat(),
            "estimated_max_date": (now + timedelta(days=max_days)).isoformat(),
            "business_days_range": f"{min_days}-{max_days}",
        }

    async def get_shipping_rates(
        self,
        weight_oz: float,
        destination_zone: str = "US",
    ) -> List[Dict[str, Any]]:
        """Get available shipping rates for given package parameters."""
        query = select(ShippingRate).where(
            and_(
                ShippingRate.is_active == True,
                ShippingRate.weight_min_oz <= weight_oz,
                ShippingRate.weight_max_oz >= weight_oz,
                ShippingRate.destination_zone == destination_zone,
            )
        ).order_by(ShippingRate.base_rate)

        result = await self.db.execute(query)
        rates = result.scalars().all()

        return [
            {
                "carrier": r.carrier,
                "service_level": r.service_level,
                "base_rate": float(r.base_rate),
                "weight_surcharge": round(float(r.per_oz_rate) * weight_oz, 2),
                "fuel_surcharge_pct": float(r.fuel_surcharge_pct),
                "total_rate": round(
                    float(r.base_rate)
                    + (float(r.per_oz_rate) * weight_oz)
                    + (float(r.base_rate) * float(r.fuel_surcharge_pct) / 100),
                    2,
                ),
                "estimated_days": f"{r.estimated_days_min}-{r.estimated_days_max}",
            }
            for r in rates
        ]

    async def list_pending_shipments(self, vendor_id: str) -> List[Shipment]:
        """List all pending shipments for a vendor."""
        query = select(Shipment).where(
            and_(
                Shipment.vendor_id == vendor_id,
                Shipment.status.in_(["PENDING", "LABEL_CREATED"]),
            )
        ).order_by(Shipment.created_at)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def bulk_mark_shipped(
        self,
        shipment_ids: List[str],
        carrier: str,
        tracking_numbers: List[str],
    ) -> List[Shipment]:
        """Bulk update multiple shipments with tracking numbers."""
        updated = []
        for sid, tn in zip(shipment_ids, tracking_numbers):
            shipment = await self.db.get(Shipment, sid)
            if shipment and shipment.status in ("PENDING", "LABEL_CREATED"):
                shipment.carrier = carrier
                shipment.tracking_number = tn
                if carrier in CARRIER_TRACKING_URLS:
                    shipment.tracking_url = CARRIER_TRACKING_URLS[carrier].format(tn)
                shipment.status = "PICKED_UP"
                shipment.shipped_at = datetime.now(timezone.utc)

                update = ShipmentStatusUpdate(
                    shipment_id=shipment.id,
                    status="PICKED_UP",
                    description=f"Bulk shipped via {carrier}. Tracking: {tn}",
                )
                self.db.add(update)
                updated.append(shipment)

        await self.db.flush()
        return updated

"""Shipping & fulfillment models for multi-vendor sub-order shipments."""
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric, String, Text, Boolean, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base


class ShippingCarrier:
    USPS = "USPS"
    FEDEX = "FEDEX"
    UPS = "UPS"
    DHL = "DHL"
    AMAZON_LOGISTICS = "AMAZON_LOGISTICS"
    ONTRAC = "ONTRAC"
    LASERSHIP = "LASERSHIP"


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sub_order_id = Column(String(36), ForeignKey("sub_orders.id"), nullable=False, index=True)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False, index=True)
    carrier = Column(String(50), nullable=False, default=ShippingCarrier.USPS)
    tracking_number = Column(String(100), nullable=True, index=True)
    tracking_url = Column(Text, nullable=True)
    label_url = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default="PENDING")
    shipped_at = Column(DateTime, nullable=True)
    estimated_delivery_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    shipping_cost = Column(Numeric(10, 2), nullable=False, default=0.00)
    insurance_cost = Column(Numeric(10, 2), nullable=False, default=0.00)
    weight_oz = Column(Numeric(8, 2), nullable=True)
    dimensions_length = Column(Numeric(6, 2), nullable=True)
    dimensions_width = Column(Numeric(6, 2), nullable=True)
    dimensions_height = Column(Numeric(6, 2), nullable=True)
    origin_address = Column(Text, nullable=True)
    destination_address = Column(Text, nullable=True)
    signature_required = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sub_order = relationship("SubOrder", backref="shipments")
    vendor = relationship("Vendor", backref="shipments")
    status_updates = relationship("ShipmentStatusUpdate", back_populates="shipment", order_by="ShipmentStatusUpdate.created_at")


class ShipmentStatusUpdate(Base):
    __tablename__ = "shipment_status_updates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    shipment_id = Column(String(36), ForeignKey("shipments.id"), nullable=False, index=True)
    status = Column(String(30), nullable=False)
    location = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    raw_carrier_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="status_updates")


class ShippingRate(Base):
    __tablename__ = "shipping_rates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    carrier = Column(String(50), nullable=False)
    service_level = Column(String(50), nullable=False)
    origin_zone = Column(String(20), nullable=False)
    destination_zone = Column(String(20), nullable=False)
    weight_min_oz = Column(Numeric(8, 2), nullable=False, default=0)
    weight_max_oz = Column(Numeric(8, 2), nullable=False, default=9999)
    base_rate = Column(Numeric(10, 2), nullable=False)
    per_oz_rate = Column(Numeric(6, 4), nullable=False, default=0)
    fuel_surcharge_pct = Column(Numeric(5, 2), nullable=False, default=0)
    estimated_days_min = Column(Integer, nullable=False, default=1)
    estimated_days_max = Column(Integer, nullable=False, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ShippingZone(Base):
    __tablename__ = "shipping_zones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False, index=True)
    zone_name = Column(String(100), nullable=False)
    countries = Column(Text, nullable=True)
    states = Column(Text, nullable=True)
    zip_ranges = Column(Text, nullable=True)
    flat_rate = Column(Numeric(10, 2), nullable=True)
    free_shipping_threshold = Column(Numeric(10, 2), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

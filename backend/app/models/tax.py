"""Tax rule and exemption models for multi-jurisdiction tax handling."""
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class TaxRule(Base):
    __tablename__ = "tax_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    jurisdiction_name = Column(String(100), nullable=False)
    jurisdiction_type = Column(String(20), nullable=False, default="STATE")
    country = Column(String(3), nullable=False, default="US")
    state_code = Column(String(10), nullable=True, index=True)
    city = Column(String(100), nullable=True)
    postal_code_pattern = Column(String(50), nullable=True)
    tax_rate = Column(Numeric(6, 4), nullable=False)
    tax_type = Column(String(30), nullable=False, default="SALES_TAX")
    applies_to_shipping = Column(Boolean, default=False)
    applies_to_digital = Column(Boolean, default=True)
    priority = Column(String(10), nullable=False, default="0")
    is_compound = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    effective_from = Column(DateTime, nullable=True)
    effective_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class TaxExemption(Base):
    __tablename__ = "tax_exemptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=True, index=True)
    exemption_type = Column(String(30), nullable=False)
    certificate_number = Column(String(100), nullable=True)
    issuing_state = Column(String(10), nullable=True)
    exempt_categories = Column(Text, nullable=True)
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

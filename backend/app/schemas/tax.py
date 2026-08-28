"""Pydantic schemas for tax calculation module."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class TaxBreakdownItem(BaseModel):
    item_id: str
    item_name: str
    taxable_amount: float
    tax_rate: float
    tax_amount: float


class TaxCalculationResponse(BaseModel):
    tax_amount: float
    tax_rate: float
    jurisdiction: str
    taxable_subtotal: Optional[float] = None
    shipping_taxed: bool = False
    breakdown: List[TaxBreakdownItem] = []
    note: Optional[str] = None


class TaxRuleResponse(BaseModel):
    id: str
    jurisdiction_name: str
    rate: float
    type: str
    applies_to_shipping: bool
    is_compound: bool


class TaxJurisdictionResponse(BaseModel):
    state: str
    country: str
    default_state_rate: float
    custom_rules: List[TaxRuleResponse] = []
    effective_rate: float


class TaxReportEntry(BaseModel):
    jurisdiction: str
    tax_rate: float
    estimated_collected: float


class TaxSummaryReportResponse(BaseModel):
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    jurisdictions: List[TaxReportEntry] = []
    total_tax_collected: float
    filing_status: str

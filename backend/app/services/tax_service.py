"""Tax calculation service with US state tax rate lookup."""
from decimal import Decimal
from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.tax import TaxExemption, TaxRule


US_STATE_TAX_RATES = {
    "AL": Decimal("4.00"), "AK": Decimal("0.00"), "AZ": Decimal("5.60"),
    "AR": Decimal("6.50"), "CA": Decimal("7.25"), "CO": Decimal("2.90"),
    "CT": Decimal("6.35"), "DE": Decimal("0.00"), "FL": Decimal("6.00"),
    "GA": Decimal("4.00"), "HI": Decimal("4.00"), "ID": Decimal("6.00"),
    "IL": Decimal("6.25"), "IN": Decimal("7.00"), "IA": Decimal("6.00"),
    "KS": Decimal("6.50"), "KY": Decimal("6.00"), "LA": Decimal("4.45"),
    "ME": Decimal("5.50"), "MD": Decimal("6.00"), "MA": Decimal("6.25"),
    "MI": Decimal("6.00"), "MN": Decimal("6.875"), "MS": Decimal("7.00"),
    "MO": Decimal("4.225"), "MT": Decimal("0.00"), "NE": Decimal("5.50"),
    "NV": Decimal("6.85"), "NH": Decimal("0.00"), "NJ": Decimal("6.625"),
    "NM": Decimal("5.125"), "NY": Decimal("4.00"), "NC": Decimal("4.75"),
    "ND": Decimal("5.00"), "OH": Decimal("5.75"), "OK": Decimal("4.50"),
    "OR": Decimal("0.00"), "PA": Decimal("6.00"), "RI": Decimal("7.00"),
    "SC": Decimal("6.00"), "SD": Decimal("4.50"), "TN": Decimal("7.00"),
    "TX": Decimal("6.25"), "UT": Decimal("6.10"), "VT": Decimal("6.00"),
    "VA": Decimal("5.30"), "WA": Decimal("6.50"), "WV": Decimal("6.00"),
    "WI": Decimal("5.00"), "WY": Decimal("4.00"), "DC": Decimal("6.00"),
    "PR": Decimal("10.50"), "GU": Decimal("4.00"), "VI": Decimal("0.00"),
}


class TaxService:
    """Handles multi-jurisdiction sales tax calculation, exemptions, and reporting."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def calculate_tax(
        self,
        items: List[Dict[str, Any]],
        shipping_state: str,
        shipping_country: str = "US",
        shipping_amount: Decimal = Decimal("0.00"),
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Calculate tax for a list of items based on shipping destination."""
        if shipping_country != "US":
            return {
                "tax_amount": Decimal("0.00"),
                "tax_rate": Decimal("0.00"),
                "jurisdiction": f"International ({shipping_country})",
                "breakdown": [],
                "note": "International tax calculation not yet supported.",
            }

        # Check exemptions
        if user_id:
            exemption = await self._check_exemption(user_id, shipping_state)
            if exemption:
                return {
                    "tax_amount": Decimal("0.00"),
                    "tax_rate": Decimal("0.00"),
                    "jurisdiction": f"{shipping_state}, US",
                    "breakdown": [],
                    "note": f"Tax exempt: {exemption.exemption_type} (Certificate: {exemption.certificate_number})",
                }

        # Look up custom rules first, fall back to default state rates
        custom_rate = await self._get_custom_rate(shipping_state, shipping_country)
        state_rate = custom_rate if custom_rate is not None else US_STATE_TAX_RATES.get(
            shipping_state.upper(), Decimal("0.00")
        )

        subtotal = sum(Decimal(str(item.get("price", 0))) * item.get("quantity", 1) for item in items)
        taxable_amount = subtotal

        # Check if shipping is taxable in this jurisdiction
        shipping_taxable = await self._is_shipping_taxable(shipping_state)
        if shipping_taxable:
            taxable_amount += shipping_amount

        tax_amount = (taxable_amount * state_rate / Decimal("100.00")).quantize(Decimal("0.01"))

        breakdown = []
        for item in items:
            item_total = Decimal(str(item.get("price", 0))) * item.get("quantity", 1)
            item_tax = (item_total * state_rate / Decimal("100.00")).quantize(Decimal("0.01"))
            breakdown.append({
                "item_id": item.get("id", "unknown"),
                "item_name": item.get("name", "Item"),
                "taxable_amount": float(item_total),
                "tax_rate": float(state_rate),
                "tax_amount": float(item_tax),
            })

        return {
            "tax_amount": float(tax_amount),
            "tax_rate": float(state_rate),
            "jurisdiction": f"{shipping_state}, US",
            "taxable_subtotal": float(taxable_amount),
            "shipping_taxed": shipping_taxable,
            "breakdown": breakdown,
        }

    async def get_tax_rates_for_jurisdiction(
        self,
        state: str,
        country: str = "US",
    ) -> Dict[str, Any]:
        """Get all applicable tax rates for a jurisdiction."""
        if country == "US":
            default_rate = US_STATE_TAX_RATES.get(state.upper(), Decimal("0.00"))
        else:
            default_rate = Decimal("0.00")

        query = select(TaxRule).where(
            and_(
                TaxRule.country == country,
                TaxRule.state_code == state.upper(),
                TaxRule.is_active == True,
            )
        )
        result = await self.db.execute(query)
        custom_rules = result.scalars().all()

        return {
            "state": state.upper(),
            "country": country,
            "default_state_rate": float(default_rate),
            "custom_rules": [
                {
                    "id": r.id,
                    "jurisdiction_name": r.jurisdiction_name,
                    "rate": float(r.tax_rate),
                    "type": r.tax_type,
                    "applies_to_shipping": r.applies_to_shipping,
                    "is_compound": r.is_compound,
                }
                for r in custom_rules
            ],
            "effective_rate": float(custom_rules[0].tax_rate) if custom_rules else float(default_rate),
        }

    async def get_tax_summary_report(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Generate a tax collection summary report by jurisdiction."""
        # Simplified report from tax rules
        all_states = list(US_STATE_TAX_RATES.items())
        report_entries = []
        total_estimated = Decimal("0.00")

        for state_code, rate in all_states:
            if rate > 0:
                report_entries.append({
                    "jurisdiction": f"{state_code}, US",
                    "tax_rate": float(rate),
                    "estimated_collected": 0.00,
                })

        return {
            "period_start": start_date.isoformat() if start_date else None,
            "period_end": end_date.isoformat() if end_date else None,
            "jurisdictions": report_entries,
            "total_tax_collected": float(total_estimated),
            "filing_status": "DRAFT",
        }

    async def validate_tax_id(self, tax_id: str) -> Dict[str, Any]:
        """Validate a tax identification number format."""
        cleaned = tax_id.replace("-", "").replace(" ", "")
        is_ein = len(cleaned) == 9 and cleaned.isdigit()
        is_ssn = len(cleaned) == 9 and cleaned.isdigit()

        return {
            "tax_id": tax_id,
            "is_valid_format": is_ein,
            "id_type": "EIN" if is_ein else ("SSN" if is_ssn else "UNKNOWN"),
            "formatted": f"{cleaned[:2]}-{cleaned[2:]}" if is_ein else tax_id,
        }

    async def _check_exemption(self, user_id: str, state: str) -> Optional[TaxExemption]:
        """Check if user has a valid tax exemption for the given state."""
        query = select(TaxExemption).where(
            and_(
                TaxExemption.user_id == user_id,
                TaxExemption.is_active == True,
            )
        )
        result = await self.db.execute(query)
        exemptions = result.scalars().all()

        for exemption in exemptions:
            if exemption.issuing_state and exemption.issuing_state.upper() == state.upper():
                return exemption
            if not exemption.issuing_state:
                return exemption
        return None

    async def _get_custom_rate(self, state: str, country: str) -> Optional[Decimal]:
        """Get custom tax rate from database rules."""
        query = select(TaxRule.tax_rate).where(
            and_(
                TaxRule.country == country,
                TaxRule.state_code == state.upper(),
                TaxRule.is_active == True,
            )
        ).limit(1)
        result = await self.db.execute(query)
        rate = result.scalar_one_or_none()
        return rate

    async def _is_shipping_taxable(self, state: str) -> bool:
        """Check whether shipping charges are taxable in the given state."""
        taxable_shipping_states = {
            "AR", "CT", "DC", "GA", "HI", "IL", "IN", "KS", "KY", "MI",
            "MN", "MS", "NE", "NJ", "NM", "NY", "NC", "ND", "OH", "PA",
            "SC", "SD", "TN", "TX", "UT", "VT", "WA", "WV", "WI", "WY",
        }
        return state.upper() in taxable_shipping_states

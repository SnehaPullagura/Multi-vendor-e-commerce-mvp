"""
Cross-Border Logistics, Harmonized Tariff Schedule (HTS) & Landed Cost Engine.
Calculates import duties, customs clearance tariffs, international VAT/GST, and generates electronic commercial invoices.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Optional


@dataclass
class CustomsDutyRate:
    hts_code: str
    description: str
    duty_rate_pct: Decimal
    vat_rate_pct: Decimal
    requires_export_license: bool


class InternationalLogisticsEngine:
    CUSTOMS_DATABASE: Dict[str, CustomsDutyRate] = {
        "8518.30.20": CustomsDutyRate(
            hts_code="8518.30.20",
            description="Over-ear active noise cancelling headphones with microphones",
            duty_rate_pct=Decimal("4.50"),
            vat_rate_pct=Decimal("20.00"),
            requires_export_license=False,
        ),
        "8471.60.20": CustomsDutyRate(
            hts_code="8471.60.20",
            description="Keyboards and optical data entry units",
            duty_rate_pct=Decimal("0.00"),
            vat_rate_pct=Decimal("19.00"),
            requires_export_license=False,
        ),
        "9401.30.80": CustomsDutyRate(
            hts_code="9401.30.80",
            description="Swivel seats with variable height adjustment mechanisms",
            duty_rate_pct=Decimal("3.20"),
            vat_rate_pct=Decimal("21.00"),
            requires_export_license=False,
        ),
        "8211.92.20": CustomsDutyRate(
            hts_code="8211.92.20",
            description="Chef knives and cutlery blades with fixed handles",
            duty_rate_pct=Decimal("6.00"),
            vat_rate_pct=Decimal("20.00"),
            requires_export_license=False,
        ),
        "3304.99.50": CustomsDutyRate(
            hts_code="3304.99.50",
            description="Organic cosmetic serums and skin care preparations",
            duty_rate_pct=Decimal("2.80"),
            vat_rate_pct=Decimal("19.50"),
            requires_export_license=False,
        ),
    }

    @classmethod
    def calculate_total_landed_cost(
        cls,
        hts_code: str,
        fob_item_price_usd: Decimal,
        international_freight_usd: Decimal,
        cargo_insurance_usd: Decimal,
        destination_country_iso: str = "DE",
    ) -> Dict[str, Any]:
        """
        Calculates CIF (Cost, Insurance, Freight) landed cost breakdown according to WCO standard valuation rules.
        """
        tariff_entry = cls.CUSTOMS_DATABASE.get(
            hts_code,
            CustomsDutyRate(
                hts_code=hts_code,
                description="General Merchandising Goods",
                duty_rate_pct=Decimal("5.00"),
                vat_rate_pct=Decimal("20.00"),
                requires_export_license=False,
            )
        )

        cif_customs_value = (fob_item_price_usd + international_freight_usd + cargo_insurance_usd).quantize(Decimal("0.01"))
        customs_duty_amount = (cif_customs_value * tariff_entry.duty_rate_pct / Decimal("100.00")).quantize(Decimal("0.01"))
        taxable_vat_base = cif_customs_value + customs_duty_amount
        import_vat_amount = (taxable_vat_base * tariff_entry.vat_rate_pct / Decimal("100.00")).quantize(Decimal("0.01"))
        carrier_customs_brokerage_fee = Decimal("15.00")

        total_landed_cost = (
            fob_item_price_usd
            + international_freight_usd
            + cargo_insurance_usd
            + customs_duty_amount
            + import_vat_amount
            + carrier_customs_brokerage_fee
        ).quantize(Decimal("0.01"))

        return {
            "hts_code": tariff_entry.hts_code,
            "hts_description": tariff_entry.description,
            "destination_country": destination_country_iso.upper(),
            "fob_merchandise_subtotal": float(fob_item_price_usd),
            "international_freight": float(international_freight_usd),
            "cargo_insurance": float(cargo_insurance_usd),
            "cif_valuation_base": float(cif_customs_value),
            "duty_rate_percentage": float(tariff_entry.duty_rate_pct),
            "customs_duty_amount": float(customs_duty_amount),
            "import_vat_percentage": float(tariff_entry.vat_rate_pct),
            "import_vat_amount": float(import_vat_amount),
            "brokerage_clearance_fee": float(carrier_customs_brokerage_fee),
            "total_estimated_landed_cost": float(total_landed_cost),
        }

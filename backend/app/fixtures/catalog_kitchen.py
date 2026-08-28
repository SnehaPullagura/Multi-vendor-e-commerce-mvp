"""Catalog data fixture for Artisanal Cookware & Chef Tools"""

CATEGORY_SLUG = "kitchen"
CATEGORY_NAME = "Artisanal Cookware & Chef Tools"

CATALOG_ITEMS = [
    {
        "title": "Damascus Steel 8-Inch Chef Knife with Pakkawood Handle",
        "description": "67-layer Japanese VG-10 high-carbon Damascus steel blade with Rockwell hardness 60±2 HRC, razor-sharp 15-degree edge angle, and ergonomic moisture-resistant Pakkawood handle.",
        "base_price": 135.0,
        "brand": "Damascus",
        "variants": [
            {
                "title": "8-Inch Chef Knife",
                "price": 135.0,
                "sku": "KNF-DAM-8IN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "5-Piece Chef Set (Knife + Sheath + Stone)",
                "price": 220.0,
                "sku": "KNF-DAM-SET5",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Enameled Cast Iron Dutch Oven (5.5 Quart)",
        "description": "Heirloom-quality enameled cast iron delivering superior heat retention and uniform distribution with self-basting lid condensation spikes and stainless steel knob.",
        "base_price": 160.0,
        "brand": "Enameled",
        "variants": [
            {
                "title": "Cobalt Blue",
                "price": 160.0,
                "sku": "DTO-55-BLU",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Sage Green",
                "price": 160.0,
                "sku": "DTO-55-GRN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Matte Black",
                "price": 160.0,
                "sku": "DTO-55-BLK",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Precision Conical Burr Coffee Grinder",
        "description": "40mm hardened stainless steel conical burrs with 30 micro-adjust grind settings from ultra-fine espresso to coarse French press, low-RPM motor preventing heat buildup.",
        "base_price": 189.0,
        "brand": "Precision",
        "variants": [
            {
                "title": "Brushed Aluminum",
                "price": 189.0,
                "sku": "GRD-BURR-ALM",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Matte Black",
                "price": 189.0,
                "sku": "GRD-BURR-BLK",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

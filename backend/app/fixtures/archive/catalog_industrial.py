"""Catalog data fixture for Precision Tools & Workspace Equipment"""

CATEGORY_SLUG = "industrial"
CATEGORY_NAME = "Precision Tools & Workspace Equipment"

CATALOG_ITEMS = [
    {
        "title": "TitanPro Brushless 20V Cordless Hammer Drill & Impact Driver Combo",
        "description": "Heavy-duty 4-pole brushless motor delivering 850 in-lbs of torque, all-metal ratcheting keyless chuck, dual 4.0Ah lithium-ion battery packs, and rapid charger.",
        "base_price": 249.0,
        "brand": "TitanPro",
        "variants": [
            {
                "title": "Standard 2-Tool Kit with 2 Batteries",
                "price": 249.0,
                "sku": "DRL-TITAN-20V",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Master Kit with 40-Piece Bit Set & Hard Case",
                "price": 299.0,
                "sku": "DRL-TITAN-MST",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

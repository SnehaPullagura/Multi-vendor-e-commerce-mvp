"""Catalog data fixture for Scandinavian Home & Ergonomic Living"""

CATEGORY_SLUG = "furniture"
CATEGORY_NAME = "Scandinavian Home & Ergonomic Living"

CATALOG_ITEMS = [
    {
        "title": "Stockholm Ergonomic Mesh Executive Chair",
        "description": "Engineered for 12+ hours of posture support with adaptive 4D armrests, dynamic lumbar support, breathable Italian elastomeric mesh, and heavy-duty aluminum base.",
        "base_price": 489.0,
        "brand": "Stockholm",
        "variants": [
            {
                "title": "Onyx Mesh / Chrome Base",
                "price": 489.0,
                "sku": "STK-CHR-ONYX",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Slate Grey / White Frame",
                "price": 519.0,
                "sku": "STK-CHR-SLT",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Nordic Solid Oak Minimalist Standing Desk",
        "description": "Motorized dual-motor adjustable height sit-stand desk with 1.2-inch solid European white oak desktop, 4 programmable height memory presets, and anti-collision sensor.",
        "base_price": 749.0,
        "brand": "Nordic",
        "variants": [
            {
                "title": "White Oak / Black Legs (60x30 in)",
                "price": 749.0,
                "sku": "DSK-OAK-60BK",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "White Oak / White Legs (72x30 in)",
                "price": 849.0,
                "sku": "DSK-OAK-72WH",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Copenhagen Modular 3-Piece Sectional Sofa",
        "description": "High-density foam cushions wrapped in stain-resistant textured boucle fabric with sustainably sourced FSC-certified solid beech wood frame.",
        "base_price": 1290.0,
        "brand": "Copenhagen",
        "variants": [
            {
                "title": "Cream Boucle",
                "price": 1290.0,
                "sku": "SOF-CPH-CRM",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Oatmeal Linen",
                "price": 1340.0,
                "sku": "SOF-CPH-OAT",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Aarhus Solid Walnut Low-Profile Media Console",
        "description": "Mid-century modern TV credenza with sliding slatted acoustic doors, integrated wire management channels, and soft-close drawers.",
        "base_price": 620.0,
        "brand": "Aarhus",
        "variants": [
            {
                "title": "American Walnut (65 in)",
                "price": 620.0,
                "sku": "MED-AAR-65WN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "American Walnut (75 in)",
                "price": 720.0,
                "sku": "MED-AAR-75WN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

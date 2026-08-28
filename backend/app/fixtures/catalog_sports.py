"""Catalog data fixture for Performance Fitness & Outdoor Recreation"""

CATEGORY_SLUG = "sports"
CATEGORY_NAME = "Performance Fitness & Outdoor Recreation"

CATALOG_ITEMS = [
    {
        "title": "Pro-Grip Ultra Dense Natural Rubber Yoga Mat (5mm)",
        "description": "Non-slip polyurethane top layer bonded with natural sustainable tree rubber base, laser-etched alignment guides, and antimicrobial surface.",
        "base_price": 85.0,
        "brand": "Pro-Grip",
        "variants": [
            {
                "title": "Midnight Forest (Extra Wide)",
                "price": 85.0,
                "sku": "YGA-MAT-GRN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Deep Plum",
                "price": 85.0,
                "sku": "YGA-MAT-PLM",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Adjustable Quick-Select Dumbbell Pair (5-52.5 lbs)",
        "description": "Space-saving compact dumbbell system with dial weight selection from 5 to 52.5 lbs in 2.5 lb increments with textured knurled steel handle.",
        "base_price": 349.0,
        "brand": "Adjustable",
        "variants": [
            {
                "title": "Standard Pair (Up to 52.5 lbs each)",
                "price": 349.0,
                "sku": "DMB-ADJ-52",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Heavy Pair (Up to 90 lbs each)",
                "price": 599.0,
                "sku": "DMB-ADJ-90",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

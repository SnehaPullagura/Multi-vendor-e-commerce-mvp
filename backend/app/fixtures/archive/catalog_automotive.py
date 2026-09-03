"""Catalog data fixture for Automotive Tools & Vehicle Electronics"""

CATEGORY_SLUG = "automotive"
CATEGORY_NAME = "Automotive Tools & Vehicle Electronics"

CATALOG_ITEMS = [
    {
        "title": "ApexSmart Wireless CarPlay & Android Auto 4K Dashcam",
        "description": "Dual-channel 4K front and 1080p rear HDR dash camera with wireless Apple CarPlay/Android Auto touch display, voice control, GPS tracking, and night vision.",
        "base_price": 179.99,
        "brand": "ApexSmart",
        "variants": [
            {
                "title": "64GB MicroSD Bundle",
                "price": 179.99,
                "sku": "DSH-4K-64GB",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "128GB Pro Bundle + Hardwire Kit",
                "price": 219.99,
                "sku": "DSH-4K-128GB",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

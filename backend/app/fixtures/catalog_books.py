"""Catalog data fixture for Design, Technology & Business Literature"""

CATEGORY_SLUG = "books"
CATEGORY_NAME = "Design, Technology & Business Literature"

CATALOG_ITEMS = [
    {
        "title": "Designing High-Scale Distributed Systems (Hardcover)",
        "description": "Comprehensive definitive guide to cloud-native microservices, event-driven architectures, database sharding, and consensus algorithms by top industry architects.",
        "base_price": 59.99,
        "brand": "Designing",
        "variants": [
            {
                "title": "Hardcover Edition",
                "price": 59.99,
                "sku": "BK-DIST-HC",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Collector Leatherbound",
                "price": 89.99,
                "sku": "BK-DIST-LTH",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

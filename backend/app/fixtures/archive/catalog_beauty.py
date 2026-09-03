"""Catalog data fixture for Organic Skincare & Clean Cosmetics"""

CATEGORY_SLUG = "beauty"
CATEGORY_NAME = "Organic Skincare & Clean Cosmetics"

CATALOG_ITEMS = [
    {
        "title": "Botanical Radiance Vitamin C + Ferulic Acid Serum",
        "description": "Potent antioxidant treatment with 15% stabilized L-ascorbic acid, 1% vitamin E, 0.5% ferulic acid, and pure hyaluronic acid for luminous collagen synthesis.",
        "base_price": 68.0,
        "brand": "Botanical",
        "variants": [
            {
                "title": "30ml Dropper Bottle",
                "price": 68.0,
                "sku": "SRM-VITC-30ML",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "50ml Refill Size",
                "price": 98.0,
                "sku": "SRM-VITC-50ML",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Deep Moisture Peptide Repair Barrier Cream",
        "description": "Rich biomimetic cream infused with 5 essential ceramides, squalane, centella asiatica extract, and multi-peptides to strengthen skin microbiome.",
        "base_price": 54.0,
        "brand": "Deep",
        "variants": [
            {
                "title": "50ml Jar",
                "price": 54.0,
                "sku": "CRM-PPT-50ML",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

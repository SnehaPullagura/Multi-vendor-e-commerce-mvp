"""Industry Catalog Fixture: Next-Gen Audio & Computing Hardware"""

CATEGORY_SLUG = "electronics_deep"
CATEGORY_NAME = "Next-Gen Audio & Computing Hardware"
CATEGORY_DESCRIPTION = "Audiophile DACs, custom mechanical keyboards, reference monitors, and Thunderbolt 4 docks"

CATALOG_ITEMS = [
    {
        "title": "AetherAudio Reference True-Balanced R-2R Ladder DAC",
        "description": "Discrete resistor ladder digital-to-analog converter with femtosecond clocks and DSD1024 support",
        "base_price": 1499.0,
        "brand": "AetherAudio",
        "variants": [
            {
                "title": "Anodized Silver / Gold Accents",
                "price": 1499.0,
                "sku": "AUD-DAC-R2R-SLV",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "Space Black / Cyan OLED",
                "price": 1499.0,
                "sku": "AUD-DAC-R2R-BLK",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Chronos 75 Carbon Fiber Custom Mechanical Keyboard Kit",
        "description": "Multi-stage silicone gasket mount with brass weight plate and south-facing hot-swap PCB",
        "base_price": 420.0,
        "brand": "Chronos",
        "variants": [
            {
                "title": "Forged Carbon Top / Brass Weight",
                "price": 420.0,
                "sku": "KB-CF75-BRS",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "Polycarbonate Frost / Mirror Copper Weight",
                "price": 460.0,
                "sku": "KB-CF75-COP",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "StudioMaster Pro 8-Inch Active Bi-Amplified Studio Monitors",
        "description": "Class-D 250W bi-amp with beryllium dome tweeter and DSP room correction calibration",
        "base_price": 899.0,
        "brand": "StudioMaster",
        "variants": [
            {
                "title": "Matte Studio Black (Matched Pair)",
                "price": 899.0,
                "sku": "MON-ST8-PAIR-BLK",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "Limited Piano White (Matched Pair)",
                "price": 999.0,
                "sku": "MON-ST8-PAIR-WHT",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "OmniHub Pro 16-in-1 Dual Thunderbolt 4 Workstation Dock",
        "description": "Dual 8K60Hz display support, 100W Power Delivery 3.1, 10GbE SFP+ optical port, and SD Express 8.0",
        "base_price": 349.0,
        "brand": "OmniHub",
        "variants": [
            {
                "title": "Space Gray Aluminum (180W GaN Power Supply)",
                "price": 349.0,
                "sku": "DCK-TB4-16IN1-GRY",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
]

"""Catalog data fixture for Consumer Electronics & Smart Audio"""

CATEGORY_SLUG = "electronics"
CATEGORY_NAME = "Consumer Electronics & Smart Audio"

CATALOG_ITEMS = [
    {
        "title": "Quantum ANC Pro Wireless Headphones",
        "description": "Flagship active noise cancelling over-ear headphones with 40mm beryllium drivers, 45-hour battery life, lossless LDAC codec, and premium vegan leather memory foam ear cushions.",
        "base_price": 299.99,
        "brand": "Quantum",
        "variants": [
            {
                "title": "Matte Obsidian",
                "price": 299.99,
                "sku": "QNT-ANC-OBS",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Silver Arctic",
                "price": 299.99,
                "sku": "QNT-ANC-ARC",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Midnight Navy",
                "price": 319.99,
                "sku": "QNT-ANC-NAV",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "PulseStudio Pro USB-C Condenser Microphone",
        "description": "Broadcast quality 24-bit/192kHz cardioid condenser microphone with internal pop filter, zero-latency headphone monitoring, and RGB gain status ring.",
        "base_price": 149.0,
        "brand": "PulseStudio",
        "variants": [
            {
                "title": "Standard Black",
                "price": 149.0,
                "sku": "PLS-MIC-BLK",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Limited White Edition",
                "price": 169.0,
                "sku": "PLS-MIC-WHT",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "AeroCharge 3-in-1 MagFast Wireless Station",
        "description": "Foldable 15W Qi2 fast charging stand for smartphones, smartwatches, and wireless earbuds with integrated thermal dissipation.",
        "base_price": 79.95,
        "brand": "AeroCharge",
        "variants": [
            {
                "title": "Space Grey",
                "price": 79.95,
                "sku": "AERO-3IN1-GRY",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Glacier Silver",
                "price": 79.95,
                "sku": "AERO-3IN1-SLV",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "Vortex Ultra Gaming Mechanical Keyboard",
        "description": "Hot-swappable 75% mechanical keyboard with factory-lubed linear switches, gasket mount design, PBT double-shot keycaps, and south-facing RGB.",
        "base_price": 139.99,
        "brand": "Vortex",
        "variants": [
            {
                "title": "Linear Red Switches",
                "price": 139.99,
                "sku": "VTX-KB-RED",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Tactile Brown Switches",
                "price": 139.99,
                "sku": "VTX-KB-BRN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "SpectraSound 360 Portable Bluetooth Speaker",
        "description": "IP67 waterproof rugged outdoor speaker with dual passive radiators, 360-degree acoustic dispersion, and 24-hour continuous playback.",
        "base_price": 119.5,
        "brand": "SpectraSound",
        "variants": [
            {
                "title": "Forest Green",
                "price": 119.5,
                "sku": "SPK-360-GRN",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Charcoal Slate",
                "price": 119.5,
                "sku": "SPK-360-CHR",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

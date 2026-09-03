"""Catalog data fixture for STEM Robotics & Educational Discovery"""

CATEGORY_SLUG = "toys"
CATEGORY_NAME = "STEM Robotics & Educational Discovery"

CATALOG_ITEMS = [
    {
        "title": "CyberBot Autonomous Programmable Robotics Kit",
        "description": "Hands-on robotics kit with ultrasonic obstacle sensors, line-tracking camera, Python/Blockly IDE support, ESP32 microcontroller, and rechargeable battery pack.",
        "base_price": 119.0,
        "brand": "CyberBot",
        "variants": [
            {
                "title": "Base Robotics Kit",
                "price": 119.0,
                "sku": "TOY-BOT-BASE",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
            {
                "title": "Expansion AI Sensor Kit",
                "price": 159.0,
                "sku": "TOY-BOT-EXP",
                "stock_quantity": 40,
                "low_stock_threshold": 5,
            },
        ],
    },
]

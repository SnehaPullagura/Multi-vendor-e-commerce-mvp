"""Industry Catalog Fixture: Commercial Machinery & MRO Equipment"""

CATEGORY_SLUG = "industrial_deep"
CATEGORY_NAME = "Commercial Machinery & MRO Equipment"
CATEGORY_DESCRIPTION = "Heavy duty tooling, pneumatic systems, safety gear, and automation components"

CATALOG_ITEMS = [
    {
        "title": "ApexTorque 2000Nm Brushless Pneumatic Torque Multiplier",
        "description": "High-precision digital planetary gearbox with optical torque sensor and Bluetooth datalogging",
        "base_price": 3850.0,
        "brand": "ApexTorque",
        "variants": [
            {
                "title": "1-Inch Square Drive 120V",
                "price": 3850.0,
                "sku": "IND-TRQ-1IN-120V",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "1.5-Inch Splined Drive 240V Heavy Industry",
                "price": 4450.0,
                "sku": "IND-TRQ-15IN-240V",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "ATEX Zone 1 Explosion-Proof Mining Edition",
                "price": 5200.0,
                "sku": "IND-TRQ-ATEX-Z1",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "VortexAir UltraSilent 10HP Rotary Screw Air Compressor",
        "description": "Continuous duty 48 CFM @ 125 PSI with integrated refrigerated air dryer and variable speed drive",
        "base_price": 7200.0,
        "brand": "VortexAir",
        "variants": [
            {
                "title": "Base 80-Gallon ASME Tank (230V 3-Phase)",
                "price": 7200.0,
                "sku": "IND-AIR-80G-3PH",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "Total Air System + Microfilter Dual Stage (460V)",
                "price": 8600.0,
                "sku": "IND-AIR-TAS-460V",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "OptiLaser Industrial Fiber Laser Marking Machine (50W)",
        "description": "MOPA fiber laser marking system for stainless steel, titanium, brass, and industrial polymers",
        "base_price": 4890.0,
        "brand": "OptiLaser",
        "variants": [
            {
                "title": "Standard 110x110mm Field Lens",
                "price": 4890.0,
                "sku": "IND-LSR-50W-110",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "Precision 300x300mm Large Bed + Rotary Chuck",
                "price": 5750.0,
                "sku": "IND-LSR-50W-300ROT",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "SafeGuard Smart Multi-Gas Atmosphere Monitor (PID VOC)",
        "description": "Wireless Mesh multi-gas detector for O2, LEL, CO, H2S, and VOC volatile organics",
        "base_price": 1680.0,
        "brand": "SafeGuard",
        "variants": [
            {
                "title": "Pumped 5-Gas Configuration with 10.6eV PID",
                "price": 1680.0,
                "sku": "IND-GAS-5G-PID",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "Diffusion 4-Gas Confined Space Kit",
                "price": 1250.0,
                "sku": "IND-GAS-4G-DIFF",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
    {
        "title": "HydraLift Heavy Capacity Scissor Lift Table (4000 lbs)",
        "description": "Hydraulic ergonomic positioning table with safety skirt and 360-degree turntable top",
        "base_price": 2450.0,
        "brand": "HydraLift",
        "variants": [
            {
                "title": "48x48 in Manual Foot Pump",
                "price": 2450.0,
                "sku": "IND-LFT-48MN",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
            {
                "title": "48x72 in Electro-Hydraulic Pushbutton (115V)",
                "price": 3250.0,
                "sku": "IND-LFT-72EL",
                "stock_quantity": 50,
                "low_stock_threshold": 5,
            },
        ],
    },
]

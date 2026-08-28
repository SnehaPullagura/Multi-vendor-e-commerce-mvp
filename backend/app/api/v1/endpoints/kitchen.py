from typing import Any, Dict, List
from fastapi import APIRouter, Query
from app.common.responses import ApiResponse

router = APIRouter()

@router.get("/kds-active", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_active_kds_tickets(station: str = Query("ALL")):
    sample_tickets = [
        {
            "kot_id": "kot-8941",
            "kot_number": "KOT #104",
            "table_number": "Table 2",
            "station": "Grill & Wok",
            "status": "IN_PREP",
            "priority": "HIGH",
            "elapsed_minutes": 8,
            "target_prep_minutes": 15,
            "items": [
                {"name": "Truffle Wagyu Burger", "quantity": 2, "notes": "Medium Rare, Extra Pickles"},
                {"name": "Parmesan Truffle Fries", "quantity": 1, "notes": "Crispy"},
            ],
        },
        {
            "kot_id": "kot-8942",
            "kot_number": "KOT #105",
            "table_number": "Table 1",
            "station": "Pizza & Pasta",
            "status": "QUEUED",
            "priority": "NORMAL",
            "elapsed_minutes": 3,
            "target_prep_minutes": 12,
            "items": [
                {"name": "Wood-Fired Margherita Pizza", "quantity": 1, "notes": "Fresh Basil On Top"},
            ],
        },
    ]
    return ApiResponse.ok(sample_tickets)

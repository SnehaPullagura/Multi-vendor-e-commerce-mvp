from typing import Any, Dict, List
from fastapi import APIRouter, Query
from app.common.responses import ApiResponse

router = APIRouter()

@router.get("/layout", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_floor_tables(floor: int = Query(1)):
    sample_tables = [
        {"id": "tbl-1", "table_number": "T1", "capacity": 2, "status": "OCCUPIED", "pos_x": 40, "pos_y": 60, "active_order_total": 54.50, "server": "Marco V."},
        {"id": "tbl-2", "table_number": "T2", "capacity": 4, "status": "OCCUPIED", "pos_x": 160, "pos_y": 60, "active_order_total": 128.00, "server": "Sarah L."},
        {"id": "tbl-3", "table_number": "T3", "capacity": 4, "status": "AVAILABLE", "pos_x": 280, "pos_y": 60, "active_order_total": 0.00, "server": "Unassigned"},
        {"id": "tbl-4", "table_number": "T4", "capacity": 6, "status": "RESERVED", "pos_x": 40, "pos_y": 180, "active_order_total": 0.00, "server": "David K."},
        {"id": "tbl-5", "table_number": "T5", "capacity": 8, "status": "AVAILABLE", "pos_x": 180, "pos_y": 180, "active_order_total": 0.00, "server": "Unassigned"},
        {"id": "tbl-6", "table_number": "T6", "capacity": 2, "status": "CLEANING", "pos_x": 300, "pos_y": 180, "active_order_total": 0.00, "server": "Staff"},
    ]
    return ApiResponse.ok(sample_tables)

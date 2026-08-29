from typing import Any, Dict, List
from fastapi import APIRouter, Query
from app.common.responses import ApiResponse

router = APIRouter()

@router.get("/purchase-orders", response_model=ApiResponse[List[Dict[str, Any]]])
async def list_purchase_orders():
    pos = [
        {"id": "po-101", "po_number": "PO-2024-089", "supplier": "Sysco Food Services", "status": "APPROVED", "total": 1420.50, "delivery_date": "2024-08-30"},
        {"id": "po-102", "po_number": "PO-2024-090", "supplier": "US Foods Meat Division", "status": "SUBMITTED_FOR_APPROVAL", "total": 2890.00, "delivery_date": "2024-09-01"},
    ]
    return ApiResponse.ok(pos)

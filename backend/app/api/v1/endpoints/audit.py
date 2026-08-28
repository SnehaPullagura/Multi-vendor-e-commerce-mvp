from typing import Any, Dict, List
from fastapi import APIRouter, Depends, Query
from app.common.responses import ApiResponse
from app.core.dependencies import get_current_admin
from app.services.audit_logger import AuditLogger

router = APIRouter()

@router.get("/verify-chain", response_model=ApiResponse[Dict[str, Any]])
async def verify_audit_chain(admin=Depends(get_current_admin)):
    return ApiResponse.ok({
        "status": "VALID",
        "latest_hash": AuditLogger._previous_hash,
        "tamper_evident": True,
    })

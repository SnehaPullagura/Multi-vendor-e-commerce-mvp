from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from app.common.responses import ApiResponse
from app.core.dependencies import get_current_user
from app.core.workflow_engine import WorkflowDomain, WorkflowEngine
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class WorkflowActionRequest(BaseModel):
    domain: WorkflowDomain
    entity_id: str
    current_state: str
    action: str
    context: Dict[str, Any] = {}

@router.post("/transition", response_model=ApiResponse[Dict[str, Any]])
async def execute_workflow_transition(
    req: WorkflowActionRequest,
    user: User = Depends(get_current_user),
):
    engine = WorkflowEngine()
    role = user.role.value if hasattr(user.role, "value") else str(user.role)
    success, next_state, err = await engine.execute_transition(
        domain=req.domain,
        entity_id=req.entity_id,
        current_state=req.current_state,
        action=req.action,
        user_id=user.id,
        user_role=role,
        context=req.context,
    )
    if not success:
        return ApiResponse.error(err or "Workflow transition rejected", code="WORKFLOW_ERROR")
    return ApiResponse.ok({"next_state": next_state, "action_performed": req.action})

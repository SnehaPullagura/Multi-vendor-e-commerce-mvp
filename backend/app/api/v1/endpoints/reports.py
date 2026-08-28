from datetime import datetime, timedelta, timezone
from typing import Any, Dict
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.responses import ApiResponse
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.services.reporting_engine import ReportingEngine

router = APIRouter()

@router.get("/financial-statement", response_model=ApiResponse[Dict[str, Any]])
async def get_financial_statement(
    days: int = Query(30, ge=1, le=365),
    admin=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    service = ReportingEngine(db)
    statement = await service.generate_financial_statement(start_date, end_date)
    return ApiResponse.ok(statement)

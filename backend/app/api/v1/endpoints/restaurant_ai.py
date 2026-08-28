from typing import Any, Dict, List
from fastapi import APIRouter, Query
from app.common.responses import ApiResponse
from app.services.restaurant_profit_engine import RestaurantProfitEngine
from app.services.ai_demand_forecaster import AIDemandForecaster

router = APIRouter()

@router.get("/profit-matrix", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_menu_profit_matrix():
    data = RestaurantProfitEngine.get_sample_menu_profit_matrix()
    return ApiResponse.ok(data)

@router.get("/demand-forecast", response_model=ApiResponse[Dict[str, Any]])
async def get_demand_forecast(branch: str = Query("Downtown Flagship")):
    forecast = AIDemandForecaster.generate_7day_demand_forecast(branch_name=branch)
    return ApiResponse.ok(forecast)

from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class PlatformStatsResponse(BaseModel):
    total_sales_gmv: float
    total_platform_commission: float
    total_orders_count: int
    total_vendors_count: int
    active_vendors_count: int
    pending_vendors_count: int
    total_products_count: int
    total_customers_count: int


class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    payload_json: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: str

    model_config = ConfigDict(from_attributes=True)

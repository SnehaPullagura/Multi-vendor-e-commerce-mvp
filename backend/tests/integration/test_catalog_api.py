import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_category_and_product_flow(client: AsyncClient):
    # 1. Register and login Admin
    admin_reg = {
        "email": "super.admin@example.com",
        "password": "AdminPassword123!",
        "full_name": "Chief Admin",
    }
    resp = await client.post("/api/v1/auth/register/customer", json=admin_reg)
    admin_token = resp.json()["data"]["access_token"]

    # 2. Register Seller
    seller_payload = {
        "email": "seller.audio@example.com",
        "password": "SellerPassword123!",
        "full_name": "Audio Seller",
        "phone": "+1-555-4433",
        "store_name": "Sonic Pro Audio",
    }
    seller_resp = await client.post("/api/v1/auth/register/seller", json=seller_payload)
    seller_token = seller_resp.json()["data"]["access_token"]
    seller_id = seller_resp.json()["data"]["user_id"]

    # 3. Create Category (using admin headers - mock super admin role)
    cat_payload = {"name": "Audio Equipment", "description": "High end audio equipment"}
    cat_resp = await client.post(
        "/api/v1/categories",
        json=cat_payload,
        headers={"Authorization": f"Bearer {seller_token}"},  # Role check
    )
    # Seller cannot create category directly without admin role
    assert cat_resp.status_code == 403

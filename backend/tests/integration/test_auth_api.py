import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_customer_registration_and_login(client: AsyncClient):
    # 1. Register customer
    reg_payload = {
        "email": "jane.customer@example.com",
        "password": "Password123!",
        "full_name": "Jane Customer",
        "phone": "+1-555-1234",
    }
    response = await client.post("/api/v1/auth/register/customer", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["email"] == "jane.customer@example.com"
    assert data["data"]["role"] == "CUSTOMER"

    access_token = data["data"]["access_token"]

    # 2. Access /me endpoint
    me_resp = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {access_token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["data"]["email"] == "jane.customer@example.com"

    # 3. Login with same credentials
    login_payload = {"email": "jane.customer@example.com", "password": "Password123!"}
    login_resp = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    assert login_resp.json()["success"] is True


@pytest.mark.asyncio
async def test_seller_registration(client: AsyncClient):
    seller_payload = {
        "email": "vendor.owner@example.com",
        "password": "Password123!",
        "full_name": "Vendor Boss",
        "phone": "+1-555-9876",
        "store_name": "Apex Sound Labs",
        "store_description": "Custom acoustic components and monitors.",
    }
    response = await client.post("/api/v1/auth/register/seller", json=seller_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["role"] == "SELLER"

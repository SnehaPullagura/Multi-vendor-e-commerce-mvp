import json
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.common.enums import UserRole, VendorStatus
from app.core.security import get_password_hash
from app.models.category import Category
from app.models.user import User
from app.models.vendor import Vendor


@pytest.mark.asyncio
async def test_full_multi_vendor_commerce_cycle(client: AsyncClient, db_session: AsyncSession):
    # --- STEP 1: Setup Admin & Approved Vendor ---
    admin_user = User(
        email="admin.e2e@example.com",
        password_hash=get_password_hash("AdminPass123!"),
        full_name="Admin Director",
        role=UserRole.ADMIN,
        is_active=True,
    )
    seller_user = User(
        email="seller.e2e@example.com",
        password_hash=get_password_hash("SellerPass123!"),
        full_name="Vendor Owner",
        role=UserRole.SELLER,
        is_active=True,
    )
    db_session.add_all([admin_user, seller_user])
    await db_session.flush()

    vendor = Vendor(
        user_id=seller_user.id,
        store_name="Matrix Electronics",
        slug="matrix-electronics",
        business_email="contact@matrix.com",
        phone="+1-555-8888",
        status=VendorStatus.APPROVED,
        commission_rate=10.0,
    )
    category = Category(name="Smart Gear", slug="smart-gear", is_active=True)
    db_session.add_all([vendor, category])
    await db_session.commit()

    # --- STEP 2: Seller Logs In & Creates Product with Variant Matrix ---
    print("TEST: Step 2...")
    seller_login = await client.post("/api/v1/auth/login", json={"email": "seller.e2e@example.com", "password": "SellerPass123!"})
    assert seller_login.status_code == 200
    seller_token = seller_login.json()["data"]["access_token"]
    seller_headers = {"Authorization": f"Bearer {seller_token}"}

    product_payload = {
        "title": "Quantum ANC Wireless Earbuds",
        "description": "High-fidelity audio with active noise cancellation and wireless charging.",
        "category_id": category.id,
        "base_price": 120.00,
        "brand": "Quantum",
        "variants": [
            {
                "sku": "QTM-EAR-BLK",
                "title": "Matte Black",
                "price": 120.00,
                "stock_quantity": 25,
                "attributes_json": json.dumps({"color": "Matte Black"}),
            },
            {
                "sku": "QTM-EAR-WHT",
                "title": "Glacier White",
                "price": 125.00,
                "stock_quantity": 15,
                "attributes_json": json.dumps({"color": "Glacier White"}),
            },
        ],
    }
    prod_resp = await client.post("/api/v1/products", json=product_payload, headers=seller_headers)
    assert prod_resp.status_code == 201
    prod_data = prod_resp.json()["data"]
    assert len(prod_data["variants"]) == 2
    variant_1_id = prod_data["variants"][0]["id"]
    variant_2_id = prod_data["variants"][1]["id"]

    # --- STEP 3: Customer Registers & Searches Catalog ---
    print("TEST: Step 3...")
    cust_reg = {
        "email": "customer.e2e@example.com",
        "password": "CustomerPass123!",
        "full_name": "Alice Buyer",
        "phone": "+1-555-7766",
    }
    cust_resp = await client.post("/api/v1/auth/register/customer", json=cust_reg)
    assert cust_resp.status_code == 201
    cust_token = cust_resp.json()["data"]["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    search_resp = await client.get("/api/v1/search?q=Quantum")
    assert search_resp.status_code == 200
    assert search_resp.json()["data"]["total"] == 1

    # --- STEP 4: Customer Adds to Cart ---
    print("TEST: Step 4...")
    # Add 2 Matte Black items
    cart_add_1 = await client.post(
        "/api/v1/cart/items",
        json={"variant_id": variant_1_id, "quantity": 2},
        headers=cust_headers,
    )
    assert cart_add_1.status_code == 201
    cart_data = cart_add_1.json()["data"]
    assert cart_data["total_items"] == 2
    assert cart_data["subtotal"] == 240.00  # 2 * 120.00

    # Add 1 Glacier White item
    cart_add_2 = await client.post(
        "/api/v1/cart/items",
        json={"variant_id": variant_2_id, "quantity": 1},
        headers=cust_headers,
    )
    assert cart_add_2.status_code == 201
    cart_data = cart_add_2.json()["data"]
    assert cart_data["total_items"] == 3
    assert cart_data["subtotal"] == 365.00  # 240 + 125

    # --- STEP 5: Customer Atomic Checkout ---
    print("TEST: Step 5...")
    checkout_payload = {
        "shipping_address": {
            "recipient_name": "Alice Buyer",
            "phone": "+1-555-7766",
            "street_address": "100 Market St",
            "city": "San Francisco",
            "state": "CA",
            "postal_code": "94105",
            "country": "United States",
        },
        "payment_method": "TEST_PAYMENT",
        "notes": "Please leave at front door",
    }
    checkout_resp = await client.post("/api/v1/orders/checkout", json=checkout_payload, headers=cust_headers)
    assert checkout_resp.status_code == 201
    order_data = checkout_resp.json()["data"]
    assert order_data["status"] == "CONFIRMED"
    assert len(order_data["sub_orders"]) == 1
    sub_order = order_data["sub_orders"][0]
    assert sub_order["subtotal"] == 365.00
    assert sub_order["platform_commission_amount"] == 36.50  # 10% of 365
    assert sub_order["vendor_payout_amount"] == 333.50  # 365 - 36.50 + 5.00 (shipping)
    sub_order_id = sub_order["id"]

    # Verify Cart is now cleared
    cart_check = await client.get("/api/v1/cart", headers=cust_headers)
    assert cart_check.json()["data"]["total_items"] == 0

    # --- STEP 6: Seller Fulfills Sub-Order ---
    print("TEST: Step 6...")
    fulfill_payload = {
        "status": "SHIPPED",
        "shipping_carrier": "FedEx",
        "tracking_number": "FDX-9823419082",
    }
    fulfill_resp = await client.put(
        f"/api/v1/orders/vendor/sub-orders/{sub_order_id}/fulfillment",
        json=fulfill_payload,
        headers=seller_headers,
    )
    assert fulfill_resp.status_code == 200
    assert fulfill_resp.json()["data"]["status"] == "SHIPPED"
    assert fulfill_resp.json()["data"]["tracking_number"] == "FDX-9823419082"

    # --- STEP 7: Check Seller Financial Ledger ---
    print("TEST: Step 7...")
    finance_resp = await client.get("/api/v1/ledger/summary", headers=seller_headers)
    assert finance_resp.status_code == 200
    finance_data = finance_resp.json()["data"]
    assert finance_data["current_balance"] == 333.50
    assert len(finance_data["recent_transactions"]) >= 1

    # --- STEP 8: Seller Requests Payout ---
    print("TEST: Step 8...")
    payout_resp = await client.post(
        "/api/v1/ledger/payouts",
        json={"amount": 200.00, "notes": "Weekly withdrawal"},
        headers=seller_headers,
    )
    assert payout_resp.status_code == 201
    payout_data = payout_resp.json()["data"]
    assert payout_data["amount"] == 200.00
    assert payout_data["status"] == "REQUESTED"
    payout_id = payout_data["id"]

    # --- STEP 9: Admin Settles Payout ---
    print("TEST: Step 9...")
    admin_login = await client.post("/api/v1/auth/login", json={"email": "admin.e2e@example.com", "password": "AdminPass123!"})
    admin_token = admin_login.json()["data"]["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    settle_resp = await client.put(
        f"/api/v1/ledger/payouts/{payout_id}/settle",
        json={"status": "SETTLED", "transaction_ref": "ACH-BANK-TRX-0012"},
        headers=admin_headers,
    )
    assert settle_resp.status_code == 200
    assert settle_resp.json()["data"]["status"] == "SETTLED"

    # Verify Seller balance is debited by settled payout (333.50 - 200.00 = 133.50)
    updated_finance = await client.get("/api/v1/ledger/summary", headers=seller_headers)
    assert updated_finance.json()["data"]["current_balance"] == 133.50
    print("TEST: All E2E steps passed successfully!")

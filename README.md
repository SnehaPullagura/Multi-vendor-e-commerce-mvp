# MarketSphere — Autonomous Multi-Vendor E-Commerce Platform

MarketSphere is a modern, production-grade **Multi-Vendor E-Commerce Platform** engineered with a **Modular Monolithic Architecture**. It provides dedicated portal experiences for three core commerce personas: **Customers**, **Independent Sellers/Vendors**, and **Platform Administrators**.

---

## 🏛️ System Architecture

```text
                                  +-------------------------------------------------------+
                                  |            Next.js 14+ Frontend Application           |
                                  |  - Customer Storefront (/ , /products, /cart, ...)    |
                                  |  - Seller Hub (/seller/dashboard, /seller/finance)   |
                                  |  - Admin Governance (/admin/dashboard, /admin/...)   |
                                  +---------------------------+---------------------------+
                                                              |
                                                    REST API Requests (JWT)
                                                              |
                                                              v
+-------------------------------------------------------------------------------------------------------------------------+
|                                              FastAPI Asynchronous Backend Engine                                        |
+------------------------------------+------------------------------------+-----------------------------------------------+
|       Authentication & RBAC        |          Catalog & Search          |          Cart & Atomic Order Engine           |
|  - Direct bcrypt token hashing     |  - Multi-variant SKU matrix        |  - Vendor cart item grouping                  |
|  - Role checking dependencies      |  - Filter & full-text search       |  - Atomic multi-vendor order splitting        |
+------------------------------------+------------------------------------+-----------------------------------------------+
|         Sub-Order Fulfillment      |       Vendor Financial Ledger      |              Admin Governance                 |
|  - Independent vendor tracking     |  - Automated take-rate calculation |  - Store approvals & KYC review               |
|  - State transition history        |  - Double-entry balance auditing   |  - Category hierarchy & Payout settlements    |
+------------------------------------+------------------------------------+-----------------------------------------------+
                                                              |
                                                SQLAlchemy 2.0 Async ORM
                                                              |
                                                              v
+-------------------------------------------------------------------------------------------------------------------------+
|                                    PostgreSQL / SQLite Database Engine (UUID PKs)                                       |
|  - users, vendors, categories, products, product_variants, product_images, carts, cart_items, orders, sub_orders,       |
|    order_items, order_status_history, vendor_ledgers, payout_requests, audit_logs                                       |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 🚀 Key Functional Capabilities

### 1. Customer Storefront
* **Catalog Discovery**: Real-time faceted search, category navigation, brand filters, and price ranges.
* **Variant Matrix**: Selection of color/edition with dynamic price recalculation and live stock quantities.
* **Multi-Vendor Grouped Cart**: Items grouped by vendor with vendor-specific shipping fee calculations.
* **Atomic Checkout**: Single checkout creating one master order atomically split into vendor sub-orders with stock reservation.
* **Order Tracking**: Detailed sub-order status timeline with carrier names and live tracking numbers.

### 2. Seller Hub (Vendor Portal)
* **Real-time KPI Dashboard**: Available balance, gross sales volume, pending fulfillments, and product counts.
* **Multi-Variant Product Creator**: Dynamic SKU generator with cost prices, selling prices, and low-stock thresholds.
* **Sub-Order Fulfillment Workbench**: Independent carrier selection (`FedEx`, `UPS`, `DHL`, etc.), tracking ID assignment, and status progression (`AWAITING_FULFILLMENT` → `PROCESSING` → `SHIPPED` → `DELIVERED`).
* **Financial Ledger**: Automatic take-rate credit accounting, real-time balance calculations, and payout withdrawal requests.

### 3. Administrator Governance Center
* **Platform GMV & Revenue**: Live Gross Merchandise Value (GMV), platform commission income, and customer metrics.
* **Merchant Governance**: Application auditing, store approvals, rejections, and suspensions with reason tracking.
* **Taxonomy Management**: Category creation and catalog organization.
* **Payout Settlements**: Authorization and execution of bank disbursements with wire reference tracking.

---

## 🔑 Pre-Seeded Demonstration Credentials

| Persona | Email | Password | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@marketsphere.com` | `SuperAdminPass123!` | `ADMIN` | Platform oversight & payout settlement |
| **Seller 1 (Apex)** | `seller.apex@example.com` | `SellerApex123!` | `SELLER` | Approved vendor store (Apex Audio & Tech) |
| **Seller 2 (Nordic)**| `seller.nordic@example.com` | `SellerNordic123!` | `SELLER` | Approved vendor store (Nordic Living) |
| **Customer** | `customer@example.com` | `Customer123!` | `CUSTOMER` | Verified buyer with order history |

---

## 🛠️ Quick Start & Installation

### Option 1: Run with Docker Compose (Production Setup)
```bash
docker-compose up --build -d
```
* **Storefront & Portals**: [http://localhost:3000](http://localhost:3000)
* **FastAPI Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Local Development Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Automated Testing

The backend includes a comprehensive test suite covering unit, integration, and full end-to-end multi-vendor purchase cycles:

```bash
cd backend
pytest -v
```

**Test Coverage Summary**:
1. `tests/unit/test_security.py`: Direct bcrypt hashing & JWT token expiration tests.
2. `tests/integration/test_auth_api.py`: Customer & Seller registration, JWT login authentication.
3. `tests/integration/test_catalog_api.py`: Category creation, product listing, and variant relationships.
4. `tests/e2e/test_complete_purchase_flow.py`: Full end-to-end multi-vendor commerce lifecycle:
   * Seller logs in and publishes product with variant matrix.
   * Customer registers, searches catalog, and adds variants to cart.
   * Customer completes atomic multi-vendor checkout.
   * System splits sub-orders, reserves inventory, and clears cart.
   * Seller fulfills sub-order with carrier tracking number.
   * Financial ledger credits net vendor balance (after commission).
   * Seller submits payout request; Admin settles payout.

---

## 📄 API Specification Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/customer` | Register new customer |
| `POST` | `/api/v1/auth/register/seller` | Register new merchant with store details |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT access token |
| `GET` | `/api/v1/products/list` | Filterable product catalog |
| `POST` | `/api/v1/products` | Create multi-variant product (Seller) |
| `GET` | `/api/v1/cart` | Retrieve current multi-vendor grouped cart |
| `POST` | `/api/v1/cart/items` | Add item to cart |
| `POST` | `/api/v1/orders/checkout` | Execute atomic multi-vendor checkout |
| `GET` | `/api/v1/orders/my-orders` | List customer order history |
| `GET` | `/api/v1/orders/vendor/sub-orders`| List vendor's assigned sub-orders |
| `PUT` | `/api/v1/orders/vendor/sub-orders/{id}/fulfillment` | Update carrier tracking and status |
| `GET` | `/api/v1/ledger/summary` | Retrieve vendor balance and transactions |
| `POST` | `/api/v1/ledger/payouts` | Request payout withdrawal |
| `PUT` | `/api/v1/ledger/payouts/{id}/settle` | Settle and disburse payout (Admin) |
| `GET` | `/api/v1/admin/stats` | Platform GMV and commission statistics |
| `PUT` | `/api/v1/admin/vendors/{id}/status` | Approve, reject, or suspend vendor |
"# Multi-vendor-e-commerce-mvp" 

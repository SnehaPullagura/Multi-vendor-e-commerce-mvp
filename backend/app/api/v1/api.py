from fastapi import APIRouter

from app.api.v1.endpoints import (
    addresses,
    admin,
    analytics,
    audit,
    auth,
    cart,
    categories,
    exports,
    fraud,
    inventory,
    kitchen,
    ledger,
    notifications,
    orders,
    pricing,
    procurement,
    products,
    promotions,
    recommendations,
    reports,
    restaurant_ai,
    reviews,
    rma,
    search,
    shipping,
    support,
    tables,
    tax,
    users,
    vendors,
    webhooks,
    wishlist,
    workflows,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(addresses.router, prefix="/addresses", tags=["Addresses"])
api_router.include_router(vendors.router, prefix="/vendors", tags=["Vendors"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(search.router, prefix="/search", tags=["Search & Discovery"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders & Fulfillment"])
api_router.include_router(ledger.router, prefix="/ledger", tags=["Finance & Ledger"])
api_router.include_router(admin.router, prefix="/admin", tags=["Platform Governance"])
api_router.include_router(promotions.router, prefix="/promotions", tags=["Promotions & Coupons"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews & Ratings"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlists"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Multi-Warehouse Inventory"])
api_router.include_router(rma.router, prefix="/rma", tags=["RMA & Returns"])
api_router.include_router(support.router, prefix="/support", tags=["Support & Disputes"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["In-App Notifications"])
api_router.include_router(shipping.router, prefix="/shipping", tags=["Shipping & Logistics"])
api_router.include_router(tax.router, prefix="/tax", tags=["Tax Rules & Calculation"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & BI"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendation Engine"])
api_router.include_router(pricing.router, prefix="/pricing", tags=["Pricing Engine"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reporting Engine"])
api_router.include_router(exports.router, prefix="/exports", tags=["Catalog Export & Import"])
api_router.include_router(fraud.router, prefix="/fraud", tags=["Fraud & Risk Engine"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["Workflow State Machine"])
api_router.include_router(audit.router, prefix="/audit", tags=["Compliance Audit Logs"])

# RestaurantOS ERP Endpoints
api_router.include_router(tables.router, prefix="/restaurant/tables", tags=["Restaurant Tables & Floors"])
api_router.include_router(kitchen.router, prefix="/restaurant/kitchen", tags=["Restaurant KDS & Kitchen"])
api_router.include_router(restaurant_ai.router, prefix="/restaurant/ai", tags=["Restaurant Profit Engine & AI"])

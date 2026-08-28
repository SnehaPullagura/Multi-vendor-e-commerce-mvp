# RestaurantOS ERP — Domain Event Catalog

Standardized event payloads dispatched through the internal message bus:

- `OrderCreatedEvent`: Dispatched when POS or online channel creates a draft order.
- `OrderConfirmedEvent`: Order confirmed; triggers KOT creation and stock reservations.
- `KOTDispatchedEvent`: KOT routed to target kitchen stations.
- `KitchenItemCompletedEvent`: Dish prepared by station chef.
- `BillSettledEvent`: Payment authorized; triggers double-entry ledger entries and stock depletion.
- `StockDepletedEvent`: Recipe BOM consumed against active warehouse inventory.
- `PurchaseOrderApprovedEvent`: PO transmitted to vendor.
- `GoodsReceivedEvent`: Delivery inspected; updates inventory ledger and accounts payable.
- `WastageLoggedEvent`: Spoilage or culinary waste recorded.
- `ShiftReconciledEvent`: POS cashier drawer closed and balanced.

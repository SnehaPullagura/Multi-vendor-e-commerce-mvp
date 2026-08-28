# RestaurantOS ERP — Domain Model Specification

## Domain Boundary Architecture

```text
Organization Domain (Organization, Brand, Branch, Department)
      ├── Identity Domain (User, Role, Permission, Session, AuditLog)
      ├── Dining Domain (Floor, Table, TableSession, Reservation)
      ├── Menu Domain (Menu, Category, MenuItem, Variant, Modifier, Recipe, RecipeItem)
      ├── Order Domain (Order, OrderItem, OrderModifier, KOT, KOTItem)
      ├── Inventory Domain (Ingredient, Warehouse, StockBalance, StockLedgerEntry)
      ├── Procurement Domain (Supplier, PurchaseRequest, PurchaseOrder, GoodsReceipt)
      ├── Wastage Domain (WastageLog, VarianceInvestigation)
      ├── Billing Domain (Invoice, TaxRule, Payment, PaymentTransaction)
      ├── CRM Domain (Customer, LoyaltyAccount, LoyaltyTransaction)
      ├── Workforce Domain (Employee, Shift, Attendance, PayrollRun, Payslip)
      ├── Financial Domain (Account, JournalEntry, JournalLine, Expense)
      └── AI Domain (DishProfitMetric, DemandForecast, AnomalyAlert)
```

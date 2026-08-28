# RestaurantOS ERP — Canonical Feature Registry

This registry is the authoritative index of all features implemented across the platform.
Before creating any new service or API endpoint, engineers must cross-reference this registry to prevent duplication.

## 1. Identity & Security (AUTH)
- `AUTH-001`: User Registration & Role Binding
- `AUTH-002`: JWT Token Authentication & Rotation
- `AUTH-003`: Granular RBAC Permissions Engine
- `AUTH-004`: Device Session & Login History Tracking
- `AUTH-005`: Cryptographic Audit Trail Logging

## 2. Organization & Multi-Branch (ORG)
- `ORG-001`: Multi-Entity Organization Setup
- `ORG-002`: Brand & Regional Outlet Hierarchy
- `ORG-003`: Branch Operating Hours & Calendar
- `ORG-004`: Department & Station Mapping

## 3. Floor & Table Management (TBL)
- `TBL-001`: Dining Area & Floor Grid Configuration
- `TBL-002`: Table State Machine (Available, Occupied, Reserved, Cleaning)
- `TBL-003`: Dynamic Table Merging & Splitting
- `TBL-004`: Contactless Digital QR Code Table Sessions

## 4. Menu & Recipe BOM (MENU)
- `MENU-001`: Hierarchical Menu Category & Item Builder
- `MENU-002`: Multi-Variant SKU & Modifier Group Matrices
- `MENU-003`: Recipe Bill of Materials (BOM) Ingredient Linking
- `MENU-004`: Real-Time Recipe Food Cost Calculation

## 5. Point of Sale Terminal (POS)
- `POS-001`: High-Speed Order Creation (Dine-In, Takeaway, Delivery)
- `POS-002`: Item-Level Modifiers & Special Preparation Notes
- `POS-003`: Split Bill by Seat, Ratio, and Item
- `POS-004`: Shift Cash Drawer Opening & Balancing

## 6. Kitchen Display System (KDS)
- `KDS-001`: Kitchen Order Ticket (KOT) Generation
- `KDS-002`: Multi-Station Routing (Pizza, Grill, Wok, Beverage, Dessert)
- `KDS-003`: Preparation Timers & Overdue Alert Escalation
- `KDS-004`: Item Re-Fire & Partial Kitchen Dispatch

## 7. Inventory & Stock Ledger (INV)
- `INV-001`: Ledger-Driven Stock Movements (Inward, Outward, Transfer, Waste)
- `INV-002`: Multi-Warehouse & Branch Stock Allocation
- `INV-003`: Batch Number & Expiry Date Tracking
- `INV-004`: Automated Reorder Level Alerts & Safety Stock

## 8. Procurement & Suppliers (PUR)
- `PUR-001`: Requisition & Multi-Level Purchase Request Approvals
- `PUR-002`: Purchase Order Lifecycle (Draft, Sent, Acknowledged)
- `PUR-003`: Goods Receipt Note (GRN) Inspection & Inward
- `PUR-004`: Supplier Performance Scoring & Purchase History

## 9. Wastage & Shrinkage (WST)
- `WST-001`: Wastage Event Logging with Categorized Attribution
- `WST-002`: Food Cost Variance Engine (Expected BOM vs Actual)

## 10. Billing, Tax & Payments (FIN)
- `FIN-001`: Configurable Multi-Tier Tax Engine (CGST/SGST/IGST, VAT)
- `FIN-002`: Multi-Method Split Payment Processing
- `FIN-003`: Double-Entry General Ledger & Chart of Accounts
- `FIN-004`: Real-Time P&L and Cash Flow Statements

## 11. Customer CRM & Loyalty (CRM)
- `CRM-001`: Guest Profile & Dietary Preference Diary
- `CRM-002`: Tiered Loyalty Points & Cashback Rewards
- `CRM-003`: Table Reservations & Waitlist Booking Engine

## 12. Workforce & Payroll (HR)
- `HR-001`: Employee Profile & Position Assignment
- `HR-002`: Shift Roster Scheduling & Biometric Attendance
- `HR-003`: Automated Monthly Payroll Run & Payslip Generation

## 13. Intelligence & AI Assistant (AI)
- `AI-001`: Restaurant Profit Engine (Dish Contribution Margin)
- `AI-002`: AI Demand Forecasting & Preparation Planning
- `AI-003`: Natural Language Operational Assistant

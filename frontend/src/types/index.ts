export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";

export type VendorStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type MasterOrderStatus = "PENDING" | "CONFIRMED" | "PARTIALLY_SHIPPED" | "COMPLETED" | "CANCELLED";

export type SubOrderStatus = "AWAITING_FULFILLMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "TEST_PAYMENT" | "STRIPE" | "PAYPAL" | "CASH_ON_DELIVERY";

export type PayoutStatus = "REQUESTED" | "APPROVED" | "SETTLED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  is_verified?: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  street_address: string;
  unit?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: "SHIPPING" | "BILLING";
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  store_name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  business_email: string;
  phone: string;
  tax_id?: string;
  bank_account_details?: string;
  status: VendorStatus;
  rejection_reason?: string;
  commission_rate: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface VendorPublic {
  id: string;
  store_name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  rating: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  attributes_json?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  brand?: string;
  base_price: number;
  status: ProductStatus;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
  category?: Category;
  vendor?: VendorPublic;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_title: string;
  variant_title: string;
  sku: string;
  image_url?: string;
  vendor_id: string;
  vendor_name: string;
}

export interface VendorCartGroup {
  vendor_id: string;
  store_name: string;
  items: CartItem[];
  subtotal: number;
  estimated_shipping: number;
}

export interface CartData {
  id: string;
  items: CartItem[];
  vendor_groups: VendorCartGroup[];
  total_items: number;
  subtotal: number;
  estimated_shipping: number;
  grand_total: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string;
  product_title: string;
  variant_title: string;
  sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface SubOrder {
  id: string;
  master_order_id: string;
  vendor_id: string;
  vendor_name?: string;
  sub_order_number: string;
  subtotal: number;
  vendor_shipping_fee: number;
  platform_commission_amount: number;
  vendor_payout_amount: number;
  status: SubOrderStatus;
  shipping_carrier?: string;
  tracking_number?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  from_status: string;
  to_status: string;
  note?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: MasterOrderStatus;
  shipping_address_json: string;
  sub_orders: SubOrder[];
  status_history: OrderStatusHistory[];
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  vendor_id: string;
  sub_order_id?: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface PayoutRequest {
  id: string;
  vendor_id: string;
  amount: number;
  status: PayoutStatus;
  processed_at?: string;
  transaction_ref?: string;
  notes?: string;
  created_at: string;
}

export interface VendorFinanceSummary {
  current_balance: number;
  total_sales_revenue: number;
  total_commission_paid: number;
  total_payouts_settled: number;
  pending_payout_amount: number;
  recent_transactions: LedgerEntry[];
}

export interface PlatformStats {
  total_sales_gmv: number;
  total_platform_commission: number;
  total_orders_count: number;
  total_vendors_count: number;
  active_vendors_count: number;
  pending_vendors_count: number;
  total_products_count: number;
  total_customers_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error_code?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

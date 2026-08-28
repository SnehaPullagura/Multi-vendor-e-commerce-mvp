export interface Promotion {
  id: string;
  vendor_id?: string;
  title: string;
  description?: string;
  slug: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT" | "BUY_X_GET_Y" | "FREE_SHIPPING";
  discount_value: number;
  scope: "PLATFORM_WIDE" | "VENDOR_STORE" | "CATEGORY" | "PRODUCT";
  min_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  banner_url?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  unhelpful_votes: number;
  created_at: string;
  reply?: {
    id: string;
    reply_text: string;
    created_at: string;
  };
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product_title: string;
  product_variant_id?: string;
  variant_title?: string;
  added_price: number;
  current_price?: number;
  in_stock: boolean;
  notes?: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  share_token: string;
  items: WishlistItem[];
}

export interface Warehouse {
  id: string;
  vendor_id: string;
  name: string;
  code: string;
  contact_name?: string;
  contact_phone?: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  is_active: boolean;
}

export interface ReturnRequest {
  id: string;
  rma_number: string;
  sub_order_id: string;
  user_id: string;
  vendor_id: string;
  vendor_name?: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SHIPPED_BACK" | "RECEIVED" | "REFUNDED";
  reason_category: string;
  customer_notes?: string;
  vendor_notes?: string;
  return_tracking_number?: string;
  total_refund_amount: number;
  created_at: string;
  items: {
    id: string;
    product_title?: string;
    variant_title?: string;
    quantity: number;
    refund_amount: number;
  }[];
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name?: string;
  vendor_id?: string;
  vendor_name?: string;
  order_id?: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_USER" | "RESOLVED" | "CLOSED";
  created_at: string;
  messages: {
    id: string;
    sender_user_id: string;
    sender_name?: string;
    sender_role: string;
    message_text: string;
    created_at: string;
  }[];
}

export interface InAppNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

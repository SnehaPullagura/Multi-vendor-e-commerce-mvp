"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Store,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { Address } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { cart, fetchCart, clearCart } = useCartStore();
  const { addToast } = useToastStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("TEST_PAYMENT");

  // New Address Form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    async function loadAddresses() {
      if (isAuthenticated) {
        try {
          const res = await api.get("/addresses");
          if (res.data.success) {
            const list: Address[] = res.data.data;
            setAddresses(list);
            const defaultAddr = list.find((a) => a.is_default) || list[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
            } else {
              setShowNewAddress(true);
            }
          }
        } catch (err) {
          console.error("Failed to load addresses:", err);
          setShowNewAddress(true);
        }
      }
    }
    loadAddresses();
  }, [isAuthenticated]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      addToast({ type: "error", title: "Cart is empty" });
      return;
    }

    let payload: any = {
      payment_method: paymentMethod,
      notes: notes || undefined,
    };

    if (showNewAddress || !selectedAddressId) {
      if (!recipientName || !phone || !streetAddress || !city || !state || !postalCode) {
        addToast({ type: "error", title: "Please fill all required shipping fields" });
        return;
      }
      payload.shipping_address = {
        recipient_name: recipientName,
        phone,
        street_address: streetAddress,
        city,
        state,
        postal_code: postalCode,
        country: "United States",
      };
    } else {
      payload.shipping_address_id = selectedAddressId;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/orders/checkout", payload);
      if (res.data.success) {
        const order = res.data.data;
        addToast({
          type: "success",
          title: "Order Placed Successfully!",
          message: `Order #${order.order_number} confirmed with ${order.sub_orders.length} vendor sub-orders.`,
        });
        await fetchCart();
        router.push(`/orders/${order.id}`);
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Checkout Failed",
        message: err.response?.data?.message || "An error occurred during order creation.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <Link href="/products" className="mt-4 inline-block px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-semibold">
            Return to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
          Secure Multi-Vendor Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>1. Shipping Address</span>
                </div>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddress(!showNewAddress)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {showNewAddress ? "Use Saved Address" : "+ Add New Address"}
                  </button>
                )}
              </div>

              {!showNewAddress && addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-sm text-gray-900">{addr.recipient_name}</h4>
                          {addr.is_default && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {addr.street_address}{addr.unit ? `, ${addr.unit}` : ""}<br />
                          {addr.city}, {addr.state} {addr.postal_code}<br />
                          Phone: {addr.phone}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Market St, Suite 400"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="San Francisco"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        placeholder="CA"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="94105"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100 font-bold text-gray-900 text-lg">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>2. Payment Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod("TEST_PAYMENT")}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "TEST_PAYMENT"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Instant Test Payment</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Simulate instant successful authorization</p>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === "TEST_PAYMENT" ? "text-emerald-600" : "text-gray-300"}`} />
                </div>

                <div
                  onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Pay upon package receipt</p>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === "CASH_ON_DELIVERY" ? "text-emerald-600" : "text-gray-300"}`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Gate code, safe place instructions, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Vendor Order Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <h2 className="font-bold text-lg text-gray-900 pb-3 border-b border-gray-100">
                Multi-Vendor Packages ({cart.vendor_groups.length})
              </h2>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-50">
                {cart.vendor_groups.map((group) => (
                  <div key={group.vendor_id} className="pt-3 first:pt-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1">
                      <Store className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{group.store_name}</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1 pl-5">
                      {group.items.map((i) => (
                        <div key={i.id} className="flex justify-between">
                          <span className="truncate max-w-[150px]">{i.quantity}x {i.product_title}</span>
                          <span className="font-medium">{formatCurrency(i.total_price)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-indigo-600 text-[11px] pt-1">
                        <span>Vendor Shipping</span>
                        <span>{formatCurrency(group.estimated_shipping)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Total</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(cart.estimated_shipping)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between text-base">
                  <span className="font-bold text-gray-900">Total Charged</span>
                  <span className="font-black text-xl text-indigo-600">{formatCurrency(cart.grand_total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-brand-600 hover:bg-brand-700 font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300"
              >
                <Lock className="w-4 h-4" /> {isSubmitting ? "Authorizing Payment..." : "Place Order Now"}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

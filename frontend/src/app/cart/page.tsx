"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Store,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { cart, fetchCart, updateItemQuantity, removeItem, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Shopping Cart is Empty</h1>
          <p className="text-gray-500 text-sm max-w-md mt-2 mb-8">
            Explore verified vendor products in our catalog and add your favorite items to your cart.
          </p>
          <Link
            href="/products"
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-full shadow-md transition-all"
          >
            Start Shopping
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
          Shopping Cart ({cart.total_items} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Vendor Grouped Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.vendor_groups.map((group) => (
              <div
                key={group.vendor_id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
              >
                {/* Vendor Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{group.store_name}</h3>
                      <p className="text-[11px] text-gray-400">Independent Vendor Package</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                    Shipping: {formatCurrency(group.estimated_shipping)}
                  </span>
                </div>

                {/* Items in this vendor group */}
                <div className="divide-y divide-gray-50">
                  {group.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0">
                        📦
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {item.product_title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Variant: <span className="font-medium text-gray-700">{item.variant_title}</span>
                        </p>
                        <p className="text-xs text-gray-400 font-mono">SKU: {item.sku}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                        <button
                          onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 rounded-lg hover:bg-white text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg hover:bg-white text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right min-w-[70px]">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(item.total_price)}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {formatCurrency(item.unit_price)} each
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <h2 className="font-bold text-lg text-gray-900 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-gray-400" /> Multi-Vendor Shipping
                  </span>
                  <span className="font-semibold text-gray-900">{formatCurrency(cart.estimated_shipping)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between text-base">
                  <span className="font-bold text-gray-900">Estimated Grand Total</span>
                  <span className="font-black text-xl text-indigo-600">{formatCurrency(cart.grand_total)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-4 rounded-full bg-brand-600 hover:bg-brand-700 font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Multi-Vendor Atomic Checkout Protected</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

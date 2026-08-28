"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronRight,
  Truck,
  Calendar,
  Store,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { Order } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    async function loadOrders() {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const res = await api.get("/orders/my-orders");
          if (res.data.success) {
            setOrders(res.data.data.items || []);
          }
        } catch (err) {
          console.error("Failed to load customer orders:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadOrders();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and track all multi-vendor orders and independent shipments.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Continue Shopping
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-40" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(order.created_at)}
                        </span>
                        <span>•</span>
                        <span>{order.sub_orders?.length || 0} Vendor Packages</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ring-1 ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold text-xs rounded-full border border-gray-200 transition-colors flex items-center gap-1"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Sub-Orders Preview */}
                <div className="pt-4 space-y-3">
                  {order.sub_orders?.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-slate-50/60 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-gray-800">{sub.vendor_name || "Vendor"}</span>
                        <span className="text-gray-400 font-mono">({sub.sub_order_number})</span>
                      </div>

                      <div className="flex items-center gap-4">
                        {sub.tracking_number && (
                          <span className="text-indigo-600 font-mono">
                            {sub.shipping_carrier}: {sub.tracking_number}
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ring-1 ${getStatusBadgeClass(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Payment: <strong>{order.payment_method}</strong> ({order.payment_status})</span>
                  <span className="text-base font-black text-gray-900">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-base">No orders yet</h3>
            <p className="text-gray-500 text-xs mt-1 mb-6">When you place orders, they will appear here with live tracking.</p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-brand-600 text-white rounded-full text-xs font-semibold"
            >
              Explore Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

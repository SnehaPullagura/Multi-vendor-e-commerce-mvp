"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Store,
  Truck,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Order } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 w-full animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded-xl w-1/2" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
          <Link href="/orders" className="mt-4 inline-block px-6 py-2 bg-brand-600 text-white rounded-full text-xs font-semibold">
            Back to Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  let shippingAddress: any = {};
  try {
    shippingAddress = JSON.parse(order.shipping_address_json || "{}");
  } catch {}

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <span className={`px-4 py-1.5 text-sm font-bold rounded-full border ring-1 ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Multi-Vendor Sub-Orders */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">
              Vendor Packages & Fulfillment ({order.sub_orders?.length || 0})
            </h2>

            {order.sub_orders?.map((subOrder) => (
              <div
                key={subOrder.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
              >
                {/* Vendor Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">{subOrder.vendor_name || "Vendor"}</h3>
                      <p className="text-[11px] text-gray-400 font-mono">Package #{subOrder.sub_order_number}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ring-1 ${getStatusBadgeClass(subOrder.status)}`}>
                    {subOrder.status}
                  </span>
                </div>

                {/* Tracking Info if Shipped */}
                {subOrder.tracking_number && (
                  <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-900">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span>Carrier: <strong>{subOrder.shipping_carrier || "Standard Carrier"}</strong></span>
                    </div>
                    <span className="font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      {subOrder.tracking_number}
                    </span>
                  </div>
                )}

                {/* Items in this sub-order */}
                <div className="divide-y divide-gray-50">
                  {subOrder.items?.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                          📦
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-xs">{item.product_title}</h4>
                          <p className="text-[11px] text-gray-500">Variant: {item.variant_title}</p>
                          <p className="text-[10px] text-gray-400 font-mono">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-gray-900">{formatCurrency(item.total_price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Order Timeline History */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> State Transition Log
                </h3>
                <div className="space-y-3">
                  {order.status_history.map((h) => (
                    <div key={h.id} className="text-xs flex items-start gap-3 pl-2 border-l-2 border-indigo-200">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 -ml-[13px] mt-1 ring-4 ring-white" />
                      <div>
                        <p className="font-bold text-gray-800">
                          {h.from_status} → {h.to_status}
                        </p>
                        {h.note && <p className="text-gray-500 mt-0.5">{h.note}</p>}
                        <span className="text-[10px] text-gray-400">{formatDate(h.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Address & Payment Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPin className="w-4 h-4 text-indigo-600" /> Delivery Address
              </h3>
              <div className="text-xs text-gray-600 leading-relaxed">
                <p className="font-bold text-gray-900">{shippingAddress.recipient_name || "N/A"}</p>
                <p>{shippingAddress.street_address}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                <p>{shippingAddress.country}</p>
                <p className="mt-2 text-gray-400">Phone: {shippingAddress.phone || "N/A"}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                Payment Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order.shipping_fee)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                  <span className="font-bold text-gray-900">Total Paid</span>
                  <span className="font-black text-indigo-600">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  PlusCircle,
  Truck,
  ArrowUpRight,
  TrendingUp,
  Store,
} from "lucide-react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { VendorFinanceSummary, SubOrder, Product } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function SellerDashboardPage() {
  const { vendor } = useAuthStore();

  const [finance, setFinance] = useState<VendorFinanceSummary | null>(null);
  const [subOrders, setSubOrders] = useState<SubOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [finRes, ordRes, prodRes] = await Promise.all([
          api.get("/ledger/summary"),
          api.get("/orders/vendor/sub-orders?limit=5"),
          api.get("/products/list?limit=5"),
        ]);

        if (finRes.data.success) setFinance(finRes.data.data);
        if (ordRes.data.success) setSubOrders(ordRes.data.data.items || []);
        if (prodRes.data.success) setProducts(prodRes.data.data.items || []);
      } catch (err) {
        console.error("Failed to load seller dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const pendingFulfillments = subOrders.filter(
    (so) => so.status === "AWAITING_FULFILLMENT" || so.status === "PROCESSING"
  );

  return (
    <SellerLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Welcome, {vendor?.store_name || "Merchant"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Store Status: <span className="font-bold text-emerald-600">{vendor?.status || "APPROVED"}</span> • Commission Rate: {vendor?.commission_rate || 10}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/seller/products/new"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </Link>
            <Link
              href="/seller/finance"
              className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <DollarSign className="w-4 h-4 text-emerald-600" /> Request Payout
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Current Balance */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Available Balance</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatCurrency(finance?.current_balance || 0)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Ready for withdrawal
            </p>
          </div>

          {/* Total Sales Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatCurrency(finance?.total_sales_revenue || 0)}
            </p>
            <p className="text-[11px] text-gray-400">
              Commission paid: {formatCurrency(finance?.total_commission_paid || 0)}
            </p>
          </div>

          {/* Pending Shipments */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Pending Shipments</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {pendingFulfillments.length}
            </p>
            <Link
              href="/seller/orders"
              className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              Fulfill packages <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Active Catalog */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Store Products</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {products.length}
            </p>
            <Link
              href="/seller/products"
              className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              Manage catalog <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Sub-Orders Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-bold text-base text-gray-900">Recent Customer Sub-Orders</h2>
            <Link
              href="/seller/orders"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All Orders
            </Link>
          </div>

          {subOrders.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {subOrders.map((so) => (
                <div key={so.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 first:pt-0 last:pb-0 text-xs">
                  <div>
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      #{so.sub_order_number}
                    </span>
                    <p className="text-gray-400 mt-0.5">{formatDate(so.created_at)}</p>
                  </div>

                  <div>
                    <span className="text-gray-500">Subtotal:</span>{" "}
                    <span className="font-bold text-gray-900">{formatCurrency(so.subtotal)}</span>
                    <span className="text-gray-400 ml-2">(Payout: {formatCurrency(so.vendor_payout_amount)})</span>
                  </div>

                  <span className={`px-3 py-1 font-bold rounded-full border ring-1 ${getStatusBadgeClass(so.status)}`}>
                    {so.status}
                  </span>

                  <Link
                    href={`/seller/orders`}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700 rounded-lg border border-gray-200 transition-colors"
                  >
                    Fulfill
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">No customer orders yet.</p>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Store,
  Package,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PlatformStats, Vendor } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        setIsLoading(true);
        const [statsRes, vendRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/vendors?status=PENDING_REVIEW&limit=5"),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (vendRes.data.success) setPendingVendors(vendRes.data.data.items || []);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Governance Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-vendor oversight, Gross Merchandise Value (GMV), escrow liquidity, and store audit metrics.
          </p>
        </div>

        {/* High-Level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* GMV */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Total Sales GMV</span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(stats?.total_sales_gmv || 0)}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Multi-vendor gross volume
            </p>
          </div>

          {/* Platform Commission Earned */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Platform Commission (Revenue)</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatCurrency(stats?.total_platform_commission || 0)}
            </p>
            <p className="text-[11px] text-slate-400">Net marketplace take-rate</p>
          </div>

          {/* Total Orders */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Total Platform Orders</span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {stats?.total_orders_count || 0}
            </p>
            <p className="text-[11px] text-slate-400">Multi-vendor atomic orders</p>
          </div>

          {/* Total Stores */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Active / Pending Stores</span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {stats?.active_vendors_count || 0} <span className="text-amber-400 text-lg font-bold">({stats?.pending_vendors_count || 0} pending)</span>
            </p>
            <Link
              href="/admin/vendors"
              className="text-[11px] text-rose-400 font-semibold hover:underline flex items-center gap-1"
            >
              Review stores <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pending Vendor Approvals */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pending Merchant Applications
            </h2>
            <Link href="/admin/vendors" className="text-xs text-rose-400 font-semibold hover:underline">
              View All Vendors
            </Link>
          </div>

          {pendingVendors.length > 0 ? (
            <div className="divide-y divide-slate-800/80 text-xs">
              {pendingVendors.map((v) => (
                <div key={v.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{v.store_name}</h4>
                      <p className="text-slate-400 text-[11px]">{v.business_email} • Applied on {formatDate(v.created_at)}</p>
                    </div>
                  </div>

                  <Link
                    href="/admin/vendors"
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Review & Decide
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              No pending vendor applications awaiting review.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

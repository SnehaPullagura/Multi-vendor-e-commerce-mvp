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
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Award,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PlatformStats, Vendor } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { CATEGORY_META_LIST } from "@/lib/categoryMeta";

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
        {/* Colorful White & Green Hero Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Executive Supervision Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Platform Governance Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Multi-vendor gross volume, escrow liquidity, take-rate revenues, and merchant compliance oversight.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <Link
              href="/admin/vendors"
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 shadow-md transition-all flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-emerald-700" /> Manage Stores
            </Link>
            <Link
              href="/admin/categories"
              className="px-4 py-2.5 rounded-xl bg-emerald-600/60 hover:bg-emerald-600 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" /> Taxonomy
            </Link>
          </div>

          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* High-Level Colorful KPI Cards (White & Green Combination) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Sales GMV */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Volume (GMV)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatCurrency(stats?.total_sales_gmv || 0)}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Multi-vendor gross throughput
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          </div>

          {/* Card 2: Platform Revenue (Vibrant Emerald Gradient) */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Platform Take-Rate</span>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-white">
                {formatCurrency(stats?.total_platform_commission || 0)}
              </p>
              <p className="text-[11px] text-emerald-100 font-semibold mt-1">
                Net marketplace commission revenue
              </p>
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Orders</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.total_orders_count || 0}
              </p>
              <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1 mt-1">
                <Activity className="w-3.5 h-3.5" /> Atomic multi-vendor splits
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          </div>

          {/* Card 4: Store Merchant Accounts */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Merchants</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.active_vendors_count || 0}{" "}
                <span className="text-amber-600 text-sm font-bold">
                  ({stats?.pending_vendors_count || 0} pending)
                </span>
              </p>
              <Link
                href="/admin/vendors"
                className="text-[11px] text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1 mt-1"
              >
                Review applications <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
          </div>
        </div>

        {/* Department Catalog Health (White & Colorful Green Badges) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-50 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Department Catalog Coverage (210 Products)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every department is pre-seeded with 35+ verified products and active variant SKUs.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORY_META_LIST.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex flex-col justify-between hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white">
                    35 prods
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{c.name.split(" ")[0]}</h4>
                  <p className="text-[10px] text-emerald-800/80 font-medium truncate">100% Operational</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Vendor Approvals (White & Green Table Card) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-50">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Pending Merchant Applications
            </h2>
            <Link href="/admin/vendors" className="text-xs text-emerald-700 font-bold hover:underline">
              View All Vendors
            </Link>
          </div>

          {pendingVendors.length > 0 ? (
            <div className="divide-y divide-emerald-50 text-xs">
              {pendingVendors.map((v) => (
                <div key={v.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{v.store_name}</h4>
                      <p className="text-slate-500 text-[11px]">
                        {v.business_email} • Applied on {formatDate(v.created_at)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/admin/vendors"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Review & Decide
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="font-semibold text-slate-700">All merchant applications have been reviewed</p>
              <p className="text-[11px] text-slate-400">New seller onboardings will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, ShoppingBag, Store, Users, BarChart3, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const platformMetrics = {
    gmv: 186420.75,
    total_orders: 2847,
    active_vendors: 24,
    registered_customers: 15340,
    avg_order_value: 65.47,
    platform_commission: 27963.11,
    growth_pct: 18.4,
  };

  const vendorLeaderboard = [
    { rank: 1, name: "Apex Electronics", revenue: 42580.00, orders: 543, rating: 4.8, commission: 6387.00 },
    { rank: 2, name: "Nordic Living Co.", revenue: 38920.00, orders: 312, rating: 4.9, commission: 5838.00 },
    { rank: 3, name: "Urban Streetwear", revenue: 28450.00, orders: 421, rating: 4.6, commission: 4267.50 },
    { rank: 4, name: "Chef's Arsenal", revenue: 22100.00, orders: 287, rating: 4.7, commission: 3315.00 },
    { rank: 5, name: "FitPro Equipment", revenue: 18750.00, orders: 198, rating: 4.5, commission: 2812.50 },
  ];

  const categoryBreakdown = [
    { name: "Consumer Electronics", revenue: 52340, share: 28.1 },
    { name: "Home & Furniture", revenue: 38920, share: 20.9 },
    { name: "Fashion & Footwear", revenue: 28450, share: 15.3 },
    { name: "Kitchen & Cookware", revenue: 22100, share: 11.9 },
    { name: "Sports & Fitness", revenue: 18750, share: 10.1 },
    { name: "Beauty & Skincare", revenue: 14280, share: 7.7 },
    { name: "Other Categories", revenue: 11580, share: 6.0 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Platform Analytics</h1>
            <p className="text-xs text-gray-500 mt-1">Marketplace-wide performance, vendor benchmarks, and growth metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white outline-none">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Gross Merchandise Volume" value={formatCurrency(platformMetrics.gmv)} icon={DollarSign} trend={{ value: `+${platformMetrics.growth_pct}%`, isPositive: true }} colorScheme="indigo" />
          <StatCard title="Total Orders" value={platformMetrics.total_orders.toLocaleString()} icon={ShoppingBag} trend={{ value: "+14.2%", isPositive: true }} colorScheme="emerald" />
          <StatCard title="Platform Commission" value={formatCurrency(platformMetrics.platform_commission)} icon={TrendingUp} trend={{ value: "+22.1%", isPositive: true }} colorScheme="amber" />
          <StatCard title="Active Vendors" value={platformMetrics.active_vendors.toString()} icon={Store} trend={{ value: "+3", isPositive: true }} colorScheme="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Breakdown */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Category Distribution</h2>
            <p className="text-[11px] text-gray-400 mb-5">Revenue share by product category</p>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-semibold">{cat.name}</span>
                    <span className="text-gray-500">{cat.share}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${cat.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Vendor Performance Leaderboard</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Top vendors ranked by gross revenue</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Vendor</th>
                    <th className="p-4 text-center">Rating</th>
                    <th className="p-4 text-center">Orders</th>
                    <th className="p-4 text-right">Revenue</th>
                    <th className="p-4 text-right">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vendorLeaderboard.map((v) => (
                    <tr key={v.rank} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-black text-gray-400">{v.rank}</td>
                      <td className="p-4 font-bold text-gray-900">{v.name}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-bold">⭐ {v.rating}</span>
                      </td>
                      <td className="p-4 text-center text-gray-700">{v.orders}</td>
                      <td className="p-4 text-right font-extrabold text-gray-900">{formatCurrency(v.revenue)}</td>
                      <td className="p-4 text-right text-indigo-600 font-bold">{formatCurrency(v.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

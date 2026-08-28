"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatCard } from "@/components/ui/StatCard";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface TopProduct {
  product_id: string;
  product_title: string;
  units_sold: number;
  total_revenue: number;
  order_count: number;
}

export default function SellerAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [revenue, setRevenue] = useState({
    gross_revenue: 24580.50,
    net_revenue: 21143.23,
    total_commission: 3437.27,
    order_count: 312,
    average_order_value: 78.78,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([
    { product_id: "1", product_title: "Quantum ANC Pro Wireless Headphones", units_sold: 87, total_revenue: 26069.13, order_count: 87 },
    { product_id: "2", product_title: "PulseStudio Pro USB-C Condenser Microphone", units_sold: 56, total_revenue: 8344.00, order_count: 56 },
    { product_id: "3", product_title: "Vortex Ultra Gaming Mechanical Keyboard", units_sold: 43, total_revenue: 6019.57, order_count: 43 },
    { product_id: "4", product_title: "AeroCharge 3-in-1 MagFast Wireless Station", units_sold: 38, total_revenue: 3038.10, order_count: 38 },
    { product_id: "5", product_title: "SpectraSound 360 Portable Bluetooth Speaker", units_sold: 29, total_revenue: 3465.50, order_count: 29 },
  ]);

  const trendData = [
    { day: "Mon", orders: 18, revenue: 1420 },
    { day: "Tue", orders: 22, revenue: 1734 },
    { day: "Wed", orders: 15, revenue: 1182 },
    { day: "Thu", orders: 28, revenue: 2206 },
    { day: "Fri", orders: 35, revenue: 2758 },
    { day: "Sat", orders: 42, revenue: 3310 },
    { day: "Sun", orders: 31, revenue: 2443 },
  ];
  const maxOrders = Math.max(...trendData.map((d) => d.orders));

  const dateOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "ytd", label: "Year to Date" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Store Analytics</h1>
            <p className="text-xs text-gray-500 mt-1">Revenue, orders, and product performance insights.</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {dateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Gross Revenue" value={formatCurrency(revenue.gross_revenue)} icon={DollarSign} trend={{ value: "+12.3%", isPositive: true }} colorScheme="indigo" />
          <StatCard title="Net Revenue" value={formatCurrency(revenue.net_revenue)} icon={TrendingUp} trend={{ value: "+8.7%", isPositive: true }} colorScheme="emerald" />
          <StatCard title="Total Orders" value={revenue.order_count.toString()} icon={ShoppingBag} trend={{ value: "+5.2%", isPositive: true }} colorScheme="amber" />
          <StatCard title="Avg Order Value" value={formatCurrency(revenue.average_order_value)} icon={BarChart3} trend={{ value: "-1.4%", isPositive: false }} colorScheme="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Trend Bar Chart */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Weekly Order Volume</h2>
            <p className="text-[11px] text-gray-400 mb-4">Orders per day for the current week</p>
            <div className="flex items-end gap-3 h-40">
              {trendData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-700">{d.orders}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all"
                    style={{ height: `${(d.orders / maxOrders) * 100}%` }}
                  />
                  <span className="text-[10px] text-gray-400 font-semibold">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Revenue Breakdown</h2>
            <p className="text-[11px] text-gray-400 mb-6">How your gross revenue is distributed</p>
            <div className="space-y-4">
              {[
                { label: "Net Payout", amount: revenue.net_revenue, pct: ((revenue.net_revenue / revenue.gross_revenue) * 100).toFixed(1), color: "bg-emerald-500" },
                { label: "Platform Commission", amount: revenue.total_commission, pct: ((revenue.total_commission / revenue.gross_revenue) * 100).toFixed(1), color: "bg-indigo-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-semibold">{item.label}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.amount)} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Top Performing Products</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Ranked by total revenue generated</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Product</th>
                  <th className="p-4 text-center">Units Sold</th>
                  <th className="p-4 text-center">Orders</th>
                  <th className="p-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p, i) => (
                  <tr key={p.product_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-400">{i + 1}</td>
                    <td className="p-4 font-bold text-gray-900">{p.product_title}</td>
                    <td className="p-4 text-center text-gray-700">{p.units_sold}</td>
                    <td className="p-4 text-center text-gray-700">{p.order_count}</td>
                    <td className="p-4 text-right font-extrabold text-gray-900">{formatCurrency(p.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

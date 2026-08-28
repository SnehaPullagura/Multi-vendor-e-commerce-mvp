"use client";

import { useState } from "react";
import { FileText, Download, TrendingUp, DollarSign, Calendar, Filter, PieChart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LineChart } from "@/components/analytics/LineChart";
import { DonutChart } from "@/components/analytics/DonutChart";
import { formatCurrency } from "@/lib/utils";

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const revenueSeries = [
    { label: "Aug 1", value: 12400 },
    { label: "Aug 5", value: 15800 },
    { label: "Aug 10", value: 14200 },
    { label: "Aug 15", value: 18900 },
    { label: "Aug 20", value: 22400 },
    { label: "Aug 25", value: 24800 },
    { label: "Aug 28", value: 28500 },
  ];

  const categorySegments = [
    { label: "Consumer Electronics", value: 42500, color: "#4f46e5" },
    { label: "Furniture & Decor", value: 31200, color: "#10b981" },
    { label: "Industrial & MRO", value: 24800, color: "#f59e0b" },
    { label: "Apparel & Shoes", value: 18400, color: "#ec4899" },
    { label: "Clean Beauty", value: 12100, color: "#06b6d4" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Financial Reports & Executive BI</h1>
            <p className="text-xs text-gray-500 mt-1">Platform P&L statements, fee reconciliation, and ledger audit reports.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-gray-700 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition-all">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Gross Merchandise Volume (GMV) Trend</h3>
                <p className="text-[11px] text-gray-400">Cumulative sales transactions across verified merchants</p>
              </div>
              <span className="text-base font-black text-indigo-600">$128,450.00</span>
            </div>
            <LineChart data={revenueSeries} valuePrefix="$" height={220} />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Category Revenue Split</h3>
              <p className="text-[11px] text-gray-400">Total GMV contribution by sector</p>
            </div>
            <DonutChart segments={categorySegments} centerValue="$128.4k" centerLabel="Total GMV" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

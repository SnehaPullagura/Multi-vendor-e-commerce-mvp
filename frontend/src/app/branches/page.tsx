"use client";

import React from "react";
import { Building2, TrendingUp, DollarSign, Users, Award, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

export default function MultiBranchPage() {
  const branches = [
    {
      code: "BR-001",
      name: "Downtown Flagship (Bistro & Bar)",
      location: "San Francisco, CA",
      revenue: 148500.00,
      foodCostPct: 28.0,
      laborCostPct: 26.0,
      primeCostPct: 54.0,
      contribution: 43810.00,
      orders: 4210,
      csat: 4.9,
    },
    {
      code: "BR-002",
      name: "Uptown Terrace (Fine Dining)",
      location: "San Jose, CA",
      revenue: 122000.00,
      foodCostPct: 29.0,
      laborCostPct: 27.0,
      primeCostPct: 56.0,
      contribution: 32680.00,
      orders: 2840,
      csat: 4.8,
    },
    {
      code: "BR-003",
      name: "Westside Express (QSR & Delivery)",
      location: "Oakland, CA",
      revenue: 94500.00,
      foodCostPct: 30.0,
      laborCostPct: 21.0,
      primeCostPct: 51.0,
      contribution: 32105.00,
      orders: 5120,
      csat: 4.7,
    },
    {
      code: "BR-004",
      name: "Airport Terminal 3 Hub",
      location: "SFO International",
      revenue: 186000.00,
      foodCostPct: 26.0,
      laborCostPct: 23.0,
      primeCostPct: 49.0,
      contribution: 56860.00,
      orders: 8450,
      csat: 4.6,
    },
  ];

  const totalGroupRevenue = branches.reduce((s, b) => s + b.revenue, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-[11px] rounded-full border border-indigo-200">
              Proprietary Feature #3
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Multi-Branch Operating System</h1>
            <p className="text-xs text-gray-500 mt-1">
              Enterprise Head Office visibility: Consolidated P&L, prime cost benchmarks, and outlet performance.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-right">
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Group Monthly Revenue</span>
            <p className="text-2xl font-black text-indigo-600">{formatCurrency(totalGroupRevenue)}</p>
          </div>
        </div>

        {/* Outlets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((b) => (
            <div key={b.code} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">{b.code}</span>
                  <h3 className="text-base font-black text-gray-900 mt-0.5">{b.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {b.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Gross Sales</span>
                  <p className="text-lg font-black text-gray-900">{formatCurrency(b.revenue)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl text-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Food Cost</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">{b.foodCostPct}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Labor Cost</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">{b.laborCostPct}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Prime Cost</p>
                  <p className="text-sm font-black text-emerald-600 mt-0.5">{b.primeCostPct}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500 font-semibold">{b.orders.toLocaleString()} orders completed</span>
                <span className="font-extrabold text-indigo-600">Net Store Contribution: {formatCurrency(b.contribution)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

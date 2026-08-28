"use client";

import React, { useState } from "react";
import { Sparkles, DollarSign, TrendingUp, AlertTriangle, Layers, ArrowUpRight, Award, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

export default function ProfitEnginePage() {
  const dishes = [
    {
      name: "Truffle Wagyu Burger",
      category: "Burgers",
      price: 26.00,
      cogs: 8.30,
      labor: 3.20,
      utility: 0.50,
      margin: 14.00,
      marginPct: 53.8,
      unitsSold: 340,
      totalProfit: 4760.00,
      quadrant: "STAR",
      advice: "Top margin driver. Maintain ingredient quality and recipe consistency.",
    },
    {
      name: "Signature Butter Chicken & Naan",
      category: "Main Course",
      price: 22.50,
      cogs: 5.80,
      labor: 2.80,
      utility: 0.45,
      margin: 13.45,
      marginPct: 59.8,
      unitsSold: 420,
      totalProfit: 5649.00,
      quadrant: "STAR",
      advice: "Flagship favorite. Highest volume item with exceptional contribution.",
    },
    {
      name: "Wood-Fired Margherita Pizza",
      category: "Pizza",
      price: 18.00,
      cogs: 3.30,
      labor: 2.10,
      utility: 0.60,
      margin: 12.00,
      marginPct: 66.7,
      unitsSold: 580,
      totalProfit: 6960.00,
      quadrant: "STAR",
      advice: "Exceptional unit economics (66.7% margin). Keep as primary cross-sell combo.",
    },
    {
      name: "Crispy Calamari Fritti",
      category: "Starters",
      price: 14.50,
      cogs: 4.60,
      labor: 1.80,
      utility: 0.35,
      margin: 7.75,
      marginPct: 53.4,
      unitsSold: 180,
      totalProfit: 1395.00,
      quadrant: "PUZZLE",
      advice: "High margin but lower volume. Train service staff to suggest as shared appetizer.",
    },
    {
      name: "Matcha Lava Cake & Gelato",
      category: "Desserts",
      price: 12.00,
      cogs: 2.40,
      labor: 1.40,
      utility: 0.25,
      margin: 7.95,
      marginPct: 66.3,
      unitsSold: 290,
      totalProfit: 2305.50,
      quadrant: "STAR",
      advice: "High margin dessert attachment. Upsell with digestifs and espresso.",
    },
  ];

  const totalProfit = dishes.reduce((s, d) => s + d.totalProfit, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-[11px] rounded-full border border-indigo-200">
                Proprietary AI Feature #1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Restaurant Profit Engine™</h1>
            <p className="text-xs text-gray-500 mt-1">
              True dish-level contribution margins ($Selling Price - Ingredients - Packaging - Labor - Utilities$).
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-right">
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Monthly Gross Contribution</span>
            <p className="text-2xl font-black text-emerald-600">{formatCurrency(totalProfit)}</p>
          </div>
        </div>

        {/* Menu Engineering Matrix Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "⭐ Stars (High Margin, High Vol)", count: 4, desc: "Promote & protect quality", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { label: "🐎 Plowhorses (Low Margin, High Vol)", count: 0, desc: "Re-engineer recipe portions", color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "🧩 Puzzles (High Margin, Low Vol)", count: 1, desc: "Upsell & bundle in combos", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
            { label: "🐕 Dogs (Low Margin, Low Vol)", count: 0, desc: "Consider retiring from menu", color: "bg-rose-50 text-rose-700 border-rose-200" },
          ].map((card, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${card.color}`}>
              <h4 className="font-black text-xs">{card.label}</h4>
              <p className="text-2xl font-black my-1">{card.count} SKUs</p>
              <p className="text-[10px] opacity-80">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Dishes Unit Economics Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Menu Item Unit Economics & Contribution Margins</h3>
            <p className="text-[11px] text-gray-400">Complete itemized cost breakdown derived from BOM recipes and labor schedules</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Dish Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Food Cost (BOM)</th>
                  <th className="p-4 text-right">Labor + Util</th>
                  <th className="p-4 text-right">Unit Margin</th>
                  <th className="p-4 text-center">Margin %</th>
                  <th className="p-4 text-center">Quadrant</th>
                  <th className="p-4 text-right">Total Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dishes.map((dish, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{dish.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{dish.advice}</p>
                    </td>
                    <td className="p-4 font-semibold text-gray-600">{dish.category}</td>
                    <td className="p-4 text-right font-bold text-gray-900">{formatCurrency(dish.price)}</td>
                    <td className="p-4 text-right font-mono text-rose-600 font-bold">{formatCurrency(dish.cogs)}</td>
                    <td className="p-4 text-right font-mono text-gray-600">{formatCurrency(dish.labor + dish.utility)}</td>
                    <td className="p-4 text-right font-extrabold text-emerald-600">{formatCurrency(dish.margin)}</td>
                    <td className="p-4 text-center font-black text-gray-900">{dish.marginPct}%</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                        {dish.quadrant}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-gray-900">{formatCurrency(dish.totalProfit)}</td>
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

"use client";

import React, { useState } from "react";
import { AlertTriangle, TrendingUp, CheckCircle, Scale, DollarSign, ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

export default function FoodCostIntelligencePage() {
  const variances = [
    {
      ingredient: "Fresh Boneless Chicken Breast",
      unit: "kg",
      unitCost: 6.80,
      expected: 85.0,
      actual: 98.5,
      varianceQty: 13.5,
      variancePct: 15.9,
      costImpact: 91.80,
      isFlagged: true,
      diagnosis: "Significant over-portioning on Dinner Entrees or unrecorded kitchen trimming waste.",
      action: "Initiate kitchen station portion audit and recalibrate digital scales.",
    },
    {
      ingredient: "Aged Mozzarella di Bufala",
      unit: "kg",
      unitCost: 12.50,
      expected: 42.0,
      actual: 44.2,
      varianceQty: 2.2,
      variancePct: 5.2,
      costImpact: 27.50,
      isFlagged: true,
      diagnosis: "Slight heavy cheese topping on wood-fired pizzas.",
      action: "Review standard 120g cheese portion cups at pizza station.",
    },
    {
      ingredient: "San Marzano Plum Tomatoes",
      unit: "cans",
      unitCost: 3.20,
      expected: 60.0,
      actual: 61.0,
      varianceQty: 1.0,
      variancePct: 1.7,
      costImpact: 3.20,
      isFlagged: false,
      diagnosis: "Normal operational tolerance within allowable threshold.",
      action: "No action required.",
    },
    {
      ingredient: "Black Summer Truffle Paste",
      unit: "jars",
      unitCost: 45.00,
      expected: 8.0,
      actual: 11.0,
      varianceQty: 3.0,
      variancePct: 37.5,
      costImpact: 135.00,
      isFlagged: true,
      diagnosis: "Critical variance in high-value ingredient. Potential double-portioning or shrinkage.",
      action: "Enforce dual-signoff on luxury ingredient storage lockup.",
    },
  ];

  const totalCostVariance = variances.reduce((s, v) => s + v.costImpact, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-[11px] rounded-full border border-indigo-200">
              Proprietary AI Feature #2
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Food Cost Intelligence™</h1>
            <p className="text-xs text-gray-500 mt-1">
              Expected Consumption ($Recipe BOM \times Units Sold$) vs Actual Physical Inventory Depletion.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-right">
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Discrepancy Cost Leakage</span>
            <p className="text-2xl font-black text-rose-600">+{formatCurrency(totalCostVariance)}</p>
          </div>
        </div>

        {/* Variances Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Live Recipe Variance & Shrinkage Detection</h3>
              <p className="text-[11px] text-gray-400">Automated ingredient reconciliation for current weekly operating cycle</p>
            </div>
            <span className="px-3 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-full border border-rose-200">
              3 Items Require Investigation
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Ingredient</th>
                  <th className="p-4 text-center">Unit Cost</th>
                  <th className="p-4 text-center">Expected (BOM)</th>
                  <th className="p-4 text-center">Actual Used</th>
                  <th className="p-4 text-center">Variance Qty</th>
                  <th className="p-4 text-center">Variance %</th>
                  <th className="p-4 text-right">Financial Impact</th>
                  <th className="p-4">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {variances.map((v, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/50 ${v.isFlagged ? "bg-rose-50/20" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {v.isFlagged ? <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                        <div>
                          <p className="font-bold text-gray-900">{v.ingredient}</p>
                          <p className="text-[10px] text-gray-400">{v.diagnosis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono text-gray-700">{formatCurrency(v.unitCost)} / {v.unit}</td>
                    <td className="p-4 text-center font-bold text-gray-900">{v.expected} {v.unit}</td>
                    <td className="p-4 text-center font-bold text-gray-900">{v.actual} {v.unit}</td>
                    <td className="p-4 text-center font-mono font-bold text-rose-600">+{v.varianceQty} {v.unit}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 font-black text-[10px] rounded-full ${v.isFlagged ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                        +{v.variancePct}%
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-rose-600">+{formatCurrency(v.costImpact)}</td>
                    <td className="p-4 text-gray-700 max-w-xs">{v.action}</td>
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

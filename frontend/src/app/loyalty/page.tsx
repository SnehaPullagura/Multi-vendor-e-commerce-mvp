"use client";

import React, { useState } from "react";
import { Award, Gift, Sparkles, User, CreditCard, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

export default function LoyaltyPage() {
  const members = [
    { id: "mem-1", name: "Eleanor Vance", email: "eleanor.v@example.com", tier: "PLATINUM_VIP", points: 4850, visits: 28, totalSpend: 1420.00, cashback: 45.50 },
    { id: "mem-2", name: "Liam Sterling", email: "liam.s@example.com", tier: "GOLD", points: 2150, visits: 14, totalSpend: 780.00, cashback: 22.00 },
    { id: "mem-3", name: "Sophia Chen", email: "sophia.c@example.com", tier: "SILVER", points: 950, visits: 6, totalSpend: 340.00, cashback: 10.00 },
    { id: "mem-4", name: "Marcus Brody", email: "marcus.b@example.com", tier: "BRONZE", points: 300, visits: 2, totalSpend: 115.00, cashback: 5.00 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Guest Loyalty & VIP Tiers</h1>
            <p className="text-xs text-gray-500 mt-1">Multi-tier customer loyalty points, cashback rewards, and guest lifetime value.</p>
          </div>
          <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all">
            <Gift className="w-3.5 h-3.5" /> Issue Bonus Reward
          </button>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { tier: "BRONZE", minSpend: "$0+", earnRate: "1 pt / $1", members: 412, color: "border-amber-700/30 bg-amber-50/50" },
            { tier: "SILVER", minSpend: "$250+", earnRate: "1.25 pts / $1", members: 184, color: "border-slate-300 bg-slate-100/50" },
            { tier: "GOLD", minSpend: "$600+", earnRate: "1.5 pts / $1", members: 92, color: "border-yellow-400 bg-yellow-50/50" },
            { tier: "PLATINUM VIP", minSpend: "$1,200+", earnRate: "2.0 pts / $1", members: 38, color: "border-purple-400 bg-purple-50/50" },
          ].map((t) => (
            <div key={t.tier} className={`p-5 rounded-3xl border ${t.color} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-gray-900">{t.tier}</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xl font-black text-gray-900">{t.members} Guests</p>
              <div className="text-[10px] text-gray-500 space-y-0.5">
                <p>Spend: {t.minSpend}</p>
                <p>Earning: {t.earnRate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Member Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">VIP Members Roster</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Guest Name</th>
                  <th className="p-4">Tier Level</th>
                  <th className="p-4 text-center">Points Balance</th>
                  <th className="p-4 text-center">Visits</th>
                  <th className="p-4 text-right">Lifetime Spend</th>
                  <th className="p-4 text-right">Cashback Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-gray-900">
                      {m.name}
                      <span className="block text-[10px] text-gray-400 font-normal">{m.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-[10px] border border-indigo-200">
                        {m.tier.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-black text-gray-900">{m.points.toLocaleString()} pts</td>
                    <td className="p-4 text-center font-bold text-gray-700">{m.visits}</td>
                    <td className="p-4 text-right font-black text-gray-900">{formatCurrency(m.totalSpend)}</td>
                    <td className="p-4 text-right font-bold text-emerald-600">{formatCurrency(m.cashback)}</td>
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

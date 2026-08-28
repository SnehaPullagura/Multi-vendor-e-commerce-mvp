"use client";

import { useState } from "react";
import { Tag, ShieldCheck, AlertTriangle, Eye, Ban, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AdminPromotion {
  id: string;
  title: string;
  vendor_name: string;
  scope: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  is_approved: boolean;
  usage_count: number;
  usage_limit: number | null;
  total_discount_given: number;
  fraud_flag: boolean;
  starts_at: string;
  ends_at: string;
}

export default function AdminPromotionsPage() {
  const [filterScope, setFilterScope] = useState("all");

  const promotions: AdminPromotion[] = [
    { id: "1", title: "Summer Electronics Blowout", vendor_name: "Apex Electronics", scope: "VENDOR_STORE", discount_type: "PERCENTAGE", discount_value: 20, is_active: true, is_approved: true, usage_count: 145, usage_limit: 500, total_discount_given: 4350.00, fraud_flag: false, starts_at: "2024-08-01T00:00:00Z", ends_at: "2024-08-31T23:59:59Z" },
    { id: "2", title: "Platform-Wide Free Shipping Week", vendor_name: "MarketSphere", scope: "PLATFORM_WIDE", discount_type: "FREE_SHIPPING", discount_value: 0, is_active: true, is_approved: true, usage_count: 892, usage_limit: null, total_discount_given: 6236.00, fraud_flag: false, starts_at: "2024-08-20T00:00:00Z", ends_at: "2024-08-27T23:59:59Z" },
    { id: "3", title: "BOGO Yoga Mats", vendor_name: "FitPro Equipment", scope: "VENDOR_STORE", discount_type: "BUY_X_GET_Y", discount_value: 50, is_active: true, is_approved: false, usage_count: 0, usage_limit: 100, total_discount_given: 0, fraud_flag: true, starts_at: "2024-08-25T00:00:00Z", ends_at: "2024-09-10T23:59:59Z" },
    { id: "4", title: "New Customer Welcome 15%", vendor_name: "MarketSphere", scope: "PLATFORM_WIDE", discount_type: "PERCENTAGE", discount_value: 15, is_active: false, is_approved: true, usage_count: 2340, usage_limit: 5000, total_discount_given: 18720.00, fraud_flag: false, starts_at: "2024-01-01T00:00:00Z", ends_at: "2024-06-30T23:59:59Z" },
  ];

  const filtered = promotions.filter((p) => filterScope === "all" || p.scope === filterScope);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Promotion Oversight</h1>
          <p className="text-xs text-gray-500 mt-1">Review, approve, and monitor all vendor and platform-wide promotional campaigns.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Tag, label: "Total Campaigns", value: promotions.length },
            { icon: CheckCircle, label: "Approved", value: promotions.filter((p) => p.is_approved).length },
            { icon: AlertTriangle, label: "Pending Approval", value: promotions.filter((p) => !p.is_approved).length },
            { icon: ShieldCheck, label: "Fraud Flagged", value: promotions.filter((p) => p.fraud_flag).length },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <s.icon className="w-4 h-4 text-gray-400 mb-1" />
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "PLATFORM_WIDE", "VENDOR_STORE"].map((scope) => (
            <button key={scope} onClick={() => setFilterScope(scope)} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterScope === scope ? "bg-brand-600 text-white" : "bg-white text-gray-600 border border-gray-100"}`}>
              {scope === "all" ? "All" : scope.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4 text-center">Usage</th>
                  <th className="p-4 text-right">Total Given</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${p.fraud_flag ? "bg-rose-50/30" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{p.title}</p>
                        {p.fraud_flag && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{p.vendor_name}</td>
                    <td className="p-4 font-bold text-indigo-600">
                      {p.discount_type === "PERCENTAGE" ? `${p.discount_value}%` : p.discount_type === "FREE_SHIPPING" ? "Free Ship" : `${p.discount_value}%`}
                    </td>
                    <td className="p-4 text-center text-gray-700">{p.usage_count}{p.usage_limit ? `/${p.usage_limit}` : ""}</td>
                    <td className="p-4 text-right font-extrabold text-gray-900">{formatCurrency(p.total_discount_given)}</td>
                    <td className="p-4">
                      {!p.is_approved ? (
                        <span className="px-2.5 py-0.5 font-bold rounded-full border text-[10px] bg-amber-50 text-amber-700 border-amber-200">Pending</span>
                      ) : p.is_active ? (
                        <span className="px-2.5 py-0.5 font-bold rounded-full border text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Active</span>
                      ) : (
                        <span className="px-2.5 py-0.5 font-bold rounded-full border text-[10px] bg-gray-50 text-gray-500 border-gray-200">Ended</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {!p.is_approved && (
                        <>
                          <button className="text-emerald-600 font-bold text-[11px]">Approve</button>
                          <button className="text-rose-600 font-bold text-[11px]">Reject</button>
                        </>
                      )}
                      {p.is_approved && p.is_active && (
                        <button className="text-rose-600 font-bold text-[11px]">Suspend</button>
                      )}
                    </td>
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

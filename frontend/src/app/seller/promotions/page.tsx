"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Percent, Calendar, Users, BarChart3, Gift, Zap, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Promotion } from "@/types/commerce_extensions";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SellerPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "scheduled" | "expired">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    min_order_amount: "0",
    starts_at: "",
    ends_at: "",
    coupon_code: "",
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  async function loadPromotions() {
    try {
      setIsLoading(true);
      const res = await api.get("/promotions/active");
      if (res.data.success) setPromotions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredPromotions = promotions.filter((p) => {
    if (activeFilter === "all") return true;
    const now = new Date();
    const start = new Date(p.starts_at);
    const end = new Date(p.ends_at);
    if (activeFilter === "active") return p.is_active && start <= now && end >= now;
    if (activeFilter === "scheduled") return start > now;
    if (activeFilter === "expired") return end < now;
    return true;
  });

  const filterButtons = [
    { key: "all" as const, label: "All", count: promotions.length },
    { key: "active" as const, label: "Active", count: promotions.filter((p) => p.is_active).length },
    { key: "scheduled" as const, label: "Scheduled", count: 0 },
    { key: "expired" as const, label: "Expired", count: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Promotions & Coupons</h1>
            <p className="text-xs text-gray-500 mt-1">Create promotional campaigns to boost store sales and customer engagement.</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Campaign
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Tag, label: "Total Campaigns", value: promotions.length, color: "indigo" },
            { icon: Zap, label: "Active Now", value: promotions.filter((p) => p.is_active).length, color: "emerald" },
            { icon: Gift, label: "Coupons Issued", value: promotions.reduce((s, p) => s + (p.is_active ? 1 : 0), 0), color: "amber" },
            { icon: BarChart3, label: "Total Redemptions", value: 0, color: "rose" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filterButtons.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeFilter === f.key
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 space-y-5">
            <h2 className="text-base font-bold text-gray-900">Create New Promotion</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Campaign Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Summer Flash Sale" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Discount Type</label>
                <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none">
                  <option value="PERCENTAGE">Percentage Off (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                  <option value="BUY_X_GET_Y">Buy X Get Y</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Discount Value</label>
                <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="20" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Start Date</label>
                <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">End Date</label>
                <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Coupon Code (Optional)</label>
                <input type="text" value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })} placeholder="SUMMER20" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
                Create Campaign
              </button>
              <button onClick={() => setShowCreateForm(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Promotions table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{p.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.scope}</p>
                      </td>
                      <td className="p-4 font-bold text-indigo-600">
                        {p.discount_type === "PERCENTAGE" ? `${p.discount_value}%` : formatCurrency(p.discount_value)}
                      </td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">
                        {formatDate(p.starts_at)} → {formatDate(p.ends_at)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 font-bold rounded-full border text-[10px] ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]">Edit</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">No promotions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

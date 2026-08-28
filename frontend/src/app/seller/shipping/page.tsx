"use client";

import { useEffect, useState } from "react";
import { Truck, Package, MapPin, Clock, CheckCircle, Search, ChevronDown, Send, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface PendingShipment {
  id: string;
  sub_order_id: string;
  customer_name: string;
  destination: string;
  items_count: number;
  created_at: string;
  carrier: string;
  tracking_number: string;
  status: string;
}

const CARRIERS = [
  { value: "USPS", label: "USPS" },
  { value: "FEDEX", label: "FedEx" },
  { value: "UPS", label: "UPS" },
  { value: "DHL", label: "DHL Express" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  LABEL_CREATED: "bg-blue-50 text-blue-700 border-blue-200",
  PICKED_UP: "bg-indigo-50 text-indigo-700 border-indigo-200",
  IN_TRANSIT: "bg-purple-50 text-purple-700 border-purple-200",
  OUT_FOR_DELIVERY: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXCEPTION: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function SellerShippingPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "shipped" | "delivered">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("USPS");
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());

  const sampleShipments: PendingShipment[] = [
    { id: "s1", sub_order_id: "SO-2024-0891", customer_name: "Sarah Johnson", destination: "Portland, OR 97201", items_count: 2, created_at: "2024-08-25T10:30:00Z", carrier: "", tracking_number: "", status: "PENDING" },
    { id: "s2", sub_order_id: "SO-2024-0892", customer_name: "Michael Chen", destination: "Austin, TX 78701", items_count: 1, created_at: "2024-08-25T11:15:00Z", carrier: "", tracking_number: "", status: "PENDING" },
    { id: "s3", sub_order_id: "SO-2024-0888", customer_name: "Emily Rodriguez", destination: "Denver, CO 80202", items_count: 3, created_at: "2024-08-24T09:00:00Z", carrier: "FEDEX", tracking_number: "794644790568", status: "IN_TRANSIT" },
    { id: "s4", sub_order_id: "SO-2024-0885", customer_name: "David Kim", destination: "Seattle, WA 98101", items_count: 1, created_at: "2024-08-23T14:20:00Z", carrier: "USPS", tracking_number: "9400111899223100001234", status: "DELIVERED" },
  ];

  const filtered = sampleShipments.filter((s) => {
    if (activeTab === "pending" && s.status !== "PENDING") return false;
    if (activeTab === "shipped" && !["LABEL_CREATED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(s.status)) return false;
    if (activeTab === "delivered" && s.status !== "DELIVERED") return false;
    if (searchQuery && !s.sub_order_id.toLowerCase().includes(searchQuery.toLowerCase()) && !s.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  function toggleSelection(id: string) {
    setSelectedShipments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Shipping & Fulfillment</h1>
            <p className="text-xs text-gray-500 mt-1">Manage shipments, print labels, and track deliveries.</p>
          </div>
          {selectedShipments.size > 0 && (
            <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all">
              <Send className="w-3.5 h-3.5" /> Ship Selected ({selectedShipments.size})
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Awaiting Shipment", value: sampleShipments.filter((s) => s.status === "PENDING").length, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "In Transit", value: sampleShipments.filter((s) => ["IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(s.status)).length, icon: Truck, color: "text-indigo-600 bg-indigo-50" },
            { label: "Delivered", value: sampleShipments.filter((s) => s.status === "DELIVERED").length, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2">
            {(["pending", "shipped", "delivered"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize ${
                  activeTab === tab ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or customer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  {activeTab === "pending" && <th className="p-4 w-10"></th>}
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Carrier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      {activeTab === "pending" && (
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedShipments.has(s.id)}
                            onChange={() => toggleSelection(s.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                      )}
                      <td className="p-4 font-mono font-bold text-indigo-600">{s.sub_order_id}</td>
                      <td className="p-4 font-semibold text-gray-900">{s.customer_name}</td>
                      <td className="p-4 text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.destination}</td>
                      <td className="p-4 text-gray-700">{s.items_count} item(s)</td>
                      <td className="p-4 text-gray-700">{s.carrier || "—"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 font-bold rounded-full border text-[10px] ${STATUS_COLORS[s.status] || ""}`}>
                          {s.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400">{formatDate(s.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">No shipments found.</td>
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

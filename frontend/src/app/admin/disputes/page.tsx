"use client";

import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, User, MessageSquare, ChevronDown, ChevronUp, Scale } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Dispute {
  id: string;
  ticket_number: string;
  customer_name: string;
  vendor_name: string;
  order_id: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: string;
  amount_in_dispute: number;
  assigned_mediator: string;
  created_at: string;
  messages_count: number;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-50 text-gray-600 border-gray-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminDisputesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const disputes: Dispute[] = [
    { id: "d1", ticket_number: "DISP-2024-0042", customer_name: "Sarah Johnson", vendor_name: "Apex Electronics", order_id: "ORD-2024-0891", subject: "Received damaged headphones - box was crushed", category: "DAMAGED_ITEM", priority: "HIGH", status: "ESCALATED", amount_in_dispute: 299.99, assigned_mediator: "Admin Team", created_at: "2024-08-25T10:30:00Z", messages_count: 8 },
    { id: "d2", ticket_number: "DISP-2024-0041", customer_name: "Michael Chen", vendor_name: "Nordic Living Co.", order_id: "ORD-2024-0878", subject: "Standing desk motor stopped working after 2 weeks", category: "DEFECTIVE", priority: "URGENT", status: "UNDER_REVIEW", amount_in_dispute: 749.00, assigned_mediator: "Jane Smith", created_at: "2024-08-24T14:15:00Z", messages_count: 12 },
    { id: "d3", ticket_number: "DISP-2024-0040", customer_name: "Emily Rodriguez", vendor_name: "Urban Streetwear", order_id: "ORD-2024-0865", subject: "Wrong size sneakers sent, vendor refusing return", category: "WRONG_ITEM", priority: "MEDIUM", status: "PENDING_VENDOR", amount_in_dispute: 185.00, assigned_mediator: "Admin Team", created_at: "2024-08-23T09:00:00Z", messages_count: 5 },
    { id: "d4", ticket_number: "DISP-2024-0039", customer_name: "David Kim", vendor_name: "Chef's Arsenal", order_id: "ORD-2024-0852", subject: "Knife arrived without box and missing sheath", category: "INCOMPLETE_ORDER", priority: "LOW", status: "RESOLVED", amount_in_dispute: 135.00, assigned_mediator: "Mark Wilson", created_at: "2024-08-22T16:45:00Z", messages_count: 6 },
  ];

  const filtered = disputes.filter((d) => filterStatus === "all" || d.status === filterStatus);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Dispute Resolution Center</h1>
            <p className="text-xs text-gray-500 mt-1">Mediate escalated customer-vendor disputes and authorize refund actions.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-gray-400" />
            <span className="font-bold text-gray-700">{disputes.filter((d) => d.status !== "RESOLVED").length} Active Disputes</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: AlertTriangle, label: "Escalated", value: disputes.filter((d) => d.status === "ESCALATED").length, color: "text-rose-600 bg-rose-50" },
            { icon: Clock, label: "Under Review", value: disputes.filter((d) => d.status === "UNDER_REVIEW").length, color: "text-amber-600 bg-amber-50" },
            { icon: MessageSquare, label: "Pending Vendor", value: disputes.filter((d) => d.status === "PENDING_VENDOR").length, color: "text-indigo-600 bg-indigo-50" },
            { icon: CheckCircle, label: "Resolved", value: disputes.filter((d) => d.status === "RESOLVED").length, color: "text-emerald-600 bg-emerald-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</span>
              </div>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "ESCALATED", "UNDER_REVIEW", "PENDING_VENDOR", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap capitalize ${
                filterStatus === status ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {status === "all" ? "All" : status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {filtered.map((d) => {
            const isExpanded = expandedId === d.id;
            return (
              <div key={d.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : d.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900">{d.ticket_number}</h3>
                        <span className={`px-2 py-0.5 font-bold rounded-full border text-[10px] ${PRIORITY_COLORS[d.priority]}`}>{d.priority}</span>
                      </div>
                      <p className="text-xs text-gray-700">{d.subject}</p>
                      <p className="text-[11px] text-gray-400">
                        {d.customer_name} vs {d.vendor_name} • Order {d.order_id} • {d.messages_count} messages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-base font-extrabold text-gray-900">{formatCurrency(d.amount_in_dispute)}</p>
                      <p className="text-[10px] text-gray-400">In Dispute</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-gray-100 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                      <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Status</p><p className="text-xs font-bold text-gray-900 mt-0.5">{d.status.replace(/_/g, " ")}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Category</p><p className="text-xs font-bold text-gray-900 mt-0.5">{d.category.replace(/_/g, " ")}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Mediator</p><p className="text-xs font-bold text-gray-900 mt-0.5">{d.assigned_mediator}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-semibold">Filed</p><p className="text-xs font-bold text-gray-900 mt-0.5">{formatDate(d.created_at)}</p></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all">Approve Full Refund</button>
                      <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all">Partial Refund</button>
                      <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all">Reject Claim</button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all">Escalate</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

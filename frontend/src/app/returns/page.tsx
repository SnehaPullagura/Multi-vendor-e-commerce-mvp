"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Package, Clock, CheckCircle, XCircle, ChevronRight, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReturnRequest } from "@/types/commerce_extensions";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  PENDING_APPROVAL: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  SHIPPED_BACK: Package,
  RECEIVED: Package,
  REFUNDED: CheckCircle,
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sub_order_id: "",
    reason_category: "DEFECTIVE",
    customer_notes: "",
  });

  useEffect(() => {
    loadReturns();
  }, []);

  async function loadReturns() {
    try {
      setIsLoading(true);
      const res = await api.get("/rma/my-returns");
      if (res.data.success) setReturns(res.data.data || []);
    } catch (err) {
      console.error("Failed to load returns:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const reasonOptions = [
    { value: "DEFECTIVE", label: "Product is defective or damaged" },
    { value: "WRONG_ITEM", label: "Wrong item received" },
    { value: "NOT_AS_DESCRIBED", label: "Not as described / different from listing" },
    { value: "CHANGED_MIND", label: "Changed my mind" },
    { value: "SIZE_FIT", label: "Wrong size / doesn't fit" },
    { value: "QUALITY", label: "Quality not satisfactory" },
    { value: "OTHER", label: "Other reason" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Returns & Refunds</h1>
            <p className="text-xs text-gray-500 mt-1">
              Track the status of your return merchandise authorizations (RMA).
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Request Return
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 space-y-5">
            <h2 className="text-base font-bold text-gray-900">New Return Request</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Sub-Order ID
                </label>
                <input
                  type="text"
                  value={formData.sub_order_id}
                  onChange={(e) => setFormData({ ...formData, sub_order_id: e.target.value })}
                  placeholder="Enter sub-order ID from your order page"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Reason for Return
                </label>
                <select
                  value={formData.reason_category}
                  onChange={(e) => setFormData({ ...formData, reason_category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
                >
                  {reasonOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.customer_notes}
                onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
                placeholder="Describe the issue in detail to help expedite your return..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
                Submit Return Request
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {returns.length > 0 ? (
            returns.map((r) => {
              const StatusIcon = STATUS_ICONS[r.status] || AlertTriangle;
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">{r.rma_number}</h3>
                          <span
                            className={`px-2.5 py-0.5 font-bold rounded-full border text-[10px] ${getStatusBadgeClass(
                              r.status
                            )}`}
                          >
                            {r.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {r.reason_category.replace(/_/g, " ")} • Filed {formatDate(r.created_at)}
                        </p>
                        {r.vendor_name && (
                          <p className="text-[11px] text-gray-400">Vendor: {r.vendor_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-extrabold text-gray-900">
                        {formatCurrency(r.total_refund_amount)}
                      </p>
                      <p className="text-[10px] text-gray-400">Estimated Refund</p>
                    </div>
                  </div>

                  {r.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      {r.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">
                            {item.product_title || "Product"}{" "}
                            {item.variant_title && `(${item.variant_title})`} × {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(item.refund_amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {r.return_tracking_number && (
                    <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                      📦 Return Tracking: <strong>{r.return_tracking_number}</strong>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No returns filed</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                You have not submitted any return requests yet.
              </p>
              <Link
                href="/orders"
                className="px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-full shadow-md"
              >
                View Orders
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

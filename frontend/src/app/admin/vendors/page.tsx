"use client";

import { useEffect, useState } from "react";
import {
  Store,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Sliders,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Vendor, VendorStatus } from "@/types";
import { api } from "@/lib/api";
import { formatDate, getStatusBadgeClass } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export default function AdminVendorsPage() {
  const { addToast } = useToastStore();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Status update form
  const [newStatus, setNewStatus] = useState<VendorStatus>("APPROVED");
  const [commissionRate, setCommissionRate] = useState<number>(10.0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadVendors = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/vendors?limit=50");
      if (res.data.success) {
        setVendors(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Failed to load vendors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    try {
      setIsUpdating(true);
      const res = await api.put(`/admin/vendors/${selectedVendor.id}/status`, {
        status: newStatus,
        commission_rate: Number(commissionRate),
        rejection_reason: rejectionReason || undefined,
      });

      if (res.data.success) {
        addToast({
          type: "success",
          title: "Vendor Status Updated",
          message: `${selectedVendor.store_name} marked as ${newStatus}.`,
        });
        setSelectedVendor(null);
        await loadVendors();
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Could not update vendor status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Vendor Store Governance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review store applications, configure custom commission rates, and manage merchant suspensions.
          </p>
        </div>

        {/* Vendors Table */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Store Profile</th>
                  <th className="p-4">Business Email</th>
                  <th className="p-4">Commission %</th>
                  <th className="p-4">Tax ID / Bank</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading vendors...</td>
                  </tr>
                ) : vendors.length > 0 ? (
                  vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {v.store_name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs">{v.store_name}</h4>
                            <p className="text-[10px] text-slate-400">Created: {formatDate(v.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-mono">{v.business_email}</td>
                      <td className="p-4 font-bold text-indigo-400">{v.commission_rate}%</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {v.tax_id || "N/A"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 font-bold rounded-full border ring-1 text-[10px] ${getStatusBadgeClass(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedVendor(v);
                            setNewStatus(v.status);
                            setCommissionRate(v.commission_rate);
                            setRejectionReason(v.rejection_reason || "");
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Govern
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No vendor stores found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Governance Status & Commission */}
        {selectedVendor && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-6 text-white animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Store className="w-5 h-5 text-indigo-400" /> Govern: {selectedVendor.store_name}
                </h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Store Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as VendorStatus)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="PENDING_REVIEW">PENDING REVIEW</option>
                    <option value="APPROVED">APPROVED (Active Seller)</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="SUSPENDED">SUSPENDED (Locked)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Platform Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                {newStatus === "REJECTED" || newStatus === "SUSPENDED" ? (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Reason for Rejection / Suspension</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="KYC documentation mismatch or violation of terms..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                ) : null}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedVendor(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 font-bold text-white rounded-xl shadow-md disabled:bg-slate-800"
                  >
                    {isUpdating ? "Saving..." : "Save Governance"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

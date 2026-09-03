"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  CheckCircle,
  Clock,
  Send,
  Building,
  ShieldCheck,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PayoutRequest, PayoutStatus } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export default function AdminPayoutsPage() {
  const { addToast } = useToastStore();
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);

  // Settlement Form
  const [settleStatus, setSettleStatus] = useState<PayoutStatus>("SETTLED");
  const [trxRef, setTrxRef] = useState("ACH-" + Math.floor(100000 + Math.random() * 900000));
  const [isSettling, setIsSettling] = useState(false);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/ledger/payouts?limit=50");
      if (res.data.success) {
        setPayouts(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Failed to load payout requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const handleSettlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    try {
      setIsSettling(true);
      const res = await api.put(`/ledger/payouts/${selectedPayout.id}/settle`, {
        status: settleStatus,
        transaction_ref: trxRef || undefined,
      });

      if (res.data.success) {
        addToast({
          type: "success",
          title: "Payout Settled",
          message: `Payout of ${formatCurrency(selectedPayout.amount)} marked as ${settleStatus}.`,
        });
        setSelectedPayout(null);
        await loadPayouts();
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Settlement Failed",
        message: err.response?.data?.message || "Could not settle payout.",
      });
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Merchant Payout Settlements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorize and execute bank disbursements for vendor earnings after multi-vendor commissions.
          </p>
        </div>

        {/* Payouts Table (White and Green Theme) */}
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50/70 border-b border-emerald-100 text-emerald-900 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Payout ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4">Bank Ref / Memo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Loading payout requests...</td>
                  </tr>
                ) : payouts.length > 0 ? (
                  payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="p-4 font-mono text-slate-700">
                        {p.id.substring(0, 8)}...
                      </td>
                      <td className="p-4 font-black text-emerald-700 text-sm">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(p.created_at)}</td>
                      <td className="p-4 font-mono text-slate-600">
                        {p.transaction_ref || p.notes || "Standard Wire"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 font-bold rounded-full border ring-1 text-[10px] ${getStatusBadgeClass(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {p.status === "REQUESTED" || p.status === "APPROVED" ? (
                          <button
                            onClick={() => {
                              setSelectedPayout(p);
                              setSettleStatus("SETTLED");
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-xs transition-colors"
                          >
                            Disburse
                          </button>
                        ) : (
                          <span className="text-slate-400 font-semibold text-[11px]">Finalized</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No payout requests in queue.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Settle Payout */}
        {selectedPayout && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-100 shadow-2xl space-y-6 text-slate-900 animate-scale-in">
              <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
                <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Settle Payout: {formatCurrency(selectedPayout.amount)}
                </h3>
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSettlePayout} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Settlement Action</label>
                  <select
                    value={settleStatus}
                    onChange={(e) => setSettleStatus(e.target.value as PayoutStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="SETTLED">SETTLED (Bank Transfer Complete)</option>
                    <option value="APPROVED">APPROVED (Queued for Clearing)</option>
                    <option value="REJECTED">REJECTED (Refund to Vendor Balance)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Reference / Wire Confirmation #</label>
                  <input
                    type="text"
                    required
                    placeholder="ACH-889123049"
                    value={trxRef}
                    onChange={(e) => setTrxRef(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-emerald-50">
                  <button
                    type="button"
                    onClick={() => setSelectedPayout(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSettling}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-xl shadow-md disabled:bg-slate-300"
                  >
                    {isSettling ? "Executing..." : "Confirm Settlement"}
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

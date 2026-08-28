"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  History,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { VendorFinanceSummary, PayoutRequest } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export default function SellerFinancePage() {
  const { addToast } = useToastStore();
  const [finance, setFinance] = useState<VendorFinanceSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Request Payout Form
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(100);
  const [payoutNotes, setPayoutNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFinanceData = async () => {
    try {
      setIsLoading(true);
      const [finRes, payRes] = await Promise.all([
        api.get("/ledger/summary"),
        api.get("/ledger/payouts"),
      ]);

      if (finRes.data.success) setFinance(finRes.data.data);
      if (payRes.data.success) setPayouts(payRes.data.data.items || []);
    } catch (err) {
      console.error("Failed to load seller finance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finance || payoutAmount > finance.current_balance || payoutAmount <= 0) {
      addToast({
        type: "error",
        title: "Invalid Amount",
        message: "Payout amount exceeds current available balance.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/ledger/payouts", {
        amount: Number(payoutAmount),
        notes: payoutNotes || undefined,
      });

      if (res.data.success) {
        addToast({
          type: "success",
          title: "Payout Requested",
          message: `Your request for ${formatCurrency(payoutAmount)} was submitted for admin settlement.`,
        });
        setShowPayoutModal(false);
        await loadFinanceData();
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Request Failed",
        message: err.response?.data?.message || "Could not submit payout request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Financial Ledger & Payouts</h1>
            <p className="text-xs text-gray-500 mt-1">
              Real-time balance tracking, multi-vendor commission debits, and withdrawal settlements.
            </p>
          </div>

          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={!finance || finance.current_balance <= 0}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs rounded-xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto disabled:bg-gray-300"
          >
            <PlusCircle className="w-4 h-4" /> Request Payout
          </button>
        </div>

        {/* Finance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs text-gray-400">Available For Withdrawal</span>
            <p className="text-3xl font-black text-emerald-600">
              {formatCurrency(finance?.current_balance || 0)}
            </p>
            <p className="text-[11px] text-gray-400">Net earned balance</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs text-gray-400">Gross Sales Revenue</span>
            <p className="text-2xl font-black text-gray-900">
              {formatCurrency(finance?.total_sales_revenue || 0)}
            </p>
            <p className="text-[11px] text-gray-400">Total customer orders</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs text-gray-400">Platform Commission</span>
            <p className="text-2xl font-black text-indigo-600">
              {formatCurrency(finance?.total_commission_paid || 0)}
            </p>
            <p className="text-[11px] text-gray-400">Automatic platform split</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs text-gray-400">Settled Payouts</span>
            <p className="text-2xl font-black text-gray-900">
              {formatCurrency(finance?.total_payouts_settled || 0)}
            </p>
            <p className="text-[11px] text-gray-400">Disbursed to bank account</p>
          </div>
        </div>

        {/* Recent Ledger Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <History className="w-4 h-4 text-indigo-600" /> Recent Ledger Entries
          </h2>

          {finance?.recent_transactions && finance.recent_transactions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {finance.recent_transactions.map((tx) => {
                const isCredit = tx.transaction_type.includes("CREDIT");
                return (
                  <div key={tx.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                        isCredit ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{tx.description}</h4>
                        <p className="text-[10px] text-gray-400 font-mono">Ref: {tx.reference_id || "SYSTEM"}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-black text-sm ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                        {isCredit ? "+" : "-"}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        Balance after: {formatCurrency(tx.balance_after)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">No ledger transactions yet.</p>
          )}
        </div>

        {/* Payout Requests History */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100">
            Payout Withdrawal Requests
          </h2>

          {payouts.length > 0 ? (
            <div className="divide-y divide-gray-50 text-xs">
              {payouts.map((p) => (
                <div key={p.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-black text-sm text-gray-900">{formatCurrency(p.amount)}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Requested on {formatDate(p.created_at)}</p>
                  </div>

                  {p.transaction_ref && (
                    <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      TRX: {p.transaction_ref}
                    </span>
                  )}

                  <span className={`px-3 py-1 font-bold rounded-full border ring-1 text-[10px] ${getStatusBadgeClass(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">No payout requests placed.</p>
          )}
        </div>

        {/* Request Payout Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Request Payout
                </h3>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Withdrawal Amount ($) (Max: {formatCurrency(finance?.current_balance || 0)})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={finance?.current_balance || 0}
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Notes / Instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Weekly withdrawal to linked bank account..."
                    value={payoutNotes}
                    onChange={(e) => setPayoutNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-xl shadow-md disabled:bg-gray-300"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Payout Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

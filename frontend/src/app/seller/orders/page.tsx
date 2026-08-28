"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { SubOrder, SubOrderStatus } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export default function SellerOrdersPage() {
  const { addToast } = useToastStore();
  const [subOrders, setSubOrders] = useState<SubOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubOrder, setSelectedSubOrder] = useState<SubOrder | null>(null);

  // Fulfillment Form
  const [newStatus, setNewStatus] = useState<SubOrderStatus>("SHIPPED");
  const [carrier, setCarrier] = useState("FedEx");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const loadSubOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/orders/vendor/sub-orders?limit=50");
      if (res.data.success) {
        setSubOrders(res.data.data.items || []);
      }
    } catch (err) {
      console.error("Failed to load seller orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubOrders();
  }, []);

  const handleUpdateFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubOrder) return;

    try {
      setIsUpdating(true);
      const res = await api.put(`/orders/vendor/sub-orders/${selectedSubOrder.id}/fulfillment`, {
        status: newStatus,
        shipping_carrier: carrier || undefined,
        tracking_number: trackingNumber || undefined,
        notes: notes || undefined,
      });

      if (res.data.success) {
        addToast({
          type: "success",
          title: "Fulfillment Updated!",
          message: `Package #${selectedSubOrder.sub_order_number} marked as ${newStatus}.`,
        });
        setSelectedSubOrder(null);
        await loadSubOrders();
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Could not update status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Order Fulfillment Center</h1>
          <p className="text-xs text-gray-500 mt-1">
            Independently manage packages, dispatch with carriers, and update live tracking numbers.
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Package #</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">Your Payout</th>
                  <th className="p-4">Carrier / Tracking</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">Loading sub-orders...</td>
                  </tr>
                ) : subOrders.length > 0 ? (
                  subOrders.map((so) => (
                    <tr key={so.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-gray-900">#{so.sub_order_number}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(so.created_at)}</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          {so.items?.map((item) => (
                            <p key={item.id} className="text-gray-700 truncate max-w-xs">
                              {item.quantity}x {item.product_title} ({item.variant_title})
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">{formatCurrency(so.subtotal)}</td>
                      <td className="p-4 font-bold text-emerald-600">{formatCurrency(so.vendor_payout_amount)}</td>
                      <td className="p-4">
                        {so.tracking_number ? (
                          <div>
                            <span className="font-semibold text-gray-800">{so.shipping_carrier}</span>
                            <p className="font-mono text-indigo-600 text-[10px]">{so.tracking_number}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not Dispatched</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 font-bold rounded-full border ring-1 text-[10px] ${getStatusBadgeClass(so.status)}`}>
                          {so.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSubOrder(so);
                            setNewStatus(so.status);
                            setCarrier(so.shipping_carrier || "FedEx");
                            setTrackingNumber(so.tracking_number || "");
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No customer orders received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Update Fulfillment */}
        {selectedSubOrder && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6 animate-scale-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>Fulfill Package #{selectedSubOrder.sub_order_number}</span>
                </div>
                <button
                  onClick={() => setSelectedSubOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleUpdateFulfillment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fulfillment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as SubOrderStatus)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="AWAITING_FULFILLMENT">AWAITING FULFILLMENT</option>
                    <option value="PROCESSING">PROCESSING (Packing)</option>
                    <option value="SHIPPED">SHIPPED (In Transit)</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Carrier</label>
                    <input
                      type="text"
                      placeholder="e.g. FedEx, UPS, DHL, USPS"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      placeholder="FDX-9982348"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fulfillment Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Optional notes for customer or tracking audit..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSubOrder(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl shadow-md disabled:bg-gray-300"
                  >
                    {isUpdating ? "Saving..." : "Save Fulfillment"}
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

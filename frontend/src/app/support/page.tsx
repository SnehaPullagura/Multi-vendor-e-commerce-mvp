"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, PlusCircle, Clock, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SupportTicket } from "@/types/commerce_extensions";
import { api } from "@/lib/api";
import { formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        setIsLoading(true);
        const res = await api.get("/support/my-tickets");
        if (res.data.success) setTickets(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTickets();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Customer Support & Inquiries</h1>
            <p className="text-xs text-gray-500 mt-1">Get direct help from independent merchants and platform escrow dispute mediators.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Ticket #</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.length > 0 ? (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600">{t.ticket_number}</td>
                      <td className="p-4 font-semibold text-gray-900">{t.subject}</td>
                      <td className="p-4 text-gray-600">{t.category}</td>
                      <td className="p-4 font-bold text-gray-700">{t.priority}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 font-bold rounded-full border text-[10px] ${getStatusBadgeClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400">{formatDate(t.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">No support tickets found.</td>
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

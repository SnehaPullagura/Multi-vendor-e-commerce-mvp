"use client";

import React, { useState } from "react";
import { Clock, CheckCircle, Flame, AlertCircle, ChefHat, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

interface KDSTicket {
  id: string;
  kot_number: string;
  table: string;
  station: string;
  server: string;
  elapsed_min: number;
  priority: "NORMAL" | "RUSH" | "VIP";
  items: Array<{ name: string; qty: number; notes?: string; done?: boolean }>;
}

export default function KDSPage() {
  const [stationFilter, setStationFilter] = useState("ALL");
  const [tickets, setTickets] = useState<KDSTicket[]>([
    {
      id: "k1",
      kot_number: "KOT #104",
      table: "Table 2 (Dine-In)",
      station: "Grill",
      server: "Marco V.",
      elapsed_min: 14,
      priority: "RUSH",
      items: [
        { name: "Truffle Wagyu Burger", qty: 2, notes: "Medium Rare, No Onion" },
        { name: "Double Bacon Smashburger", qty: 1, notes: "Extra Cheese" },
      ],
    },
    {
      id: "k2",
      kot_number: "KOT #105",
      table: "Table 4 (Dine-In)",
      station: "Pizza",
      server: "Sarah L.",
      elapsed_min: 6,
      priority: "NORMAL",
      items: [
        { name: "Wood-Fired Margherita Pizza", qty: 1, notes: "Crispy Crust" },
        { name: "Quattro Formaggi White Pizza", qty: 1 },
      ],
    },
    {
      id: "k3",
      kot_number: "KOT #106",
      table: "Takeaway #44",
      station: "Wok & Curry",
      server: "Online App",
      elapsed_min: 2,
      priority: "NORMAL",
      items: [
        { name: "Butter Chicken with Garlic Naan", qty: 2, notes: "Spicy Level 3" },
      ],
    },
  ]);

  const markItemDone = (ticketId: string, itemIdx: number) => {
    setTickets(
      tickets.map((t) => {
        if (t.id !== ticketId) return t;
        const newItems = [...t.items];
        newItems[itemIdx] = { ...newItems[itemIdx], done: !newItems[itemIdx].done };
        return { ...t, items: newItems };
      })
    );
  };

  const completeTicket = (ticketId: string) => {
    setTickets(tickets.filter((t) => t.id !== ticketId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ChefHat className="w-7 h-7 text-amber-400" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black">Kitchen Display System (KDS)</h1>
              <p className="text-xs text-slate-400">Live KOT queues, preparation timers, and station routing.</p>
            </div>
          </div>

          <div className="flex gap-2">
            {["ALL", "Grill", "Pizza", "Wok & Curry", "Desserts"].map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  stationFilter === st ? "bg-amber-400 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((t) => {
            const isDelayed = t.elapsed_min >= 12;
            return (
              <div
                key={t.id}
                className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                  isDelayed
                    ? "bg-slate-800/90 border-rose-500 shadow-lg shadow-rose-950/40"
                    : "bg-slate-800/70 border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div>
                      <span className="font-black text-sm text-white">{t.kot_number}</span>
                      <p className="text-xs text-amber-400 font-semibold">{t.table}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-4 h-4 ${isDelayed ? "text-rose-400 animate-pulse" : "text-slate-400"}`} />
                      <span className={`text-xs font-mono font-black ${isDelayed ? "text-rose-400 font-black" : "text-slate-300"}`}>
                        {t.elapsed_min} min
                      </span>
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    {t.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => markItemDone(t.id, idx)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                          item.done ? "bg-emerald-950/40 border border-emerald-800/50 line-through opacity-60" : "bg-slate-900/60 border border-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{item.name}</span>
                          <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">x{item.qty}</span>
                        </div>
                        {item.notes && <p className="text-[10px] text-amber-300/80 mt-1 italic">Note: {item.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => completeTicket(t.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> Order Prepared & Ready
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

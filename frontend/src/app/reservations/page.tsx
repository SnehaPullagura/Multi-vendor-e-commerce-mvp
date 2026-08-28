"use client";

import React, { useState } from "react";
import { Calendar, Clock, Users, Phone, CheckCircle, Plus, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ReservationsPage() {
  const reservations = [
    { id: "res-1", guest: "Jonathan Sterling", party: 4, time: "19:00", table: "Table 4 (Dine-In)", phone: "+1 (555) 234-5678", notes: "Anniversary celebration; requested champagne on arrival", status: "CONFIRMED" },
    { id: "res-2", guest: "Dr. Rachel Green", party: 6, time: "19:30", table: "Table 5 (Dining Room)", phone: "+1 (555) 876-5432", notes: "Gluten allergy for 1 guest", status: "SEATED" },
    { id: "res-3", guest: "Alexander Vance", party: 2, time: "20:00", table: "Table 1 (Window)", phone: "+1 (555) 345-6789", notes: "Quiet corner requested", status: "CONFIRMED" },
    { id: "res-4", guest: "Victoria Belmont", party: 8, time: "20:30", table: "Private Dining Suite", phone: "+1 (555) 987-6543", notes: "Executive dinner; preset tasting menu", status: "PENDING" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Table Reservations & Waitlist</h1>
            <p className="text-xs text-gray-500 mt-1">Manage guest bookings, seating assignments, and special dietary requests.</p>
          </div>
          <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all">
            <Plus className="w-3.5 h-3.5" /> New Reservation
          </button>
        </div>

        {/* Reservation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900">{r.guest}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-gray-400" /> {r.phone}
                  </p>
                </div>
                <span className={`px-2.5 py-1 font-bold text-[10px] rounded-full border ${
                  r.status === "SEATED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  r.status === "CONFIRMED" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                  "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Party</span>
                  <p className="font-bold text-gray-900 mt-0.5">{r.party} Guests</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Time</span>
                  <p className="font-bold text-gray-900 mt-0.5">{r.time}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Table</span>
                  <p className="font-bold text-indigo-600 mt-0.5">{r.table.split(" ")[0]}</p>
                </div>
              </div>

              {r.notes && (
                <p className="text-[11px] text-gray-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  Note: {r.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

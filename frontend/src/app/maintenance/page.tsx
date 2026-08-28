"use client";

import React, { useState } from "react";
import { Wrench, AlertTriangle, CheckCircle, Calendar, Shield, Clock, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

export default function MaintenancePage() {
  const assets = [
    { tag: "AST-001", name: "Rational iCombi Pro 10-Pan Combi Oven", location: "Main Kitchen", status: "OPTIMAL", nextService: "2024-11-15", costYtd: 350.00 },
    { tag: "AST-002", name: "True 2-Door Reach-In Freezer", location: "Walk-in Storage", status: "MAINTENANCE_REQUIRED", nextService: "2024-09-02", costYtd: 580.00 },
    { tag: "AST-003", name: "La Marzocco Linea PB 3-Group Espresso Machine", location: "Bar Area", status: "OPTIMAL", nextService: "2024-10-20", costYtd: 240.00 },
    { tag: "AST-004", name: "Hobart Flight-Type Conveyor Dishwasher", location: "Dish Pit", status: "OPTIMAL", nextService: "2024-12-01", costYtd: 1200.00 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Equipment Asset & Preventative Maintenance</h1>
            <p className="text-xs text-gray-500 mt-1">Track kitchen asset health, service histories, and scheduled warranty inspections.</p>
          </div>
          <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all">
            <Plus className="w-3.5 h-3.5" /> Log Work Order
          </button>
        </div>

        {/* Asset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assets.map((a) => (
            <div key={a.tag} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">{a.tag}</span>
                  <h3 className="text-sm font-black text-gray-900 mt-0.5">{a.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{a.location}</p>
                </div>
                <span className={`px-2.5 py-1 font-bold text-[10px] rounded-full border ${
                  a.status === "OPTIMAL" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  {a.status.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Next Scheduled PM</span>
                  <p className="font-bold text-gray-900 mt-0.5">{a.nextService}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">YTD Maintenance Cost</span>
                  <p className="font-bold text-indigo-600 mt-0.5">{formatCurrency(a.costYtd)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

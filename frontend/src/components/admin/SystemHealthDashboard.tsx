"use client";

import React from "react";
import { Activity, Server, Database, ShieldAlert, Cpu, HardDrive, Wifi } from "lucide-react";

export const SystemHealthDashboard: React.FC = () => {
  const services = [
    { name: "FastAPI REST Gateway", status: "HEALTHY", latency: "18ms", uptime: "99.98%", load: "12%" },
    { name: "PostgreSQL Database Engine", status: "HEALTHY", latency: "4ms", uptime: "99.99%", load: "24%" },
    { name: "Redis Memory Cache & Session Store", status: "HEALTHY", latency: "1ms", uptime: "100.0%", load: "8%" },
    { name: "Background Workflow Task Queue", status: "HEALTHY", latency: "35ms", uptime: "99.95%", load: "18%" },
    { name: "Stripe & PayPal Escrow Webhooks", status: "HEALTHY", latency: "42ms", uptime: "99.99%", load: "5%" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-900">Infrastructure & Cluster Telemetry</h3>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
          ● All Systems Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Cpu className="w-4 h-4 text-indigo-500" /> CPU Utilization
          </div>
          <p className="text-2xl font-black text-gray-900">14.2%</p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: "14.2%" }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <HardDrive className="w-4 h-4 text-emerald-500" /> RAM Allocation
          </div>
          <p className="text-2xl font-black text-gray-900">1.8 / 8.0 GB</p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "22.5%" }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Wifi className="w-4 h-4 text-cyan-500" /> Avg API Latency
          </div>
          <p className="text-2xl font-black text-gray-900">22.4 ms</p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-600 h-full rounded-full" style={{ width: "18%" }} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-gray-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-3">Component / Microservice</th>
              <th className="p-3">Health Status</th>
              <th className="p-3 text-center">Avg Response</th>
              <th className="p-3 text-center">Uptime (30d)</th>
              <th className="p-3 text-right">Load</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-gray-400" /> {s.name}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] border border-emerald-200">
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-center font-mono text-gray-600">{s.latency}</td>
                <td className="p-3 text-center font-semibold text-gray-900">{s.uptime}</td>
                <td className="p-3 text-right font-mono font-bold text-indigo-600">{s.load}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

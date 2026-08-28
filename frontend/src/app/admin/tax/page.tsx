"use client";

import { useState } from "react";
import { Calculator, Plus, Search, FileText, Globe, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface TaxRule {
  id: string;
  state: string;
  state_name: string;
  rate: number;
  applies_to_shipping: boolean;
  type: string;
}

export default function AdminTaxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const taxRules: TaxRule[] = [
    { id: "1", state: "CA", state_name: "California", rate: 7.25, applies_to_shipping: false, type: "SALES_TAX" },
    { id: "2", state: "TX", state_name: "Texas", rate: 6.25, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "3", state: "NY", state_name: "New York", rate: 4.00, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "4", state: "FL", state_name: "Florida", rate: 6.00, applies_to_shipping: false, type: "SALES_TAX" },
    { id: "5", state: "IL", state_name: "Illinois", rate: 6.25, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "6", state: "PA", state_name: "Pennsylvania", rate: 6.00, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "7", state: "OH", state_name: "Ohio", rate: 5.75, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "8", state: "GA", state_name: "Georgia", rate: 4.00, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "9", state: "OR", state_name: "Oregon", rate: 0.00, applies_to_shipping: false, type: "NO_TAX" },
    { id: "10", state: "MT", state_name: "Montana", rate: 0.00, applies_to_shipping: false, type: "NO_TAX" },
    { id: "11", state: "NH", state_name: "New Hampshire", rate: 0.00, applies_to_shipping: false, type: "NO_TAX" },
    { id: "12", state: "DE", state_name: "Delaware", rate: 0.00, applies_to_shipping: false, type: "NO_TAX" },
    { id: "13", state: "WA", state_name: "Washington", rate: 6.50, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "14", state: "NJ", state_name: "New Jersey", rate: 6.625, applies_to_shipping: true, type: "SALES_TAX" },
    { id: "15", state: "TN", state_name: "Tennessee", rate: 7.00, applies_to_shipping: true, type: "SALES_TAX" },
  ];

  const filtered = taxRules.filter((r) =>
    !searchQuery || r.state_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Tax Configuration</h1>
            <p className="text-xs text-gray-500 mt-1">Manage sales tax rates by jurisdiction for automated tax calculation at checkout.</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tax Rule
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Globe, label: "Jurisdictions", value: taxRules.length },
            { icon: Calculator, label: "Tax-Free States", value: taxRules.filter((r) => r.rate === 0).length },
            { icon: FileText, label: "Ship-Taxable", value: taxRules.filter((r) => r.applies_to_shipping).length },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <s.icon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search states..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">State</th>
                  <th className="p-4">Code</th>
                  <th className="p-4 text-center">Rate</th>
                  <th className="p-4 text-center">Shipping Taxed</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-gray-400" /> {r.state_name}
                    </td>
                    <td className="p-4 font-mono text-gray-600">{r.state}</td>
                    <td className="p-4 text-center font-extrabold text-gray-900">{r.rate}%</td>
                    <td className="p-4 text-center">
                      {r.applies_to_shipping ? (
                        <span className="text-emerald-600 font-bold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{r.type.replace(/_/g, " ")}</td>
                    <td className="p-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Warehouse, Package, AlertTriangle, Plus, ArrowUpDown, RefreshCw, Search, MapPin, Boxes } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  is_primary: boolean;
  is_active: boolean;
}

interface StockItem {
  id: string;
  warehouse_id: string;
  warehouse_name: string;
  variant_id: string;
  sku: string;
  product_title: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  reorder_threshold: number;
}

export default function SellerInventoryPage() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    warehouse_id: "",
    variant_id: "",
    quantity_change: 0,
    reason: "",
  });

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setIsLoading(true);
      const res = await api.get("/inventory/warehouses");
      if (res.data.success) {
        setWarehouses(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const sampleStock: StockItem[] = [
    { id: "1", warehouse_id: "w1", warehouse_name: "Primary DC", variant_id: "v1", sku: "QNT-ANC-OBS", product_title: "Quantum ANC Pro Headphones - Matte Obsidian", quantity_on_hand: 156, quantity_reserved: 12, quantity_available: 144, reorder_threshold: 20 },
    { id: "2", warehouse_id: "w1", warehouse_name: "Primary DC", variant_id: "v2", sku: "QNT-ANC-ARC", product_title: "Quantum ANC Pro Headphones - Silver Arctic", quantity_on_hand: 8, quantity_reserved: 3, quantity_available: 5, reorder_threshold: 15 },
    { id: "3", warehouse_id: "w1", warehouse_name: "Primary DC", variant_id: "v3", sku: "PLS-MIC-BLK", product_title: "PulseStudio Pro USB-C Microphone - Standard Black", quantity_on_hand: 67, quantity_reserved: 0, quantity_available: 67, reorder_threshold: 10 },
    { id: "4", warehouse_id: "w2", warehouse_name: "West Coast Hub", variant_id: "v4", sku: "VTX-KB-RED", product_title: "Vortex Ultra Gaming Keyboard - Linear Red", quantity_on_hand: 0, quantity_reserved: 0, quantity_available: 0, reorder_threshold: 25 },
    { id: "5", warehouse_id: "w2", warehouse_name: "West Coast Hub", variant_id: "v5", sku: "SPK-360-GRN", product_title: "SpectraSound 360 Speaker - Forest Green", quantity_on_hand: 42, quantity_reserved: 8, quantity_available: 34, reorder_threshold: 10 },
  ];

  const displayStock = sampleStock.filter((item) => {
    const matchesWarehouse = selectedWarehouse === "all" || item.warehouse_id === selectedWarehouse;
    const matchesSearch = !searchQuery || item.product_title.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWarehouse && matchesSearch;
  });

  const lowStockCount = sampleStock.filter((s) => s.quantity_available > 0 && s.quantity_available <= s.reorder_threshold).length;
  const outOfStockCount = sampleStock.filter((s) => s.quantity_available === 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Inventory Management</h1>
            <p className="text-xs text-gray-500 mt-1">Multi-warehouse stock tracking, adjustments, and movement history.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white text-gray-700 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Sync
            </button>
            <button
              onClick={() => setShowAdjustModal(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5" /> Adjust Stock
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Boxes, label: "Total SKUs", value: sampleStock.length, color: "text-indigo-600 bg-indigo-50" },
            { icon: Package, label: "In Stock", value: sampleStock.filter((s) => s.quantity_available > 0).length, color: "text-emerald-600 bg-emerald-50" },
            { icon: AlertTriangle, label: "Low Stock", value: lowStockCount, color: "text-amber-600 bg-amber-50" },
            { icon: AlertTriangle, label: "Out of Stock", value: outOfStockCount, color: "text-rose-600 bg-rose-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</span>
              </div>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            />
          </div>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="all">All Warehouses</option>
            <option value="w1">Primary DC</option>
            <option value="w2">West Coast Hub</option>
          </select>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Product / SKU</th>
                  <th className="p-4">Warehouse</th>
                  <th className="p-4 text-center">On Hand</th>
                  <th className="p-4 text-center">Reserved</th>
                  <th className="p-4 text-center">Available</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayStock.map((item) => {
                  const isLow = item.quantity_available > 0 && item.quantity_available <= item.reorder_threshold;
                  const isOut = item.quantity_available === 0;
                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${isOut ? "bg-rose-50/30" : isLow ? "bg-amber-50/30" : ""}`}>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{item.product_title}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.sku}</p>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3 h-3" /> {item.warehouse_name}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-gray-900">{item.quantity_on_hand}</td>
                      <td className="p-4 text-center text-gray-600">{item.quantity_reserved}</td>
                      <td className="p-4 text-center font-bold text-gray-900">{item.quantity_available}</td>
                      <td className="p-4">
                        {isOut ? (
                          <span className="px-2.5 py-0.5 font-bold rounded-full border text-[10px] bg-rose-50 text-rose-700 border-rose-200">Out of Stock</span>
                        ) : isLow ? (
                          <span className="px-2.5 py-0.5 font-bold rounded-full border text-[10px] bg-amber-50 text-amber-700 border-amber-200">Low Stock</span>
                        ) : (
                          <span className="px-2.5 py-0.5 font-bold rounded-full border text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">In Stock</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

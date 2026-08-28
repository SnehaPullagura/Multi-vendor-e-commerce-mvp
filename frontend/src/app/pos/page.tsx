"use client";

import React, { useState } from "react";
import { Utensils, ShoppingBag, CreditCard, Trash2, Plus, Minus, Send, SplitSquareVertical, User, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { formatCurrency } from "@/lib/utils";

interface POSItem {
  id: string;
  name: string;
  price: number;
  category: string;
  code: string;
}

export default function POSTerminalPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY" | "DELIVERY">("DINE_IN");
  const [selectedTable, setSelectedTable] = useState("T2");
  const [cart, setCart] = useState<Array<{ item: POSItem; quantity: number; notes: string }>>([
    {
      item: { id: "p1", name: "Truffle Wagyu Burger", price: 26.00, category: "Burgers", code: "WAG-01" },
      quantity: 2,
      notes: "Medium Rare",
    },
    {
      item: { id: "p2", name: "Wood-Fired Margherita Pizza", price: 18.00, category: "Pizza", code: "PIZ-01" },
      quantity: 1,
      notes: "Extra Basil",
    },
  ]);

  const categories = ["All", "Starters", "Main Course", "Burgers", "Pizza", "Beverages", "Desserts"];

  const menuCatalog: POSItem[] = [
    { id: "p1", name: "Truffle Wagyu Burger", price: 26.00, category: "Burgers", code: "WAG-01" },
    { id: "p2", name: "Wood-Fired Margherita Pizza", price: 18.00, category: "Pizza", code: "PIZ-01" },
    { id: "p3", name: "Butter Chicken with Garlic Naan", price: 22.50, category: "Main Course", code: "IND-01" },
    { id: "p4", name: "Crispy Calamari Fritti", price: 14.50, category: "Starters", code: "APP-01" },
    { id: "p5", name: "San Pellegrino Sparkling (750ml)", price: 6.50, category: "Beverages", code: "BEV-01" },
    { id: "p6", name: "Matcha Lava Cake & Gelato", price: 12.00, category: "Desserts", code: "DES-01" },
    { id: "p7", name: "Double Smash Bacon Cheeseburger", price: 19.50, category: "Burgers", code: "WAG-02" },
    { id: "p8", name: "Quattro Formaggi White Pizza", price: 21.00, category: "Pizza", code: "PIZ-02" },
  ];

  const filteredItems = selectedCategory === "All" ? menuCatalog : menuCatalog.filter((m) => m.category === selectedCategory);

  const addItemToCart = (item: POSItem) => {
    const existing = cart.find((c) => c.item.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { item, quantity: 1, notes: "" }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((c) => (c.item.id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = subtotal * 0.0825;
  const grandTotal = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Menu & POS Browser */}
        <div className="lg:col-span-8 space-y-4">
          {/* Service Mode Selector */}
          <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded-2xl border border-gray-200 shadow-sm gap-2">
            <div className="flex gap-1.5">
              {(["DINE_IN", "TAKEAWAY", "DELIVERY"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    orderType === type ? "bg-brand-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>
            {orderType === "DINE_IN" && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">Table:</span>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 font-bold text-gray-900 bg-white outline-none"
                >
                  {["T1", "T2", "T3", "T4", "T5", "Bar 01", "Bar 02"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Categories Pill Nav */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addItemToCart(item)}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-left hover:border-brand-500 hover:shadow-md transition-all flex flex-col justify-between h-32 group"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">{item.code}</span>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 mt-0.5">
                    {item.name}
                  </h4>
                </div>
                <span className="text-sm font-black text-gray-900">{formatCurrency(item.price)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Order Ticket & Billing */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between h-[calc(100vh-140px)] sticky top-20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Current Order Ticket</h3>
                <p className="text-[11px] text-gray-400">{orderType} • {selectedTable} • Server: Marco V.</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-200">
                In Progress
              </span>
            </div>

            {/* Cart Items List */}
            <div className="overflow-y-auto max-h-72 space-y-3 py-3 divide-y divide-gray-50">
              {cart.map((c) => (
                <div key={c.item.id} className="pt-2 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-gray-900">{c.item.name}</h5>
                    <p className="text-[10px] text-gray-400 font-mono">{formatCurrency(c.item.price)} each</p>
                    {c.notes && <p className="text-[10px] text-indigo-600 italic">"{c.notes}"</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                      <button onClick={() => updateQuantity(c.item.id, -1)} className="p-1 hover:bg-white rounded text-gray-600">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-gray-900">{c.quantity}</span>
                      <button onClick={() => updateQuantity(c.item.id, 1)} className="p-1 hover:bg-white rounded text-gray-600">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 w-14 text-right">
                      {formatCurrency(c.item.price * c.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals & Actions */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Sales Tax (8.25%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-gray-100">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all">
                <Send className="w-3.5 h-3.5" /> Send to KDS
              </button>
              <button className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all">
                <CreditCard className="w-3.5 h-3.5" /> Charge & Pay
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

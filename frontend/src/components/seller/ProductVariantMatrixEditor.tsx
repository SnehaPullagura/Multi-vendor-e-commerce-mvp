"use client";

import React, { useState } from "react";
import { Plus, Trash2, Layers, Check } from "lucide-react";

export interface VariantRow {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock_quantity: number;
  barcode?: string;
  weight_oz?: number;
}

interface ProductVariantMatrixEditorProps {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
  basePrice: number;
}

export const ProductVariantMatrixEditor: React.FC<ProductVariantMatrixEditorProps> = ({
  variants,
  onChange,
  basePrice,
}) => {
  const addVariant = () => {
    const nextIdx = variants.length + 1;
    const newVariant: VariantRow = {
      id: "var-" + Date.now(),
      title: `Option ${nextIdx}`,
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      price: basePrice,
      stock_quantity: 25,
    };
    onChange([...variants, newVariant]);
  };

  const updateVariant = (id: string, field: keyof VariantRow, val: any) => {
    const updated = variants.map((v) => (v.id === id ? { ...v, [field]: val } : v));
    onChange(updated);
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-gray-900">SKU & Variant Matrix</h3>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Variant
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-gray-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-2.5">Variant Title</th>
              <th className="p-2.5">SKU Code</th>
              <th className="p-2.5">Price ($)</th>
              <th className="p-2.5">Stock</th>
              <th className="p-2.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {variants.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50">
                <td className="p-2">
                  <input
                    type="text"
                    value={v.title}
                    onChange={(e) => updateVariant(v.id, "title", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => updateVariant(v.id, "sku", e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    step="0.01"
                    value={v.price}
                    onChange={(e) => updateVariant(v.id, "price", parseFloat(e.target.value) || 0)}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={v.stock_quantity}
                    onChange={(e) => updateVariant(v.id, "stock_quantity", parseInt(e.target.value) || 0)}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeVariant(v.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import Link from "next/link";
import { Check, X, Star, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface CompareProduct {
  id: string;
  title: string;
  slug: string;
  brand: string;
  base_price: number;
  rating: number;
  specs: Record<string, string>;
  in_stock: boolean;
}

interface ProductComparisonGridProps {
  products: CompareProduct[];
  onAddToCart?: (productId: string) => void;
}

export const ProductComparisonGrid: React.FC<ProductComparisonGridProps> = ({
  products,
  onAddToCart,
}) => {
  if (!products || products.length === 0) {
    return <div className="text-center py-10 text-xs text-gray-400">Select at least 2 items to compare</div>;
  }

  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              <th className="p-4 w-48 font-bold text-gray-400 uppercase text-[10px]">Specification</th>
              {products.map((p) => (
                <th key={p.id} className="p-4 min-w-[200px] text-center">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{p.brand}</span>
                  <h4 className="font-bold text-xs text-gray-900 mt-0.5 line-clamp-1">{p.title}</h4>
                  <p className="text-sm font-extrabold text-gray-900 mt-1">{formatCurrency(p.base_price)}</p>
                  <button
                    onClick={() => onAddToCart?.(p.id)}
                    className="mt-3 w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    <ShoppingBag className="w-3 h-3" /> Add to Cart
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-slate-50/50">Customer Rating</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-center font-bold text-gray-900">
                  ⭐ {p.rating.toFixed(1)} / 5.0
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-slate-50/50">Availability</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.in_stock ? (
                    <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> In Stock
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center justify-center gap-1">
                      <X className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 font-bold text-gray-700 bg-slate-50/50">{key}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center text-gray-600">
                    {p.specs[key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

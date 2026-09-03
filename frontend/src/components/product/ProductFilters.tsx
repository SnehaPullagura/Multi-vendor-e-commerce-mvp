"use client";

import { useState } from "react";
import { Filter, RotateCcw, Sparkles } from "lucide-react";
import { Category } from "@/types";
import { CATEGORY_META_LIST, getCategoryMeta } from "@/lib/categoryMeta";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  brand: string;
  onBrandChange: (brand: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  brand,
  onBrandChange,
  sortBy,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 shadow-sm sticky top-20">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Filter className="w-4 h-4 text-indigo-600" /> Filter Department
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-colors font-medium"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category Departments */}
      <div>
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
          Departments
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory("")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              selectedCategory === ""
                ? "bg-[#0d1e3d] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span>All Departments</span>
            </div>
            <span className="text-[10px] opacity-75">210</span>
          </button>

          {CATEGORY_META_LIST.map((meta) => {
            const isSelected = selectedCategory === meta.slug || selectedCategory === meta.id;
            return (
              <button
                key={meta.id}
                onClick={() => onSelectCategory(meta.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? `${meta.badgeBg} ${meta.badgeText} border ${meta.badgeBorder} font-bold shadow-sm`
                    : "text-gray-600 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{meta.icon}</span>
                  <span className="truncate">{meta.name}</span>
                </div>
                <span className="text-[10px] opacity-70 ml-1 font-mono">35+</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option value="newest">✨ Newest Arrivals</option>
          <option value="price_asc">💵 Price: Low to High</option>
          <option value="price_desc">💎 Price: High to Low</option>
          <option value="title_asc">🔤 Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Filter by Brand
        </label>
        <input
          type="text"
          placeholder="e.g. AeroSound, Nova..."
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

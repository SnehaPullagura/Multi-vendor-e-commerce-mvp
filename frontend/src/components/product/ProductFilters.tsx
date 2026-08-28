"use client";

import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Category } from "@/types";

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Filter className="w-4 h-4 text-brand-600" /> Filter Catalog
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title_asc">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Category List */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory("")}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === ""
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Brand
        </label>
        <input
          type="text"
          placeholder="Filter by brand..."
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

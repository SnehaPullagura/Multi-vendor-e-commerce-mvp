"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Category, Product } from "@/types";
import { api } from "@/lib/api";
import { Search, PackageOpen, Sparkles, Filter, X } from "lucide-react";
import { CATEGORY_META_LIST, getCategoryMeta } from "@/lib/categoryMeta";

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "newest");
  const [page, setPage] = useState(1);

  // Load Categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get("/categories");
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Sync category param from URL if changed
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null && urlCat !== category) {
      setCategory(urlCat);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch Products with filters
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (category) params.append("category_id", category);
      if (brand) params.append("brand", brand);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (sortBy) params.append("sort_by", sortBy);
      params.append("page", page.toString());
      params.append("page_size", "12");

      let res;
      if (searchQuery) {
        res = await api.get(`/search?${params.toString()}`);
      } else {
        res = await api.get(`/products/list?${params.toString()}`);
      }

      if (res.data.success) {
        setProducts(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, category, brand, minPrice, maxPrice, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSelectCategory = (catSlug: string) => {
    setCategory(catSlug);
    setPage(1);
    const newParams = new URLSearchParams(searchParams.toString());
    if (catSlug) {
      newParams.set("category", catSlug);
    } else {
      newParams.delete("category");
    }
    router.push(`/products?${newParams.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setPage(1);
    router.push("/products");
  };

  const activeCategoryMeta = category ? getCategoryMeta(category) : null;

  return (
    <div className="w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Marketplace Catalog"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore <span className="font-semibold text-gray-900">{total}</span> verified products across 6 curated marketplace departments
          </p>
        </div>

        {/* Quick Search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, brand, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Differentiated Category Selector Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => handleSelectCategory("")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
            !category
              ? "bg-[#0d1e3d] text-white shadow-md scale-105"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span>✨</span>
          <span>All Departments (210)</span>
        </button>

        {CATEGORY_META_LIST.map((c) => {
          const isSelected = category === c.slug || category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCategory(c.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                isSelected
                  ? `bg-gradient-to-r ${c.gradient} text-white shadow-md scale-105 ring-2 ring-offset-2 ring-brand-500`
                  : `bg-white ${c.badgeText} hover:bg-slate-50 border ${c.badgeBorder}`
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name.split(" ")[0]} (35+)</span>
            </button>
          );
        })}
      </div>

      {/* Active Department Spotlight Banner */}
      {activeCategoryMeta && (
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{activeCategoryMeta.icon}</span>
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">
                Department Spotlight
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {activeCategoryMeta.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              {activeCategoryMeta.description}
            </p>
            {/* Subcategory Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {activeCategoryMeta.subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSelectCategory("")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Show All Departments</span>
            </button>
          </div>
        </div>
      )}

      {/* Layout Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            selectedCategory={category}
            onSelectCategory={(c) => {
              setCategory(c);
              setPage(1);
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
              setPage(1);
            }}
            brand={brand}
            onBrandChange={(b) => {
              setBrand(b);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(s) => {
              setSortBy(s);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-80" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No matching products found</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1 mb-6">
                We couldn't find any products matching your current filters or search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-3xl" />}>
          <ProductsCatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

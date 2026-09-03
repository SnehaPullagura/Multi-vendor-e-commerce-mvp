"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Store,
  ShieldCheck,
  Zap,
  TrendingUp,
  PackageCheck,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Category, Product, VendorPublic } from "@/types";
import { api } from "@/lib/api";
import { CATEGORY_META_LIST } from "@/lib/categoryMeta";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [departmentProducts, setDepartmentProducts] = useState<Product[]>([]);
  const [activeDepartment, setActiveDepartment] = useState<string>("electronics");
  const [isDeptLoading, setIsDeptLoading] = useState(false);
  const [vendors, setVendors] = useState<VendorPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes, vendRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products/list?page_size=8"),
          api.get("/vendors?limit=4"),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.data.items);
        if (vendRes.data.success) {
          const vendorData = vendRes.data.data;
          setVendors(Array.isArray(vendorData) ? vendorData : vendorData.items || []);
        }
      } catch (err) {
        console.error("Failed to load home page content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Fetch department specific products when tab changes
  useEffect(() => {
    async function loadDepartmentProducts() {
      setIsDeptLoading(true);
      try {
        const res = await api.get(`/products/list?category_id=${activeDepartment}&limit=4`);
        if (res.data.success) {
          setDepartmentProducts(res.data.data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch department products:", err);
      } finally {
        setIsDeptLoading(false);
      }
    }
    loadDepartmentProducts();
  }, [activeDepartment]);

  const activeDeptMeta = CATEGORY_META_LIST.find((c) => c.slug === activeDepartment) || CATEGORY_META_LIST[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1e3d] via-[#102447] to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Over 210 Differentiated Products Across 6 Departments
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            A Curated Multi-Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-amber-300">Commerce Ecosystem</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Shop directly from verified independent specialists in high-performance electronics, Portuguese leather fashion, Scandinavian home living, clinical skincare, endurance sports, and gourmet provisions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <PackageCheck className="w-5 h-5" /> Explore All 210 Products
            </Link>
            <Link
              href="/register-seller"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              <Store className="w-5 h-5" /> Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Differentiated Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORY_META_LIST.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                  35+
                </span>
              </div>
              <div className="min-w-0 w-full">
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate group-hover:text-indigo-600 transition-colors">
                  {cat.name.split(" ")[0]}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{cat.tagline.split(" ")[0] + " & More"}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Differentiated Department Showcase (Tabbed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Department Focus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Shop by Specialized Department
            </h2>
          </div>
          <Link
            href={`/products?category=${activeDepartment}`}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 self-start md:self-auto"
          >
            Explore all {activeDeptMeta.name} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Department Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_META_LIST.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveDepartment(c.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shadow-sm ${
                activeDepartment === c.slug
                  ? `bg-gradient-to-r ${c.gradient} text-white shadow-md scale-105 ring-2 ring-offset-2 ring-indigo-500`
                  : `bg-white ${c.badgeText} hover:bg-slate-50 border ${c.badgeBorder}`
              }`}
            >
              <span className="text-sm">{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Department Info & Products Row */}
        <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeDeptMeta.icon}</span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{activeDeptMeta.name}</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{activeDeptMeta.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeDeptMeta.subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Department Products Grid */}
          <div className="mt-6">
            {isDeptLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-gray-100 animate-pulse h-80" />
                ))}
              </div>
            ) : departmentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {departmentProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">Loading department products...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> Fresh From Vendors
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Featured Arrivals</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-80" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-gray-500 text-sm">No products available at the moment.</p>
          </div>
        )}
      </section>

      {/* Vendor Spotlight */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Verified Merchants</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Top Marketplace Sellers</h2>
            <p className="text-gray-500 text-sm mt-2">
              Every seller on MarketSphere undergoes strict verification and background compliance auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(vendors.length > 0 ? vendors : [
              { id: "1", store_name: "Apex Audio & Tech", slug: "apex-audio-tech", rating: 4.9, description: "Smart tech and premium audio gear" },
              { id: "2", store_name: "Nordic Living & Studio", slug: "nordic-living-studio", rating: 4.8, description: "Minimalist workspace furniture and apparel" },
              { id: "3", store_name: "EcoGoods Organics", slug: "ecogoods-organics", rating: 4.9, description: "Clean skincare and artisanal provisions" },
              { id: "4", store_name: "Quantum Sound Lab", slug: "quantum-sound", rating: 4.9, description: "Studio ANC headphones and mechanical keyboards" },
            ]).map((v) => (
              <div
                key={v.id}
                className="bg-slate-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {v.store_name[0]}
                  </div>
                  <h4 className="font-bold text-gray-900 text-base mt-4">{v.store_name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{v.description || "Verified merchant partner."}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified
                  </span>
                  <span className="font-bold text-gray-900">★ {v.rating || "4.9"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

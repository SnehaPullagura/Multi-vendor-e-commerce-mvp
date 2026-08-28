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
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Category, Product, VendorPublic } from "@/types";
import { api } from "@/lib/api";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<VendorPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes, vendRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products/list?limit=8"),
          api.get("/vendors/public/list?limit=4"),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.data.items);
        if (vendRes.data.success) setVendors(vendRes.data.data.items);
      } catch (err) {
        console.error("Failed to load home page content:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-300 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Discover Verified Independent Sellers
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            A Next-Gen Marketplace For <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">Curated Goods</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Shop directly from verified boutique merchants, high-performance tech creators, and artisanal brands with multi-vendor atomic checkout and guaranteed escrow protection.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <PackageCheck className="w-5 h-5" /> Explore Products
            </Link>
            <Link
              href="/register-seller"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              <Store className="w-5 h-5" /> Launch Your Store
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(categories.length > 0 ? categories : [
            { id: "1", name: "Smart Gear", slug: "smart-gear", description: "Audio & Wearables" },
            { id: "2", name: "Modern Audio", slug: "audio", description: "Noise-cancelling & Studio" },
            { id: "3", name: "Workstations", slug: "workstations", description: "Ergonomic & Accessories" },
            { id: "4", name: "Everyday Tech", slug: "everyday", description: "Power & Cables" },
          ]).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate">Browse items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> Fresh From Vendors
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Trending Products</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
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
            {featuredProducts.map((p) => (
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
              Every seller on MarketSphere undergoes strict KYC verification and background compliance auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(vendors.length > 0 ? vendors : [
              { id: "1", store_name: "Apex Gadgets", slug: "apex-gadgets", rating: 4.9, description: "Smart tech and premium audio" },
              { id: "2", store_name: "Nordic Living", slug: "nordic-living", rating: 5.0, description: "Minimalist workspace gear" },
              { id: "3", store_name: "Quantum Audio", slug: "quantum-audio", rating: 4.8, description: "Studio ANC headphones" },
              { id: "4", store_name: "Circuit Lab", slug: "circuit-lab", rating: 4.9, description: "Modular mechanical keyboards" },
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
                  <span className="font-bold text-gray-900">★ {v.rating || "5.0"}</span>
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

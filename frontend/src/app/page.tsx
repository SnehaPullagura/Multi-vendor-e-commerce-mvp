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

const DEFAULT_FEATURED_PRODUCTS: Product[] = [
  {
    id: "feat-1",
    title: "AeroSound Pro Wireless ANC Studio Headphones",
    slug: "aerosound-pro-anc-headphones",
    description: "Lossless LDAC wireless planar magnetic headphones with active hybrid noise cancellation.",
    base_price: 349.00,
    brand: "AeroSound",
    is_featured: true,
    images: [{ id: "img-1", product_id: "feat-1", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-1", product_id: "feat-1", title: "Space Gray", sku: "AERO-ANC-GRY", price: 349.00, stock_quantity: 45 }],
    category: { id: "cat-1", name: "Electronics & Smart Audio", slug: "electronics" },
  },
  {
    id: "feat-2",
    title: "Nova Titan 5G Smartphone 256GB Sapphire",
    slug: "nova-titan-5g-phone",
    description: "Aerospace titanium chassis, 120Hz LTPO OLED display, and cinematic quad camera array.",
    base_price: 899.00,
    brand: "Nova Mobile",
    is_featured: true,
    images: [{ id: "img-2", product_id: "feat-2", image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-2", product_id: "feat-2", title: "Titanium Blue", sku: "NOVA-TITAN-BLU", price: 899.00, stock_quantity: 30 }],
    category: { id: "cat-1", name: "Electronics & Smart Audio", slug: "electronics" },
  },
  {
    id: "feat-3",
    title: "Minimalist Italian Wool Overcoat - Camel",
    slug: "cashmere-wool-overcoat",
    description: "Double-faced virgin Italian wool tailored overcoat with unconstructed shoulders.",
    base_price: 495.00,
    brand: "Sartorial Atelier",
    is_featured: true,
    images: [{ id: "img-3", product_id: "feat-3", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-3", product_id: "feat-3", title: "Camel / Medium", sku: "SART-COAT-CAM", price: 495.00, stock_quantity: 18 }],
    category: { id: "cat-2", name: "Fashion & Luxury Apparel", slug: "fashion" },
  },
  {
    id: "feat-4",
    title: "Ergonomic Solid Oak Motorized Standing Desk",
    slug: "solid-oak-standing-desk",
    description: "Solid sustainably harvested white oak work surface with dual ultra-quiet German motors.",
    base_price: 749.00,
    brand: "Nordic Atelier",
    is_featured: true,
    images: [{ id: "img-4", product_id: "feat-4", image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-4", product_id: "feat-4", title: "Natural Oak 60x30", sku: "NORD-DESK-60", price: 749.00, stock_quantity: 12 }],
    category: { id: "cat-3", name: "Home Living & Decor", slug: "home-living" },
  },
  {
    id: "feat-5",
    title: "15% Bio-Active Vitamin C Radiance Serum",
    slug: "vitamin-c-radiance-serum",
    description: "Cold-pressed ferulic acid and hyaluronic acid antioxidant morning renewal serum.",
    base_price: 68.00,
    brand: "Lumina Skin Lab",
    is_featured: true,
    images: [{ id: "img-5", product_id: "feat-5", image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-5", product_id: "feat-5", title: "30ml Dropper", sku: "LUM-VTC-30", price: 68.00, stock_quantity: 75 }],
    category: { id: "cat-4", name: "Beauty & Wellness", slug: "beauty-wellness" },
  },
  {
    id: "feat-6",
    title: "Carbon Plate Marathon Trail Running Shoes",
    slug: "trail-running-shoes-carbon",
    description: "Vibram Megagrip lugged outsole with dual-density supercritical foam and full-length carbon plate.",
    base_price: 210.00,
    brand: "Apex Endurance",
    is_featured: true,
    images: [{ id: "img-6", product_id: "feat-6", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-6", product_id: "feat-6", title: "US 10.5 / Solar Red", sku: "APEX-RUN-105", price: 210.00, stock_quantity: 24 }],
    category: { id: "cat-5", name: "Sports & Fitness", slug: "sports-outdoors" },
  },
  {
    id: "feat-7",
    title: "Ethiopian Yirgacheffe Natural Whole Bean Coffee",
    slug: "ethiopian-yirgacheffe-coffee",
    description: "Single-origin Grade 1 heirloom micro-lot with jasmine, bergamot, and sweet stone fruit notes.",
    base_price: 26.00,
    brand: "Origin Roast Lab",
    is_featured: true,
    images: [{ id: "img-7", product_id: "feat-7", image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-7", product_id: "feat-7", title: "12oz Whole Bean", sku: "ORIG-COF-12", price: 26.00, stock_quantity: 80 }],
    category: { id: "cat-6", name: "Gourmet Provisions", slug: "gourmet-provisions" },
  },
  {
    id: "feat-8",
    title: "Tradizionale 25-Year Aged Balsamic of Modena DOP",
    slug: "aged-balsamic-vinegar-modena",
    description: "Aged in sequential cherry, chestnut, and juniper wood casks with deep velvet viscosity.",
    base_price: 135.00,
    brand: "Acetaia Reale",
    is_featured: true,
    images: [{ id: "img-8", product_id: "feat-8", image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800", is_primary: true, display_order: 0 }],
    variants: [{ id: "var-8", product_id: "feat-8", title: "100ml Wax Sealed Flask", sku: "MOD-BAL-100", price: 135.00, stock_quantity: 15 }],
    category: { id: "cat-6", name: "Gourmet Provisions", slug: "gourmet-provisions" },
  },
] as unknown as Product[];

const DEPARTMENT_FALLBACK_MAP: Record<string, Product[]> = {
  electronics: DEFAULT_FEATURED_PRODUCTS.slice(0, 4),
  fashion: [DEFAULT_FEATURED_PRODUCTS[2], DEFAULT_FEATURED_PRODUCTS[0], DEFAULT_FEATURED_PRODUCTS[1], DEFAULT_FEATURED_PRODUCTS[3]],
  "home-living": [DEFAULT_FEATURED_PRODUCTS[3], DEFAULT_FEATURED_PRODUCTS[0], DEFAULT_FEATURED_PRODUCTS[1], DEFAULT_FEATURED_PRODUCTS[4]],
  "beauty-wellness": [DEFAULT_FEATURED_PRODUCTS[4], DEFAULT_FEATURED_PRODUCTS[0], DEFAULT_FEATURED_PRODUCTS[1], DEFAULT_FEATURED_PRODUCTS[6]],
  "sports-outdoors": [DEFAULT_FEATURED_PRODUCTS[5], DEFAULT_FEATURED_PRODUCTS[0], DEFAULT_FEATURED_PRODUCTS[1], DEFAULT_FEATURED_PRODUCTS[2]],
  "gourmet-provisions": [DEFAULT_FEATURED_PRODUCTS[6], DEFAULT_FEATURED_PRODUCTS[7], DEFAULT_FEATURED_PRODUCTS[0], DEFAULT_FEATURED_PRODUCTS[1]],
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(DEFAULT_FEATURED_PRODUCTS);
  const [departmentProducts, setDepartmentProducts] = useState<Product[]>(DEPARTMENT_FALLBACK_MAP["electronics"]);
  const [activeDepartment, setActiveDepartment] = useState<string>("electronics");
  const [isDeptLoading, setIsDeptLoading] = useState(false);
  const [vendors, setVendors] = useState<VendorPublic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const prodRes = await api.get("/products/list?page_size=12");
        if (prodRes.data?.success && prodRes.data?.data?.items && prodRes.data.data.items.length > 0) {
          setFeaturedProducts(prodRes.data.data.items);
        }
      } catch (err) {
        console.error("Failed to load products for home page:", err);
      }

      try {
        const catRes = await api.get("/categories");
        if (catRes.data?.success && catRes.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories for home page:", err);
      }

      try {
        const vendRes = await api.get("/vendors?limit=4");
        if (vendRes.data?.success && vendRes.data?.data) {
          const vendorData = vendRes.data.data;
          setVendors(Array.isArray(vendorData) ? vendorData : vendorData.items || []);
        }
      } catch (err) {
        console.error("Failed to load vendors for home page:", err);
      }
    }
    loadData();
  }, []);

  // Fetch department specific products when tab changes
  useEffect(() => {
    async function loadDepartmentProducts() {
      setIsDeptLoading(true);
      // Pre-set matching department fallback for immediate UI feedback
      if (DEPARTMENT_FALLBACK_MAP[activeDepartment]) {
        setDepartmentProducts(DEPARTMENT_FALLBACK_MAP[activeDepartment]);
      }
      try {
        const res = await api.get(`/products/list?category_id=${activeDepartment}&page_size=4`);
        if (res.data?.success && res.data?.data?.items && res.data.data.items.length > 0) {
          setDepartmentProducts(res.data.data.items);
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
            <div className="flex flex-wrap gap-2">
              {activeDeptMeta.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/products?category=${sub.slug}`}
                  className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                </Link>
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

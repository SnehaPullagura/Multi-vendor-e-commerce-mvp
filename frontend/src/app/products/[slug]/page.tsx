"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Truck,
  CheckCircle,
  AlertTriangle,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Product, ProductVariant } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

function getProductFallbackImage(product: Product): string {
  const text = `${product.title || ""} ${product.brand || ""} ${(product as any).category?.name || ""}`.toLowerCase();
  if (text.includes("wallet") || text.includes("case") || text.includes("magsafe") || text.includes("card")) {
    return "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800";
  }
  if (text.includes("deskmat") || text.includes("mat") || text.includes("pad") || text.includes("felt")) {
    return "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800";
  }
  if (text.includes("webcam") || text.includes("camera") || text.includes("stream") || text.includes("pulsecam")) {
    return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800";
  }
  if (text.includes("projector") || text.includes("beam") || text.includes("monitor") || text.includes("display")) {
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800";
  }
  if (text.includes("keyboard") || text.includes("keycap")) {
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800";
  }
  if (text.includes("headphone") || text.includes("audio") || text.includes("sound") || text.includes("anc") || text.includes("earphone")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
  }
  if (text.includes("phone") || text.includes("smartphone") || text.includes("titan") || text.includes("5g") || text.includes("nova")) {
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800";
  }
  if (text.includes("hoodie") || text.includes("fleece") || text.includes("cotton") || text.includes("apparel") || text.includes("jacket") || text.includes("shirt")) {
    return "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800";
  }
  if (text.includes("sneaker") || text.includes("shoe") || text.includes("footwear") || text.includes("leather") || text.includes("boot")) {
    return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800";
  }
  if (text.includes("watch") || text.includes("timepiece")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
  }
  if (text.includes("lamp") || text.includes("light") || text.includes("chair") || text.includes("desk") || text.includes("furniture")) {
    return "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800";
  }
  if (text.includes("serum") || text.includes("skin") || text.includes("lotion") || text.includes("cream") || text.includes("oil")) {
    return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800";
  }
  if (text.includes("coffee") || text.includes("espresso") || text.includes("brew") || text.includes("bean") || text.includes("tea")) {
    return "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800";
  }
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod: Product = res.data.data;
          setProduct(prod);
          if (prod.images && prod.images.length > 0 && prod.images[0].image_url) {
            setSelectedImage(prod.images[0].image_url);
          } else {
            setSelectedImage(getProductFallbackImage(prod));
          }
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    const success = await addItem(selectedVariant.id, quantity);
    setIsAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    const success = await addItem(selectedVariant.id, quantity);
    setIsAdding(false);
    if (success) {
      router.push("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-200 rounded-xl w-1/3 mt-8" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <p className="text-gray-500 text-sm mt-2 mb-6">
            The item you are looking for might have been retired or does not exist.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.base_price;
  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : false;
  const stockCount = selectedVariant ? selectedVariant.stock_quantity : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/products" className="hover:text-brand-600">Catalog</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.id}`} className="hover:text-brand-600">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          {/* Left: Product Images */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-100 border border-gray-100 flex items-center justify-center relative overflow-hidden">
              <img
                src={selectedImage || getProductFallbackImage(product)}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={() => {
                  setSelectedImage(getProductFallbackImage(product));
                }}
              />
              {product.is_featured && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  FEATURED PICK
                </span>
              )}
            </div>

            {/* Additional gallery thumbnails if available */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`aspect-square rounded-xl bg-slate-100 border-2 overflow-hidden cursor-pointer transition-all ${
                      selectedImage === img.image_url ? "border-brand-600 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img.image_url} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Variant Picker */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & Vendor Badge */}
              <div className="flex items-center justify-between gap-2">
                {product.brand && (
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                )}
                {product.vendor && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-gray-700">
                    <Store className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{product.vendor.store_name}</span>
                  </div>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2 leading-tight">
                {product.title}
              </h1>

              {/* Price & Stock */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatCurrency(currentPrice)}
                </span>
                {inStock ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" /> In Stock ({stockCount} units)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                  </span>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-8">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Select Edition / Variant
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariant(v);
                            setQuantity(1);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="font-semibold text-xs text-gray-900 truncate">{v.title}</div>
                          <div className="text-xs text-gray-500 mt-1 font-mono">{formatCurrency(v.price)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                    disabled={quantity >= stockCount}
                    className="p-1.5 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || isAdding}
                  className={`flex-1 px-6 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-600 hover:bg-brand-700 text-white"
                  } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  {added ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock || isAdding}
                  className="flex-1 px-6 py-3.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Vendor Fulfilled Assurance */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Dispatched by <strong>{product.vendor?.store_name || "Vendor"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Escrow Buyer Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description & Specs</h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Store, Check, Layers } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { getCategoryMeta } from "@/lib/categoryMeta";

interface ProductCardProps {
  product: Product;
}

function getProductImage(product: Product): string {
  if (product.images && product.images.length > 0 && product.images[0].image_url && product.images[0].image_url.startsWith("http")) {
    return product.images[0].image_url;
  }
  const text = `${product.title || ""} ${product.brand || ""}`.toLowerCase();
  if (text.includes("headphone") || text.includes("audio") || text.includes("sound") || text.includes("anc") || text.includes("aero")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("phone") || text.includes("smartphone") || text.includes("titan") || text.includes("5g") || text.includes("nova")) {
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("hoodie") || text.includes("fleece") || text.includes("cotton") || text.includes("apparel") || text.includes("jacket")) {
    return "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("sneaker") || text.includes("shoe") || text.includes("footwear") || text.includes("leather")) {
    return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("watch")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("camera")) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("laptop") || text.includes("computer")) {
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("chair") || text.includes("desk") || text.includes("furniture") || text.includes("living") || text.includes("home")) {
    return "https://images.unsplash.com/photo-1580481077111-9a70f2f354f3?w=800&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Pick first variant
  const defaultVariant = product.variants?.[0];
  const primaryImage = getProductImage(product);
  const variantCount = product.variants?.length || 1;

  // Category styling
  const catMeta = getCategoryMeta(
    product.category?.slug || (product as any).category_id,
    defaultVariant?.sku,
    product.title
  );

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) return;

    setIsAdding(true);
    const success = await addItem(defaultVariant.id, 1);
    setIsAdding(false);

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 p-3 flex flex-col hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden"
    >
      {/* Image Container */}
      <div className="aspect-square w-full rounded-xl bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300 group-hover:scale-105 transition-transform duration-300">
            📦
          </div>
        )}

        {/* Category Pill Tag */}
        <span
          className={`absolute top-2 left-2 ${catMeta.badgeBg} ${catMeta.badgeText} border ${catMeta.badgeBorder} text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md flex items-center gap-1 z-10`}
        >
          <span>{catMeta.icon}</span>
          <span className="truncate max-w-[100px]">{catMeta.name.split(" ")[0]}</span>
        </span>

        {/* Featured Tag */}
        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            FEATURED
          </span>
        )}

        {/* Vendor Badge */}
        {product.vendor && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1 text-[11px] font-medium text-gray-700 shadow-sm z-10">
            <Store className="w-3 h-3 text-indigo-600" />
            <span className="truncate max-w-[100px]">{product.vendor.store_name}</span>
          </div>
        )}

        {/* Variant count pill */}
        {variantCount > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white z-10">
            {variantCount} options
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between mt-3 p-1">
        <div>
          <div className="flex items-center justify-between gap-1">
            {product.brand && (
              <span className="text-[11px] font-semibold text-indigo-600 tracking-wide uppercase">
                {product.brand}
              </span>
            )}
            <span className="text-[10px] text-gray-400 font-mono">
              {defaultVariant?.sku?.split("-")[0] || ""}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-1 group-hover:text-brand-600 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400">Starting at</span>
            <p className="text-base font-bold text-gray-900 leading-tight">
              {formatCurrency(product.base_price)}
            </p>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isAdding || !defaultVariant || defaultVariant.stock_quantity <= 0}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-sm ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 hover:bg-brand-600 text-white hover:shadow-md"
            } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}

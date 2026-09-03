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

function getFallbackImage(product: Product): string {
  const text = `${product.title || ""} ${product.brand || ""} ${(product as any).category?.name || ""}`.toLowerCase();
  if (text.includes("wallet") || text.includes("case") || text.includes("magsafe") || text.includes("card")) {
    return "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800";
  }
  if (text.includes("deskmat") || text.includes("mat") || text.includes("pad") || text.includes("felt")) {
    return "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800";
  }
  if (text.includes("webcam") || text.includes("camera") || text.includes("stream") || text.includes("tracking") || text.includes("pulsecam")) {
    return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800";
  }
  if (text.includes("projector") || text.includes("beam") || text.includes("monitor") || text.includes("display") || text.includes("spectra")) {
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800";
  }
  if (text.includes("keyboard") || text.includes("keycap") || text.includes("switch")) {
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

function getProductImage(product: Product): string {
  if (product.images && product.images.length > 0 && product.images[0].image_url && product.images[0].image_url.startsWith("http")) {
    return product.images[0].image_url;
  }
  return getFallbackImage(product);
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(getProductImage(product));
  const [hasError, setHasError] = useState(false);

  // Pick first variant
  const defaultVariant = product.variants?.[0];
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

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFallbackImage(product));
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 p-3 flex flex-col hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden"
    >
      {/* Image Container */}
      <div className="aspect-square w-full rounded-xl bg-slate-100 relative overflow-hidden flex items-center justify-center">
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={handleImageError}
        />

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

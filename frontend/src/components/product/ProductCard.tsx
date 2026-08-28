"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Store, Star, Check } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Pick first variant
  const defaultVariant = product.variants?.[0];
  const primaryImage = product.images?.[0]?.image_url || "/placeholder.png";

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
      <div className="aspect-square w-full rounded-xl bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
        {/* Placeholder image or Real image */}
        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-200 group-hover:scale-105 transition-transform duration-300">
          📦
        </div>

        {/* Featured Tag */}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            FEATURED
          </span>
        )}

        {/* Vendor Badge */}
        {product.vendor && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1 text-[11px] font-medium text-gray-700 shadow-sm">
            <Store className="w-3 h-3 text-indigo-600" />
            <span className="truncate max-w-[100px]">{product.vendor.store_name}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between mt-3 p-1">
        <div>
          {product.brand && (
            <span className="text-[11px] font-medium text-indigo-600 tracking-wide uppercase">
              {product.brand}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-0.5 group-hover:text-brand-600 transition-colors">
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

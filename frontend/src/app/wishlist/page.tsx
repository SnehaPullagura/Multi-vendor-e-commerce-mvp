"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

export default function WishlistPage() {
  const { wishlist, fetchWishlist, removeItem, isLoading } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Saved Wishlist</h1>
            <p className="text-xs text-gray-500 mt-1">Keep track of favorite products and editions.</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {wishlist && wishlist.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.items.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
                    📦
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.product_title}</h3>
                    {item.variant_title && <p className="text-xs text-gray-400 mt-0.5">{item.variant_title}</p>}
                    <p className="text-base font-extrabold text-gray-900 mt-2">{formatCurrency(item.added_price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => item.product_variant_id && addItem(item.product_variant_id, 1)}
                    className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-gray-400 hover:text-rose-600 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">Your wishlist is empty</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">Discover trending products and tap the heart icon to save them.</p>
            <Link href="/products" className="px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-full shadow-md">
              Explore Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

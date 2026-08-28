"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Package, Search, Filter, Edit, CheckCircle } from "lucide-react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const res = await api.get("/products/list?limit=50");
        if (res.data.success) {
          setProducts(res.data.data.items || []);
        }
      } catch (err) {
        console.error("Failed to load seller products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Products Catalog</h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage your product matrix, pricing tiers, and SKU inventory.
            </p>
          </div>

          <Link
            href="/seller/products/new"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" /> Add New Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search your products by title or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Variants</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">Loading catalog...</td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                              📦
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-gray-900 text-xs truncate max-w-xs">{p.title}</h4>
                              <p className="text-[10px] text-indigo-600 uppercase font-semibold">{p.brand || "Independent"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-900">{formatCurrency(p.base_price)}</td>
                        <td className="p-4 text-gray-600">{p.variants?.length || 1} Variant(s)</td>
                        <td className="p-4">
                          <span className={`font-semibold ${totalStock < 10 ? "text-amber-600" : "text-emerald-600"}`}>
                            {totalStock} units
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 font-bold rounded-full border ring-1 text-[10px] ${getStatusBadgeClass(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/products/${p.slug}`}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700 rounded-lg border border-gray-200"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No products found. Click "Add New Product" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

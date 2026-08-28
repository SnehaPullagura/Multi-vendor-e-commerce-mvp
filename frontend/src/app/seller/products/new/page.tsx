"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Layers,
} from "lucide-react";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { Category } from "@/types";
import { api } from "@/lib/api";
import { useToastStore } from "@/store/useToastStore";

interface VariantForm {
  sku: string;
  title: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [basePrice, setBasePrice] = useState<number>(99.0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Variants List
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      sku: "PROD-SKU-01",
      title: "Standard Edition",
      price: 99.0,
      stock_quantity: 50,
      low_stock_threshold: 5,
    },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get("/categories");
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setCategoryId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  const handleAddVariant = () => {
    const nextIdx = variants.length + 1;
    setVariants([
      ...variants,
      {
        sku: `PROD-SKU-0${nextIdx}`,
        title: `Variant ${nextIdx}`,
        price: basePrice,
        stock_quantity: 25,
        low_stock_threshold: 5,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      addToast({ type: "warning", title: "At least one variant is required" });
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantForm, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !categoryId) {
      addToast({ type: "error", title: "Please fill in all required product fields" });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        title,
        description,
        category_id: categoryId,
        brand: brand || undefined,
        base_price: Number(basePrice),
        is_featured: isFeatured,
        variants: variants.map((v) => ({
          sku: v.sku,
          title: v.title,
          price: Number(v.price),
          stock_quantity: Number(v.stock_quantity),
          low_stock_threshold: Number(v.low_stock_threshold),
        })),
      };

      const res = await api.post("/products", payload);
      if (res.data.success) {
        addToast({
          type: "success",
          title: "Product Published!",
          message: `${title} is now active on the marketplace catalog.`,
        });
        router.push("/seller/products");
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: err.response?.data?.message || "Could not create product.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/seller/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Add New Product</h1>
            <p className="text-xs text-gray-500 mt-1">
              Create a multi-variant SKU listing published directly to the customer storefront.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" /> General Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quantum ANC Wireless Earbuds"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Quantum"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide comprehensive details on specs, warranty, features, and package contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="featuredCheck" className="text-xs font-semibold text-gray-700">
                  Feature this product on homepage spotlight
                </label>
              </div>
            </div>
          </div>

          {/* Variant Matrix Builder Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Variant Inventory Matrix ({variants.length})
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-2xl border border-gray-200/70 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Edition #{idx + 1}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">SKU Code</label>
                      <input
                        type="text"
                        required
                        value={v.sku}
                        onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Variant Title</label>
                      <input
                        type="text"
                        required
                        value={v.title}
                        onChange={(e) => handleVariantChange(idx, "title", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={v.price}
                        onChange={(e) => handleVariantChange(idx, "price", parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stock Units</label>
                      <input
                        type="number"
                        required
                        value={v.stock_quantity}
                        onChange={(e) => handleVariantChange(idx, "stock_quantity", parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-md hover:shadow-lg transition-all text-sm disabled:bg-gray-300"
          >
            {isLoading ? "Publishing Listing..." : "Publish Product Listing"}
          </button>
        </form>
      </div>
    </SellerLayout>
  );
}

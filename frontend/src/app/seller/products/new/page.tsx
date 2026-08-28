"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Layers, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductVariantMatrixEditor, VariantRow } from "@/components/seller/ProductVariantMatrixEditor";
import { FileUpload } from "@/components/ui/FileUpload";
import { api } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    brand: "",
    base_price: 199.99,
    category_id: "",
    is_active: true,
  });

  const [variants, setVariants] = useState<VariantRow[]>([
    {
      id: "var-init-1",
      title: "Standard Edition",
      sku: "PROD-STD-001",
      price: 199.99,
      stock_quantity: 50,
    },
  ]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    setFormData({ ...formData, title: val, slug: generatedSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          price: v.price,
          stock_quantity: v.stock_quantity,
        })),
      };
      await api.post("/products", payload);
      router.push("/seller/products");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Create Catalog Product</h1>
            <p className="text-xs text-gray-500 mt-1">Add a new multi-variant product listing to your verified storefront.</p>
          </div>
          <Link
            href="/seller/products"
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-900">General Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Pro Wireless Reference Headphones"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Brand Name</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Quantum Audio Labs"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Base Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Technical Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive technical specifications, features, materials, and warranty information..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Variants Table */}
          <ProductVariantMatrixEditor variants={variants} onChange={setVariants} basePrice={formData.base_price} />

          {/* Media Upload */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900">Product Media & Gallery</h2>
            <FileUpload onUpload={(files) => console.log(files)} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/seller/products"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? "Publishing SKU..." : "Publish Product Listing"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

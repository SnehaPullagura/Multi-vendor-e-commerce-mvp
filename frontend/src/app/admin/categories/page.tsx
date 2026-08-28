"use client";

import { useEffect, useState } from "react";
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  Layers,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Category } from "@/types";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";

export default function AdminCategoriesPage() {
  const { addToast } = useToastStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Category Form
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/categories");
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post("/categories", {
        name,
        description: description || undefined,
        is_active: true,
      });

      if (res.data.success) {
        addToast({
          type: "success",
          title: "Category Created",
          message: `${name} was added to marketplace taxonomy.`,
        });
        setName("");
        setDescription("");
        setShowModal(false);
        await loadCategories();
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: err.response?.data?.message || "Could not create category.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Category Taxonomy</h1>
            <p className="text-xs text-slate-400 mt-1">
              Structure the multi-vendor catalog classification hierarchy.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 font-bold text-white text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Categories List */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">URL Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Loading categories...</td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-400" /> {c.name}
                      </td>
                      <td className="p-4 font-mono text-slate-300">/{c.slug}</td>
                      <td className="p-4 text-slate-400">{c.description || "No description provided."}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 font-bold rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                          ACTIVE
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-400">{formatDate(c.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No categories created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Category */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-6 text-white animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-rose-500" /> Add Product Category
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ergonomics & Chairs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Summary of product types that belong in this category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 font-bold text-white rounded-xl shadow-md disabled:bg-slate-800"
                  >
                    {isSubmitting ? "Creating..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

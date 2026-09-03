"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Lock, Mail, User, Phone, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { api } from "@/lib/api";
import { Logo } from "@/components/ui/Logo";

export default function RegisterSellerPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post("/auth/register/seller", {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        store_name: storeName.trim(),
        description: storeDescription.trim() || undefined,
        tax_id: taxId.trim() || undefined,
        bank_account_details: bankAccount.trim() || undefined,
      });

      if (res.data.success) {
        const data = res.data.data;
        const user: any = {
          id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          is_active: true,
          is_verified: true,
        };
        login(data.access_token, user);
        addToast({
          type: "success",
          title: "Store Registration Submitted!",
          message: "Welcome to the MarketSphere Merchant Hub.",
        });
        router.push("/seller/dashboard");
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Registration Failed",
        message: err.response?.data?.message || "Could not complete seller registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-16 w-full flex-1">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl space-y-6">
          <div className="flex flex-col items-center text-center pb-2">
            <Link href="/" className="mb-4 group hover:opacity-90 transition-opacity">
              <Logo variant="full" theme="navy" size="md" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Become a Marketplace Seller</h1>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Launch your independent digital storefront and reach customers nationwide with our multi-vendor fulfillment engine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Owner Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">1. Account Owner Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Sterling"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@boutique.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 333-8899"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Store Details */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">2. Store & Financial Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Audio & Smart Tech"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Store Bio / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what your brand makes, product categories, and your warranty standards..."
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tax ID / EIN</label>
                    <input
                      type="text"
                      placeholder="XX-XXXXXXX"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Payout Account (ACH / Routing)</label>
                    <input
                      type="text"
                      placeholder="Bank Account / Routing #"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:bg-gray-300"
            >
              {isLoading ? "Submitting Application..." : "Submit Seller Registration"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already a registered merchant?{" "}
            <Link href="/login" className="font-bold text-indigo-600 hover:underline">
              Sign In to Seller Hub
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

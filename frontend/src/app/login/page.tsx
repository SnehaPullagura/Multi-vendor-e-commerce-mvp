"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Store, ShieldCheck, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { api } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        const data = res.data.data;
        const user: any = {
          id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        login(data.access_token, user);
        addToast({
          type: "success",
          title: `Welcome back, ${user.full_name}!`,
          message: `Signed in as ${user.role}.`,
        });

        if (user.role === "SELLER") {
          router.push(redirect === "/" ? "/seller/dashboard" : redirect);
        } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
          router.push(redirect === "/" ? "/admin/dashboard" : redirect);
        } else {
          router.push(redirect);
        }
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Login Failed",
        message: err.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-black text-gray-900">Sign In</h1>
        <p className="text-xs text-gray-500 mt-1">
          Access your Customer, Seller, or Admin portal
        </p>
      </div>

      {/* Quick Demo Fill Tabs */}
      <div className="bg-slate-50 p-2.5 rounded-2xl border border-gray-100 space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
          Quick One-Click Demo Logins
        </p>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleQuickFill("customer@example.com", "Customer123!")}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-brand-500 font-semibold text-gray-700 flex flex-col items-center gap-1 transition-all"
          >
            <User className="w-3.5 h-3.5 text-brand-600" /> Buyer
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("seller.apex@example.com", "SellerApex123!")}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-indigo-500 font-semibold text-gray-700 flex flex-col items-center gap-1 transition-all"
          >
            <Store className="w-3.5 h-3.5 text-indigo-600" /> Seller
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("admin@marketsphere.com", "SuperAdminPass123!")}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-rose-500 font-semibold text-gray-700 flex flex-col items-center gap-1 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:bg-gray-300"
        >
          {isLoading ? "Signing In..." : "Sign In"} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500 space-y-2">
        <p>
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-brand-600 hover:underline">
            Create Customer Account
          </Link>
        </p>
        <p>
          Want to sell products?{" "}
          <Link href="/register-seller" className="font-bold text-indigo-600 hover:underline">
            Register as Merchant
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16 w-full flex-1 flex flex-col justify-center">
        <Suspense fallback={<div className="bg-white rounded-3xl p-8 animate-pulse h-96" />}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ShieldCheck,
  Store,
  FolderTree,
  DollarSign,
  ArrowLeft,
  LogOut,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Logo } from "@/components/ui/Logo";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN"))) {
      router.push("/login?redirect=" + pathname);
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  const navItems = [
    { label: "Platform Overview", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Vendor Governance", href: "/admin/vendors", icon: Store },
    { label: "Category Taxonomy", href: "/admin/categories", icon: FolderTree },
    { label: "Payout Settlements", href: "/admin/payouts", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar (White & Emerald Green Theme) */}
      <aside className="w-full md:w-64 bg-white flex flex-col shrink-0 border-r border-emerald-100/80 shadow-sm">
        {/* Header Branding */}
        <div className="p-6 border-b border-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight">MarketSphere</h2>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800/60">
            Governance & Controls
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                    : "hover:bg-emerald-50/70 text-slate-600 hover:text-emerald-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Live System Status Pill */}
        <div className="mx-4 mb-3 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Platform Engine Active</span>
          </div>
          <p className="text-[10px] text-emerald-700/80 mt-0.5">
            Escrow & multi-vendor settlements operational
          </p>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-emerald-50 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" /> Storefront View
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-2 w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content (Light Canvas with Green Highlights) */}
      <main className="flex-1 min-w-0 p-6 md:p-10 bg-slate-50/60 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

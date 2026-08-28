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
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

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
    { label: "Platform Overview", href: "/admin/dashboard", icon: ShieldCheck },
    { label: "Vendor Governance", href: "/admin/vendors", icon: Store },
    { label: "Category Taxonomy", href: "/admin/categories", icon: FolderTree },
    { label: "Payout Settlements", href: "/admin/payouts", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Admin Center</h2>
              <span className="text-[10px] text-slate-400 font-mono">SUPERVISION MODE</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    : "hover:bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-rose-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Storefront View
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-2 w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-10 bg-slate-900 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

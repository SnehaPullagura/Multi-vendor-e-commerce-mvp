"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Store,
  LogOut,
  ChevronRight,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, vendor, isAuthenticated, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "SELLER")) {
      // Allow Admin to view or redirect
      if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
        router.push("/login?redirect=" + pathname);
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  const navItems = [
    { label: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/seller/products", icon: Package },
    { label: "Add New Product", href: "/seller/products/new", icon: PlusCircle },
    { label: "Orders Fulfillment", href: "/seller/orders", icon: ShoppingBag },
    { label: "Financials & Payouts", href: "/seller/finance", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Store Title */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white text-sm truncate">{vendor?.store_name || "Vendor Hub"}</h2>
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                {vendor?.status || "SELLER"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
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

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

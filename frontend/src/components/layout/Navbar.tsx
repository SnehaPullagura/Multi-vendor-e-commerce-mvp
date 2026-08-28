"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Store,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Package,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export function Navbar() {
  const router = useRouter();
  const { user, vendor, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top Banner for Seller/Admin Quick Access */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center font-medium">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">🚀 Multi-Vendor Autonomous Commerce Engine</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Production Grade MVP
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/seller/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
            <Store className="w-3.5 h-3.5" /> Seller Hub
          </Link>
          <span className="text-slate-600">|</span>
          <Link href="/admin/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Center
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-lg tracking-tight leading-none">MarketSphere</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-0.5">Multi-Vendor Marketplace</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/products" className="hover:text-brand-600 transition-colors flex items-center gap-1">
                <Layers className="w-4 h-4" /> All Products
              </Link>
              <Link href="/register-seller" className="hover:text-brand-600 transition-colors text-indigo-600 font-semibold">
                Become a Seller
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search across all verified vendor stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {(cart?.total_items || 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                  {cart?.total_items}
                </span>
              )}
            </Link>

            {/* Auth Buttons or User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 border border-gray-200 rounded-full hover:shadow-sm bg-gray-50 transition-all text-sm font-medium text-gray-800"
                >
                  <span className="max-w-[120px] truncate">{user.full_name.split(" ")[0]}</span>
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {user.full_name[0]?.toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-brand-50 text-brand-700 font-semibold text-[10px] rounded-full">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>

                    {user.role === "SELLER" && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                      >
                        <Store className="w-4 h-4" /> Seller Dashboard
                      </Link>
                    )}

                    {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Console
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </form>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-gray-700 font-medium py-2"
            >
              <Layers className="w-4 h-4" /> All Products
            </Link>
            <Link
              href="/register-seller"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-indigo-600 font-semibold py-2"
            >
              <Store className="w-4 h-4" /> Become a Seller
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

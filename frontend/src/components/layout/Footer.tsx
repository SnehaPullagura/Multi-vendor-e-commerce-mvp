import Link from "next/link";
import { Store, ShieldCheck, Truck, RefreshCw, Headphones, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Multi-Vendor Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct fulfillment from verified independent vendors.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Escrow-Grade Security</h4>
              <p className="text-xs text-slate-400 mt-0.5">Automated sub-order ledger & safe merchant payouts.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Buyer Protection</h4>
              <p className="text-xs text-slate-400 mt-0.5">Easy returns and sub-order order tracking.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Platform Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated dispute management & seller assistance.</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <span className="font-bold text-white text-lg">MarketSphere</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-sm">
              An enterprise-grade, multi-vendor marketplace connecting passionate shoppers with autonomous independent sellers.
            </p>
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products?category=smart-gear" className="hover:text-white transition-colors">Smart Gear</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-white transition-colors">Audio & Sound</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Tech Accessories</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-3">For Sellers</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/register-seller" className="hover:text-white transition-colors">Open a Store</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
              <li><Link href="/seller/finance" className="hover:text-white transition-colors">Payout System</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-3">Platform</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Admin Console</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">User Sign In</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MarketSphere Multi-Vendor Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Seller Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

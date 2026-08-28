"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SplitSquareVertical } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductComparisonGrid, CompareProduct } from "@/components/product/ProductComparisonGrid";
import { useCartStore } from "@/store/useCartStore";

export default function ComparePage() {
  const { addItem } = useCartStore();
  const [products] = useState<CompareProduct[]>([
    {
      id: "prod-1",
      title: "Quantum ANC Pro Wireless Headphones",
      slug: "quantum-anc-pro-wireless-headphones",
      brand: "Quantum",
      base_price: 299.99,
      rating: 4.9,
      in_stock: true,
      specs: {
        "Driver Size": "40mm Beryllium",
        "Battery Life": "45 Hours",
        "ANC Capability": "Adaptive Hybrid (-42dB)",
        "Bluetooth Codecs": "LDAC, AAC, SBC",
        "Weight": "250g",
        "Warranty": "2 Years",
      },
    },
    {
      id: "prod-2",
      title: "PulseStudio Pro USB-C Condenser Microphone",
      slug: "pulsestudio-pro-usb-c-microphone",
      brand: "PulseStudio",
      base_price: 149.00,
      rating: 4.8,
      in_stock: true,
      specs: {
        "Driver Size": "25mm Condenser Capsule",
        "Battery Life": "USB Bus Powered",
        "ANC Capability": "Internal Acoustic Pop Filter",
        "Bluetooth Codecs": "24-bit/192kHz USB Audio",
        "Weight": "420g",
        "Warranty": "1 Year",
      },
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
              <SplitSquareVertical className="w-7 h-7 text-brand-600" /> Compare Products
            </h1>
            <p className="text-xs text-gray-500 mt-1">Side-by-side technical specification analysis.</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
        </div>

        <ProductComparisonGrid products={products} />
      </main>

      <Footer />
    </div>
  );
}

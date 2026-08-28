import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "MarketSphere — Autonomous Multi-Vendor E-Commerce Platform",
  description: "Production-grade multi-vendor marketplace connecting customers with verified independent sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

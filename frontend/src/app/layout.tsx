import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "MarketSphere — Autonomous Multi-Vendor E-Commerce Platform",
  description: "Production-grade multi-vendor marketplace connecting customers with verified independent sellers.",
  icons: {
    icon: "/marketsphere-mark.svg",
    shortcut: "/marketsphere-mark.svg",
    apple: "/marketsphere-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white font-sans">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

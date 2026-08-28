"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SystemHealthDashboard } from "@/components/admin/SystemHealthDashboard";

export default function AdminSystemPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">System Architecture & Infrastructure</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time microservices latency, PostgreSQL connection pools, and Redis cache health.</p>
        </div>

        <SystemHealthDashboard />
      </main>

      <Footer />
    </div>
  );
}

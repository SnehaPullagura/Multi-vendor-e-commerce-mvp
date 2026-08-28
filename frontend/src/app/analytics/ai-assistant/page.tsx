"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User, TrendingUp, Calendar, AlertCircle, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AIAssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Chef & General Manager. I am your RestaurantOS AI Operations Assistant. I have analyzed your sales velocity, recipe BOM food costs, and weather forecasts. How can I assist you today?",
    },
    {
      sender: "user",
      text: "Which dishes generated the highest contribution margin this week?",
    },
    {
      sender: "ai",
      text: "Based on real-time POS sales and BOM recipe costs: 1) Wood-Fired Margherita Pizza ($6,960 profit, 66.7% margin), 2) Signature Butter Chicken ($5,649 profit, 59.8% margin), 3) Truffle Wagyu Burger ($4,760 profit, 53.8% margin). Overall menu average contribution margin is 58.2%.",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    const aiResponse = {
      sender: "ai",
      text: `Analysis for "${query}": Based on current historical trends and 7-day predictive demand models, we anticipate a +18% covers surge this Friday evening. Recommended action: Prep 65kg boneless chicken breast and schedule 2 extra kitchen line staff.`,
    };

    setMessages([...messages, userMsg, aiResponse]);
    setQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-6">
        <div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-[11px] rounded-full border border-indigo-200">
            Proprietary AI Feature #4
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">AI Restaurant Operations Assistant</h1>
          <p className="text-xs text-gray-500 mt-1">
            Query operational insights across inventory variances, labor allocations, and menu engineering.
          </p>
        </div>

        {/* Chat Stream */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm min-h-[420px] flex flex-col justify-between space-y-4">
          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed ${
                    m.sender === "user" ? "bg-brand-600 text-white font-medium" : "bg-slate-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about wastage, labor scheduling, top profitable dishes, or demand forecasts..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Ask AI
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

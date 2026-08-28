"use client";

import React, { useState } from "react";
import { MessageCircle, HelpCircle, ThumbsUp, Send, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface QAItem {
  id: string;
  question: string;
  asked_by: string;
  created_at: string;
  answer?: {
    text: string;
    answered_by: string;
    is_merchant: boolean;
    created_at: string;
  };
  helpful_votes: number;
}

interface QnADiscussionBoardProps {
  productId: string;
}

export const QnADiscussionBoard: React.FC<QnADiscussionBoardProps> = ({ productId }) => {
  const [questions, setQuestions] = useState<QAItem[]>([
    {
      id: "qa-1",
      question: "Is this compatible with 240V international power outlets?",
      asked_by: "Alex M.",
      created_at: "2024-08-20T10:00:00Z",
      answer: {
        text: "Yes, it features an auto-switching 100V-240V internal power supply that works globally with standard plug adapters.",
        answered_by: "Apex Electronics Support Team",
        is_merchant: true,
        created_at: "2024-08-20T14:30:00Z",
      },
      helpful_votes: 14,
    },
    {
      id: "qa-2",
      question: "Does this package include mounting brackets and screws?",
      asked_by: "Marcus K.",
      created_at: "2024-08-18T08:15:00Z",
      answer: {
        text: "Yes, heavy-duty stainless steel mounting hardware and a detailed installation template are included in the box.",
        answered_by: "Apex Electronics Support Team",
        is_merchant: true,
        created_at: "2024-08-18T11:00:00Z",
      },
      helpful_votes: 9,
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const created: QAItem = {
      id: "qa-" + Date.now(),
      question: newQuestion,
      asked_by: "You",
      created_at: new Date().toISOString(),
      helpful_votes: 0,
    };
    setQuestions([created, ...questions]);
    setNewQuestion("");
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">Questions & Community Answers</h3>
          <p className="text-xs text-gray-400 mt-0.5">Have a question? Search answered topics or ask the verified seller.</p>
        </div>
      </div>

      {/* Ask Question Bar */}
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this product..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Send className="w-3.5 h-3.5" /> Ask Question
        </button>
      </form>

      {/* Questions list */}
      <div className="space-y-4 pt-2">
        {questions.map((q) => (
          <div key={q.id} className="p-4 rounded-2xl bg-slate-50/70 border border-gray-100 space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-black text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Q:</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900">{q.question}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Asked by {q.asked_by} on {formatDate(q.created_at)}</p>
              </div>
            </div>

            {q.answer ? (
              <div className="pl-6 border-l-2 border-brand-500 space-y-1">
                <p className="text-xs text-gray-700 leading-relaxed">{q.answer.text}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {q.answer.answered_by}
                  </span>
                  <span className="text-[10px] text-gray-400">• {formatDate(q.answer.created_at)}</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-amber-600 italic pl-6">Waiting for merchant answer...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

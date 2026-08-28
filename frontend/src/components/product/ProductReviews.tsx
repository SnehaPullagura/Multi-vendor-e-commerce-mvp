"use client";

import React, { useEffect, useState } from "react";
import { Star, ThumbsUp, ShieldCheck, MessageCircle, User } from "lucide-react";
import { Review } from "@/types/commerce_extensions";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        setIsLoading(true);
        const [rRes, sRes] = await Promise.all([
          api.get(`/reviews/product/${productId}`),
          api.get(`/reviews/product/${productId}/summary`),
        ]);
        if (rRes.data.success) setReviews(rRes.data.data);
        if (sRes.data.success) setSummary(sRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) loadReviews();
  }, [productId]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Verified Customer Reviews</h2>
          <p className="text-xs text-gray-500 mt-1">Real ratings from confirmed buyers.</p>
        </div>
        {summary && (
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-gray-100">
            <span className="text-3xl font-black text-gray-900">{summary.average_rating}</span>
            <div>
              <RatingStars rating={summary.average_rating} />
              <p className="text-[11px] text-gray-400 mt-0.5">{summary.total_reviews} total reviews</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-slate-50/70 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {r.user_name?.[0] || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                      {r.user_name}
                      {r.is_verified_purchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-gray-400">{formatDate(r.created_at)}</p>
                  </div>
                </div>
                <RatingStars rating={r.rating} size="sm" showValue={false} />
              </div>

              <div>
                <h5 className="font-bold text-xs text-gray-900">{r.title}</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{r.content}</p>
              </div>

              {r.reply && (
                <div className="mt-3 pl-4 border-l-2 border-indigo-400 bg-indigo-50/50 p-3 rounded-r-xl text-xs space-y-1">
                  <span className="font-bold text-indigo-900">Merchant Reply:</span>
                  <p className="text-gray-700">{r.reply.reply_text}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-gray-400 py-6">No customer reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

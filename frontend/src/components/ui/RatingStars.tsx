import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = "md",
  showValue = true,
}) => {
  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={`${starSizes[size]} ${
                filled
                  ? "text-amber-400 fill-amber-400"
                  : half
                  ? "text-amber-400 fill-amber-400/50"
                  : "text-gray-300"
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-bold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

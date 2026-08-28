import React from "react";

interface SkeletonProps {
  variant?: "text" | "avatar" | "card" | "table" | "image";
  lines?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  lines = 3,
  className = "",
}) => {
  const baseClass = "animate-pulse bg-gray-200 rounded";

  if (variant === "avatar") {
    return <div className={`${baseClass} w-10 h-10 rounded-full ${className}`} />;
  }

  if (variant === "image") {
    return <div className={`${baseClass} w-full aspect-video rounded-2xl ${className}`} />;
  }

  if (variant === "card") {
    return (
      <div className={`bg-white rounded-3xl border border-gray-100 p-5 space-y-4 ${className}`}>
        <div className={`${baseClass} h-40 rounded-2xl`} />
        <div className="space-y-2">
          <div className={`${baseClass} h-3 w-3/4`} />
          <div className={`${baseClass} h-3 w-1/2`} />
        </div>
        <div className={`${baseClass} h-4 w-1/4`} />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`bg-white rounded-3xl border border-gray-100 overflow-hidden ${className}`}>
        <div className={`${baseClass} h-10 rounded-none`} />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-50">
            <div className={`${baseClass} h-3 w-1/5`} />
            <div className={`${baseClass} h-3 w-1/3`} />
            <div className={`${baseClass} h-3 w-1/6`} />
            <div className={`${baseClass} h-3 w-1/4`} />
          </div>
        ))}
      </div>
    );
  }

  // Default: text lines
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} h-3`}
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
};

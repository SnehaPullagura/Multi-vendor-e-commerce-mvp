import React, { ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const VARIANT_STYLES = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

const SIZE_STYLES = {
  sm: "px-1.5 py-0.5 text-[9px]",
  md: "px-2.5 py-0.5 text-[10px]",
  lg: "px-3 py-1 text-xs",
};

const DOT_COLORS = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  info: "bg-blue-500",
  neutral: "bg-gray-400",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  children,
  dot = false,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[variant]}`} />}
      {children}
    </span>
  );
};

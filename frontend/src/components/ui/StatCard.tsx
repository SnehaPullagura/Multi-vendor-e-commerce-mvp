import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: "indigo" | "emerald" | "amber" | "rose" | "slate";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = "indigo",
}) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border ${colorMap[colorScheme]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-black text-gray-900">{value}</p>
      {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
      {trend && (
        <span className={`text-[11px] font-semibold flex items-center gap-1 ${trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
          {trend.isPositive ? "▲" : "▼"} {trend.value}
        </span>
      )}
    </div>
  );
};

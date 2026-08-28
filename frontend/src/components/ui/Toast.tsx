"use client";

import { useToastStore } from "@/store/useToastStore";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClasses = "bg-blue-50 border-blue-200 text-blue-900";

        if (toast.type === "success") {
          Icon = CheckCircle2;
          colorClasses = "bg-emerald-50 border-emerald-200 text-emerald-900";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          colorClasses = "bg-rose-50 border-rose-200 text-rose-900";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          colorClasses = "bg-amber-50 border-amber-200 text-amber-900";
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${colorClasses}`}
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs mt-1 opacity-90 leading-relaxed break-words">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

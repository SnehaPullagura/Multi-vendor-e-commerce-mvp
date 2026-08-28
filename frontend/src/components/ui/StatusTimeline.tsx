import React from "react";
import { Check, Clock, AlertTriangle, Circle } from "lucide-react";

interface TimelineStep {
  key: string;
  label: string;
  description?: string;
  timestamp?: string;
  status: "completed" | "current" | "pending" | "error";
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

const STATUS_CONFIG = {
  completed: {
    icon: Check,
    dotClass: "bg-emerald-500 border-emerald-500 text-white",
    lineClass: "bg-emerald-500",
    labelClass: "text-gray-900",
  },
  current: {
    icon: Clock,
    dotClass: "bg-brand-600 border-brand-600 text-white animate-pulse",
    lineClass: "bg-gray-200",
    labelClass: "text-brand-600",
  },
  pending: {
    icon: Circle,
    dotClass: "bg-white border-gray-300 text-gray-300",
    lineClass: "bg-gray-200",
    labelClass: "text-gray-400",
  },
  error: {
    icon: AlertTriangle,
    dotClass: "bg-rose-500 border-rose-500 text-white",
    lineClass: "bg-rose-200",
    labelClass: "text-rose-600",
  },
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  steps,
  className = "",
}) => {
  return (
    <div className={`space-y-0 ${className}`}>
      {steps.map((step, idx) => {
        const config = STATUS_CONFIG[step.status];
        const Icon = config.icon;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.key} className="flex gap-3 relative">
            {!isLast && (
              <div
                className={`absolute left-[13px] top-7 bottom-0 w-0.5 ${config.lineClass}`}
              />
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${config.dotClass}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 pb-5">
              <p className={`text-xs font-bold ${config.labelClass}`}>{step.label}</p>
              {step.description && (
                <p className="text-[11px] text-gray-500 mt-0.5">{step.description}</p>
              )}
              {step.timestamp && (
                <p className="text-[10px] text-gray-400 mt-0.5">{step.timestamp}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

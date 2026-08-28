import React from "react";
import { Check } from "lucide-react";

interface StepperStep {
  key: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: string;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  variant = "horizontal",
  className = "",
}) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  if (variant === "vertical") {
    return (
      <div className={`space-y-0 ${className}`}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isCompleted
                      ? "bg-brand-600 border-brand-600 text-white"
                      : isCurrent
                      ? "border-brand-600 text-brand-600 bg-white"
                      : "border-gray-200 text-gray-400 bg-white"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 ${
                      isCompleted ? "bg-brand-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className="pt-1 pb-4">
                <p className={`text-xs font-bold ${isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                  isCompleted
                    ? "bg-brand-600 border-brand-600 text-white"
                    : isCurrent
                    ? "border-brand-600 text-brand-600 bg-white"
                    : "border-gray-200 text-gray-400 bg-white"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-bold hidden sm:inline ${
                  isCurrent ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 min-w-[24px] ${
                  isCompleted ? "bg-brand-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

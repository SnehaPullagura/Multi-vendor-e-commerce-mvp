"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  formatValue = (v) => `\$${v}`,
  className = "",
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + pct * (max - min);
      return Math.round(raw / step) * step;
    },
    [min, max, step]
  );

  const handleMouseDown = (thumb: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newVal = getValueFromPosition(e.clientX);
      if (isDragging === "min") {
        onChange([Math.min(newVal, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newVal, value[0] + step)]);
      }
    };

    const handleMouseUp = () => setIsDragging(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, value, onChange, getValueFromPosition, step]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-gray-900">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
      <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer">
        <div
          className="absolute h-full bg-brand-500 rounded-full"
          style={{
            left: `${getPercent(value[0])}%`,
            width: `${getPercent(value[1]) - getPercent(value[0])}%`,
          }}
        />
        {(["min", "max"] as const).map((thumb) => (
          <div
            key={thumb}
            onMouseDown={handleMouseDown(thumb)}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-brand-600 rounded-full cursor-grab shadow-sm hover:scale-110 transition-transform ${
              isDragging === thumb ? "cursor-grabbing scale-110" : ""
            }`}
            style={{
              left: `${getPercent(thumb === "min" ? value[0] : value[1])}%`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

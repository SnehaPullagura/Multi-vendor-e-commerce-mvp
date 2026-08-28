"use client";

import React from "react";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  size = 180,
  thickness = 24,
  centerLabel,
  centerValue,
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {segments.map((seg, idx) => {
            const strokeDasharray = (seg.value / total) * circumference;
            const strokeDashoffset = -currentOffset;
            currentOffset += strokeDasharray;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${strokeDasharray} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {centerValue && <span className="text-xl font-black text-gray-900">{centerValue}</span>}
            {centerLabel && <span className="text-[10px] text-gray-400 font-semibold uppercase">{centerLabel}</span>}
          </div>
        )}
      </div>

      <div className="space-y-2 flex-1">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="font-semibold text-gray-700">{seg.label}</span>
            </div>
            <span className="font-bold text-gray-900">
              {((seg.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

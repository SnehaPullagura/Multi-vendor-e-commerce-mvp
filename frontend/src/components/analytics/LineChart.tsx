"use client";

import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  fillColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  showPoints?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = "#4f46e5",
  fillColor = "rgba(79, 70, 229, 0.1)",
  valuePrefix = "",
  valueSuffix = "",
  showPoints = true,
}) => {
  if (!data || data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-xs text-gray-400">No chart data</div>;
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 1);
  const range = maxVal - minVal || 1;

  const width = 600;
  const paddingX = 40;
  const paddingY = 20;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * chartW;
    const y = height - paddingY - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - paddingY - pct * chartH;
          const val = minVal + pct * range;
          return (
            <g key={idx}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                {valuePrefix}{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}{valueSuffix}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points & X-Labels */}
        {points.map((p, i) => (
          <g key={i}>
            {showPoints && (
              <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2.5" />
            )}
            <text x={p.x} y={height - 4} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

import React, { ReactNode } from "react";

interface ActivityItem {
  id: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  timestamp: string;
  meta?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  maxItems?: number;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  title = "Recent Activity",
  maxItems = 10,
  className = "",
}) => {
  const displayed = items.slice(0, maxItems);

  return (
    <div className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-sm ${className}`}>
      <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-0">
        {displayed.map((item, idx) => (
          <div key={item.id} className="flex gap-3 relative">
            {/* Timeline line */}
            {idx < displayed.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-100" />
            )}
            {/* Icon */}
            <div className="w-8 h-8 rounded-full bg-slate-100 text-gray-500 flex items-center justify-center flex-shrink-0 z-10 text-[11px]">
              {item.icon || "●"}
            </div>
            {/* Content */}
            <div className="flex-1 pb-5">
              <p className="text-xs font-bold text-gray-900">{item.title}</p>
              {item.description && (
                <p className="text-[11px] text-gray-500 mt-0.5">{item.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                {item.meta && (
                  <span className="text-[10px] text-gray-400">• {item.meta}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

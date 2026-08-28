"use client";

import React, { useState, ReactNode } from "react";

interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultKey?: string;
  variant?: "underline" | "pills" | "boxed";
  onChange?: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultKey,
  variant = "pills",
  onChange,
  className = "",
}) => {
  const [activeKey, setActiveKey] = useState(defaultKey || items[0]?.key || "");

  const handleChange = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  const activeItem = items.find((i) => i.key === activeKey);

  const tabBaseStyles = "flex items-center gap-1.5 text-xs font-bold transition-all whitespace-nowrap";

  const variantStyles = {
    underline: {
      container: "flex gap-6 border-b border-gray-200",
      active: `${tabBaseStyles} text-brand-600 pb-2.5 border-b-2 border-brand-600`,
      inactive: `${tabBaseStyles} text-gray-500 hover:text-gray-700 pb-2.5 border-b-2 border-transparent`,
    },
    pills: {
      container: "flex gap-2",
      active: `${tabBaseStyles} px-4 py-2 rounded-xl bg-brand-600 text-white shadow-sm`,
      inactive: `${tabBaseStyles} px-4 py-2 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border border-gray-100`,
    },
    boxed: {
      container: "flex bg-gray-100 rounded-xl p-1 gap-1",
      active: `${tabBaseStyles} px-4 py-2 rounded-lg bg-white text-gray-900 shadow-sm`,
      inactive: `${tabBaseStyles} px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700`,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      <div className={`${styles.container} overflow-x-auto`}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleChange(item.key)}
            className={activeKey === item.key ? styles.active : styles.inactive}
          >
            {item.icon}
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">{activeItem?.content}</div>
    </div>
  );
};

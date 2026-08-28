"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect: (key: string) => void;
  align?: "left" | "right";
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  align = "right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-flex ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute z-40 top-full mt-1.5 ${
            align === "right" ? "right-0" : "left-0"
          } min-w-[160px] bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {items.map((item) =>
            item.divider ? (
              <div key={item.key} className="h-px bg-gray-100 my-1" />
            ) : (
              <button
                key={item.key}
                onClick={() => {
                  onSelect(item.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                  item.danger
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

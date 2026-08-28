"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemData {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  variant = "default",
  className = "",
}) => {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const defaults = new Set<string>();
    items.forEach((item) => {
      if (item.defaultOpen) defaults.add(item.id);
    });
    return defaults;
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const variantClasses = {
    default: "divide-y divide-gray-100",
    bordered: "divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden",
    separated: "space-y-3",
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={isOpen}
            onToggle={() => toggle(item.id)}
            variant={variant}
          />
        );
      })}
    </div>
  );
};

interface AccordionItemProps {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
  variant: "default" | "bordered" | "separated";
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  variant,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, item.content]);

  const wrapperClass =
    variant === "separated"
      ? "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      : "";

  return (
    <div className={wrapperClass}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group hover:bg-slate-50/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-[11px] text-gray-400 mt-0.5">{item.subtitle}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${contentHeight}px` : "0px" }}
      >
        <div ref={contentRef} className="px-5 pb-5 text-xs text-gray-600 leading-relaxed">
          {item.content}
        </div>
      </div>
    </div>
  );
};

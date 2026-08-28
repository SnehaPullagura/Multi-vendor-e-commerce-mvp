"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Search, Check } from "lucide-react";

interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  maxSelected?: number;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  searchable = true,
  maxSelected,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOptions = options.filter(
    (opt) =>
      !search ||
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.description?.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (maxSelected && selected.length >= maxSelected) return;
      onChange([...selected, value]);
    }
  };

  const removeTag = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[42px] px-3 py-2 rounded-xl border cursor-pointer flex items-center flex-wrap gap-1.5 transition-all ${
          isOpen ? "border-brand-500 ring-2 ring-brand-500/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {selected.length > 0 ? (
          selected.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-lg text-[11px] font-semibold border border-brand-200"
              >
                {opt?.label || val}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(val);
                  }}
                  className="text-brand-400 hover:text-brand-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })
        ) : (
          <span className="text-xs text-gray-400">{placeholder}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-40 top-full mt-1.5 w-full bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 max-h-60 overflow-y-auto">
          {searchable && (
            <div className="px-3 pb-1.5 border-b border-gray-100 mb-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-brand-500"
                  autoFocus
                />
              </div>
            </div>
          )}
          {filteredOptions.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div>
                  <span className="font-semibold">{opt.label}</span>
                  {opt.description && (
                    <span className="text-gray-400 ml-1.5">{opt.description}</span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
            );
          })}
          {filteredOptions.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-3">No options found</p>
          )}
        </div>
      )}
    </div>
  );
};

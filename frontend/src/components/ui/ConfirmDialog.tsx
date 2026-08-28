"use client";

import React from "react";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const VARIANT_CONFIG = {
  danger: {
    icon: Trash2,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    confirmBg: "bg-rose-600 hover:bg-rose-700",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    confirmBg: "bg-amber-600 hover:bg-amber-700",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    confirmBg: "bg-blue-600 hover:bg-blue-700",
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center py-2">
        <div
          className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${config.iconBg}`}
        >
          <Icon className={`w-7 h-7 ${config.iconColor}`} />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 ${config.confirmBg}`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

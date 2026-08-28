import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status?.toUpperCase()) {
    case "PUBLISHED":
    case "APPROVED":
    case "DELIVERED":
    case "COMPLETED":
    case "SETTLED":
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20";
    case "SHIPPED":
    case "PROCESSING":
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20";
    case "PENDING":
    case "PENDING_REVIEW":
    case "AWAITING_FULFILLMENT":
    case "REQUESTED":
    case "DRAFT":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20";
    case "CANCELLED":
    case "REJECTED":
    case "SUSPENDED":
    case "FAILED":
    case "ARCHIVED":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-600/20";
  }
}

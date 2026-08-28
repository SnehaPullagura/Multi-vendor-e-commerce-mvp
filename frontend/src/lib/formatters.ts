/**
 * Internationalization & Number/Date Formatting Utilities
 */

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "k";
  }
  return num.toString();
}

export function formatPercentage(rate: number, decimals: number = 1): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatAddressOneLine(addr: {
  street_address_1: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}): string {
  return `${addr.street_address_1}, ${addr.city}, ${addr.state} ${addr.postal_code}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

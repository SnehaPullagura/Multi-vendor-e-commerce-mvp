/**
 * Enterprise Form Validation & Data Integrity Suite
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  score: number;
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score += 1;
  else suggestions.push("Password must be at least 8 characters long");

  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push("Include at least one uppercase letter");

  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push("Include at least one lowercase letter");

  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push("Include at least one number");

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else suggestions.push("Include at least one special character (!@#$%^&*)");

  return {
    isStrong: score >= 4,
    score,
    suggestions,
  };
}

export function validateSKU(sku: string): boolean {
  return /^[A-Z0-9]{3,}-[A-Z0-9]{2,}-[A-Z0-9]{1,}$/.test(sku);
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function validatePostalCode(postalCode: string, country: string = "US"): boolean {
  if (country === "US") {
    return /^\d{5}(-\d{4})?$/.test(postalCode.trim());
  }
  if (country === "CA") {
    return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode.trim());
  }
  if (country === "UK") {
    return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postalCode.trim());
  }
  return postalCode.trim().length >= 3;
}

export function validateCreditCardNumber(cardNumber: string): {
  isValid: boolean;
  brand: "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER" | "UNKNOWN";
} {
  const digits = cardNumber.replace(/\D/g, "");
  let brand: "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER" | "UNKNOWN" = "UNKNOWN";

  if (/^4/.test(digits)) brand = "VISA";
  else if (/^5[1-5]/.test(digits)) brand = "MASTERCARD";
  else if (/^3[47]/.test(digits)) brand = "AMEX";
  else if (/^6(?:011|5)/.test(digits)) brand = "DISCOVER";

  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return {
    isValid: digits.length >= 13 && digits.length <= 19 && sum % 10 === 0,
    brand,
  };
}

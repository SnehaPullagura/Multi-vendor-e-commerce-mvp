/**
 * Commerce Financial & Tax Mathematics Library
 */

export function calculateOrderTotals(items: Array<{ price: number; quantity: number }>, taxRate: number = 0.08, shipping: number = 0.0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

export function calculateCommissionSplit(subtotal: number, takeRatePercentage: number = 15.0) {
  const commission = (subtotal * takeRatePercentage) / 100.0;
  const vendorPayout = subtotal - commission;

  return {
    gross: Math.round(subtotal * 100) / 100,
    commission: Math.round(commission * 100) / 100,
    vendorPayout: Math.round(vendorPayout * 100) / 100,
  };
}

export function clamp(value, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return minimum;
  return Math.min(maximum, Math.max(minimum, parsed));
}

export function calculateBill(items, discountPercent, taxPercent, taxEnabled) {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const safeDiscount = clamp(discountPercent, 0, 100);
  const discountAmount = subtotal * (safeDiscount / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const safeTax = taxEnabled ? clamp(taxPercent, 0, 100) : 0;
  const taxAmount = taxableAmount * (safeTax / 100);

  return {
    subtotal,
    discountPercent: safeDiscount,
    discountAmount,
    taxRate: safeTax,
    taxAmount,
    total: taxableAmount + taxAmount
  };
}

export function createInvoiceNumber(prefix, count, date = new Date()) {
  return `${prefix}-${date.getFullYear()}-${String(count + 1).padStart(6, '0')}`;
}

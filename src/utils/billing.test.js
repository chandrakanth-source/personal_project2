import { describe, expect, it } from 'vitest';
import { calculateBill, clamp, createInvoiceNumber } from './billing';

describe('billing calculations', () => {
  it('calculates subtotal, tax, and grand total', () => {
    const result = calculateBill(
      [{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }],
      10,
      18,
      true
    );

    expect(result.subtotal).toBe(250);
    expect(result.discountAmount).toBe(25);
    expect(result.taxAmount).toBe(40.5);
    expect(result.total).toBe(265.5);
  });

  it('clamps invalid discount percentages', () => {
    expect(clamp(-20, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp('not-a-number', 0, 100)).toBe(0);
  });

  it('supports tax-free bills', () => {
    const result = calculateBill([{ price: 100, quantity: 1 }], 0, 18, false);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(100);
  });

  it('generates a padded invoice number', () => {
    expect(createInvoiceNumber('INV', 41, new Date('2026-11-24'))).toBe('INV-2026-000042');
  });
});

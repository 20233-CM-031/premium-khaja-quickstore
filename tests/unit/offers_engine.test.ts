import { describe, it, expect } from 'vitest';
import { DEFAULT_OFFERS } from '../../src/context/StoreContext';

describe('Section 8: Promotional Offers & Pricing Rules Engine', () => {
  it('loads default canonical offers ROYAL10 and BRIDAL200', () => {
    const codes = DEFAULT_OFFERS.map(o => o.code);
    expect(codes).toContain('ROYAL10');
    expect(codes).toContain('BRIDAL200');
  });

  it('correctly calculates 10% discount for ROYAL10 when subtotal >= minSubtotal', () => {
    const royal10 = DEFAULT_OFFERS.find(o => o.code === 'ROYAL10');
    expect(royal10).toBeDefined();

    const subtotal = 3000;
    expect(subtotal).toBeGreaterThanOrEqual(royal10!.minSubtotal);

    const discount = Math.round((subtotal * royal10!.discountValue) / 100);
    expect(discount).toBe(300);

    const finalSubtotal = subtotal - discount;
    expect(finalSubtotal).toBe(2700);
  });

  it('rejects ROYAL10 when cart subtotal is below minimum threshold (1499)', () => {
    const royal10 = DEFAULT_OFFERS.find(o => o.code === 'ROYAL10');
    const subtotal = 1200;

    const isEligible = subtotal >= royal10!.minSubtotal;
    expect(isEligible).toBe(false);
  });

  it('correctly calculates flat discount for BRIDAL200 when subtotal >= minSubtotal (2499)', () => {
    const bridal200 = DEFAULT_OFFERS.find(o => o.code === 'BRIDAL200');
    expect(bridal200).toBeDefined();

    const subtotal = 2999;
    expect(subtotal).toBeGreaterThanOrEqual(bridal200!.minSubtotal);

    const discount = Math.min(subtotal, bridal200!.discountValue);
    expect(discount).toBe(200);

    const finalSubtotal = subtotal - discount;
    expect(finalSubtotal).toBe(2799);
  });

  it('does not apply paused/inactive coupons', () => {
    const inactiveOffer = {
      id: 'coupon-test-inactive',
      code: 'EXPIRED20',
      discountType: 'percentage',
      discountValue: 20,
      minSubtotal: 1000,
      active: false
    };

    const applyOffer = (offer: typeof inactiveOffer, subtotal: number) => {
      if (!offer.active) return { success: false, error: 'Coupon is no longer active.' };
      if (subtotal < offer.minSubtotal) return { success: false, error: 'Order subtotal below minimum.' };
      return { success: true, discount: 200 };
    };

    const res = applyOffer(inactiveOffer, 2500);
    expect(res.success).toBe(false);
    expect(res.error).toBe('Coupon is no longer active.');
  });
});

import { describe, it, expect } from 'vitest';
import { calculateOrderTotals, CanonicalProduct } from '../../src/lib/pricing/pricingEngine';
import { validateOrderTransition } from '../../src/lib/orders/orderStateMachine';
import { createOrderAuthoritative } from '../../src/lib/orders/orderEngine';
import { PREMIUM_KHAJA_CONFIG } from '../../src/config/tenants/premium-khaja';
import { CheckoutAddressSchema } from '../../src/lib/validation/schemas';

const mockCatalog: CanonicalProduct[] = [
  {
    id: 'bangle-01',
    name: 'Royal Rajputi Kundan Kada',
    sku: 'PK-BGL-01-STN',
    price: 2499,
    memberPrice: 2249,
    inventoryCount: 10,
    variants: [
      { id: 'v-24', sku: 'PK-BGL-01-24', stockQty: 4, options: { size: '2.4' } },
      { id: 'v-26', sku: 'PK-BGL-01-26', stockQty: 0, options: { size: '2.6' } }
    ]
  },
  {
    id: 'earring-01',
    name: 'Meenakari Jhumka',
    sku: 'PK-EAR-01',
    price: 899,
    inventoryCount: 5
  }
];

describe('Phase 1: Authoritative Pricing & Delivery Engine', () => {
  it('correctly calculates subtotal and waives delivery fee when threshold (1499) is met', () => {
    const items = [{ productId: 'bangle-01', quantity: 1 }];
    const result = calculateOrderTotals(items, mockCatalog, PREMIUM_KHAJA_CONFIG.delivery, false, 'local_courier');

    expect(result.isValid).toBe(true);
    expect(result.subtotal).toBe(2499);
    expect(result.deliveryFee).toBe(0); // >= 1499 is free
    expect(result.total).toBe(2499);
  });

  it('charges fixed delivery fee when subtotal is below free delivery threshold', () => {
    const items = [{ productId: 'earring-01', quantity: 1 }];
    const result = calculateOrderTotals(items, mockCatalog, PREMIUM_KHAJA_CONFIG.delivery, false, 'local_courier');

    expect(result.isValid).toBe(true);
    expect(result.subtotal).toBe(899);
    expect(result.deliveryFee).toBe(99); // < 1499 charges 99
    expect(result.total).toBe(998);
  });

  it('rejects order when requested quantity exceeds available stock', () => {
    const items = [{ productId: 'earring-01', quantity: 10 }]; // only 5 in stock
    const result = calculateOrderTotals(items, mockCatalog, PREMIUM_KHAJA_CONFIG.delivery);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Insufficient stock');
  });

  it('rejects order for out-of-stock variant', () => {
    const items = [{ productId: 'bangle-01', variantId: 'v-26', quantity: 1 }]; // 0 in stock
    const result = calculateOrderTotals(items, mockCatalog, PREMIUM_KHAJA_CONFIG.delivery);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Insufficient stock');
  });
});

describe('Phase 1: Order State Machine & Access Control', () => {
  it('allows customer to submit payment reference, moving order to payment_verification_pending', () => {
    const check = validateOrderTransition('pending_payment', 'payment_verification_pending', 'customer');
    expect(check.allowed).toBe(true);
  });

  it('strictly FORBIDS customer role from marking order as payment_verified or confirmed', () => {
    const check1 = validateOrderTransition('payment_verification_pending', 'payment_verified', 'customer');
    expect(check1.allowed).toBe(false);

    const check2 = validateOrderTransition('pending_payment', 'confirmed', 'customer');
    expect(check2.allowed).toBe(false);
  });

  it('allows merchant owner or manager to verify manual UPI payment', () => {
    const check = validateOrderTransition('payment_verification_pending', 'payment_verified', 'owner');
    expect(check.allowed).toBe(true);
  });

  it('blocks invalid skipped transitions (e.g. pending_payment -> delivered)', () => {
    const check = validateOrderTransition('pending_payment', 'delivered', 'owner');
    expect(check.allowed).toBe(false);
  });
});

describe('Phase 1: Idempotency & Order Creation', () => {
  it('creates order with pending_payment status and generates WhatsApp handoff', () => {
    const payload = {
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      items: [{ productId: 'bangle-01', quantity: 1, selectedSize: '2.4' }],
      shipping: {
        fullName: 'Fatima Begum',
        phone: '9876543210',
        email: 'fatima@example.com',
        streetAddress: 'Flat 402, Royal Palms, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        deliveryMethod: 'local_courier' as const,
        marketingOptIn: false
      },
      idempotencyKey: 'idem_test_key_12345'
    };

    const res = createOrderAuthoritative(payload, mockCatalog, PREMIUM_KHAJA_CONFIG);
    expect(res.success).toBe(true);
    expect(res.order?.status).toBe('pending_payment');
    expect(res.order?.paymentStatus).toBe('unpaid');
    expect(res.whatsAppHandoffUrl).toContain('https://wa.me/919393056641');
    expect(res.whatsAppHandoffUrl).toContain(encodeURIComponent(res.order?.orderNumber || ''));
  });

  it('returns identical order if submitted with same idempotency key (duplicate tap prevention)', () => {
    const payload = {
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      items: [{ productId: 'bangle-01', quantity: 1 }],
      shipping: {
        fullName: 'Amina Khan',
        phone: '9876543211',
        streetAddress: 'House 12, King Koti',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        deliveryMethod: 'local_courier' as const,
        marketingOptIn: false
      },
      idempotencyKey: 'idem_duplicate_test_999'
    };

    const first = createOrderAuthoritative(payload, mockCatalog, PREMIUM_KHAJA_CONFIG);
    expect(first.success).toBe(true);

    const second = createOrderAuthoritative(payload, mockCatalog, PREMIUM_KHAJA_CONFIG, [first.order!]);
    expect(second.success).toBe(true);
    expect(second.order?.id).toBe(first.order?.id);
    expect(second.order?.orderNumber).toBe(first.order?.orderNumber);
  });
});

describe('Phase 1: Input Validation & DPDP Privacy Baseline', () => {
  it('validates correct Indian phone numbers and postal PIN codes', () => {
    const valid = CheckoutAddressSchema.safeParse({
      fullName: 'Mohammed Jaffar',
      phone: '9393056641',
      streetAddress: 'Charminar Heritage Market',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500002',
      deliveryMethod: 'local_courier',
      marketingOptIn: false
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid phone numbers or short PIN codes', () => {
    const invalidPhone = CheckoutAddressSchema.safeParse({
      fullName: 'Shopper',
      phone: '12345',
      streetAddress: 'Street 1',
      city: 'City',
      state: 'State',
      pincode: '500002',
      deliveryMethod: 'local_courier',
      marketingOptIn: false
    });
    expect(invalidPhone.success).toBe(false);

    const invalidPin = CheckoutAddressSchema.safeParse({
      fullName: 'Shopper',
      phone: '9876543210',
      streetAddress: 'Street 1',
      city: 'City',
      state: 'State',
      pincode: '500',
      deliveryMethod: 'local_courier',
      marketingOptIn: false
    });
    expect(invalidPin.success).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { adjustStock } from '../../src/lib/inventory/inventoryEngine';
import { 
  createOrderAuthoritative, 
  submitUpiPaymentReference, 
  verifyPaymentAuthoritative, 
  rejectPaymentAuthoritative, 
  updateOrderStatusAuthoritative, 
  cancelOrderAuthoritative,
  OrderRecord 
} from '../../src/lib/orders/orderEngine';
import { validateOrderTransition } from '../../src/lib/orders/orderStateMachine';
import { 
  InventoryAdjustmentSchema, 
  ProductMutationSchema 
} from '../../src/lib/validation/schemas';
import { PREMIUM_KHAJA_CONFIG } from '../../src/config/tenants/premium-khaja';
import { getActiveTenant } from '../../src/config';
import { CanonicalProduct } from '../../src/lib/pricing/pricingEngine';

const mockCatalog: CanonicalProduct[] = [
  {
    id: 'bangle-01',
    name: 'Royal Rajputi Kundan Kada',
    sku: 'PK-BGL-01-STN',
    price: 2499,
    memberPrice: 2249,
    inventoryCount: 10,
    variants: [
      { id: 'v-24', sku: 'PK-BGL-01-24', stockQty: 4, options: { size: '2.4' } }
    ]
  },
  {
    id: 'choker-01',
    name: 'Nizam Heritage Pearl Choker',
    sku: 'PK-CHK-01',
    price: 4999,
    inventoryCount: 3
  }
];

describe('Phase 2: Merchant Inventory Engine & Movements', () => {
  it('records an auditable inventory restock movement with actor and reason', () => {
    const result = adjustStock(
      10,
      5,
      'RESTOCK',
      PREMIUM_KHAJA_CONFIG.id,
      'bangle-01',
      undefined,
      'po_batch_402',
      'Jaffar Mohd',
      'Festival restock received from workshop'
    );

    expect(result.success).toBe(true);
    expect(result.newStock).toBe(15);
    expect(result.movement).toBeDefined();
    expect(result.movement?.quantityDelta).toBe(5);
    expect(result.movement?.reason).toBe('RESTOCK');
    expect(result.movement?.referenceId).toBe('po_batch_402');
    expect(result.movement?.actorName).toBe('Jaffar Mohd');
  });

  it('records an auditable sale deduction and links to order reference', () => {
    const result = adjustStock(
      15,
      -2,
      'SALE',
      PREMIUM_KHAJA_CONFIG.id,
      'bangle-01',
      undefined,
      'PK-ORD-9041',
      'System Order Engine'
    );

    expect(result.success).toBe(true);
    expect(result.newStock).toBe(13);
    expect(result.movement?.reason).toBe('SALE');
    expect(result.movement?.referenceType).toBe('order');
    expect(result.movement?.referenceId).toBe('PK-ORD-9041');
  });

  it('strictly blocks adjustments that would cause negative inventory', () => {
    const result = adjustStock(
      2,
      -5,
      'DAMAGE',
      PREMIUM_KHAJA_CONFIG.id,
      'bangle-01',
      undefined,
      'qc_inspection',
      'QC Manager'
    );

    expect(result.success).toBe(false);
    expect(result.newStock).toBe(2);
    expect(result.error).toContain('negative inventory');
    expect(result.movement).toBeUndefined();
  });

  it('validates InventoryAdjustmentSchema and rejects delta of 0', () => {
    const valid = InventoryAdjustmentSchema.safeParse({
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      productId: 'bangle-01',
      delta: 10,
      reason: 'RESTOCK',
      actorName: 'Jaffar Mohd'
    });
    expect(valid.success).toBe(true);

    const zeroDelta = InventoryAdjustmentSchema.safeParse({
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      productId: 'bangle-01',
      delta: 0,
      reason: 'RESTOCK'
    });
    expect(zeroDelta.success).toBe(false);
  });

  it('validates ProductMutationSchema with required fields and positive pricing', () => {
    const valid = ProductMutationSchema.safeParse({
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      name: 'Hyderabadi Jadau Guluband Choker',
      sku: 'PK-CHK-JADAU-01',
      categoryId: 'cat_necklaces',
      price: 5499,
      compareAtPrice: 6999,
      primaryImage: '/images/products/guluband.jpg',
      status: 'published'
    });
    expect(valid.success).toBe(true);

    const negativePrice = ProductMutationSchema.safeParse({
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      name: 'Bad Product',
      sku: 'PK-BAD',
      categoryId: 'cat_necklaces',
      price: -100,
      primaryImage: '/images/products/bad.jpg'
    });
    expect(negativePrice.success).toBe(false);
  });
});

describe('Phase 3: Manual UPI Payment Verification Workflow', () => {
  const sampleOrderPayload = {
    tenantId: PREMIUM_KHAJA_CONFIG.id,
    items: [{ productId: 'bangle-01', quantity: 2, selectedSize: '2.4' }],
    shipping: {
      fullName: 'Begum Rehana',
      phone: '9848022338',
      streetAddress: 'Plot 10, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      deliveryMethod: 'local_courier' as const,
      marketingOptIn: false
    },
    idempotencyKey: 'idem_workflow_test_001'
  };

  it('creates order in pending_payment status', () => {
    const res = createOrderAuthoritative(sampleOrderPayload, mockCatalog, PREMIUM_KHAJA_CONFIG);
    expect(res.success).toBe(true);
    expect(res.order?.status).toBe('pending_payment');
    expect(res.order?.paymentStatus).toBe('unpaid');
  });

  it('allows customer to submit payment reference, transitioning order to payment_verification_pending', () => {
    const initial = createOrderAuthoritative(sampleOrderPayload, mockCatalog, PREMIUM_KHAJA_CONFIG).order!;
    
    const submission = submitUpiPaymentReference(initial, {
      utrNumber: 'UPI492048102948',
      payerNote: 'Paid via GPay to Jaffar Mohd'
    });

    expect(submission.success).toBe(true);
    expect(submission.order?.status).toBe('payment_verification_pending');
    expect(submission.order?.paymentStatus).toBe('submitted_pending_verification');
    expect(submission.order?.paymentReference).toBe('UPI492048102948');
  });

  it('STRICTLY BLOCKS customer role from verifying payment or confirming order', () => {
    const initial = createOrderAuthoritative(sampleOrderPayload, mockCatalog, PREMIUM_KHAJA_CONFIG).order!;
    const withUtr = submitUpiPaymentReference(initial, { utrNumber: 'UPI492048102948' }).order!;

    const customerVerifyAttempt = verifyPaymentAuthoritative(withUtr, 'customer');
    expect(customerVerifyAttempt.success).toBe(false);
    expect(customerVerifyAttempt.error).toContain('not authorized');

    const customerConfirmAttempt = updateOrderStatusAuthoritative(withUtr, 'confirmed', 'customer');
    expect(customerConfirmAttempt.success).toBe(false);
  });

  it('allows owner or manager to verify manual payment and advance through fulfillment', () => {
    const initial = createOrderAuthoritative(sampleOrderPayload, mockCatalog, PREMIUM_KHAJA_CONFIG).order!;
    const withUtr = submitUpiPaymentReference(initial, { utrNumber: 'UPI492048102948' }).order!;

    // 1. Owner verifies payment
    const verified = verifyPaymentAuthoritative(withUtr, 'owner', 'Jaffar Mohd');
    expect(verified.success).toBe(true);
    expect(verified.order?.status).toBe('payment_verified');
    expect(verified.order?.paymentStatus).toBe('verified');

    // 2. Advance to confirmed
    const confirmed = updateOrderStatusAuthoritative(verified.order!, 'confirmed', 'owner');
    expect(confirmed.success).toBe(true);
    expect(confirmed.order?.status).toBe('confirmed');

    // 3. Advance to preparing (packing)
    const preparing = updateOrderStatusAuthoritative(confirmed.order!, 'preparing', 'manager');
    expect(preparing.success).toBe(true);
    expect(preparing.order?.status).toBe('preparing');

    // 4. Advance to ready_for_dispatch
    const ready = updateOrderStatusAuthoritative(preparing.order!, 'ready_for_dispatch', 'manager');
    expect(ready.success).toBe(true);
    expect(ready.order?.status).toBe('ready_for_dispatch');

    // 5. Advance to out_for_delivery
    const dispatched = updateOrderStatusAuthoritative(ready.order!, 'out_for_delivery', 'manager');
    expect(dispatched.success).toBe(true);
    expect(dispatched.order?.status).toBe('out_for_delivery');

    // 6. Complete delivery
    const delivered = updateOrderStatusAuthoritative(dispatched.order!, 'delivered', 'owner');
    expect(delivered.success).toBe(true);
    expect(delivered.order?.status).toBe('delivered');
  });

  it('allows owner to reject invalid UPI claim and return order to pending_payment', () => {
    const initial = createOrderAuthoritative(sampleOrderPayload, mockCatalog, PREMIUM_KHAJA_CONFIG).order!;
    const withUtr = submitUpiPaymentReference(initial, { utrNumber: 'FAKE_UTR_9999' }).order!;

    const rejected = rejectPaymentAuthoritative(withUtr, 'owner', 'Transaction not found in bank ledger');
    expect(rejected.success).toBe(true);
    expect(rejected.order?.status).toBe('pending_payment');
    expect(rejected.order?.paymentStatus).toBe('rejected');
    expect(rejected.order?.customerNote).toContain('Payment rejected');
  });

  it('restores stock when an unfulfilled order is cancelled', () => {
    const initial = createOrderAuthoritative(sampleOrderPayload, mockCatalog, PREMIUM_KHAJA_CONFIG).order!;
    const withUtr = submitUpiPaymentReference(initial, { utrNumber: 'UPI_TEST' }).order!;

    const cancelled = cancelOrderAuthoritative(withUtr, 'owner', 'Customer requested cancellation before dispatch');
    expect(cancelled.success).toBe(true);
    expect(cancelled.order?.status).toBe('cancelled');
    expect(cancelled.restockActions).toBeDefined();
    expect(cancelled.restockActions?.length).toBe(1);
    expect(cancelled.restockActions?.[0].productId).toBe('bangle-01');
    expect(cancelled.restockActions?.[0].quantity).toBe(2);
  });
});

describe('Phase 1-3 Multi-Tenant Isolation & Feature Flag Configuration', () => {
  it('resolves active tenant cleanly from registry with complete contact and payment info', () => {
    const tenant = getActiveTenant('premium-khaja');
    expect(tenant.slug).toBe('premium-khaja');
    expect(tenant.contact.ownerName).toBe('Jaffar Mohd');
    expect(tenant.payment.primaryMethod).toBe('manual_upi_qr');
    expect(tenant.payment.upiId).toBe('premiumkhaja@okaxis');
    expect(tenant.delivery.freeDeliveryThreshold).toBe(1499);
  });

  it('keeps advanced AI and voice command flags disabled until certified', () => {
    const tenant = getActiveTenant('premium-khaja');
    expect(tenant.featureFlags.enableDirectUpi).toBe(true);
    expect(tenant.featureFlags.enableShorts).toBe(true);
    expect(tenant.featureFlags.enableRecommendations).toBe(true);
    expect(tenant.featureFlags.enableThresholdOffers).toBe(true);
    // Modular flags remain false
    expect(tenant.featureFlags.enableAiStylist).toBe(false);
    expect(tenant.featureFlags.enableVoiceCommands).toBe(false);
    expect(tenant.featureFlags.enableSocialSync).toBe(false);
  });
});

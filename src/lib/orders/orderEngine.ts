import { CreateOrderPayload, CreateOrderPayloadSchema } from '../validation/schemas';
import { calculateOrderTotals, CanonicalProduct } from '../pricing/pricingEngine';
import { TenantConfig } from '../../config/tenant-defaults';
import { OrderStatus, UserRole, validateOrderTransition } from './orderStateMachine';

export interface OrderRecord {
  id: string;
  tenantId: string;
  orderNumber: string;
  publicTrackingToken: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: {
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    deliveryMethod: string;
  };
  deliveryMethod: string;
  deliveryFeeState: 'included' | 'to_be_quoted' | 'waived';
  deliveryFeeAmount: number;
  subtotal: number;
  discountTotal: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'unpaid' | 'submitted_pending_verification' | 'verified' | 'rejected';
  paymentMethod: string;
  paymentReference?: string;
  customerNote?: string;
  orderGuidanceTags?: string[];
  sizePreference?: string;
  marketingConsent: boolean;
  idempotencyKey: string;
  items: Array<{
    productId: string;
    variantId?: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    selectedSize?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResult {
  success: boolean;
  error?: string;
  order?: OrderRecord;
  whatsAppHandoffUrl?: string;
}

/**
 * Creates an order authoritatively:
 * 1. Validates inputs using Zod
 * 2. Recalculates totals from canonical catalog
 * 3. Enforces idempotency
 * 4. Produces immutable order record
 * 5. Generates pre-formatted WhatsApp handoff URL
 */
export function createOrderAuthoritative(
  payload: CreateOrderPayload,
  catalog: CanonicalProduct[],
  tenant: TenantConfig,
  existingOrders: OrderRecord[] = []
): CreateOrderResult {
  // 1. Zod input validation
  const validation = CreateOrderPayloadSchema.safeParse(payload);
  if (!validation.success) {
    const errorMsg = validation.error.errors.map(e => e.message).join(', ');
    return { success: false, error: errorMsg };
  }

  // 2. Idempotency Check
  const existingOrder = existingOrders.find(
    o => o.idempotencyKey === payload.idempotencyKey && o.tenantId === payload.tenantId
  );
  if (existingOrder) {
    return {
      success: true,
      order: existingOrder,
      whatsAppHandoffUrl: generateWhatsAppHandoffUrl(existingOrder, tenant)
    };
  }

  // 3. Authoritative Pricing & Stock Recomputation
  const calculation = calculateOrderTotals(
    payload.items,
    catalog,
    tenant.delivery,
    false,
    payload.shipping.deliveryMethod
  );

  if (!calculation.isValid) {
    return { success: false, error: calculation.error };
  }

  // 4. Generate stable order number & tracking token
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `PK-ORD-${randomSuffix}`;
  const publicTrackingToken = `trk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();

  const newOrder: OrderRecord = {
    id: `ord_${Date.now()}_${randomSuffix}`,
    tenantId: payload.tenantId,
    orderNumber,
    publicTrackingToken,
    customerName: payload.shipping.fullName,
    customerPhone: payload.shipping.phone,
    customerEmail: payload.shipping.email,
    shippingAddress: {
      streetAddress: payload.shipping.streetAddress,
      city: payload.shipping.city,
      state: payload.shipping.state,
      pincode: payload.shipping.pincode,
      deliveryMethod: payload.shipping.deliveryMethod
    },
    deliveryMethod: payload.shipping.deliveryMethod,
    deliveryFeeState: calculation.deliveryFee === 0 ? 'waived' : 'included',
    deliveryFeeAmount: calculation.deliveryFee,
    subtotal: calculation.subtotal,
    discountTotal: calculation.discountTotal,
    totalAmount: calculation.total,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    paymentMethod: tenant.payment.primaryMethod,
    customerNote: payload.shipping.customerNote,
    orderGuidanceTags: payload.orderGuidanceTags || [],
    sizePreference: payload.shipping.sizePreference,
    marketingConsent: payload.shipping.marketingOptIn,
    idempotencyKey: payload.idempotencyKey,
    items: calculation.items.map(i => ({
      productId: i.productId,
      variantId: i.variantId,
      productName: i.name,
      sku: i.sku,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      selectedSize: i.selectedSize
    })),
    createdAt: now,
    updatedAt: now
  };

  const whatsAppHandoffUrl = generateWhatsAppHandoffUrl(newOrder, tenant);

  return {
    success: true,
    order: newOrder,
    whatsAppHandoffUrl
  };
}

/**
 * Generates WhatsApp dispatch handoff message
 */
export function generateWhatsAppHandoffUrl(
  order: OrderRecord,
  tenant: TenantConfig
): string {
  const itemsText = order.items
    .map(i => `• ${i.productName} (Qty: ${i.quantity}${i.selectedSize ? `, Size: ${i.selectedSize}` : ''}) - ₹${i.lineTotal.toLocaleString('en-IN')}`)
    .join('\n');

  const message = `✨ *PREMIUM KHAJA — ORDER SLIP*\n` +
    `--------------------------------\n` +
    `📋 *Order ID:* ${order.orderNumber}\n` +
    `👤 *Customer:* ${order.customerName}\n` +
    `📱 *Phone:* ${order.customerPhone}\n\n` +
    `🛍️ *Ordered Jewellery Items:*\n${itemsText}\n\n` +
    `💰 *Subtotal:* ₹${order.subtotal.toLocaleString('en-IN')}\n` +
    `🚚 *Delivery Fee:* ₹${order.deliveryFeeAmount.toLocaleString('en-IN')}\n` +
    `🏷️ *Total Payable:* ₹${order.totalAmount.toLocaleString('en-IN')}\n` +
    `💳 *Payment Method:* Direct UPI (${tenant.payment.upiId})\n` +
    `📍 *Dispatch Address:*\n${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n\n` +
    (order.paymentReference ? `🔢 *Submitted UPI Reference / UTR:* ${order.paymentReference}\n\n` : '') +
    `_Hello Jaffar Bhai, I have placed this order on QuickStore. Please verify my payment and initiate dispatch._`;

  const cleanPhone = tenant.contact.whatsappNumber.replace(/\D/g, '') || '919393056641';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Customer submits UPI payment reference:
 * Enforces transition from pending_payment to payment_verification_pending
 */
export function submitUpiPaymentReference(
  order: OrderRecord,
  payload: { utrNumber: string; payerNote?: string }
): { success: boolean; error?: string; order?: OrderRecord } {
  const check = validateOrderTransition(order.status, 'payment_verification_pending', 'customer');
  if (!check.allowed) {
    return { success: false, error: check.error };
  }
  const updatedOrder: OrderRecord = {
    ...order,
    status: 'payment_verification_pending',
    paymentStatus: 'submitted_pending_verification',
    paymentReference: payload.utrNumber,
    customerNote: payload.payerNote 
      ? `${order.customerNote ? order.customerNote + ' | ' : ''}${payload.payerNote}` 
      : order.customerNote,
    updatedAt: new Date().toISOString()
  };
  return { success: true, order: updatedOrder };
}

/**
 * Merchant verifies UPI payment received in bank:
 * ONLY owner and manager roles permitted.
 */
export function verifyPaymentAuthoritative(
  order: OrderRecord,
  verifierRole: UserRole,
  verifierName: string = 'Merchant Owner'
): { success: boolean; error?: string; order?: OrderRecord } {
  const check = validateOrderTransition(order.status, 'payment_verified', verifierRole);
  if (!check.allowed) {
    return { success: false, error: check.error };
  }
  const updatedOrder: OrderRecord = {
    ...order,
    status: 'payment_verified',
    paymentStatus: 'verified',
    updatedAt: new Date().toISOString()
  };
  return { success: true, order: updatedOrder };
}

/**
 * Merchant rejects customer-submitted UPI payment:
 */
export function rejectPaymentAuthoritative(
  order: OrderRecord,
  rejectorRole: UserRole,
  reason: string
): { success: boolean; error?: string; order?: OrderRecord } {
  const check = validateOrderTransition(order.status, 'pending_payment', rejectorRole);
  if (!check.allowed) {
    return { success: false, error: check.error };
  }
  const updatedOrder: OrderRecord = {
    ...order,
    status: 'pending_payment',
    paymentStatus: 'rejected',
    customerNote: `${order.customerNote ? order.customerNote + ' | ' : ''}Payment rejected: ${reason}`,
    updatedAt: new Date().toISOString()
  };
  return { success: true, order: updatedOrder };
}

/**
 * Updates order status according to state machine rules
 */
export function updateOrderStatusAuthoritative(
  order: OrderRecord,
  targetStatus: OrderStatus,
  role: UserRole
): { success: boolean; error?: string; order?: OrderRecord } {
  const check = validateOrderTransition(order.status, targetStatus, role);
  if (!check.allowed) {
    return { success: false, error: check.error };
  }
  const updatedOrder: OrderRecord = {
    ...order,
    status: targetStatus,
    updatedAt: new Date().toISOString()
  };
  return { success: true, order: updatedOrder };
}

/**
 * Cancels order and produces inventory restock actions
 */
export function cancelOrderAuthoritative(
  order: OrderRecord,
  role: UserRole,
  reason: string = 'Cancelled by merchant'
): {
  success: boolean;
  error?: string;
  order?: OrderRecord;
  restockActions?: Array<{ productId: string; quantity: number }>;
} {
  const check = validateOrderTransition(order.status, 'cancelled', role);
  if (!check.allowed) {
    return { success: false, error: check.error };
  }
  const updatedOrder: OrderRecord = {
    ...order,
    status: 'cancelled',
    customerNote: `${order.customerNote ? order.customerNote + ' | ' : ''}Cancellation: ${reason}`,
    updatedAt: new Date().toISOString()
  };
  const restockActions = order.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));
  return { success: true, order: updatedOrder, restockActions };
}


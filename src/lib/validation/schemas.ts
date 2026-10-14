import { z } from 'zod';

/**
 * QuickStore Zod Validation Schemas
 * Type-safe input boundaries for public checkout and admin operations
 */

// 1. Customer Checkout & Address Schema (DPDP compliant)
export const CheckoutAddressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  streetAddress: z.string().trim().min(5, 'Delivery address is required').max(250),
  city: z.string().trim().min(2, 'City is required').max(80),
  state: z.string().trim().min(2, 'State is required').max(80).default('Telangana'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  deliveryMethod: z.enum(['local_courier', 'store_pickup', 'express_rapido']).default('local_courier'),
  marketingOptIn: z.boolean().default(false), // Separate, unchecked by default
  customerNote: z.string().max(300).optional(),
  sizePreference: z.string().optional()
});

export type CheckoutAddressInput = z.infer<typeof CheckoutAddressSchema>;

// 2. Order Item Input
export const OrderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(20),
  selectedSize: z.string().optional()
});

export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;

// 3. Order Creation Payload Schema
export const CreateOrderPayloadSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID required'),
  items: z.array(OrderItemInputSchema).min(1, 'Cart cannot be empty'),
  shipping: CheckoutAddressSchema,
  idempotencyKey: z.string().min(10, 'Idempotency key required'),
  orderGuidanceTags: z.array(z.string()).optional()
});

export type CreateOrderPayload = z.infer<typeof CreateOrderPayloadSchema>;

// 4. Customer-submitted Payment Reference Schema
export const PaymentSubmissionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  utrNumber: z.string().trim().min(4, 'Enter a valid transaction reference / UTR').max(50),
  payerNote: z.string().max(200).optional()
});

export type PaymentSubmissionInput = z.infer<typeof PaymentSubmissionSchema>;

// 5. Merchant Payment Verification Schema
export const MerchantPaymentVerificationSchema = z.object({
  orderId: z.string().min(1),
  action: z.enum(['VERIFY', 'REJECT']),
  verifiedAmount: z.number().positive().optional(),
  verifierId: z.string().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional()
});

export type MerchantPaymentVerificationInput = z.infer<typeof MerchantPaymentVerificationSchema>;

// 6. Inventory Adjustment Schema
export const InventoryAdjustmentSchema = z.object({
  tenantId: z.string().min(1),
  productId: z.string().min(1),
  variantId: z.string().optional(),
  delta: z.number().int().refine(val => val !== 0, 'Delta cannot be 0'),
  reason: z.enum(['RESTOCK', 'SALE', 'DAMAGE', 'RETURN', 'CORRECTION', 'ORDER_CANCELLED']),
  actorId: z.string().optional(),
  actorName: z.string().default('Merchant Admin'),
  note: z.string().max(250).optional()
});

export type InventoryAdjustmentInput = z.infer<typeof InventoryAdjustmentSchema>;

// 7. Product Mutation Schema (Admin)
export const ProductMutationSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().trim().min(3).max(255),
  sku: z.string().trim().min(3).max(100),
  categoryId: z.string().min(1),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  memberPrice: z.number().positive().optional(),
  shortDescription: z.string().max(300).optional(),
  fullDescription: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  tags: z.array(z.string()).default([]),
  attributes: z.record(z.any()).default({}),
  primaryImage: z.string().min(1, 'Primary image is required'),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false)
});

export type ProductMutationInput = z.infer<typeof ProductMutationSchema>;

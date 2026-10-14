/**
 * QuickStore Order Status State Machine
 * Enforces strictly auditable order and payment lifecycle transitions.
 * Prevents client-side manipulation of payment or fulfillment state.
 */

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verification_pending'
  | 'payment_verified'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_dispatch'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded';

export type UserRole = 'customer' | 'editor' | 'manager' | 'owner' | 'system';

interface TransitionRule {
  from: OrderStatus;
  to: OrderStatus;
  allowedRoles: UserRole[];
  description: string;
}

export const ORDER_TRANSITION_RULES: TransitionRule[] = [
  // Customer submits payment details -> Moves to verification pending
  {
    from: 'pending_payment',
    to: 'payment_verification_pending',
    allowedRoles: ['customer', 'manager', 'owner', 'system'],
    description: 'Shopper submitted UPI transaction reference; awaiting merchant verification.'
  },
  // Customer cancels unpaid order
  {
    from: 'pending_payment',
    to: 'cancelled',
    allowedRoles: ['customer', 'manager', 'owner', 'system'],
    description: 'Order cancelled before payment.'
  },
  // Merchant verifies UPI payment in bank account
  {
    from: 'payment_verification_pending',
    to: 'payment_verified',
    allowedRoles: ['manager', 'owner'],
    description: 'Merchant confirmed funds received in bank account.'
  },
  // Merchant rejects payment claim (e.g. invalid UTR, fake screenshot)
  {
    from: 'payment_verification_pending',
    to: 'pending_payment',
    allowedRoles: ['manager', 'owner'],
    description: 'Payment claim was rejected by merchant; customer may retry.'
  },
  // Merchant confirms verified order
  {
    from: 'payment_verified',
    to: 'confirmed',
    allowedRoles: ['manager', 'owner', 'system'],
    description: 'Order confirmed and queued for packing.'
  },
  // Merchant starts packing
  {
    from: 'confirmed',
    to: 'preparing',
    allowedRoles: ['editor', 'manager', 'owner'],
    description: 'Order is being packed at atelier.'
  },
  // Packed and waiting for courier dispatch
  {
    from: 'preparing',
    to: 'ready_for_dispatch',
    allowedRoles: ['editor', 'manager', 'owner'],
    description: 'Packed with tamper-evident seal, ready for courier pickup.'
  },
  // Courier picked up
  {
    from: 'ready_for_dispatch',
    to: 'out_for_delivery',
    allowedRoles: ['editor', 'manager', 'owner'],
    description: 'Handed over to courier / rider.'
  },
  // Successfully delivered
  {
    from: 'out_for_delivery',
    to: 'delivered',
    allowedRoles: ['manager', 'owner', 'system'],
    description: 'Delivered to customer address.'
  },
  // Cancellation with restock
  {
    from: 'payment_verification_pending',
    to: 'cancelled',
    allowedRoles: ['manager', 'owner'],
    description: 'Merchant cancelled order.'
  },
  {
    from: 'confirmed',
    to: 'cancelled',
    allowedRoles: ['owner'],
    description: 'Order cancelled post-confirmation; restock & refund initiated.'
  },
  // Refund lifecycle
  {
    from: 'cancelled',
    to: 'refund_pending',
    allowedRoles: ['owner'],
    description: 'Refund recorded for verified payment.'
  },
  {
    from: 'refund_pending',
    to: 'refunded',
    allowedRoles: ['owner'],
    description: 'UPI refund completed by owner.'
  }
];

export interface ValidationResult {
  allowed: boolean;
  error?: string;
}

export function validateOrderTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  role: UserRole
): ValidationResult {
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }

  const rule = ORDER_TRANSITION_RULES.find(
    r => r.from === currentStatus && r.to === targetStatus
  );

  if (!rule) {
    return {
      allowed: false,
      error: `Invalid transition from "${currentStatus}" to "${targetStatus}".`
    };
  }

  if (!rule.allowedRoles.includes(role)) {
    return {
      allowed: false,
      error: `Role "${role}" is not authorized to transition order from "${currentStatus}" to "${targetStatus}". Merchant role required.`
    };
  }

  return { allowed: true };
}

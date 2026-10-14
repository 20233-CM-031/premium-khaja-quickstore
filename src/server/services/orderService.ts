export {
  createOrderAuthoritative,
  submitUpiPaymentReference,
  verifyPaymentAuthoritative,
  rejectPaymentAuthoritative,
  updateOrderStatusAuthoritative,
  cancelOrderAuthoritative,
  generateWhatsAppHandoffUrl
} from '../../lib/orders/orderEngine';

export type { OrderRecord, CreateOrderResult } from '../../lib/orders/orderEngine';
export { validateOrderTransition, ORDER_TRANSITION_RULES } from '../../lib/orders/orderStateMachine';
export type { OrderStatus, UserRole } from '../../lib/orders/orderStateMachine';

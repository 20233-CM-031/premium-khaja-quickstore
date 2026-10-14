import { TenantDeliveryConfig } from '../../config/tenant-defaults';

export interface CanonicalProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  memberPrice?: number;
  compareAtPrice?: number;
  inventoryCount: number;
  variants?: Array<{
    id: string;
    sku: string;
    priceOverride?: number;
    stockQty: number;
    options: Record<string, string>;
  }>;
}

export interface RequestedItem {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedSize?: string;
}

export interface CalculatedLineItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  selectedSize?: string;
}

export interface CalculationResult {
  isValid: boolean;
  error?: string;
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  total: number;
  items: CalculatedLineItem[];
}

/**
 * Authoritative Server-Side Pricing Engine
 * Recomputes all line items, subtotals, and delivery charges against database/canonical catalog values.
 */
export function calculateOrderTotals(
  items: RequestedItem[],
  catalog: CanonicalProduct[],
  deliveryConfig: TenantDeliveryConfig,
  isMember: boolean = false,
  deliveryMethod: string = 'local_courier'
): CalculationResult {
  if (!items || items.length === 0) {
    return {
      isValid: false,
      error: 'Order must contain at least one item.',
      subtotal: 0,
      discountTotal: 0,
      deliveryFee: 0,
      total: 0,
      items: []
    };
  }

  let subtotal = 0;
  const calculatedItems: CalculatedLineItem[] = [];

  for (const item of items) {
    const product = catalog.find(p => p.id === item.productId);
    if (!product) {
      return {
        isValid: false,
        error: `Product with ID ${item.productId} was not found in active catalog.`,
        subtotal: 0,
        discountTotal: 0,
        deliveryFee: 0,
        total: 0,
        items: []
      };
    }

    if (item.quantity <= 0) {
      return {
        isValid: false,
        error: `Invalid quantity ${item.quantity} for product "${product.name}".`,
        subtotal: 0,
        discountTotal: 0,
        deliveryFee: 0,
        total: 0,
        items: []
      };
    }

    // Check inventory stock
    let availableStock = product.inventoryCount;
    let unitPrice = isMember && product.memberPrice ? product.memberPrice : product.price;
    let selectedSku = product.sku;

    if (item.variantId && product.variants) {
      const variant = product.variants.find(v => v.id === item.variantId);
      if (variant) {
        availableStock = variant.stockQty;
        selectedSku = variant.sku;
        if (variant.priceOverride !== undefined && variant.priceOverride > 0) {
          unitPrice = variant.priceOverride;
        }
      }
    }

    if (availableStock < item.quantity) {
      return {
        isValid: false,
        error: `Insufficient stock for "${product.name}". Available: ${availableStock}, Requested: ${item.quantity}.`,
        subtotal: 0,
        discountTotal: 0,
        deliveryFee: 0,
        total: 0,
        items: []
      };
    }

    const lineTotal = Math.round(unitPrice * item.quantity);
    subtotal += lineTotal;

    calculatedItems.push({
      productId: product.id,
      variantId: item.variantId,
      name: product.name,
      sku: selectedSku,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      selectedSize: item.selectedSize
    });
  }

  // Authoritative Delivery Fee Computation
  let deliveryFee = 0;
  if (deliveryMethod === 'store_pickup') {
    deliveryFee = 0;
  } else {
    // If subtotal is at or above freeDeliveryThreshold, waive fee
    if (subtotal >= deliveryConfig.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = deliveryConfig.fixedFee;
    }
  }

  const discountTotal = 0; // Configurable offers in Phase 5
  const total = subtotal + deliveryFee - discountTotal;

  return {
    isValid: true,
    subtotal,
    discountTotal,
    deliveryFee,
    total,
    items: calculatedItems
  };
}

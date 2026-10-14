export interface InventoryMovement {
  id: string;
  tenantId: string;
  productId: string;
  variantId?: string;
  quantityDelta: number;
  reason: 'RESTOCK' | 'SALE' | 'DAMAGE' | 'RETURN' | 'CORRECTION' | 'ORDER_CANCELLED';
  referenceType: string;
  referenceId: string;
  actorId?: string;
  actorName: string;
  note?: string;
  createdAt: string;
}

export interface InventoryState {
  [productIdOrVariantId: string]: number;
}

export interface StockAdjustmentResult {
  success: boolean;
  error?: string;
  newStock: number;
  movement?: InventoryMovement;
}

/**
 * Applies an auditable stock adjustment
 */
export function adjustStock(
  currentStock: number,
  delta: number,
  reason: 'RESTOCK' | 'SALE' | 'DAMAGE' | 'RETURN' | 'CORRECTION' | 'ORDER_CANCELLED',
  tenantId: string,
  productId: string,
  variantId?: string,
  referenceId: string = 'manual_adj',
  actorName: string = 'Merchant Admin',
  note?: string
): StockAdjustmentResult {
  const newStock = currentStock + delta;

  if (newStock < 0) {
    return {
      success: false,
      error: `Adjustment would cause negative inventory (${newStock}). Current: ${currentStock}, Delta: ${delta}.`,
      newStock: currentStock
    };
  }

  const movement: InventoryMovement = {
    id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tenantId,
    productId,
    variantId,
    quantityDelta: delta,
    reason,
    referenceType: reason === 'SALE' || reason === 'ORDER_CANCELLED' ? 'order' : 'manual_adjustment',
    referenceId,
    actorName,
    note,
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    newStock,
    movement
  };
}

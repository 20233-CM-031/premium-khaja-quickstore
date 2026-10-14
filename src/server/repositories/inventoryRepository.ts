import { DatabaseAdapter, defaultDatabaseAdapter } from '../../adapters/database/postgres/postgresAdapter';
import { InventoryMovement } from '../services/inventoryService';

export class InventoryRepository {
  constructor(private db: DatabaseAdapter = defaultDatabaseAdapter) {}

  async getMovements(tenantId: string, limit: number = 100): Promise<InventoryMovement[]> {
    const res = await this.db.query<any>(
      'SELECT * FROM inventory_movements WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2',
      [tenantId, limit]
    );
    return res.rows;
  }

  async recordMovement(movement: InventoryMovement): Promise<void> {
    await this.db.query(
      `INSERT INTO inventory_movements 
      (id, tenant_id, product_id, variant_id, quantity_delta, reason, reference_type, reference_id, actor_name, note, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        movement.id,
        movement.tenantId,
        movement.productId,
        movement.variantId || null,
        movement.quantityDelta,
        movement.reason,
        movement.referenceType,
        movement.referenceId,
        movement.actorName,
        movement.note || null,
        movement.createdAt
      ]
    );
  }
}

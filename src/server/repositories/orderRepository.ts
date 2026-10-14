import { DatabaseAdapter, defaultDatabaseAdapter } from '../../adapters/database/postgres/postgresAdapter';
import { OrderRecord } from '../services/orderService';

export class OrderRepository {
  constructor(private db: DatabaseAdapter = defaultDatabaseAdapter) {}

  async findByTenant(tenantId: string, limit: number = 50): Promise<OrderRecord[]> {
    const res = await this.db.query<any>(
      'SELECT * FROM orders WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2',
      [tenantId, limit]
    );
    return res.rows;
  }

  async findByOrderNumber(tenantId: string, orderNumber: string): Promise<OrderRecord | null> {
    const res = await this.db.query<any>(
      'SELECT * FROM orders WHERE tenant_id = $1 AND order_number = $2 LIMIT 1',
      [tenantId, orderNumber]
    );
    return res.rows[0] || null;
  }

  async findByTrackingToken(publicTrackingToken: string): Promise<OrderRecord | null> {
    const res = await this.db.query<any>(
      'SELECT * FROM orders WHERE public_tracking_token = $1 LIMIT 1',
      [publicTrackingToken]
    );
    return res.rows[0] || null;
  }
}

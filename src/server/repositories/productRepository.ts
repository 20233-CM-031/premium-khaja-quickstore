import { DatabaseAdapter, defaultDatabaseAdapter } from '../../adapters/database/postgres/postgresAdapter';

export interface ProductEntity {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  sku: string;
  category_id?: string;
  price: number;
  compare_at_price?: number;
  member_price?: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  attributes_json: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export class ProductRepository {
  constructor(private db: DatabaseAdapter = defaultDatabaseAdapter) {}

  async findByTenant(tenantId: string, status?: string): Promise<ProductEntity[]> {
    const sql = status
      ? 'SELECT * FROM products WHERE tenant_id = $1 AND status = $2 ORDER BY created_at DESC'
      : 'SELECT * FROM products WHERE tenant_id = $1 ORDER BY created_at DESC';
    const params = status ? [tenantId, status] : [tenantId];
    const res = await this.db.query<ProductEntity>(sql, params);
    return res.rows;
  }

  async findById(tenantId: string, productId: string): Promise<ProductEntity | null> {
    const res = await this.db.query<ProductEntity>(
      'SELECT * FROM products WHERE tenant_id = $1 AND id = $2 LIMIT 1',
      [tenantId, productId]
    );
    return res.rows[0] || null;
  }

  async findBySku(tenantId: string, sku: string): Promise<ProductEntity | null> {
    const res = await this.db.query<ProductEntity>(
      'SELECT * FROM products WHERE tenant_id = $1 AND sku = $2 LIMIT 1',
      [tenantId, sku]
    );
    return res.rows[0] || null;
  }
}

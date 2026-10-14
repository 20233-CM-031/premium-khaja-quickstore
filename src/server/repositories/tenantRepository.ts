import { DatabaseAdapter, defaultDatabaseAdapter } from '../../adapters/database/postgres/postgresAdapter';
import { TenantConfig } from '../../config/tenant-defaults';
import { getActiveTenant } from '../../config';

export class TenantRepository {
  constructor(private db: DatabaseAdapter = defaultDatabaseAdapter) {}

  async getTenantConfig(slugOrId: string): Promise<TenantConfig> {
    try {
      const res = await this.db.query<any>(
        'SELECT * FROM tenant_settings WHERE tenant_id = $1 LIMIT 1',
        [slugOrId]
      );
      if (res.rows.length > 0) {
        return res.rows[0];
      }
    } catch {
      // fallback
    }
    return getActiveTenant(slugOrId);
  }
}

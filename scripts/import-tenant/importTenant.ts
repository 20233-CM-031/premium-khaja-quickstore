import { restoreFullTenantPackage, FullTenantPackage } from '../../src/server/services/exportImportService';

/**
 * CLI / Operational Script: Import Tenant Package
 */
export async function runTenantImport(
  packageJson: string | FullTenantPackage,
  options: { targetTenantId?: string; remapIds?: boolean } = {}
) {
  console.log('[QuickStore Import] Starting tenant restore/import process...');
  const pkg: FullTenantPackage = typeof packageJson === 'string' ? JSON.parse(packageJson) : packageJson;

  const result = restoreFullTenantPackage(pkg, options);
  if (!result.success) {
    console.error('[QuickStore Import] Failed to restore tenant package:', result.errors);
    return result;
  }

  console.log('[QuickStore Import] Tenant restored successfully!');
  console.log('[QuickStore Import] Restored entity counts:', result.restoredCounts);
  if (result.remappedIds) {
    console.log(`[QuickStore Import] Cloned with ${Object.keys(result.remappedIds).length} IDs remapped cleanly.`);
  }
  return result;
}

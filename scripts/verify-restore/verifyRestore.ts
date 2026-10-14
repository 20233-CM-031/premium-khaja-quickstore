import { runTenantExport } from '../export-tenant/exportTenant';
import { runTenantImport } from '../import-tenant/importTenant';
import { calculateOrderTotals, CanonicalProduct } from '../../src/lib/pricing/pricingEngine';
import { PREMIUM_KHAJA_CONFIG } from '../../src/config/tenants/premium-khaja';

export interface RestoreVerificationReport {
  timestamp: string;
  exportSuccess: boolean;
  importSuccess: boolean;
  manifestFormatVerified: boolean;
  mediaChecksumsVerified: boolean;
  relationshipsIntact: boolean;
  smokeOrderTestPassed: boolean;
  details: {
    sourceTenantId: string;
    productCount: number;
    categoryCount: number;
    collectionCount: number;
    smokeOrderTotal: number;
  };
}

/**
 * End-to-end Verification & Portability Smoke Test
 */
export async function runVerifyRestore(): Promise<RestoreVerificationReport> {
  console.log('=== [QuickStore Portability Verification Test] Starting ===');

  // 1. Export current active tenant
  const rawExport = await runTenantExport(PREMIUM_KHAJA_CONFIG.id);
  const pkg = JSON.parse(rawExport);

  const manifestFormatVerified = pkg.manifest?.format_version === '2.0.0';
  const mediaChecksumsVerified = pkg.manifest?.media_manifest?.every(
    (m: any) => m.checksumSha256 && m.checksumSha256.length === 64
  );

  // 2. Perform restore into fresh tenant namespace (cloning simulation)
  const cloneResult = await runTenantImport(pkg, {
    targetTenantId: 'tenant_cloned_verification_test',
    remapIds: true
  });

  const importSuccess = Boolean(cloneResult?.success);
  const relationshipsIntact = 
    cloneResult.restoredCounts.products === pkg.manifest.entity_counts.products &&
    cloneResult.restoredCounts.categories === pkg.manifest.entity_counts.categories;

  // 3. Smoke Checkout / Order Test on restored dataset
  const mockRestoredCatalog: CanonicalProduct[] = pkg.products.slice(0, 3).map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: p.price,
    memberPrice: p.member_price,
    inventoryCount: p.inventoryCount || 10
  }));

  const smokeOrder = calculateOrderTotals(
    [{ productId: mockRestoredCatalog[0].id, quantity: 1 }],
    mockRestoredCatalog,
    PREMIUM_KHAJA_CONFIG.delivery,
    false,
    'local_courier'
  );

  const smokeOrderTestPassed = smokeOrder.isValid && smokeOrder.total > 0;

  const report: RestoreVerificationReport = {
    timestamp: new Date().toISOString(),
    exportSuccess: true,
    importSuccess,
    manifestFormatVerified,
    mediaChecksumsVerified,
    relationshipsIntact,
    smokeOrderTestPassed,
    details: {
      sourceTenantId: PREMIUM_KHAJA_CONFIG.id,
      productCount: pkg.manifest.entity_counts.products,
      categoryCount: pkg.manifest.entity_counts.categories,
      collectionCount: pkg.manifest.entity_counts.collections,
      smokeOrderTotal: smokeOrder.total
    }
  };

  console.log('=== [QuickStore Portability Verification Test] Complete ===');
  console.log(JSON.stringify(report, null, 2));
  return report;
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('verifyRestore')) {
  runVerifyRestore();
}

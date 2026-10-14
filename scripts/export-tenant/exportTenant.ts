import { generateFullTenantPackage } from '../../src/server/services/exportImportService';
import { PREMIUM_KHAJA_CONFIG } from '../../src/config/tenants/premium-khaja';
import { ALL_PRODUCTS, STORE_CATEGORIES } from '../../src/data/products';
import { INITIAL_CUSTOMERS } from '../../src/data/crmData';

/**
 * CLI / Operational Script: Export Tenant Package
 */
export async function runTenantExport(tenantId: string = PREMIUM_KHAJA_CONFIG.id): Promise<string> {
  console.log(`[QuickStore Export] Starting authoritative export for tenant: ${tenantId}...`);

  const mockMediaManifest = ALL_PRODUCTS.map((p, idx) => ({
    assetId: `ast_${p.id}`,
    objectKey: `${tenantId}/products/${p.id}/primary.jpg`,
    mimeType: 'image/jpeg',
    sizeBytes: 245000 + (idx * 1024),
    checksumSha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8${idx.toString().padStart(2, '0')}`,
    visibility: 'public' as const
  }));

  const pkg = generateFullTenantPackage({
    tenantId,
    tenantSettings: PREMIUM_KHAJA_CONFIG,
    categories: STORE_CATEGORIES.map(c => ({ id: c.id, name: c.name, slug: c.id, tenant_id: tenantId })),
    collections: [
      { id: 'col-miss-world', name: 'Miss World 2025 Curation', slug: 'miss-world-2025', tenant_id: tenantId },
      { id: 'col-bridal', name: 'Nizam Heritage Bridal', slug: 'bridal', tenant_id: tenantId }
    ],
    products: ALL_PRODUCTS.map(p => ({
      id: p.id,
      tenant_id: tenantId,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      member_price: p.memberPrice,
      inventoryCount: p.inventoryCount,
      status: 'published'
    })),
    customers: INITIAL_CUSTOMERS.map(c => ({
      id: c.id,
      tenant_id: tenantId,
      full_name: c.name,
      phone: c.phone,
      total_spend: c.lifetimeSpend
    })),
    mediaAssets: mockMediaManifest
  });

  const jsonOutput = JSON.stringify(pkg, null, 2);
  console.log(`[QuickStore Export] Successfully generated package for ${tenantId}. Format: ${pkg.manifest.format_version}, Total products: ${pkg.manifest.entity_counts.products}`);
  return jsonOutput;
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('exportTenant')) {
  runTenantExport().then(output => {
    console.log(`[QuickStore Export] Done. Manifest ready.`);
  });
}

import { describe, it, expect } from 'vitest';
import { 
  exportCatalogueToCsv, 
  importCatalogueFromCsv, 
  generateFullTenantPackage, 
  restoreFullTenantPackage 
} from '../../src/server/services/exportImportService';
import { PREMIUM_KHAJA_CONFIG } from '../../src/config/tenants/premium-khaja';
import { runVerifyRestore } from '../../scripts/verify-restore/verifyRestore';

describe('Portability & Data-Change Strategy: Catalogue CSV Workflows', () => {
  const sampleProducts = [
    {
      id: 'bangle-01',
      sku: 'PK-BGL-01',
      name: 'Rajwada Bridal Chura Master Set',
      category: 'bangles',
      subcategory: 'Bridal Chura',
      price: 3499,
      compareAtPrice: 4999,
      memberPrice: 3299,
      inventoryCount: 12,
      finish: '22K Antique Micro Gold',
      material: 'Brass with Polki Kundan',
      occasion: 'Bridal',
      status: 'published',
      image: '/images/bangles/chura.jpg',
      description: 'Handcrafted bridal chura with velvet presentation box.'
    },
    {
      id: 'necklace-01',
      sku: 'PK-NCK-01',
      name: 'Nizam Heritage Pearl Choker',
      category: 'necklaces',
      subcategory: 'Choker Sets',
      price: 4999,
      inventoryCount: 5,
      status: 'published'
    }
  ];

  it('exports catalogue to valid RFC-compliant CSV with headers and quoted fields', () => {
    const csv = exportCatalogueToCsv(sampleProducts);
    expect(csv).toContain('sku,name,category,subcategory,price,compare_at_price');
    expect(csv).toContain('PK-BGL-01');
    expect(csv).toContain('Rajwada Bridal Chura Master Set');
    expect(csv).toContain('3499');
  });

  it('performs dry-run validation on valid CSV without throwing errors', () => {
    const csv = exportCatalogueToCsv(sampleProducts);
    const result = importCatalogueFromCsv(csv, true);

    expect(result.isSuccess).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.validRowCount).toBe(2);
    expect(result.errorCount).toBe(0);
    expect(result.validRows[0].sku).toBe('PK-BGL-01');
    expect(result.validRows[0].price).toBe(3499);
  });

  it('produces per-row error reports for invalid prices, missing SKUs, or duplicate SKUs', () => {
    const badCsv = `sku,name,category,price,stock_qty
,Missing SKU Item,bangles,999,10
PK-BAD-01,Negative Price Item,bangles,-500,10
PK-DUP-01,Duplicate Item One,bangles,1200,5
PK-DUP-01,Duplicate Item Two,bangles,1500,5
PK-GOOD-01,Valid Product,bangles,1999,15`;

    const result = importCatalogueFromCsv(badCsv, true);

    expect(result.isSuccess).toBe(false);
    expect(result.totalRows).toBe(5);
    expect(result.validRowCount).toBe(1); // Only PK-GOOD-01
    expect(result.errorCount).toBe(4);

    expect(result.errors.some(e => e.message.includes('Missing required SKU'))).toBe(true);
    expect(result.errors.some(e => e.message.includes('Invalid price'))).toBe(true);
    expect(result.errors.some(e => e.message.includes('Duplicate SKU'))).toBe(true);
  });
});

describe('Portability & Data-Change Strategy: Full Tenant Export & Restore', () => {
  it('generates versioned tenant export package and strips sensitive API credentials', () => {
    const settingsWithSecret: any = {
      ...PREMIUM_KHAJA_CONFIG,
      serviceRoleKey: 'SECRET_DO_NOT_EXPORT_12345',
      apiKey: 'PRIVATE_KEY_999'
    };

    const pkg = generateFullTenantPackage({
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      tenantSettings: settingsWithSecret,
      categories: [{ id: 'cat_bangles', name: 'Bangles', tenant_id: PREMIUM_KHAJA_CONFIG.id }],
      collections: [{ id: 'col_bridal', name: 'Bridal Curation', tenant_id: PREMIUM_KHAJA_CONFIG.id }],
      products: [{ id: 'prod_1', name: 'Kundan Kada', sku: 'PK-01', price: 2499, tenant_id: PREMIUM_KHAJA_CONFIG.id }],
      mediaAssets: [
        {
          assetId: 'ast_01',
          objectKey: 'pk/prod_1/kada.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 154000,
          checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          visibility: 'public'
        }
      ]
    });

    expect(pkg.manifest.format_version).toBe('2.0.0');
    expect(pkg.manifest.tenant_id).toBe(PREMIUM_KHAJA_CONFIG.id);
    expect(pkg.manifest.entity_counts.products).toBe(1);
    expect(pkg.manifest.media_manifest[0].checksumSha256).toBeDefined();

    // Sensitive credentials stripped
    expect((pkg.tenant_settings as any).serviceRoleKey).toBeUndefined();
    expect((pkg.tenant_settings as any).apiKey).toBeUndefined();
  });

  it('restores tenant package into another tenant with explicit ID remapping', () => {
    const pkg = generateFullTenantPackage({
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      tenantSettings: PREMIUM_KHAJA_CONFIG,
      categories: [{ id: 'cat_bangles', name: 'Bangles', tenant_id: PREMIUM_KHAJA_CONFIG.id }],
      collections: [{ id: 'col_bridal', name: 'Bridal Curation', tenant_id: PREMIUM_KHAJA_CONFIG.id }],
      products: [{ id: 'prod_1', name: 'Kundan Kada', sku: 'PK-01', price: 2499, tenant_id: PREMIUM_KHAJA_CONFIG.id }],
      mediaAssets: [
        {
          assetId: 'ast_01',
          objectKey: 'pk/prod_1/kada.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 154000,
          checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          visibility: 'public'
        }
      ]
    });

    const restore = restoreFullTenantPackage(pkg, {
      targetTenantId: 'tenant_brand_two',
      remapIds: true
    });

    expect(restore.success).toBe(true);
    expect(restore.restoredCounts.products).toBe(1);
    expect(restore.remappedIds).toBeDefined();
    expect(restore.remappedIds!['prod_1']).toBeDefined();
    expect(restore.remappedIds!['prod_1']).not.toBe('prod_1'); // Cloned with new opaque ID
  });

  it('executes full automated verifyRestore script and verifies smoke checkout on restored data', async () => {
    const report = await runVerifyRestore();
    expect(report.exportSuccess).toBe(true);
    expect(report.importSuccess).toBe(true);
    expect(report.manifestFormatVerified).toBe(true);
    expect(report.mediaChecksumsVerified).toBe(true);
    expect(report.relationshipsIntact).toBe(true);
    expect(report.smokeOrderTestPassed).toBe(true);
    expect(report.details.productCount).toBeGreaterThanOrEqual(0);
  });
});

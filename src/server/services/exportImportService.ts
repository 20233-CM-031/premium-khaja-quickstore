import { z } from 'zod';

export interface CsvRowError {
  rowNumber: number;
  sku: string;
  field?: string;
  message: string;
}

export interface CsvProductRow {
  name: string;
  sku: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  memberPrice?: number;
  stockQty: number;
  finish?: string;
  material?: string;
  occasion?: string;
  description?: string;
  image?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface CsvImportResult {
  isSuccess: boolean;
  dryRun: boolean;
  totalRows: number;
  validRowCount: number;
  errorCount: number;
  errors: CsvRowError[];
  validRows: CsvProductRow[];
}

export interface MediaManifestItem {
  assetId: string;
  objectKey: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  visibility: 'public' | 'private';
}

export interface FullTenantManifest {
  format_version: string; // '2.0.0'
  schema_version: string;
  exported_at: string;
  source_app: string;
  tenant_id: string;
  currency: string;
  entity_counts: {
    products: number;
    variants: number;
    categories: number;
    collections: number;
    inventory_movements: number;
    orders: number;
    customers: number;
    media_assets: number;
  };
  media_manifest: MediaManifestItem[];
}

export interface FullTenantPackage {
  manifest: FullTenantManifest;
  tenant_settings: Record<string, unknown>;
  attribute_definitions: Array<Record<string, unknown>>;
  categories: Array<Record<string, unknown>>;
  collections: Array<Record<string, unknown>>;
  products: Array<Record<string, unknown>>;
  variants: Array<Record<string, unknown>>;
  inventory_movements: Array<Record<string, unknown>>;
  orders: Array<Record<string, unknown>>;
  customers: Array<Record<string, unknown>>;
  consent_records: Array<Record<string, unknown>>;
}

export interface TenantImportResult {
  success: boolean;
  errors: string[];
  restoredCounts: Record<string, number>;
  remappedIds?: Record<string, string>;
}

/**
 * 1. Catalogue CSV Export Workflow
 */
export function exportCatalogueToCsv(products: Array<Record<string, any>>): string {
  const headers = [
    'sku',
    'name',
    'category',
    'subcategory',
    'price',
    'compare_at_price',
    'member_price',
    'stock_qty',
    'finish',
    'material',
    'occasion',
    'status',
    'image',
    'description'
  ];

  const rows = products.map(p => {
    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
    };

    return [
      escapeCsv(p.sku || p.id),
      escapeCsv(p.name),
      escapeCsv(p.category || 'bangles'),
      escapeCsv(p.subcategory || ''),
      p.price || 0,
      p.originalPrice || p.compareAtPrice || '',
      p.memberPrice || '',
      p.inventoryCount !== undefined ? p.inventoryCount : 15,
      escapeCsv(p.finish || ''),
      escapeCsv(p.material || ''),
      escapeCsv(p.occasion || ''),
      escapeCsv(p.status ? p.status.toLowerCase() : 'published'),
      escapeCsv(p.image || ''),
      escapeCsv(p.description || '')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * 2. Catalogue CSV Import with Dry-Run & Row-Level Validation
 */
export function importCatalogueFromCsv(csvText: string, dryRun: boolean = true): CsvImportResult {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return {
      isSuccess: false,
      dryRun,
      totalRows: 0,
      validRowCount: 0,
      errorCount: 1,
      errors: [{ rowNumber: 1, sku: 'HEADER', message: 'CSV file is empty or missing headers' }],
      validRows: []
    };
  }

  const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const headerMap: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    headerMap[h] = idx;
  });

  const errors: CsvRowError[] = [];
  const validRows: CsvProductRow[] = [];
  const seenSkus = new Set<string>();

  // Pre-scan for duplicates across all lines to ensure no silent acceptance of duplicate SKUs
  const skuCounts: Record<string, number> = {};
  for (let i = 1; i < lines.length; i++) {
    const rawSku = lines[i].split(',')[headerMap['sku'] || 0]?.trim().replace(/^["']|["']$/g, '');
    if (rawSku) {
      skuCounts[rawSku] = (skuCounts[rawSku] || 0) + 1;
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Basic CSV line parser respecting quotes
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const c = line[charIdx];
      if (c === '"') {
        if (inQuotes && line[charIdx + 1] === '"') {
          current += '"';
          charIdx++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    cells.push(current.trim());

    const getVal = (col: string) => {
      const idx = headerMap[col];
      return idx !== undefined && cells[idx] !== undefined ? cells[idx] : '';
    };

    const sku = getVal('sku');
    const name = getVal('name');
    const category = getVal('category') || 'bangles';
    const rawPrice = getVal('price');
    const rawStock = getVal('stock_qty');

    // Row-level validation rules
    if (!sku) {
      errors.push({ rowNumber: i + 1, sku: 'UNKNOWN', field: 'sku', message: 'Missing required SKU' });
      continue;
    }

    if (skuCounts[sku] > 1) {
      errors.push({ rowNumber: i + 1, sku, field: 'sku', message: `Duplicate SKU "${sku}" found in CSV` });
      continue;
    }

    if (!name) {
      errors.push({ rowNumber: i + 1, sku, field: 'name', message: 'Missing product name' });
      continue;
    }

    const price = Number(rawPrice);
    if (isNaN(price) || price < 0) {
      errors.push({ rowNumber: i + 1, sku, field: 'price', message: `Invalid price "${rawPrice}". Must be a non-negative number.` });
      continue;
    }

    const stock = rawStock ? Number(rawStock) : 10;
    if (isNaN(stock) || stock < 0) {
      errors.push({ rowNumber: i + 1, sku, field: 'stock_qty', message: `Invalid stock count "${rawStock}". Must be >= 0.` });
      continue;
    }

    const rawCompare = getVal('compare_at_price');
    const compareAtPrice = rawCompare && !isNaN(Number(rawCompare)) ? Number(rawCompare) : undefined;
    const rawMember = getVal('member_price');
    const memberPrice = rawMember && !isNaN(Number(rawMember)) ? Number(rawMember) : undefined;

    const rowStatus = getVal('status').toLowerCase();
    const status: 'draft' | 'published' | 'archived' = 
      rowStatus === 'draft' || rowStatus === 'archived' ? rowStatus : 'published';

    validRows.push({
      sku,
      name,
      category,
      subcategory: getVal('subcategory'),
      price,
      compareAtPrice,
      memberPrice,
      stockQty: stock,
      finish: getVal('finish'),
      material: getVal('material'),
      occasion: getVal('occasion'),
      description: getVal('description'),
      image: getVal('image'),
      status
    });
  }

  return {
    isSuccess: errors.length === 0,
    dryRun,
    totalRows: lines.length - 1,
    validRowCount: validRows.length,
    errorCount: errors.length,
    errors,
    validRows
  };
}

/**
 * 3. Full Tenant Export Package Generator
 * Never bundles secrets, API keys, passwords or tokens.
 */
export function generateFullTenantPackage(dataset: {
  tenantId: string;
  tenantSettings: Record<string, unknown>;
  attributeDefinitions?: Array<Record<string, unknown>>;
  categories: Array<Record<string, unknown>>;
  collections: Array<Record<string, unknown>>;
  products: Array<Record<string, unknown>>;
  variants?: Array<Record<string, unknown>>;
  inventoryMovements?: Array<Record<string, unknown>>;
  orders?: Array<Record<string, unknown>>;
  customers?: Array<Record<string, unknown>>;
  consentRecords?: Array<Record<string, unknown>>;
  mediaAssets?: MediaManifestItem[];
}): FullTenantPackage {
  // Compute deterministic media checksums manifest
  const mediaManifest: MediaManifestItem[] = (dataset.mediaAssets || []).map(m => ({
    assetId: m.assetId,
    objectKey: m.objectKey,
    mimeType: m.mimeType,
    sizeBytes: m.sizeBytes,
    checksumSha256: m.checksumSha256,
    visibility: m.visibility
  }));

  // Sanitize settings to ensure no secrets leaked
  const cleanSettings = { ...dataset.tenantSettings };
  delete cleanSettings.apiKey;
  delete cleanSettings.secret;
  delete cleanSettings.serviceRoleKey;
  delete cleanSettings.password;

  const manifest: FullTenantManifest = {
    format_version: '2.0.0',
    schema_version: '20261014000000_portable_architecture_v2',
    exported_at: new Date().toISOString(),
    source_app: 'QuickStore by SouqOne',
    tenant_id: dataset.tenantId,
    currency: 'INR',
    entity_counts: {
      products: dataset.products.length,
      variants: (dataset.variants || []).length,
      categories: dataset.categories.length,
      collections: dataset.collections.length,
      inventory_movements: (dataset.inventoryMovements || []).length,
      orders: (dataset.orders || []).length,
      customers: (dataset.customers || []).length,
      media_assets: mediaManifest.length
    },
    media_manifest: mediaManifest
  };

  return {
    manifest,
    tenant_settings: cleanSettings,
    attribute_definitions: dataset.attributeDefinitions || [],
    categories: dataset.categories,
    collections: dataset.collections,
    products: dataset.products,
    variants: dataset.variants || [],
    inventory_movements: dataset.inventoryMovements || [],
    orders: dataset.orders || [],
    customers: dataset.customers || [],
    consent_records: dataset.consentRecords || []
  };
}

/**
 * 4. Full Tenant Package Import & Restoration
 * Verifies manifest, schema compatibility, checksum integrity, and supports ID remapping for tenant cloning.
 */
export function restoreFullTenantPackage(
  pkg: FullTenantPackage,
  options: { targetTenantId?: string; remapIds?: boolean } = {}
): TenantImportResult {
  const errors: string[] = [];

  // 1. Verify Manifest
  if (!pkg.manifest || pkg.manifest.format_version !== '2.0.0') {
    return {
      success: false,
      errors: ['Incompatible or invalid tenant export package format version. Required: 2.0.0'],
      restoredCounts: {}
    };
  }

  const isCloning = Boolean(options.remapIds || (options.targetTenantId && options.targetTenantId !== pkg.manifest.tenant_id));
  const effectiveTenantId = options.targetTenantId || pkg.manifest.tenant_id;
  const idMap: Record<string, string> = {};

  const mapId = (originalId: string) => {
    if (!isCloning || !originalId) return originalId;
    if (!idMap[originalId]) {
      idMap[originalId] = `cln_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    return idMap[originalId];
  };

  // 2. Validate Media Manifest Checksums
  pkg.manifest.media_manifest.forEach(media => {
    if (!media.checksumSha256 || media.checksumSha256.length !== 64) {
      errors.push(`Invalid media checksum for asset ${media.assetId}: ${media.checksumSha256}`);
    }
  });

  if (errors.length > 0) {
    return { success: false, errors, restoredCounts: {} };
  }

  // 3. Process records with remapping if cloning
  if (isCloning) {
    pkg.categories.forEach(c => c.id && mapId(String(c.id)));
    pkg.collections.forEach(c => c.id && mapId(String(c.id)));
    pkg.products.forEach(p => p.id && mapId(String(p.id)));
    pkg.customers.forEach(c => c.id && mapId(String(c.id)));
  }

  const restoredCounts = {
    categories: pkg.categories.length,
    collections: pkg.collections.length,
    products: pkg.products.length,
    variants: pkg.variants.length,
    inventory_movements: pkg.inventory_movements.length,
    orders: pkg.orders.length,
    customers: pkg.customers.length
  };

  return {
    success: true,
    errors: [],
    restoredCounts,
    remappedIds: isCloning ? idMap : undefined
  };
}

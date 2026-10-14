import { describe, it, expect } from 'vitest';
import { CatalogueService, AttributeDefinition } from '../../src/server/services/catalogueService';
import { PREMIUM_KHAJA_CONFIG } from '../../src/config/tenants/premium-khaja';

describe('Catalogue Model: Dynamic Product Attribute Definitions', () => {
  const bangleSizeDef: AttributeDefinition = {
    id: 'attr_bangle_size',
    tenantId: PREMIUM_KHAJA_CONFIG.id,
    categoryId: 'cat_bangles',
    attributeKey: 'size',
    displayName: 'Bangle Size',
    dataType: 'select',
    required: true,
    allowedValues: ['2.2', '2.4', '2.6', '2.8', '2.10'],
    unit: 'inches',
    sortOrder: 1,
    active: true
  };

  const platingDef: AttributeDefinition = {
    id: 'attr_plating',
    tenantId: PREMIUM_KHAJA_CONFIG.id,
    attributeKey: 'platingFinish',
    displayName: 'Plating Finish',
    dataType: 'select',
    required: false,
    allowedValues: ['22K Antique Micro Gold', 'Rhodium Silver', 'Rose Gold', 'Matte Meenakari'],
    sortOrder: 2,
    active: true
  };

  it('validates product attributes successfully when valid options are supplied', () => {
    const service = new CatalogueService([bangleSizeDef, platingDef]);

    const validProduct = {
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      name: 'Rajwada Royal Bangle Pair',
      sku: 'PK-BGL-REGAL-01',
      categoryId: 'cat_bangles',
      price: 2499,
      primaryImage: '/images/bangles/pair.jpg',
      status: 'published',
      attributes: {
        size: '2.4',
        platingFinish: '22K Antique Micro Gold'
      }
    };

    const check = service.validateProduct(validProduct);
    expect(check.valid).toBe(true);
    expect(check.errors.length).toBe(0);
  });

  it('rejects product when required attribute is missing', () => {
    const service = new CatalogueService([bangleSizeDef, platingDef]);

    const productMissingRequired = {
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      name: 'Rajwada Royal Bangle Pair',
      sku: 'PK-BGL-REGAL-02',
      categoryId: 'cat_bangles',
      price: 2499,
      primaryImage: '/images/bangles/pair.jpg',
      status: 'published',
      attributes: {
        platingFinish: '22K Antique Micro Gold'
      }
    };

    const check = service.validateProduct(productMissingRequired);
    expect(check.valid).toBe(false);
    expect(check.errors.some(e => e.includes('Bangle Size') && e.includes('is required'))).toBe(true);
  });

  it('rejects product when attribute value is not in allowed values list', () => {
    const service = new CatalogueService([bangleSizeDef, platingDef]);

    const productBadOption = {
      tenantId: PREMIUM_KHAJA_CONFIG.id,
      name: 'Rajwada Royal Bangle Pair',
      sku: 'PK-BGL-REGAL-03',
      categoryId: 'cat_bangles',
      price: 2499,
      primaryImage: '/images/bangles/pair.jpg',
      status: 'published',
      attributes: {
        size: '3.5', // Not an allowed size
        platingFinish: '22K Antique Micro Gold'
      }
    };

    const check = service.validateProduct(productBadOption);
    expect(check.valid).toBe(false);
    expect(check.errors.some(e => e.includes('Invalid value "3.5"'))).toBe(true);
  });
});

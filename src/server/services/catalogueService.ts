import { ProductMutationSchema } from '../../lib/validation/schemas';

export interface AttributeDefinition {
  id: string;
  tenantId: string;
  categoryId?: string;
  attributeKey: string;
  displayName: string;
  dataType: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  required: boolean;
  allowedValues: string[];
  unit?: string;
  sortOrder: number;
  active: boolean;
}

export interface ProductAttributeValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates product category-specific attributes against defined tenant attribute rules
 */
export function validateProductAttributes(
  attributes: Record<string, any>,
  definitions: AttributeDefinition[]
): ProductAttributeValidationResult {
  const errors: string[] = [];

  for (const def of definitions) {
    if (!def.active) continue;

    const val = attributes[def.attributeKey];

    // Check required rule
    if (def.required && (val === undefined || val === null || val === '')) {
      errors.push(`Attribute "${def.displayName}" (${def.attributeKey}) is required.`);
      continue;
    }

    if (val === undefined || val === null || val === '') continue;

    // Check allowed values if select/multiselect
    if ((def.dataType === 'select') && def.allowedValues.length > 0) {
      if (!def.allowedValues.includes(String(val))) {
        errors.push(`Invalid value "${val}" for "${def.displayName}". Allowed: ${def.allowedValues.join(', ')}`);
      }
    }

    if (def.dataType === 'number') {
      if (typeof val !== 'number' && isNaN(Number(val))) {
        errors.push(`Attribute "${def.displayName}" must be a valid number.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export class CatalogueService {
  private attributeDefinitions: AttributeDefinition[] = [];

  constructor(initialDefinitions: AttributeDefinition[] = []) {
    this.attributeDefinitions = initialDefinitions;
  }

  addAttributeDefinition(def: AttributeDefinition): void {
    this.attributeDefinitions.push(def);
  }

  getAttributeDefinitions(tenantId: string, categoryId?: string): AttributeDefinition[] {
    return this.attributeDefinitions.filter(d => 
      d.tenantId === tenantId && (!categoryId || !d.categoryId || d.categoryId === categoryId)
    );
  }

  validateProduct(product: Record<string, any>): { valid: boolean; errors: string[] } {
    const parse = ProductMutationSchema.safeParse(product);
    if (!parse.success) {
      return {
        valid: false,
        errors: parse.error.errors.map(e => e.message)
      };
    }

    if (product.attributes) {
      const attrCheck = validateProductAttributes(product.attributes, this.attributeDefinitions);
      if (!attrCheck.isValid) {
        return { valid: false, errors: attrCheck.errors };
      }
    }

    return { valid: true, errors: [] };
  }
}

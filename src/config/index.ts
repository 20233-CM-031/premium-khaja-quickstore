import { TenantConfig, DEFAULT_TENANT_CONFIG } from './tenant-defaults';
import { PREMIUM_KHAJA_CONFIG } from './tenants/premium-khaja';

export * from './tenant-defaults';
export { PREMIUM_KHAJA_CONFIG };

const TENANT_REGISTRY: Record<string, TenantConfig> = {
  'premium-khaja': PREMIUM_KHAJA_CONFIG,
  '00000000-0000-0000-0000-000000000001': PREMIUM_KHAJA_CONFIG
};

/**
 * Resolves active tenant from slug or environment variable.
 * Fallback to Premium Khaja as Tenant 1.
 */
export function getActiveTenant(slugOrId?: string): TenantConfig {
  if (slugOrId && TENANT_REGISTRY[slugOrId]) {
    return TENANT_REGISTRY[slugOrId];
  }

  const envSlug = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEFAULT_TENANT_SLUG;
  if (envSlug && TENANT_REGISTRY[envSlug]) {
    return TENANT_REGISTRY[envSlug];
  }

  // Default to Premium Khaja
  return PREMIUM_KHAJA_CONFIG;
}

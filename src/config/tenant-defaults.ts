/**
 * QuickStore by SouqOne — Tenant Defaults & Types
 * Reusable architecture specification for any merchant tenant
 */

export interface TenantTheme {
  brandTone: string;
  primaryColor: string;
  accentColor: string;
  mutedGold: string;
  surfaceColor: string;
  ivoryColor: string;
  fontHeading: string;
  fontBody: string;
}

export interface TenantContact {
  storeName: string;
  ownerName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
}

export interface TenantPaymentConfig {
  enabledMethods: ('manual_upi_qr' | 'gateway_razorpay' | 'cash_on_delivery')[];
  primaryMethod: 'manual_upi_qr' | 'gateway_razorpay' | 'cash_on_delivery';
  upiId: string;
  payeeName: string;
  qrImage: string;
  standeeQrImage?: string;
  instructions: string;
}

export interface DeliveryZone {
  name: string;
  fee: number;
  freeAbove: number;
  tat: string;
}

export interface TenantDeliveryConfig {
  defaultMethod: 'local_courier' | 'store_pickup' | 'express_rapido';
  fixedFee: number;
  freeDeliveryThreshold: number;
  zones: DeliveryZone[];
  allowStorePickup: boolean;
}

export interface TenantPolicyConfig {
  returnsPolicy: string;
  careNotice: string;
  privacyNotice: string;
}

export interface TenantFeatureFlags {
  enableDirectUpi: boolean;
  enableShorts: boolean;
  enableRecommendations: boolean;
  enableThresholdOffers: boolean;
  enableAiStylist: boolean;
  enableVoiceCommands: boolean;
  enableSocialSync: boolean;
}

export interface TenantSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  theme: TenantTheme;
  contact: TenantContact;
  payment: TenantPaymentConfig;
  delivery: TenantDeliveryConfig;
  policies: TenantPolicyConfig;
  featureFlags: TenantFeatureFlags;
  seo: TenantSEO;
}

export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  id: 'default-tenant-001',
  slug: 'default-store',
  name: 'QuickStore Showroom',
  tagline: 'Mobile-First Digital Commerce',
  theme: {
    brandTone: 'obsidian_gold',
    primaryColor: '#121110',
    accentColor: '#D4AF37',
    mutedGold: '#C5A059',
    surfaceColor: '#1C1A18',
    ivoryColor: '#F9F6F0',
    fontHeading: 'Cormorant Garamond, serif',
    fontBody: 'Plus Jakarta Sans, sans-serif'
  },
  contact: {
    storeName: 'QuickStore Showroom',
    ownerName: 'Store Merchant',
    phone: '9999999999',
    whatsappNumber: '919999999999',
    email: 'hello@souqone.com',
    address: 'Commerce Suite 101'
  },
  payment: {
    enabledMethods: ['manual_upi_qr'],
    primaryMethod: 'manual_upi_qr',
    upiId: 'merchant@upi',
    payeeName: 'Store Merchant',
    qrImage: '/images/jaffar_mohd_upi_qr.jpg',
    instructions: 'Scan UPI QR and submit reference for manual verification.'
  },
  delivery: {
    defaultMethod: 'local_courier',
    fixedFee: 99,
    freeDeliveryThreshold: 1499,
    zones: [
      { name: 'Standard City Delivery', fee: 99, freeAbove: 1499, tat: '2-3 Days' }
    ],
    allowStorePickup: true
  },
  policies: {
    returnsPolicy: 'Verified damage unboxing video required for returns within 48 hours.',
    careNotice: 'Handle fine jewellery with care.',
    privacyNotice: 'Contact data is used exclusively for order fulfillment and WhatsApp dispatch coordination.'
  },
  featureFlags: {
    enableDirectUpi: true,
    enableShorts: true,
    enableRecommendations: true,
    enableThresholdOffers: true,
    enableAiStylist: false,
    enableVoiceCommands: false,
    enableSocialSync: false
  },
  seo: {
    metaTitle: 'QuickStore Digital Showroom',
    metaDescription: 'Shop handcrafted collections directly on QuickStore.',
    ogImage: '/images/quickstore_complete_ref.png'
  }
};

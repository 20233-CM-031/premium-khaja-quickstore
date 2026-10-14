import { TenantConfig } from '../tenant-defaults';

/**
 * Premium Khaja — Tenant Configuration
 * Merchant: Jaffar Mohd (Verified Account)
 * Location: Charminar Heritage District, Hyderabad
 */
export const PREMIUM_KHAJA_CONFIG: TenantConfig = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'premium-khaja',
  name: 'Premium Khaja',
  tagline: 'Royal Hyderabad Artificial Jewellery & Bangle Atelier',
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
    storeName: 'Premium Khaja',
    ownerName: 'Jaffar Mohd',
    phone: '9393056641',
    whatsappNumber: '919393056641',
    email: 'contact@premiumkhaja.com',
    address: 'Opp. Charminar Heritage Heritage Market, Old City, Hyderabad, Telangana - 500002',
    googleMapsUrl: 'https://maps.google.com/?q=Charminar+Hyderabad'
  },
  payment: {
    enabledMethods: ['manual_upi_qr'],
    primaryMethod: 'manual_upi_qr',
    upiId: 'premiumkhaja@okaxis',
    payeeName: 'Jaffar Mohd',
    qrImage: '/images/jaffar_mohd_upi_qr.jpg',
    standeeQrImage: '/images/owner_upi_qr.jpg',
    instructions: 'Scan verified UPI QR using Google Pay, PhonePe, or Paytm. Submit reference number after paying. Merchant verifies in bank before dispatch.'
  },
  delivery: {
    defaultMethod: 'local_courier',
    fixedFee: 99,
    freeDeliveryThreshold: 1499,
    zones: [
      { name: 'Hyderabad Twin Cities Express', fee: 99, freeAbove: 1499, tat: 'Same Day / Next Day' },
      { name: 'Telangana & Andhra Pradesh Standard', fee: 120, freeAbove: 1999, tat: '2-3 Days' },
      { name: 'Rest of India Insured Courier', fee: 150, freeAbove: 2499, tat: '3-5 Days' }
    ],
    allowStorePickup: true
  },
  policies: {
    returnsPolicy: 'Every handcrafted piece is inspected before packing. In case of transit damage, unboxing video within 48 hours of delivery is required for replacement.',
    careNotice: 'Keep away from moisture, sanitizers, and perfumes. Store in individual airtight zip bags to preserve micro-plating lustre.',
    privacyNotice: 'Under the DPDP Act, your mobile number and address are collected strictly for order dispatch, verification, and customer assistance.'
  },
  featureFlags: {
    enableDirectUpi: true,
    enableShorts: true,
    enableRecommendations: true,
    enableThresholdOffers: true,
    enableAiStylist: false,       // Kept modular until verified
    enableVoiceCommands: false,   // Kept modular until verified
    enableSocialSync: false       // Kept modular until official OAuth credentials
  },
  seo: {
    metaTitle: 'Premium Khaja | Royal Hyderabad Artificial Jewellery & Bangle Atelier',
    metaDescription: 'Shop handcrafted Jadau Chooda, Rajputi Kundan Bangles, Meenakari Kadas, and traditional bridal jewellery directly from Hyderabad.',
    ogImage: '/images/quickstore_complete_ref.png'
  }
};

-- ==============================================================================
-- QuickStore by SouqOne — Master Seed Data
-- Initial Tenant: Premium Khaja (Artificial Jewellery, Bangles & Traditional Wear)
-- Merchant: Jaffar Mohd (Verified Merchant Account: 9393056641)
-- ==============================================================================

-- 1. Create Tenant: Premium Khaja
INSERT INTO tenants (id, slug, display_name, legal_name, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'premium-khaja',
    'Premium Khaja',
    'Premium Khaja Haute Artificial Jewellery',
    'active'
) ON CONFLICT (id) DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    slug = EXCLUDED.slug;

-- 2. Tenant Settings
INSERT INTO tenant_settings (
    tenant_id,
    theme_json,
    contact_json,
    payment_json,
    delivery_json,
    policy_json,
    feature_flags_json,
    seo_json
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '{
        "brandTone": "obsidian_gold",
        "primaryColor": "#121110",
        "accentColor": "#D4AF37",
        "mutedGold": "#C5A059",
        "surfaceColor": "#1C1A18",
        "ivoryColor": "#F9F6F0",
        "fontHeading": "Cormorant Garamond, serif",
        "fontBody": "Plus Jakarta Sans, sans-serif"
    }'::jsonb,
    '{
        "storeName": "Premium Khaja",
        "ownerName": "Jaffar Mohd",
        "phone": "9393056641",
        "whatsappNumber": "919393056641",
        "email": "contact@premiumkhaja.com",
        "address": "Opp. Charminar Heritage Heritage Market, Old City, Hyderabad, Telangana - 500002",
        "googleMapsUrl": "https://maps.google.com/?q=Charminar+Hyderabad"
    }'::jsonb,
    '{
        "enabledMethods": ["manual_upi_qr"],
        "primaryMethod": "manual_upi_qr",
        "upiId": "premiumkhaja@okaxis",
        "payeeName": "Jaffar Mohd",
        "qrImage": "/images/jaffar_mohd_upi_qr.jpg",
        "standeeQrImage": "/images/owner_upi_qr.jpg",
        "instructions": "Scan QR with GPay, PhonePe, or Paytm. Submit reference number after paying. Merchant verifies payment before dispatch."
    }'::jsonb,
    '{
        "defaultMethod": "local_courier",
        "fixedFee": 99,
        "freeDeliveryThreshold": 1499,
        "zones": [
            { "name": "Hyderabad Twin Cities Express", "fee": 99, "freeAbove": 1499, "tat": "Same Day / Next Day" },
            { "name": "Telangana & Andhra Pradesh Standard", "fee": 120, "freeAbove": 1999, "tat": "2-3 Days" },
            { "name": "Rest of India Courier", "fee": 150, "freeAbove": 2499, "tat": "3-5 Days" }
        ],
        "allowStorePickup": true
    }'::jsonb,
    '{
        "returnsPolicy": "Authentic artificial jewellery inspected prior to dispatch. 48-hour video-unboxing verification policy for damaged transit claims.",
        "careNotice": "Store in dry airtight container away from perfumes and sprays to maintain micro-polish lustre.",
        "privacyNotice": "Customer contact data is captured strictly for order coordination, fulfillment, and payment verification."
    }'::jsonb,
    '{
        "enableDirectUpi": true,
        "enableShorts": true,
        "enableRecommendations": true,
        "enableThresholdOffers": true,
        "enableAiStylist": false,
        "enableVoiceCommands": false,
        "enableSocialSync": false
    }'::jsonb,
    '{
        "metaTitle": "Premium Khaja | Royal Hyderabad Artificial Jewellery & Bangle Atelier",
        "metaDescription": "Shop handcrafted Jadau Chooda, Rajputi Kundan Bangles, Meenakari Kadas, and traditional bridal jewellery directly from Hyderabad.",
        "ogImage": "/images/quickstore_complete_ref.png"
    }'::jsonb
) ON CONFLICT (tenant_id) DO UPDATE SET
    theme_json = EXCLUDED.theme_json,
    contact_json = EXCLUDED.contact_json,
    payment_json = EXCLUDED.payment_json,
    delivery_json = EXCLUDED.delivery_json,
    policy_json = EXCLUDED.policy_json,
    feature_flags_json = EXCLUDED.feature_flags_json,
    seo_json = EXCLUDED.seo_json;

-- 3. Core Categories
INSERT INTO categories (id, tenant_id, name, slug, sort_order, published)
VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Bangles Atelier', 'bangles', 1, true),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Necklaces & Chokers', 'necklaces', 2, true),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Bracelets & Cuffs', 'bracelets', 3, true),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Earrings & Jhumkas', 'earrings', 4, true)
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 4. Initial Seed Products for Premium Khaja (Matching Authentic Photos)
INSERT INTO products (
    id, tenant_id, name, slug, sku, category_id,
    short_description, full_description,
    price, compare_at_price, member_price,
    status, product_type, tags,
    attributes_json, is_featured, is_new_arrival
)
VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Royal Rajputi Kundan Kada with Red Enamel',
    'royal-rajputi-kundan-kada-red-enamel',
    'PK-BGL-01-STN',
    '10000000-0000-0000-0000-000000000001',
    'Heirloom-grade royal Kada with uncut Kundan and crimson Meenakari.',
    'An heirloom-grade royal Kada featuring intricate hand-carved floral motifs, embedded uncut Kundan stones, and regal crimson Meenakari along the outer rim. Designed with an easy openable screw clasp for effortless wear.',
    2499.00, 3899.00, 2249.00,
    'published', 'jewellery', ARRAY['Bridal', 'Trending', 'Stone Bangle', 'Miss World 2025 Featured'],
    '{
        "subcategory": "Stone Bangle",
        "style": "Traditional",
        "finish": "22K Antique Micro Gold Plated",
        "material": "Brass with High-Grade Polki Kundan & Meenakari",
        "stoneType": "Uncut Glass Kundan & Ruby Red Cabochon",
        "occasion": "Bridal"
    }'::jsonb,
    true, false
),
(
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Maharani Jadau Chooda Cluster Bangles',
    'maharani-jadau-chooda-cluster-bangles',
    'PK-BGL-02-STN',
    '10000000-0000-0000-0000-000000000001',
    'Set of 8 heavy bridal bangles with micro-pave simulated stones.',
    'A breathtaking 8-piece Chooda set encrusted with sparkling white zirconia and deep ruby doublet stones.',
    3299.00, 4999.00, 2999.00,
    'published', 'jewellery', ARRAY['Bridal', 'Bestseller', 'Stone Bangle'],
    '{
        "subcategory": "Stone Bangle",
        "style": "Royal Bridal",
        "finish": "Yellow Gold Micron Plating",
        "material": "Copper Alloy & High Lustre Glass Cubic Zirconia",
        "stoneType": "Ruby & Diamond Doublet",
        "occasion": "Wedding"
    }'::jsonb,
    true, true
)
ON CONFLICT (tenant_id, sku) DO NOTHING;

-- 5. Primary Media for Seed Products
INSERT INTO product_media (
    tenant_id, product_id, media_type, storage_path, alt_text, sort_order, is_primary, approved
)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'image',
    '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png',
    'Royal Rajputi Kundan Kada with Red Enamel',
    1, true, true
),
(
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'image',
    '/images/bangles/Gemini_Generated_Image_pkx14upkx14upkx1.png',
    'Maharani Jadau Chooda Cluster Bangles',
    1, true, true
)
ON CONFLICT DO NOTHING;

-- 6. Product Variants (Sizes: 2.4, 2.6, 2.8)
INSERT INTO product_variants (
    tenant_id, product_id, sku, options_json, stock_qty, low_stock_threshold, active
)
VALUES
    ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'PK-BGL-01-24', '{"size": "2.4"}'::jsonb, 8, 2, true),
    ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'PK-BGL-01-26', '{"size": "2.6"}'::jsonb, 12, 3, true),
    ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'PK-BGL-02-26', '{"size": "2.6"}'::jsonb, 6, 2, true)
ON CONFLICT (tenant_id, sku) DO NOTHING;

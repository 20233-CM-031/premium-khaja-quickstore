-- ==============================================================================
-- QuickStore by SouqOne — Master Database Schema
-- Multi-Tenant PostgreSQL Schema with Strict Isolation, Auditing, and RLS
-- First Tenant: Premium Khaja (Artisanal Jewellery & Bangles)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants Registry
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tenant Settings (Branding, Payment, Delivery, Policies, Feature Flags)
CREATE TABLE IF NOT EXISTS tenant_settings (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    theme_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    contact_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    policy_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    feature_flags_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tenant Users & Roles (Owner, Manager, Catalog Editor)
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    auth_user_id UUID NOT NULL, -- references auth.users(id) in Supabase
    role VARCHAR(32) NOT NULL CHECK (role IN ('owner', 'manager', 'editor')),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'deactivated')),
    display_name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, auth_user_id)
);

-- 4. Categories & Subcategories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

-- 5. Collections (Curated Showcases e.g., Bridal, Trending, Miss World 2025)
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    cover_media_url TEXT,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

-- 6. Products (Canonical Jewelry Master Records)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    short_description TEXT,
    full_description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(12, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
    member_price NUMERIC(12, 2) CHECK (member_price IS NULL OR member_price >= 0),
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    product_type VARCHAR(64) DEFAULT 'jewellery',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    attributes_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. finish, material, stoneType, occasion, careInstructions
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_promotion_eligible BOOLEAN NOT NULL DEFAULT true,
    seo_json JSONB DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, sku),
    UNIQUE(tenant_id, slug)
);

-- 7. Product Variants (Sizes e.g. 2.4, 2.6, 2.8, Finishes, Stone Options)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    options_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"size": "2.4", "color": "Ruby Red"}
    price_override NUMERIC(12, 2) CHECK (price_override IS NULL OR price_override >= 0),
    stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 3 CHECK (low_stock_threshold >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, sku)
);

-- 8. Product Media (Images & Video Clips)
CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    media_type VARCHAR(32) NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    storage_path TEXT NOT NULL,
    poster_path TEXT,
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    approved BOOLEAN NOT NULL DEFAULT true,
    source_metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Collection Products Join Table
CREATE TABLE IF NOT EXISTS collection_products (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY(collection_id, product_id)
);

-- 10. Inventory Movement Audit Log
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity_delta INT NOT NULL,
    reason VARCHAR(64) NOT NULL CHECK (reason IN ('RESTOCK', 'SALE', 'DAMAGE', 'RETURN', 'CORRECTION', 'ORDER_CANCELLED')),
    reference_type VARCHAR(64), -- 'order', 'manual_adjustment', 'physical_audit'
    reference_id VARCHAR(120),
    actor_id UUID,
    actor_name VARCHAR(120),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Shorts (Vertical Discovery Reel Rail)
CREATE TABLE IF NOT EXISTS shorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    caption TEXT,
    video_url TEXT NOT NULL,
    poster_url TEXT,
    duration_seconds INT,
    status VARCHAR(32) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    sort_order INT NOT NULL DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Short Linked Products
CREATE TABLE IF NOT EXISTS short_products (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    short_id UUID NOT NULL REFERENCES shorts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (short_id, product_id)
);

-- 13. Customers (Guest & Enrolled Profiles)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    source VARCHAR(64) DEFAULT 'QUICKSTORE', -- 'INSTAGRAM', 'WHATSAPP', 'QR', 'DIRECT'
    is_member BOOLEAN NOT NULL DEFAULT false,
    member_tier VARCHAR(32) DEFAULT 'NONE',
    total_spend NUMERIC(12, 2) NOT NULL DEFAULT 0,
    order_count INT NOT NULL DEFAULT 0,
    last_order_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, phone)
);

-- 14. Customer Consent Records (DPDP Act Compliance)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    consent_type VARCHAR(64) NOT NULL CHECK (consent_type IN ('FULFILMENT_COMMUNICATIONS', 'MARKETING_PROMOTIONS', 'MEMBERSHIP_PROGRAM')),
    granted BOOLEAN NOT NULL DEFAULT false,
    source VARCHAR(64) NOT NULL DEFAULT 'CHECKOUT_OPT_IN',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- 15. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number VARCHAR(64) NOT NULL, -- e.g. PK-ORD-8492
    public_tracking_token VARCHAR(64) UNIQUE NOT NULL, -- safe opaque tracking token
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery_method VARCHAR(64) NOT NULL DEFAULT 'local_courier', -- 'local_courier', 'store_pickup', 'express_rapido'
    delivery_fee_state VARCHAR(32) NOT NULL DEFAULT 'included' CHECK (delivery_fee_state IN ('included', 'to_be_quoted', 'waived')),
    delivery_fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(64) NOT NULL DEFAULT 'pending_payment' CHECK (
        status IN (
            'pending_payment',
            'payment_verification_pending',
            'payment_verified',
            'confirmed',
            'preparing',
            'ready_for_dispatch',
            'out_for_delivery',
            'delivered',
            'cancelled',
            'refund_pending',
            'refunded'
        )
    ),
    payment_status VARCHAR(64) NOT NULL DEFAULT 'unpaid' CHECK (
        payment_status IN ('unpaid', 'submitted_pending_verification', 'verified', 'rejected', 'refunded')
    ),
    payment_method VARCHAR(64) NOT NULL DEFAULT 'manual_upi_qr',
    payment_reference VARCHAR(120), -- customer submitted UPI UTR
    verified_by UUID, -- tenant staff who verified payment
    verified_at TIMESTAMPTZ,
    customer_note TEXT,
    order_guidance_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    size_preference VARCHAR(100),
    idempotency_key VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, order_number)
);

-- 16. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name_snapshot VARCHAR(255) NOT NULL,
    sku_snapshot VARCHAR(100) NOT NULL,
    options_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"size": "2.4"}
    unit_price_snapshot NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Manual Payment Attempts & Audit
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method VARCHAR(64) NOT NULL DEFAULT 'manual_upi',
    expected_amount NUMERIC(12, 2) NOT NULL,
    payer_reference VARCHAR(120),
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Audit Logs (Admin Actions, Status Transitions, Stock Overrides)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID,
    actor_name VARCHAR(120),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(120),
    before_json JSONB,
    after_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-throughput queries and multi-tenant scoping
CREATE INDEX IF NOT EXISTS idx_products_tenant_status ON products(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_products_tenant_category ON products(tenant_id, category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status ON orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(tenant_id, customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(public_tracking_token);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_variant ON inventory_movements(tenant_id, variant_id);

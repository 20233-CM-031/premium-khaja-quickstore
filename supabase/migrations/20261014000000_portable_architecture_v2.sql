-- ==============================================================================
-- QuickStore by SouqOne — Master Database Schema v2 (Portable Architecture)
-- Adds Product Attribute Definitions, Media Assets, Identity Decoupling,
-- Offers & Redemptions, Loyalty Memberships, Aggregate Events, and AI Copilot Drafts.
-- ==============================================================================

-- 1. App Users & Decoupled Identity Provider Mapping
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL, -- e.g. 'supabase', 'auth0', 'custom'
    provider_subject VARCHAR(255) NOT NULL, -- external auth ID
    email_snapshot VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(provider, provider_subject)
);

-- 2. Product Attribute Definitions (Configurable jewelry/clothing attributes per tenant/category)
CREATE TABLE IF NOT EXISTS product_attribute_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    attribute_key VARCHAR(64) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    data_type VARCHAR(32) NOT NULL DEFAULT 'text' CHECK (data_type IN ('text', 'number', 'select', 'multiselect', 'boolean')),
    required BOOLEAN NOT NULL DEFAULT false,
    allowed_values_json JSONB DEFAULT '[]'::jsonb,
    unit VARCHAR(32),
    sort_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, category_id, attribute_key)
);

-- 3. Media Assets (Portable Asset Register with Checksums and Stable Object Keys)
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL DEFAULT 'supabase',
    bucket_key VARCHAR(120) NOT NULL,
    object_key TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    visibility VARCHAR(32) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    original_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ready' CHECK (status IN ('uploading', 'ready', 'archived', 'error')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Offers & Promotions Engine
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(64) NOT NULL CHECK (type IN ('cart_threshold', 'addon_reward', 'bundle', 'member_discount')),
    rules_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    redemption_limit INT,
    per_customer_limit INT DEFAULT 1,
    stackable BOOLEAN DEFAULT false,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offer_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    reward_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Memberships & Loyalty Club
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    tier VARCHAR(32) NOT NULL DEFAULT 'GOLD' CHECK (tier IN ('SILVER', 'GOLD', 'PLATINUM', 'ROYAL')),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    benefits_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE(tenant_id, customer_id)
);

CREATE TABLE IF NOT EXISTS membership_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    points_delta INT DEFAULT 0,
    source_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Privacy-Conscious Aggregate Store Events
CREATE TABLE IF NOT EXISTS store_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_key VARCHAR(120) NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'VIEW_PRODUCT', 'ADD_TO_CART', 'INITIATE_CHECKOUT', 'SEARCH'
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. AI Copilot Drafts & Approval Audit
CREATE TABLE IF NOT EXISTS ai_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(64) NOT NULL, -- 'product', 'inventory_adjustment', 'enhancement'
    entity_id VARCHAR(120),
    model_provider VARCHAR(64) NOT NULL,
    input_reference TEXT,
    proposed_changes_json JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    result_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attribute_definitions_tenant ON product_attribute_definitions(tenant_id, category_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_tenant ON media_assets(tenant_id, checksum_sha256);
CREATE INDEX IF NOT EXISTS idx_offers_tenant_status ON offers(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_memberships_tenant_customer ON memberships(tenant_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_store_events_tenant_event ON store_events(tenant_id, event_type);
CREATE INDEX IF NOT EXISTS idx_ai_drafts_tenant_status ON ai_drafts(tenant_id, status);

-- Enable RLS on newly created tables
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_drafts ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Storefront
CREATE POLICY "Public can view active attribute definitions" 
ON product_attribute_definitions FOR SELECT 
USING (active = true);

CREATE POLICY "Public can view public media assets" 
ON media_assets FOR SELECT 
USING (visibility = 'public' AND status = 'ready');

CREATE POLICY "Public can view active offers" 
ON offers FOR SELECT 
USING (status = 'active');

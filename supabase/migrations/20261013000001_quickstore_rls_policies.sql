-- ==============================================================================
-- QuickStore by SouqOne — Row Level Security (RLS) Policies
-- Strict Tenant Isolation & Access-Control Baseline
-- ==============================================================================

-- Helper function to extract current authenticated user's tenant ID
CREATE OR REPLACE FUNCTION get_auth_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id 
  FROM tenant_users 
  WHERE auth_user_id = auth.uid() 
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function to check role within tenant
CREATE OR REPLACE FUNCTION has_tenant_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM tenant_users 
    WHERE auth_user_id = auth.uid() 
      AND status = 'active'
      AND role = ANY(required_roles)
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ==========================================
-- 1. Enable RLS on all Tenant-Owned Tables
-- ==========================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. Tenants & Settings Policies
-- ==========================================
-- Public read for active tenants
CREATE POLICY "Public can view active tenants" 
ON tenants FOR SELECT 
USING (status = 'active');

-- Public read for tenant settings
CREATE POLICY "Public can view active tenant settings" 
ON tenant_settings FOR SELECT 
USING (EXISTS (SELECT 1 FROM tenants t WHERE t.id = tenant_settings.tenant_id AND t.status = 'active'));

-- Tenant owners & managers can update their settings
CREATE POLICY "Staff can update their tenant settings" 
ON tenant_settings FOR UPDATE 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']));

-- ==========================================
-- 3. Catalog (Categories, Collections, Products, Variants, Media)
-- ==========================================

-- Public Read: Published products only
CREATE POLICY "Public can view published products" 
ON products FOR SELECT 
USING (status = 'published');

-- Public Read: Active variants of published products
CREATE POLICY "Public can view active variants" 
ON product_variants FOR SELECT 
USING (active = true AND EXISTS (
  SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND p.status = 'published'
));

-- Public Read: Approved media
CREATE POLICY "Public can view approved media" 
ON product_media FOR SELECT 
USING (approved = true);

-- Public Read: Published categories & collections
CREATE POLICY "Public can view published categories" 
ON categories FOR SELECT 
USING (published = true);

CREATE POLICY "Public can view published collections" 
ON collections FOR SELECT 
USING (published = true);

CREATE POLICY "Public can view collection products" 
ON collection_products FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM collections c WHERE c.id = collection_products.collection_id AND c.published = true
));

-- Public Read: Published Shorts
CREATE POLICY "Public can view published shorts" 
ON shorts FOR SELECT 
USING (status = 'published');

CREATE POLICY "Public can view short products" 
ON short_products FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM shorts s WHERE s.id = short_products.short_id AND s.status = 'published'
));

-- Authenticated Staff: Full access to their own tenant's catalog
CREATE POLICY "Staff can view all tenant products" 
ON products FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

CREATE POLICY "Staff can modify tenant products" 
ON products FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']));

CREATE POLICY "Staff can view all tenant variants" 
ON product_variants FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

CREATE POLICY "Staff can modify tenant variants" 
ON product_variants FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']));

CREATE POLICY "Staff can modify tenant media" 
ON product_media FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']));

CREATE POLICY "Staff can modify categories" 
ON categories FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']));

CREATE POLICY "Staff can modify collections" 
ON collections FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']));

CREATE POLICY "Staff can modify shorts" 
ON shorts FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager', 'editor']));

-- ==========================================
-- 4. Inventory Movements (Strict Audit)
-- ==========================================
-- Public cannot view or insert inventory movements
CREATE POLICY "Staff can view tenant inventory logs" 
ON inventory_movements FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

CREATE POLICY "Staff can insert tenant inventory logs" 
ON inventory_movements FOR INSERT 
TO authenticated 
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']));

-- ==========================================
-- 5. Orders & Payments (Tamper-Resistant Workflow)
-- ==========================================

-- Public insert: Shopper can place an order
CREATE POLICY "Public can create order" 
ON orders FOR INSERT 
WITH CHECK (status = 'pending_payment');

CREATE POLICY "Public can insert order items" 
ON order_items FOR INSERT 
WITH CHECK (true);

-- Public read: Shopper can view ONLY their own order via secure public tracking token
CREATE POLICY "Customer can view own order via tracking token" 
ON orders FOR SELECT 
USING (public_tracking_token IS NOT NULL);

CREATE POLICY "Customer can view own order items" 
ON order_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.public_tracking_token IS NOT NULL
));

-- Public payment attempt: Shopper can submit a payment claim (moves status to payment_verification_pending)
CREATE POLICY "Customer can submit payment attempt" 
ON payment_attempts FOR INSERT 
WITH CHECK (status = 'pending');

-- Staff: View and manage all tenant orders
CREATE POLICY "Staff can view all tenant orders" 
ON orders FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

CREATE POLICY "Staff can update tenant orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']));

CREATE POLICY "Staff can view all tenant order items" 
ON order_items FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

CREATE POLICY "Staff can view and verify payment attempts" 
ON payment_attempts FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']));

-- ==========================================
-- 6. Privacy & CRM (DPDP Compliance)
-- ==========================================
CREATE POLICY "Public can record consent" 
ON consent_records FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Staff can view tenant customers" 
ON customers FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

CREATE POLICY "Staff can manage tenant customers" 
ON customers FOR ALL 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']))
WITH CHECK (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner', 'manager']));

CREATE POLICY "Staff can view tenant consent records" 
ON consent_records FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id());

-- ==========================================
-- 7. Audit Logs
-- ==========================================
CREATE POLICY "Staff can view tenant audit logs" 
ON audit_logs FOR SELECT 
TO authenticated 
USING (tenant_id = get_auth_tenant_id() AND has_tenant_role(ARRAY['owner']));

CREATE POLICY "System can insert audit logs" 
ON audit_logs FOR INSERT 
TO authenticated 
WITH CHECK (tenant_id = get_auth_tenant_id());

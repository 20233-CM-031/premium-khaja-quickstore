# ✨ QuickStore by SouqOne — Premium Khaja Master Implementation

A production-grade **SouqOne QuickStore** mobile-first digital showroom and lightweight commerce system, tailored for its first tenant: **Premium Khaja** (Artisanal Hyderabad Bangles & Haute Artificial Jewellery).

Built strictly according to the **QuickStore Master Product & Implementation Specification**.

---

## 🏗️ Architecture & Product Principles

1. **Multi-Tenant Foundation from Day 1**:
   - Every tenant row and transaction is explicitly partitioned by `tenant_id`.
   - Store branding, theme tokens, contact, UPI parameters, delivery fees, and policies are decoupled into `src/config/tenant-defaults.ts` and `src/config/tenants/premium-khaja.ts`.
2. **Authoritative Calculation & State Machine**:
   - Cart subtotals, variant prices, delivery waivers, and eligible offers are calculated server-side (`src/lib/pricing/pricingEngine.ts`).
   - Order statuses follow an auditable state machine (`src/lib/orders/orderStateMachine.ts`).
3. **Manual UPI Workflow (Anti-Fraud Constraint)**:
   - Customer-submitted payment claims (UTR/reference numbers) are explicitly recorded as `payment_verification_pending`.
   - The platform **never** treats customer input as proof of payment.
   - Merchant owners verify transactions in their business UPI app/bank ledger before moving orders to `payment_verified` or `confirmed`.
4. **Data Privacy (DPDP Act Compliance)**:
   - Minimal data collection: full name, mobile number, and delivery locality.
   - Marketing communication opt-in is optional, unchecked by default, and recorded with audit timestamps.
5. **Modular Advanced Capabilities**:
   - AI generation, voice commands, and automatic social platform synchronization remain guarded behind feature flags until external credentials and platform approvals are obtained.

---

## 📁 Repository Structure

```text
premium-khaja-quickstore/
├── .env.example                                  # Environment variables reference template
├── QuickStore_Premium_Khaja_Master_Product_Spec.md # Master engineering & product spec
├── netlify.toml                                  # Netlify deployment and SPA routing rules
├── package.json
├── supabase/
│   ├── migrations/
│   │   ├── 20261013000000_quickstore_core_schema.sql    # Multi-tenant tables, indexes, audit logs
│   │   └── 20261013000001_quickstore_rls_policies.sql   # Row Level Security policies
│   └── seed.sql                                         # Premium Khaja seed data
├── src/
│   ├── config/
│   │   ├── index.ts                              # Tenant resolution engine
│   │   ├── tenant-defaults.ts                    # Reusable tenant type contracts
│   │   └── tenants/premium-khaja.ts              # First production tenant configuration
│   ├── lib/
│   │   ├── inventory/inventoryEngine.ts          # Auditable inventory adjustments
│   │   ├── orders/
│   │   │   ├── orderEngine.ts                    # Authoritative order creation & handoff
│   │   │   └── orderStateMachine.ts              # State transitions and access control
│   │   ├── pricing/pricingEngine.ts              # Subtotals, variant pricing, delivery fee
│   │   ├── supabase/client.ts                    # Typed Supabase client wrapper
│   │   └── validation/schemas.ts                 # Zod validation schemas
│   ├── components/
│   │   ├── MerchantCommandCenter/CommandCenter.jsx # Protected admin, inventory & orders
│   │   ├── Header.jsx, HeroBanner.jsx, ...       # Mobile-first storefront components
│   │   ├── CheckoutModal.jsx                     # DPDP checkout & UPI QR generator
│   │   └── OrderSuccessModal.jsx                 # Order slip & WhatsApp dispatch handoff
│   └── context/StoreContext.jsx                  # Store state, multi-tab broadcast sync
└── tests/
    └── unit/
        ├── phase1.test.ts                        # Pricing, delivery, state machine, idempotency
        └── phase2_3.test.ts                      # Inventory movements, manual UPI, tenant isolation
```

---

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Note your **Project URL** and **Anon Key** (under Project Settings > API).

### 2. Apply Migrations
Navigate to the Supabase SQL Editor and execute the migration files in order:
1. `supabase/migrations/20261013000000_quickstore_core_schema.sql`:
   - Creates `tenants`, `tenant_settings`, `tenant_users`, `categories`, `products`, `product_variants`, `orders`, `order_items`, `inventory_movements`, `audit_logs`.
2. `supabase/migrations/20261013000001_quickstore_rls_policies.sql`:
   - Enforces strict Row Level Security (RLS).
   - Public can view only published products, active variants, and store settings.
   - Merchant staff can only read and mutate their own tenant data.
3. `supabase/seed.sql`:
   - Seeds initial tenant `00000000-0000-0000-0000-000000000001` (Premium Khaja).
   - Configures theme, verified UPI (`premiumkhaja@okaxis`), and sample catalogue.

### 3. Storage Bucket Configuration
Create a bucket named `quickstore-media`:
- Set public read for approved media.
- Restrict upload/update to authenticated tenant users with owner/manager roles.

---

## 🚀 Running Locally & Testing

### Installation
```bash
npm install
```

### Run Unit Tests
```bash
npm test
```
Runs Vitest test suite covering:
- Authoritative order pricing and threshold delivery waiver
- Idempotency key duplicate tap prevention
- Indian phone number and PIN code validation
- Out-of-stock and variant-level inventory blocking
- Order state machine transitions across customer, manager, and owner roles
- Auditable inventory movements (restock, sale, damage, cancellation)
- Multi-tenant config isolation

### Build Production Bundle
```bash
npm run build
```

### Start Dev Server
```bash
npm run dev
```

---

## 🌐 Netlify Deployment

1. Connect the GitHub repository to Netlify.
2. **Build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. **Environment variables** (in Netlify Site Configuration):
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `VITE_DEFAULT_TENANT_SLUG`: `premium-khaja`

---

## 📦 Portability & Disaster Recovery Architecture (Spec v2)

QuickStore isolates third-party cloud providers behind clean TypeScript adapters:
- **Database:** PostgreSQL is canonical. Business logic executes through typed repositories (`src/server/repositories/`).
- **Auth:** Supabase Auth is isolated in `src/adapters/auth/supabase/`, mapping external provider subjects to internal `app_user_id` records.
- **Storage:** Supabase Storage is isolated in `src/adapters/storage/supabase/`, storing stable SHA-256 checksums and object keys rather than hardcoded URLs.

### 1. Automated Tenant Export & Restore Verification
Run the automated end-to-end portability suite:
```bash
npm run verify:restore
```
This tests:
1. Exporting the authoritative tenant dataset (`Format: 2.0.0`).
2. Validating SHA-256 checksums on all media manifests.
3. Restoring into a fresh database namespace with relationship preservation and ID remapping.
4. Executing an authoritative smoke checkout test on the restored dataset.

### 2. Catalogue CSV Import / Export
- Merchant catalog operations support bulk CSV export and dry-run validation with per-row error reports (`src/server/services/exportImportService.ts`).

### 3. Migration Work Matrix
| Component | Portability Status | Migration Requirements |
| :--- | :--- | :--- |
| **Catalog & Products** | 100% Portable | Standard PostgreSQL dump/restore or Tenant JSON Package. |
| **Inventory & Orders** | 100% Portable | Relational tables with immutable audit movement logs. |
| **Attribute Definitions** | 100% Portable | Configurable schemas in `product_attribute_definitions`. |
| **Media Assets** | Portable with Sync | Object bytes copied to new bucket; SHA-256 verified against manifest. |
| **User Authentication** | Identity Remapped | Passwords not portable; user re-auth or magic link required. |
| **Row Level Security** | Postgres Portable | Standard SQL policies documented in `supabase/migrations/`. |

---

## 🔐 Admin Access & Staff Invitation

1. Access the protected Command Center by navigating to `/` with `#admin`, `#inventory`, or `#command-center` appended to the URL.
2. Use verified owner credentials or authenticate with configured staff account.
3. Staff users can be invited via Supabase Auth and assigned roles (`owner`, `manager`, `editor`) in `tenant_users`.

---

## 🤝 Client Handover Checklist (Premium Khaja)

- [x] Verified merchant UPI ID configured (`premiumkhaja@okaxis` - Jaffar Mohd).
- [x] Owner WhatsApp order handoff prefilled to verified number (+91 9393056641).
- [x] Direct UPI QR code with dynamic total amount generation.
- [x] Delivery fee tiers (Express Twin Cities ₹99, Free on orders ₹1,499+).
- [x] Order slip printing and customer copy-to-clipboard functionality.
- [x] Real-time multi-tab inventory deduction and manual reconciliation log.
- [x] Feature flags kept modular for AI, voice commands, and social sync.

---

## 📄 License
QuickStore Platform © MARZ Enterprises & Solutions. First Tenant Implementation for Premium Khaja.


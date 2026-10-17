# ✨ QuickStore by SouqOne — Premium Khaja Master Implementation

A production-grade, industrial-ready **SouqOne QuickStore** mobile-first digital showroom and lightweight commerce system, tailored for its premier tenant: **Premium Khaja** (Artisanal Hyderabad Bangles & Haute Artificial Jewellery, Charminar, Hyderabad).

Built strictly according to the **QuickStore Master Product & Implementation Specification (`MASTER_AGENT_BUILD_PROMPT.md`)**.

---

## 🏗️ Architecture & Core Principles

1. **Multi-Tenant Foundation from Day 1**:
   - Every tenant row and transaction is explicitly partitioned by `tenant_id`.
   - Store branding, theme tokens, contact, UPI parameters, delivery fees, and policies are decoupled into `src/config/tenant-defaults.ts` and `src/config/tenants/premium-khaja.ts`.
2. **Authoritative Calculation & State Machine**:
   - Cart subtotals, variant prices, delivery waivers, and eligible offers are calculated deterministically server-side (`src/lib/pricing/pricingEngine.ts`).
   - Order statuses follow an auditable state machine (`src/lib/orders/orderStateMachine.ts`).
3. **Manual UPI Workflow (Anti-Fraud Constraint)**:
   - Customer-submitted payment claims (UTR/reference numbers) are explicitly recorded as `payment_verification_pending`.
   - The platform **never** treats customer input as proof of payment.
   - Merchant owner Jaffar Mohd verifies transactions in his business UPI app/bank ledger before moving orders to `payment_verified`.
4. **Hero Campaign Carousel & Miss World Claim Gate (Section 4)**:
   - Multi-slide editorial hero carousel supporting 8–9 luxury slides with touch-swipe, autoplay pause/play, and reduced-motion compliance.
   - Legal **Miss World Publication Gate**: defaults to `draft_unverified` with conservative public copy (*"Couture Runway & High-Fashion Showcase"*) until the 4-point owner verification checklist is confirmed.
5. **Promotional Offers Engine (Section 8)**:
   - Live discount rules engine supporting percentage (`ROYAL10` - 10% off min ₹1,499) and flat deductions (`BRIDAL200` - ₹200 off min ₹2,499) with real-time bag and checkout recalculation.
6. **Merchant Command Center & Inventory Movement Ledger (Section 9)**:
   - Executive dashboard distinguishing Verified Paid Sales vs Pending Payment Claims.
   - Immutable stock movement ledger recording all replenishments, sales, and adjustments with **mandatory reason codes** and actor tracking.
7. **Safe AI Copilot Pipeline (Section 10)**:
   - Natural language intent parsing -> Schema validation -> **Diff Inspection Modal** -> **Explicit Human Confirmation** -> System Audit Log.
   - Zero autonomous mutations without owner confirmation.
8. **Portability & Disaster Recovery (Section 14)**:
   - Authoritative PostgreSQL schema (`supabase/migrations/001_initial_schema.sql`).
   - 1-click export of self-contained tenant JSON package (Format v2.0.0) with cryptographic SHA-256 verification runner.
9. **Data Privacy (DPDP Act Compliance)**:
   - Minimal data collection: full name, mobile number, delivery locality.
   - Marketing communication opt-in is optional, unchecked by default, and recorded with audit timestamps.

---

## 📁 Repository Structure

```text
premium-khaja-quickstore/
├── .env.example                                  # Environment variables reference template
├── IMPLEMENTATION_STATUS.md                      # Feature-by-feature implementation matrix
├── ARCHITECTURE.md                               # Architectural specification & mermaid diagrams
├── DESIGN_SYSTEM.md                              # Nizami royal palette & mobile UI guidelines
├── PILOT_BRIEF.md                                # Merchant operational brief for Jaffar Mohd
├── DEPLOY_CHECKLIST.md                           # Netlify deployment & smoke test protocol
├── QA_REPORT.md                                  # Full test execution & audit results
├── netlify.toml                                  # Netlify deployment and SPA routing rules
├── package.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql                # Multi-tenant tables, indexes, audit logs
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
│   │   └── validation/schemas.ts                 # Zod validation schemas
│   ├── components/
│   │   ├── MerchantCommandCenter/CommandCenter.jsx # Protected admin, inventory, copilot & orders
│   │   ├── HeroCarousel.jsx                      # Multi-slide editorial campaign carousel
│   │   ├── CelebrityMissWorldSpotlight.jsx       # Claim-gated Miss World showcase
│   │   ├── MobileBottomNav.jsx                   # Ergonomic mobile navigation bar
│   │   ├── ProductDetailModal.jsx                # Honest stock counts & mandatory sizing
│   │   ├── CartDrawer.jsx                        # Real-time bag & promotional coupon input
│   │   ├── CheckoutModal.jsx                     # DPDP checkout & manual UPI QR generator
│   │   └── OrderSuccessModal.jsx                 # Order slip & WhatsApp dispatch handoff
│   └── context/StoreContext.jsx                  # Store state, ledger, offers & safe copilot
└── tests/
    └── unit/                                     # 48 Automated unit tests (100% pass)
```

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- Node.js 18+
- npm 9+

### 2. Installation
```bash
git clone https://github.com/20233-CM-031/premium-khaja-quickstore.git
cd premium-khaja-quickstore
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Running Verification Test Suite
```bash
npm test
```
Executes all 48 unit tests across 7 test suites covering:
- Portability export/import & disaster recovery
- Pricing engine & delivery calculations
- Multi-tenant state broadcast synchronization
- Safe AI Copilot intent parsing & human confirmation
- Promotional coupon rules engine (`ROYAL10`, `BRIDAL200`)
- Hero carousel campaign gate & conservative copy fallback
- Product attribute definitions & sizing validation

### 5. Production Compilation
```bash
npm run build
```
Generates production bundle in `dist/`.

---

## 🧪 Disaster Recovery & Portability Verification

Run the standalone verification test script:
```bash
npx tsx scripts/verify-restore/verifyRestore.ts
```
This tests:
1. Exporting the authoritative tenant dataset (`Format: 2.0.0`).
2. Validating SHA-256 checksums on all media manifests.
3. Restoring into a fresh database namespace with relationship preservation and ID remapping.
4. Executing an authoritative smoke checkout test on the restored dataset.

---

## 🔐 Verified Merchant Configuration (Premium Khaja)

- **Merchant Name:** Jaffar Mohd
- **Verified Business UPI:** `premiumkhaja@okaxis`
- **Merchant Phone:** `+91 9393056641`
- **WhatsApp Concierge Link:** `https://wa.me/919393056641`
- **Atelier Location:** Charminar / Lad Bazaar, Hyderabad, Telangana, India
- **Delivery Thresholds:** Free delivery on orders ₹1,499+ (₹99 for orders under ₹1,499)

---

## 📄 License
QuickStore Platform © MARZ Enterprises & Solutions. First Tenant Implementation for Premium Khaja.

# 🏛️ QuickStore Architecture Specification — Premium Khaja

## 1. System Overview & Core Tenets

QuickStore is a portable, mobile-first headless commerce and digital showroom architecture designed for artisanal luxury brands. **Premium Khaja** (Hyderabad, India) is its flagship tenant.

### Core Architectural Tenets:
1. **Multi-Tenant Foundation from Day 1**: All entities partition cleanly by `tenant_id`.
2. **Authoritative Server / Context Logic**: Never trust client pricing, promotional deductions, or claim assertions.
3. **Manual Payment Collection (Zero Payment Gateway Fees)**: Strict separation between `payment_verification_pending` and `payment_verified`.
4. **Human-in-the-Loop Safe AI**: Schema validation and explicit human confirmation before any mutation occurs.
5. **Portability & Disaster Recovery**: Authoritative PostgreSQL schema and self-contained JSON backup format v2.0.0.

---

## 2. Architecture Diagram

```mermaid
graph TD
    Client[Storefront UI & Mobile View] -->|Browse & Filter| Catalog[Canonical Catalog 28 Bangles]
    Client -->|Apply Coupon| OffersEngine[Promotional Offers Engine ROYAL10 / BRIDAL200]
    OffersEngine --> PricingEngine[Authoritative Pricing & Delivery Engine]
    Client -->|Checkout Form| Validation[Zod DPDP Schema Validation]
    Validation --> OrderEngine[Order State Machine]
    OrderEngine -->|Reserve Stock| InventoryLedger[Immutable Movement Ledger]
    OrderEngine -->|Manual UPI QR| WhatsAppHandoff[WhatsApp Concierge + Order Slip]
    
    Admin[Merchant Command Center] -->|Verify UPI Receipt| OrderEngine
    Admin -->|Checklist Review| ClaimGate[Miss World Publication Gate]
    Admin -->|Prompt| Copilot[Safe AI Copilot Pipeline]
    Copilot --> ActionDraft[Structured Action Draft]
    ActionDraft --> DiffModal[Diff Inspection Modal]
    DiffModal -->|Explicit Confirmation| AuditLog[System Audit Log]
    
    DB[(Authoritative PostgreSQL / Tenant JSON)] <--> Portability[Tenant Export / Restore v2.0.0]
```

---

## 3. Order Lifecycle & Manual UPI Verification

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Customer adds items to bag
    DRAFT --> PAYMENT_VERIFICATION_PENDING: Customer submits checkout & UPI UTR
    PAYMENT_VERIFICATION_PENDING --> PAYMENT_CONFIRMED: Merchant verifies bank app receipt
    PAYMENT_VERIFICATION_PENDING --> PAYMENT_REJECTED: Merchant marks UTR invalid / unpaid
    PAYMENT_CONFIRMED --> PACKING: Atelier prepares velvet gift box
    PACKING --> DISPATCHED: Handed to Hyderabad courier / national delivery
    DISPATCHED --> DELIVERED: Reaches customer doorstep
    PAYMENT_REJECTED --> CANCELLED_RESTOCKED: Atomic inventory restocked to ledger
```

---

## 4. Miss World Publication Gate (Section 4)

Claims regarding pageant gifting are subject to legal scrutiny and brand protection:
- **Default State:** `draft_unverified`
- **Fallback Copy:** Conservative copy displayed across all public channels:
  `"Couture Runway & High-Fashion Showcase — Adorning global cultural ambassadors and international runway delegates."`
- **Gated Elements:** High-risk celebrity slides and explicit Miss World winner claims are hidden from public carousels until the 4-point verification checklist is completed by Jaffar Mohd:
  1. Recipient Identity Verified (`Krystyna Pyszková`)
  2. Event Name & Date Verified (`71st Miss World Festival`)
  3. Rights-Cleared Photography Uploaded
  4. Legal Wording Reviewed

---

## 5. Safe AI Copilot Pipeline (Section 10)

```mermaid
sequenceDiagram
    participant M as Merchant (Jaffar Mohd)
    participant CP as Copilot Parser
    participant SV as Schema Validator
    participant DM as Diff Inspection Modal
    participant ST as Store State & Ledger
    participant AL as Audit Log

    M->>CP: Enters Natural Language Prompt ("Restock PK-BAN-001 by 15 units")
    CP->>SV: Extracts Intent & Builds Action Draft
    SV->>DM: Validates Schema & Computes State Diff
    DM->>M: Presents Action, Target, Current, Proposed, & Reason
    Note over M,DM: No mutation has occurred yet!
    alt Merchant Approves
        M->>DM: Clicks "Confirm & Apply Mutation"
        DM->>ST: Executes Atomic Stock Adjustment
        DM->>AL: Records COPILOT_ACTION_EXECUTED with Actor & Timestamp
    else Merchant Rejects
        M->>DM: Clicks "Discard Draft"
        DM->>ST: State remains 100% untouched
    end
```

---

## 6. Portability & Disaster Recovery (Format v2.0.0)

All tenant data exports conform to a self-contained JSON schema:
- **Manifest:** Format version (`2.0.0`), tenant identifier, exported timestamp, entity counts.
- **Tenant Config:** Brand identity, owner contact, UPI configuration, delivery fee thresholds.
- **Entities:** Products, inventory records, immutable inventory movement ledger, customer CRM profiles, active campaign slides, claim gate state, promotional discount rules, and audit logs.
- **Verification Runner:** `scripts/verify-restore/verifyRestore.ts` executes standalone restoration and smoke test checking cryptographic checksums and catalog integrity.

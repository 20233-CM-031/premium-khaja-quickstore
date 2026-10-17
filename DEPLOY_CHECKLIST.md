# 🚢 QuickStore Production Deployment Checklist: Premium Khaja

## 1. Pre-Deployment Validation (Automated)

- [x] **Vitest Unit Test Suite**: All 48 tests passing across 7 suites (`npm test`).
- [x] **Vite Production Compilation**: Successful build with zero syntax errors (`npm run build`).
- [x] **Netlify SPA Configuration**: `netlify.toml` configured with single-page routing:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- [x] **Responsive Asset Check**: All hero images, bangles photography, and video reel poster assets referenced with accessible fallbacks.

---

## 2. Environment Variables (`.env`)

Configure the following production variables in the Netlify Dashboard (**Site Settings > Build & deploy > Environment**):

```bash
# Merchant Identity & Contacts
VITE_MERCHANT_NAME="Jaffar Mohd"
VITE_MERCHANT_PHONE="9393056641"
VITE_MERCHANT_UPI_ID="premiumkhaja@okaxis"
VITE_MERCHANT_WHATSAPP="https://wa.me/919393056641"

# Feature Flags
VITE_ENABLE_REELS="true"
VITE_ENABLE_COUPONS="true"
VITE_ENABLE_SAFE_COPILOT="true"
VITE_ENABLE_PORTABILITY_EXPORTS="true"

# Architecture Portability Version
VITE_SCHEMA_FORMAT_VERSION="2.0.0"
```

---

## 3. Post-Deployment Smoke Test Protocol

Perform these 5 sanity checks immediately following deployment:

1. **Storefront Hero Carousel:**
   - Verify multi-slide rotation, touch swipe on mobile, and Pause/Play toggle.
   - Verify conservative copy displays by default if Miss World claim gate is `draft_unverified`.
2. **Promotional Offers & Bag Drawer:**
   - Add items totaling over ₹3,000 to bag.
   - Apply coupon `ROYAL10` -> verify 10% deduction is applied to subtotal.
   - Add items totaling ₹2,500 -> apply `BRIDAL200` -> verify ₹200 flat deduction.
3. **Product Sizing Enforcement:**
   - Open a bangle set -> attempt to click "Add to Royal Bag" without choosing a size.
   - Verify mandatory size selection warning displays. Select size `2.6` -> verify successful addition.
4. **Checkout & DPDP Compliance:**
   - Complete checkout modal.
   - Verify marketing opt-in checkbox is unchecked by default.
   - Verify dynamic UPI QR code generates with amount, merchant name `Jaffar Mohd`, and UPI ID `premiumkhaja@okaxis`.
5. **Command Center Verification:**
   - Open Command Center -> verify Verified Paid GMV is clearly separated from Pending Claims.
   - Verify Stock Movement Ledger records all inventory changes with mandatory reasons.
   - Click "Run Portability & Disaster Recovery Verification" -> verify pass certificate renders.

# 🚀 QuickStore 14-Day Production Pilot Brief: Premium Khaja

## 1. Executive Summary

This document briefs **Jaffar Mohd** (Owner & Master Artisan) on operating the **Premium Khaja QuickStore** digital showroom and order fulfillment system during the initial 14-day commercial pilot in Hyderabad.

- **Brand:** Premium Khaja (Artisanal Bangles & Haute Jewellery Atelier)
- **Store Location:** Charminar / Lad Bazaar, Hyderabad, Telangana, India
- **Owner Contact:** Jaffar Mohd (`+91 9393056641`)
- **Verified Business UPI:** `premiumkhaja@okaxis`
- **WhatsApp Concierge Link:** `https://wa.me/919393056641`

---

## 2. Daily Merchant Workflow

### Step 1: Monitoring Incoming Orders
1. Open the **Business Command Center** (`/` -> click "Command Center" in header/footer or switch mode).
2. The **Orders & Dispatch** tab displays incoming orders with a clear badge:
   - `PAID - VERIFY & DISPATCH`
3. Each order card displays:
   - Customer Name & Phone
   - Delivery Address & City
   - Selected Bangle Size (e.g. `2.4`, `2.6`, `2.8`)
   - Customer-entered UPI Reference (UTR)

### Step 2: Payment Verification (Anti-Fraud Procedure)
1. Open your bank app (Axis Bank / BHIM / Google Pay / PhonePe linked to `premiumkhaja@okaxis`).
2. Search for the transaction matching the customer's UPI UTR and exact order amount.
3. If confirmed in your bank account, click **"Verify UPI & Mark Paid"**. The order transitions to `PAYMENT CONFIRMED`.
4. If payment is missing or invalid, click **"Reject Payment"** or contact customer via the 1-click WhatsApp button.

### Step 3: Packing & Atelier Dispatch
1. Assemble the handcrafted jewellery set into the signature velvet gift box.
2. Verify the customer's size preferences (e.g. `2.6` medium fit).
3. Update status to `PACKING`, then `DISPATCHED` when handed over to local courier.

---

## 3. Operating the Hero Carousel & Miss World Claim Gate

### Managing the 8-9 Luxury Hero Slides:
- Navigate to the **Campaigns & Claim Gate** tab.
- Click **"Published"** or **"Draft"** to enable/disable specific promotional slides in real-time.

### Operating the Miss World Publication Gate:
- By default, the system runs in `draft_unverified` mode, ensuring public storefront copy reads conservatively:
  *"Couture Runway & High-Fashion Showcase — Adorning global cultural ambassadors and international runway delegates."*
- To publish official Miss World gifting copy:
  1. Review the 4-point verification checklist (Recipient, Event Date, Media Rights, Legal Copy).
  2. Click **"Approve & Publish Official Miss World Copy"**.
  3. Live storefront copy instantly updates to official approved wording.

---

## 4. Operating the Safe AI Copilot

- In the **Safe AI Copilot** tab, type natural language commands:
  - *"Restock all bridal bangles with 15 units"*
  - *"Draft a 15% discount coupon FESTIVE15 for orders above 2500"*
- The Copilot inspects the command and generates an **Action Diff Inspection Modal**.
- Review the diff (Target, Current State, Proposed State).
- Click **"Confirm & Apply Mutation"** to execute, or **"Discard Draft"** to cancel. No action is ever taken without your explicit click.

---

## 5. Pilot Success Metrics

| Metric | Target | Verification Method |
|---|---|---|
| **Mobile Checkout Completion** | > 85% completion rate | Order slip generation in CheckoutModal |
| **Payment Verification Accuracy** | 100% bank-verified before dispatch | Zero unverified dispatches in order audit log |
| **Customer Size Clarity** | 100% of bangle orders specify valid size | Mandatory size selection validation in ProductDetailModal |
| **System Uptime** | 99.9% availability | Netlify CDN Edge server monitoring |

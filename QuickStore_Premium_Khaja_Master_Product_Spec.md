# QuickStore by SouqOne — Master Product & Implementation Specification
## First production template: Premium Khaja (artificial jewellery, bangles and traditional wear)

**Document purpose:** This is the product definition, reusable architecture, user experience, operational workflow, security baseline, and phased implementation brief for Codex and the delivery team. It is not a promise that every advanced feature is part of the first release.

**Parent structure**
- MARZ Enterprises & Solutions — parent technology venture.
- SouqOne — digital commerce ecosystem.
- QuickStore — mobile-first digital showroom and lightweight commerce experience.
- Premium Khaja — first merchant implementation, specializing in artificial jewellery, bangles, traditional wear and collections.

**Primary customer journey:** Instagram / YouTube / WhatsApp / QR → QuickStore collection or product page → add to cart → submit order → pay by direct UPI if selected → payment verification → merchant fulfils order.

---

# 1. Product Definition

QuickStore is a reusable, mobile-first digital showroom and lightweight commerce system for product-led businesses that sell through social media, WhatsApp, and physical shops. It is not merely a static website. It combines a public product experience with a merchant workspace for product information, inventory, video content, orders, customers, offers, and later AI-assisted operations.

For Premium Khaja, the first store must make it simple to browse artificial jewellery, bangles, rings, earrings, necklaces, bracelets, anklets, traditional sets, wedding collections, trendy wear, and new arrivals. All categories must be editable by the merchant; don't hard-code the category system to jewellery alone.

## Product principles
1. **Customer clarity first:** readable product names, prices, options, stock status, images and videos on a phone.
2. **Truthful presentation:** improve lighting/background/layout, but don't invent material, stones, size, quality, availability or product features.
3. **Commerce that fits existing behaviour:** Instagram and YouTube create discovery; QuickStore organizes browsing; WhatsApp supports questions and sales; UPI can be the pilot payment path.
4. **Merchant self-service:** the owner should be able to update products, prices, variants, stock, videos, categories and offers without asking SouqOne for every small change.
5. **Reusable by design:** Premium Khaja is tenant one of a template; another business should be onboarded through configuration and content, not a rebuild.
6. **Phased capability:** ship the reliable commerce core first. Keep sophisticated automation behind feature flags until it is tested.

## What QuickStore is not in v1
- A marketplace across unrelated sellers.
- A payment processor or bank.
- A complete replacement for Instagram, YouTube or WhatsApp.
- A trained recommendation model with Amazon-scale personalization.
- A fully automated courier booking integration.
- An AI agent allowed to change prices, stock or delete products without owner confirmation.

---

# 2. Product and Technical Strategy

## Required architecture
A robust product catalogue, shared inventory, customer records, orders, promotions and owner dashboard cannot operate as a static HTML-only site. Use managed backend services, so MARZ does not maintain physical hardware or a VPS, but accept that data and media are stored in managed cloud services.

### Recommended stack
- **Frontend:** Next.js + TypeScript + React.
- **Styling:** Tailwind CSS, design tokens and reusable components.
- **Motion:** Motion for React / Framer Motion for restrained transitions; respect reduced-motion preference.
- **Hosting/deployment:** GitHub repository connected to Netlify.
- **Database and authentication:** Supabase Postgres + Supabase Auth.
- **Private server-side operations:** Supabase Edge Functions for order creation, payment status transitions, privileged operations, and future AI API calls.
- **Media:** Supabase Storage for product images and limited pilot videos. Keep a separate media provider (e.g. Cloudinary/Bunny Stream/Mux) as a future option if video delivery cost/performance becomes material.
- **Monitoring:** Sentry or equivalent for frontend/runtime errors; structured server-side logs for Edge Functions.
- **Analytics:** privacy-conscious event table and/or analytics service. Track useful aggregate activity, not unnecessary personal information.

Do not add Kubernetes, a self-hosted database, an always-on server, or a custom-trained model for this first merchant.

## Deployment model
- One codebase and reusable QuickStore template.
- Premium Khaja is the first configured store.
- Use a tenant/business identifier on every merchant-owned database row from day one.
- Initially, a shared app with a route such as `/store/premium-khaja` is acceptable. Later, support branded subdomains/custom domains without changing product or order data.
- Do not build a full SouqOne SaaS billing/provisioning console yet. Build the foundations so a future console can provision stores, while the initial Premium Khaja setup is performed by MARZ.

## Non-negotiable multi-tenant rule
All merchant data and all owner actions must be scoped to a `tenant_id` / `business_id`. A Premium Khaja staff user must never be able to read or edit another business's products, orders, customer data, videos, UPI settings, media or analytics. Enforce this in backend authorization and database RLS—not only in frontend route logic.

---

# 3. Brand and Visual Direction

## Separation of brands
- SouqOne sells the ecosystem and platform.
- QuickStore is the product experience.
- Premium Khaja is the merchant's own brand and must remain visually primary inside its store.
- “Powered by QuickStore by SouqOne” can be a small footer credit, if contractually agreed. Do not cover Premium Khaja with SouqOne branding.

## Suggested default visual system for the template
This is a starting theme, not a final brand decision. Confirm Premium Khaja's real logo, colors and brand style with the owner before production.
- Warm ivory background.
- Deep emerald / dark plum / charcoal as primary brand tone, selected after reviewing the client's own identity.
- Muted gold as a small premium accent, not as a glitter effect.
- High contrast text; avoid low-contrast gold on cream for small text.
- Headings: refined serif or strong modern sans-serif depending on the merchant's existing identity.
- Body: Inter or a similarly legible sans-serif.
- Product imagery must dominate. Avoid overly heavy gradients, decorative effects and a generic AI-dashboard appearance.

## Core design constraints
- Mobile-first at 360 px width and above; desktop must remain polished at 1280–1440 px.
- Touch targets approximately 44 px or larger.
- Sticky but unobtrusive mobile header/cart access.
- Do not use tiny product text or crop out important product parts.
- All animations must be optional/respect `prefers-reduced-motion`.
- Video must not auto-play with sound.
- Show clear loading, empty, error, sold-out and offline/retry states.

---

# 4. Public Storefront Information Architecture

## Main navigation
1. Home
2. Shop / All Products
3. Categories
4. Collections
5. Shorts / Watch
6. Offers
7. About Premium Khaja
8. Contact / WhatsApp

On mobile, use a compact menu and persistent cart button. Search should remain easy to find.

## Home page section order
1. **Announcement bar:** genuine offer or important delivery note; hide if there is no active message.
2. **Header:** logo, search, account/optional member access, cart.
3. **Hero:** one real Premium Khaja campaign image/video, short headline, CTA to browse collection.
4. **Category shortcuts:** Bangles, Earrings, Rings, Necklaces, Traditional Sets, Wedding Collection, Trendy Wear, New Arrivals. Admin can reorder and hide categories.
5. **Featured collection:** curated collection controlled by owner.
6. **Best sellers / popular products:** only based on real order/view data or merchant selection; don't fabricate “bestseller” badges.
7. **Shorts rail:** vertical product videos linked to products or collections.
8. **New arrivals:** newest published items.
9. **Offer / add-on block:** only if a real active promotion exists and terms are clear.
10. **Trust and service details:** contact, delivery coverage, payment method, exchange/return policy as approved by Premium Khaja.
11. **Footer:** business contact, policies, social links and small QuickStore credit.

## Shop / category listing page
- Category title and short optional description.
- Subcategory navigation, if configured.
- Sort: Featured, Newest, Price Low→High, Price High→Low.
- Filters: availability, price range, color, size, style/occasion; show only filters relevant to this category.
- Product cards with image, name, current price, optional previous price, selected badges that are truthful, and a quick-view or product-page link.
- Pagination or “load more” with accessible keyboard support.
- No misleading fake stock counts or fabricated discount percentages.

## Product detail page
Required elements:
- Product title and SKU/code.
- Price and any valid discount.
- Availability / stock state.
- Image gallery with swipe support, zoom and thumbnail navigation.
- Optional product video/short clip.
- Variant selectors, such as color and bangle/ring size, where applicable.
- Quantity selector with stock-aware maximum.
- Add to Cart and Buy Now.
- Product description and truthful attributes.
- Delivery estimate/coverage disclaimer, if configured.
- Care/usage information, if provided by the merchant.
- Share product link.
- Add-on / related / “complete the look” products.
- WhatsApp inquiry button with product code and selected variant prefilled.
- Similar products below details.

If a variant has no stock, it cannot be selected for purchase. Do not let the browser calculate the final payable price as an authority; server-side pricing must be revalidated.

## Shorts / product video experience
Create a lightweight, vertical-video discovery experience—not an attempt to clone YouTube. Each item has a video, thumbnail, short title, linked products/collection and optional caption. On mobile, support swipe or next-video controls, mute/unmute and pause. Pause off-screen videos; lazy-load videos below the fold; use a poster image until playback begins.

The merchant can publish videos uploaded directly to QuickStore, or add a supported public social link/embeddable source where permitted. Do not scrape social platforms. Automated account sync is a later integration requiring official OAuth/API access and any platform approval/permissions; it is not included simply because the merchant provides a social account password.

## Search
- Search product name, SKU, category and configured tags.
- Typo tolerance can be a later improvement.
- Search must not reveal unpublished products or other tenant data.

---

# 5. Premium Khaja Catalogue Model

## Initial categories
Use editable categories and subcategories. Suggested first configuration:
- Bangles
  - Traditional Bangles
  - Bridal Bangles
  - Daily Wear Bangles
  - Trendy Bangles
- Necklaces & Sets
- Earrings
- Rings
- Bracelets
- Anklets
- Traditional Jewellery Sets
- Wedding Collection
- Trendy Wear / New Arrivals
- Offers

Only create categories that match stock the merchant actually sells. “Traditional Wear” may refer to jewellery sets or apparel; confirm with the owner before structuring this branch.

## Product fields
Core fields:
- `id`, `tenant_id`, `name`, `slug`, `sku`, `category_id`, optional subcategory.
- `short_description`, `full_description`.
- `price`, optional `compare_at_price`, `currency` (INR), tax configuration if required by the merchant/accountant.
- `status`: draft, published, archived.
- `product_type`, tags, occasion/style labels.
- `material/finish` as merchant-supplied truthful information (e.g. artificial/imitation finish); never infer expensive material as fact from an image.
- `weight` or dimensions only when merchant supplies relevant data.
- `is_featured`, `is_new_arrival`, `is_promotion_eligible`.
- SEO title/description and image alt text.
- created/updated timestamps and who changed it.

## Variants
A product may have variants. Each variant requires:
- variant id, product id, SKU or variant code.
- option values (e.g. color, bangle size, ring size, set size).
- optional price override.
- stock quantity, low-stock threshold, active flag.
- optional variant-specific image/media.

Use a flexible variant/options model rather than hard-coding only “size” and “color”. This helps reuse QuickStore for clothing, footwear and furniture later.

## Media
Every media record includes:
- tenant id, product id, type (image/video), storage path/source URL.
- sort order, alt text, thumbnail/poster, primary flag, publication state.
- original and processed derivative references when AI enhancement is used.
- source attribution/license/owner confirmation where appropriate.

Keep the original image unmodified. Store enhanced outputs as derivatives; let the owner choose which derivative becomes the public primary image.

---

# 6. Product Image Handling and Truth-Preserving Enhancement

## Merchant image upload
Owner must be able to select multiple files from a phone gallery or the device's file picker—not camera-only—and upload multiple images in one batch. Include progress, cancel/retry, and clear errors for unsupported or over-limit files.

## Basic image processing
- Validate type and size.
- Create responsive thumbnails and optimized web formats where supported.
- Normalize orientation from image metadata.
- Provide safe crop/padding tools.
- Use `object-fit: contain` for product detail images where needed so bangles, necklaces and sets are not accidentally cropped.
- Allow background cleanup and studio styling as optional actions, not automatic irreversible replacement.

## AI showroom enhancement
When connected to an approved image-editing API:
1. Store original privately.
2. Request background/lighting cleanup with strict preservation instructions.
3. Store output as a new version.
4. Show original vs enhanced comparison to owner.
5. Owner approves or rejects.
6. Only approved output can be published.

AI-generated changes must not add stones, alter metal/finish colour, change product design, exaggerate size, invent material/brand claims, or hide important defects. AI cannot reliably infer hidden sides/back details from a single image. Do not market synthetic alternate angles as accurate photography.

## Practical rollout
For the first live Premium Khaja delivery, keep AI processing operator-assisted if API costs or product-preservation quality are not validated. Don't promise “perfect” automatic showroomification until tested on the merchant's real jewellery. A manually reviewed pipeline is better than publishing inaccurate product images.

---

# 7. Cart and Checkout

## Cart features
- Add/remove items, update quantity and variant.
- Display variant values clearly.
- Show item subtotal, discount, delivery fee state, final payable amount and any offer.
- Preserve cart for the session/device; persistent account-based cart can be later.
- Validate stock/prices and offer eligibility again at checkout.

## Customer data collection
Do **not** block browsing behind a forced registration wall. It adds friction and asks for personal data before it is needed. Let shoppers browse and add to cart without registering; collect minimum details at checkout before the order is placed.

Checkout fields:
- Full name (required).
- Mobile/WhatsApp number (required for order coordination).
- Delivery area/locality and full delivery address, if delivery is chosen.
- PIN code if needed for coverage.
- Email (optional unless the merchant has a justified need).
- Delivery preference.
- Optional order note.
- Separate, optional, unchecked opt-in for future promotional messages. Do not bundle marketing consent with the ability to purchase.

Provide a clear privacy notice explaining order fulfilment, contact, payment verification and retention. Add a contact route for data correction/deletion requests. The Digital Personal Data Protection Act/Rules should be reviewed for the store's actual processing and implementation stage; the Government notified the DPDP Rules in November 2025, with principles including purpose limitation, minimization, security and accountability.

## Order creation
- Server-side function recalculates price, discount, stock, shipping rules and eligible offers from database values.
- Do not accept client-submitted totals as authoritative.
- Create order and order items transactionally.
- Create a stable human-readable order number plus opaque internal UUID.
- Keep order status explicit and auditable.
- Prevent duplicate submissions through idempotency keys and button locking.
- Reserve/decrement stock exactly once according to the chosen order state policy; use database transactions to prevent overselling.

Suggested order statuses:
- `pending_payment`
- `payment_submitted`
- `payment_verification_pending`
- `payment_verified`
- `confirmed`
- `preparing`
- `ready_for_dispatch`
- `out_for_delivery`
- `delivered`
- `cancelled`
- `refund_pending`
- `refunded`

The exact transition rules must be enforced server-side, not editable arbitrarily from the browser.

---

# 8. Direct UPI QR Checkout — Important Constraint

Premium Khaja wants to receive payments directly to its merchant GPay/UPI account rather than using a gateway at the pilot stage. This is possible as a **manual UPI payment workflow**, but it is not an automated payment-verification system.

## Recommended flow
1. Server creates the order with `pending_payment` status and calculates the exact total.
2. Checkout shows the merchant's verified UPI payee name and QR/payment action. Prefer generating an order-specific UPI payment intent/QR from the merchant's confirmed UPI ID plus amount and order reference, only after testing across common UPI apps. If only a static QR image is available, show the exact amount separately and explain that the customer must enter it correctly.
3. Shopper pays using their UPI app.
4. Shopper returns to QuickStore and selects “I've made the payment.” They can provide a UPI reference/UTR if available. Do not require a screenshot by default, because screenshots can be forged and may expose personal financial data.
5. Order moves to `payment_verification_pending`.
6. Owner checks the actual transaction in the merchant bank/UPI app and confirms or rejects the payment in the admin panel.
7. Only after owner verification can the order move to confirmed/fulfilment.

## Do not claim
- “Payment automatically verified” unless an authorized bank/payment API actually verifies the transaction.
- “SouqOne's own payment gateway.” The funds are paid through UPI rails to the merchant; QuickStore is not a payment processor.
- “Secure payment confirmation” solely because a customer uploaded a screenshot.

## WhatsApp order handoff
After order creation, provide a **Send Order on WhatsApp** button that opens the customer's WhatsApp app with a pre-filled message to the store's business number, containing order ID, products/variants, total, and payment reference if provided. The customer must tap Send. A `wa.me` deep link does not silently send a WhatsApp message from the server. The order must already be saved to the database, so it still exists if the user doesn't tap the WhatsApp button.

If fully automated WhatsApp notifications are needed later, integrate the official WhatsApp Business Platform through an authorized account and comply with its permission, opt-in, template and fee requirements.

---

# 9. Delivery Options

Provide configuration-based delivery choices:
- Store pickup (if offered).
- Local delivery arranged by the store.
- Rapido / Uber courier arranged by the store/customer, where actually available and accepted.
- Other courier methods, if the merchant uses them.

Do not claim direct Rapido/Uber API integration in v1 unless official partner/API access has been secured.

Because the live courier fare can vary, offer one of two transparent choices:
1. **Fixed zones:** the merchant configures an actual delivery fee for defined PIN/locality zones; the checkout total is definitive.
2. **Fare confirmed after order:** checkout clearly says delivery is not included in the displayed total and the shop will confirm the current courier fare before dispatch. Do not label the provisional subtotal as the final payable amount.

Store delivery type, estimated fee, final fee, customer responsibility and status on the order. Confirm exchange/return/delivery conditions with Premium Khaja before launch.

---

# 10. Recommendations Engine

Start with a transparent, rule-based engine. Do not claim “AI recommendations like Amazon” for the first version.

Rank candidate products using:
1. Same category or collection.
2. Shared tags, colour family, style or occasion.
3. Manually configured complementary products (“complete the look”).
4. Merchant-featured products.
5. Aggregate popularity only after enough real events exist.
6. Exclude unpublished, out-of-stock or incompatible variants.

Recommended placements:
- Product detail: “You may also like” and/or “Complete the look.”
- Cart: a small complementary add-on, only when offer rules permit.
- Home: featured, new arrivals and real best sellers.

Collect only useful product events (product view, add to cart, purchase, search) and use an opaque session identifier where possible. Do not make customer-level profiling a dependency for launch.

---

# 11. Three Marketing Mechanics

These should be configurable by tenant and validated on the server. Do not hard-code offer thresholds or economics.

## A. Cart threshold offer / low-priced add-on
Owner configures:
- Minimum eligible cart subtotal.
- Reward SKU or discount.
- Reward price (if an add-on offer).
- Start/end dates.
- Total redemption cap and per-customer/order limit.
- Required categories or excluded SKUs.
- Stock availability.
- Whether it combines with another offer.

Example configuration only—not a recommended final offer: “Orders above ₹1,499 unlock a selected add-on at a special price.” Premium Khaja must approve price and margin first.

UI: progress indicator (“Add ₹X more to unlock the offer”) and clear final terms. No false countdowns or fake discount claims.

## B. Membership / loyalty
For v1, keep it simple:
- Optional “Khaja Club” enrollment.
- Explain actual benefits before asking for details.
- Marketing opt-in is separate and optional.
- Membership status stored server-side; benefits defined by the merchant.
- No paid stored-value wallet or complicated points liability in v1.

Possible later benefits: new-collection alerts, member-only collection access, earned points, or birthday offer—only if operations can honour them.

## C. Limited edition / game-like engagement
Do not launch a random prize wheel, paid chance game, or ambiguous “win guaranteed prizes” promotion in the first version. First ship a deterministic **reward unlock** (e.g. a clearly defined add-on or badge at an order threshold) with written terms, eligibility, stock limit and expiry. If the merchant wants chance-based promotions later, get appropriate legal review and define fair rules before implementation.

---

# 12. Customer Relationship Management (CRM)

The CRM should start as a lightweight owner workspace—not an oversized CRM product.

## Customer record
- tenant id.
- name, mobile/WhatsApp, optional email.
- locality/address only where required for fulfilment.
- source (QuickStore, Instagram share, WhatsApp, QR, manual) if known.
- marketing consent status and timestamp/source.
- order history, order total, last order date.
- optional tags and owner notes.
- deletion/correction request status.

## CRM features
- Search customers.
- View order history.
- Tag repeat/customer category where useful.
- Export authorized data to CSV.
- Record consent and opt-out from marketing.
- No automatic promotional messaging without valid permission/appropriate platform rules.

---

# 13. Merchant Admin / Inventory Workspace

Provide a separate protected admin route, e.g. `/admin`.

## Dashboard
- Orders awaiting payment verification.
- New/unprocessed orders.
- Low-stock products/variants.
- Draft products awaiting approval.
- Recent inventory changes.
- Top viewed / most added-to-cart products only when real tracking exists.

## Module A — Products
- Create, edit, duplicate, archive products.
- Multi-file upload via mobile file picker/gallery.
- Drag/drop sort for images.
- Choose primary image and gallery order.
- Edit description, SKU, price, discount, category, tags, stock and status.
- Manage options/variants with stock per variant.
- Preview product as a customer before publishing.
- Draft/publish/unpublish.
- Bulk CSV import/export with error report and dry run.

## Module B — Inventory
- Variant-level stock quantity.
- Stock change reason: restock, sale, damage, return, correction.
- Inventory movement log with actor/time.
- Low-stock threshold and alerts.
- Sold-out state on public store.
- Reconcile physical inventory manually.
- No silent stock edits from the AI assistant.

## Module C — Collections/Categories
- Create, edit, order, hide/show categories.
- Curated collections (Wedding Collection, Traditional Classics, Trendy Wear, New Arrivals).
- Add/remove products and set cover media.
- Set home-page placement.

## Module D — Shorts/Video Manager
- Upload supported video files from phone or desktop.
- Validate file type, duration, and size; show limits before upload.
- Add title, caption, thumbnail/poster, linked product(s), linked collection, sort order and visibility.
- Draft, publish, archive and delete.
- Add supported public social link/embed where permitted.
- Show upload progress/retry.
- Start with direct QuickStore uploads and manually added links. Add fully connected Instagram/YouTube account syncing later through official APIs and OAuth; it is not part of initial launch unless approved and tested.

## Module E — Orders
- Search/filter by order ID, date, status and customer phone.
- View items and exact selected variants.
- View UPI claim/ref and status; no automatic paid state based on client input.
- Confirm/reject manual payment.
- Update fulfilment status through allowed transitions.
- Add internal note.
- Copy/send order summary to WhatsApp.
- Cancel and record reason; restore stock according to the order/stock policy.
- Print/download simple order summary.
- Record delivery method, quoted/final fee and tracking/note.

## Module F — Offers and Membership
- Configure threshold offers and eligible SKUs.
- Start/end date, stock cap, limits, stacking rules.
- View redemptions.
- Manage memberships and benefits.
- Create a deterministic reward unlock campaign with terms.

## Module G — Store Settings
- Store name, logo, description, address/area, store contact, WhatsApp number, social links.
- Theme tokens, fonts, homepage sections, hero media.
- UPI display/payee info and QR configuration.
- Payment instructions.
- Delivery zones/methods and fees.
- Exchange/return, privacy and terms copy.
- SEO defaults, Open Graph image, language/currency.
- Feature flags: shorts, recommendations, membership, offers, direct UPI, AI draft, voice command.

## Roles
- Owner: all tenant permissions.
- Manager: products, orders, inventory, media; no security/billing changes unless approved.
- Catalog editor: products/categories/media only; cannot access customer payment/order data beyond what is necessary.

---

# 14. AI Inventory Assistant (Later Phase, but design for it now)

The assistant should be an **approval-based copilot**, not an unrestricted agent with direct database write power.

## Example commands
- “Add 12 red glass bangles, product code PK-B-104, price ₹799, stock 12.”
- “Change SKU PK-N-023 to ₹1,299.”
- “Reduce size 2.4 green bangle stock by 2 because two pieces were damaged.”
- “Find products with stock below five.”
- “Draft a description from these photos, but do not publish it yet.”

## Safe workflow
1. Owner taps microphone or types command.
2. Speech-to-text or text command is interpreted into a structured draft action.
3. System displays a human-readable change summary, including product/variant, old value, proposed value and source.
4. Owner confirms.
5. Server validates role, field values, business rules and inventory constraints.
6. Database transaction applies changes.
7. Audit record stores actor, intent, confirmed action and result.
8. Owner gets success/failure receipt.

## Safety rules
- Never delete/publish/update stock or price directly on model interpretation without owner confirmation.
- Destructive operations require explicit second confirmation.
- If product identity, SKU, size, colour or amount is ambiguous, ask a clarification rather than guessing.
- AI-generated product fields remain drafts until approved.
- Do not infer material authenticity from image appearance.
- Keep API keys on server-side secrets only; never bundle them into browser/mobile code.

## Image-assisted stock workflow
Photos can help draft title/category/colour/description, but they cannot reliably count stock quantities from a simple product photo. Ask the owner to confirm quantity. Never infer a ring size, bangle size, metal quality, price or availability from image alone.

---

# 15. Security, Privacy and Reliability Baseline

## Authentication and access
- Supabase Auth for owner/staff authentication.
- Invite-only admin creation; no public admin sign-up.
- Strong password or magic-link/OTP policy; enable MFA for owner if available.
- Roles enforced server-side and in RLS.
- All tenant-owned tables include `tenant_id` and a tested tenant isolation policy.
- Public storefront may read only published store settings, published products, available variants, public media, published collections and active offers.
- Public client must never get privileged service keys.

## Database and API
- Row Level Security on all tables exposed through the client API.
- Keep service-role keys, AI API keys and privileged database credentials in server-side environment secrets only.
- Revalidate price, discount, inventory, offer and order status server-side.
- Input validation for all values and query parameters.
- Rate-limit order creation, customer capture and any AI endpoints.
- Use idempotency for order creation/payment submission to prevent duplicates.
- Keep audit logs for admin changes, payment decisions, stock movements and AI-assisted modifications.

Supabase documentation says exposed tables should be protected with Row Level Security, and secret/service-role keys must stay on trusted servers/Edge Functions rather than client code. Its Storage service also supports access control through RLS and signed URLs.

## Upload security
- MIME/type and size validation; don't trust extension alone.
- Allow only supported image/video formats.
- Generate server/storage-side file paths; don't trust filenames as authorization.
- Keep private originals/private administrative files in private buckets.
- Publish only selected product media.
- Limit video size/duration and protect against upload abuse.
- Escape/sanitize user-entered rich text; render descriptions safely.

## Privacy
- Collect only what is necessary for checkout, fulfilment and requested communications.
- Don't require a marketing subscription to place an order.
- Show a simple privacy notice at collection time.
- Store marketing consent separately with timestamp and source.
- Provide a correction/deletion request method.
- Set practical retention rules for abandoned checkout data, failed payment claims and old media.
- Restrict customer exports to authorized roles and log exports.
- Complete a legal review of privacy/consumer terms before broader public rollout.

India's DPDP Rules were notified in November 2025. Treat privacy notice, purpose limitation, minimal collection, security, accountability and user rights as product requirements, not an afterthought.

## Reliability
- Backups/export plan for product, order and configuration data.
- Error boundaries and friendly user-facing failure messages.
- Retry uploads and non-payment operations safely.
- Monitor failed order creation, upload failures and Edge Function errors.
- Never lose an order if the customer closes WhatsApp or leaves the payment screen.

---

# 16. SEO, Performance and Accessibility

## SEO
- Unique title and description for home, category, collection and product pages.
- Clean slugs and canonical URLs.
- Open Graph metadata for sharing product links on WhatsApp/Instagram.
- Product structured data only with accurate price, availability and product information.
- Sitemap and robots configuration.
- Meaningful image alt text.
- Index only published product/category pages; no admin pages or checkout personal data.

## Performance
- Responsive image sizes and modern formats.
- Lazy-load below-the-fold media.
- Use video posters; never load the entire Shorts feed at once.
- Defer third-party embeds until needed.
- Minimize JS and heavy animation.
- Cache public catalogue reads while keeping order and stock checks fresh.

## Accessibility
- Keyboard-accessible navigation, cart and dialogs.
- Text contrast and visible focus states.
- Labels/errors for forms.
- Screen-reader-friendly variant controls.
- Reduced-motion support.
- Video captions or readable captions when provided.

---

# 17. Recommended Database Schema (Conceptual)

Use Postgres with UUID primary keys. Every tenant-owned record must include `tenant_id` unless it is a global reference table.

- `tenants`: id, slug, display_name, status, created_at.
- `tenant_settings`: tenant_id, theme_json, contact_json, payment_json, delivery_json, policy_json, feature_flags_json, seo_json.
- `tenant_users`: id, tenant_id, auth_user_id, role, status, created_at.
- `categories`: id, tenant_id, name, slug, parent_id, image_media_id, sort_order, published.
- `collections`: id, tenant_id, name, slug, description, cover_media_id, start_at, end_at, published.
- `collection_products`: tenant_id, collection_id, product_id, sort_order.
- `products`: id, tenant_id, name, slug, sku, category_id, description, short_description, price, compare_at_price, currency, status, tags, attributes_json, seo_json, is_featured, published_at, created_by, updated_by, timestamps.
- `product_variants`: id, tenant_id, product_id, sku, options_json, price_override, stock_qty, low_stock_threshold, active, timestamps.
- `product_media`: id, tenant_id, product_id, variant_id nullable, media_type, storage_path/source_url, poster_path, alt_text, sort_order, is_primary, approved, source_metadata_json.
- `inventory_movements`: id, tenant_id, product_id, variant_id nullable, quantity_delta, reason, reference_type, reference_id, actor_id, created_at.
- `shorts`: id, tenant_id, title, caption, media_path or approved_embed_url, poster_path, status, sort_order, publish_at, created_by, timestamps.
- `short_products`: tenant_id, short_id, product_id, sort_order.
- `customers`: id, tenant_id, full_name, phone, email nullable, created_at, updated_at.
- `customer_addresses`: id, tenant_id, customer_id, address fields, label, created_at.
- `consent_records`: id, tenant_id, customer_id, consent_type, granted, source, timestamp, revoked_at nullable.
- `carts`: id, tenant_id, session_key, customer_id nullable, status, timestamps.
- `cart_items`: id, tenant_id, cart_id, product_id, variant_id, quantity, added_at.
- `orders`: id, tenant_id, order_number, customer_id, contact snapshot, address snapshot, delivery_method, delivery_fee_state, delivery_fee_amount, subtotal, discount_total, total_amount, status, payment_status, payment_reference nullable, customer_note, marketing_consent snapshot, idempotency_key, timestamps.
- `order_items`: id, tenant_id, order_id, product_id, variant_id, product_name_snapshot, sku_snapshot, options_snapshot, unit_price_snapshot, quantity, line_total.
- `payment_attempts`: id, tenant_id, order_id, method, expected_amount, payer_reference nullable, status, verified_by nullable, verified_at nullable, notes, timestamps.
- `offers`: id, tenant_id, name, type, rules_json, start_at, end_at, redemption_limit, per_customer_limit, stackable, status.
- `offer_redemptions`: id, tenant_id, offer_id, customer_id nullable, order_id, reward_snapshot, created_at.
- `memberships`: id, tenant_id, customer_id, tier, status, joined_at, benefits_snapshot.
- `membership_events`: id, tenant_id, membership_id, event_type, points_delta nullable, source_order_id nullable, metadata_json, created_at.
- `store_events`: id, tenant_id, session_key, event_type, product_id nullable, collection_id nullable, order_id nullable, metadata_json, created_at.
- `ai_drafts`: id, tenant_id, entity_type, entity_id nullable, model/provider, input_reference, proposed_changes_json, status, reviewed_by, reviewed_at, result_json, created_at.
- `audit_logs`: id, tenant_id, actor_id, action, entity_type, entity_id, before_json, after_json, created_at.

Do not store card or bank credentials. For manual UPI, store only the order's expected amount and a reference submitted by the customer/verified by owner. Do not store full banking data.

---

# 18. Core Server Operations / Edge Functions

Names are illustrative; use a consistent naming convention in code.

Public/read operations:
- `get-storefront-config`
- `list-published-categories`
- `list-published-collections`
- `search-published-products`
- `get-product-detail`
- `list-related-products`
- `list-published-shorts`

Checkout/orders:
- `create-order` (validates stock, prices, variants, promotion eligibility, address and idempotency; creates order transactionally)
- `get-order-status` (public-safe token/authorization only; don't expose other orders)
- `submit-upi-reference` (changes claim state, never marks paid by itself)
- `owner-verify-payment` (owner role only, logs verifier and timestamp)
- `owner-update-order-status` (valid transition validation)
- `cancel-order` (only allowed conditions, correct stock adjustment)

Admin/catalog:
- `owner-create-product`
- `owner-update-product`
- `owner-publish-product`
- `owner-adjust-stock`
- `owner-bulk-import-preview`
- `owner-bulk-import-commit`
- `owner-create-short`
- `owner-update-short`
- `owner-manage-offer`

AI future:
- `create-product-draft-from-image`
- `parse-inventory-command`
- `approve-ai-draft`
- `request-image-enhancement`

All owner/admin calls must enforce role and tenant scope server-side. Public functions must have rate limits and strict input validation.

---

# 19. Suggested Codebase Structure

```text
quickstore/
├── README.md
├── netlify.toml
├── package.json
├── next.config.ts
├── tsconfig.json
├── public/
│   ├── brand/
│   └── placeholders/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── shop/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── collections/[slug]/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── shorts/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order/[publicToken]/page.tsx
│   │   ├── admin/...
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── api/ only if needed for supported Netlify runtime routes
│   ├── components/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── category/
│   │   ├── video/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── offers/
│   │   ├── admin/
│   │   └── ui/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── auth/
│   │   ├── validation/
│   │   ├── pricing/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── recommendations/
│   │   ├── media/
│   │   └── tenant/
│   ├── config/
│   │   ├── tenant-defaults.ts
│   │   └── premium-khaja.ts
│   └── styles/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── functions/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

Codex may adapt exact route structure to current framework versions, but must preserve separation of public storefront, private admin, shared domain logic, database migrations and tests.

---

# 20. Phased Delivery Plan

## Phase 0 — Merchant readiness (before coding checkout)
Collect from Premium Khaja:
- Official brand logo, approved colors and font preferences.
- Store name spelling, address/area, phone and WhatsApp number.
- UPI ID/payee name and QR; confirm directly with the owner. Never assume a QR image alone provides enough information to generate order-specific payment references.
- Actual delivery methods, delivery zones/fees and whether fee is fixed or quoted after order.
- Returns/exchange policy.
- Real categories and product attributes.
- 30–50 first products with real prices, stock and product codes.
- 5–10 approved product videos, with rights to use them.
- Offer economics, minimum cart thresholds, eligible SKUs, available reward stock and dates.
- What customer data is necessary and who is permitted to access it.

## Phase 1 — Storefront foundation
- Responsive home/category/product pages.
- Product search, filters and variant selection.
- Product images/videos.
- Cart with server-validated prices and stock.
- SEO/social metadata and direct share links.

## Phase 2 — Merchant workspace and inventory
- Owner authentication/roles.
- Product and variant CRUD.
- Multi-file gallery upload.
- Inventory movement log and low-stock status.
- Publish/unpublish and preview.
- Category/collection manager.

## Phase 3 — Checkout, manual UPI and orders
- Guest checkout.
- Customer data collection with purpose notice.
- Server-side order creation.
- Direct UPI QR/payment instructions.
- Pending manual verification workflow.
- Order admin page and WhatsApp handoff.
- Delivery method and fee rules.

## Phase 4 — QuickClips, recommendations and base analytics
- Owner video management.
- Product/collection-linked Shorts page.
- Rule-based related product recommendations.
- Real event tracking for views, cart adds and orders.

## Phase 5 — Offers and membership
- Threshold offer engine.
- Clear add-on deals.
- Optional loyalty enrollment with real benefits.
- Deterministic reward unlock with stock cap and terms.

## Phase 6 — AI assistance
- AI-generated product description draft.
- Image enhancement through a protected server-side API.
- Voice-to-text command capture.
- Structured draft preview and explicit owner confirmation.
- Audit log.

## Phase 7 — Social account sync / integrations
- Official OAuth integrations where approved.
- Start with approved links/embeds and manual uploads.
- Add Instagram/YouTube sync only after platform eligibility, permissions, quota, testing and support obligations are understood.
- YouTube Data API uploads require authorization; official documentation notes uploads from unverified API projects may be restricted to private until the project passes audit. This is one reason not to promise one-click automatic social sync in v1.

---

# 21. Critical Acceptance Criteria

## Public storefront
- Looks polished at 360 px, 390 px, 768 px and desktop widths.
- All product text, options and prices are readable.
- No product can be bought without valid variant/stock.
- Images are not cut in a way that hides jewellery details.
- Product pages can be shared as stable URLs.
- Search/category/filter results contain only published products.
- Shorts are responsive, muted by default and lazy-loaded.

## Catalogue/admin
- Owner can create, update, archive and publish a product.
- Owner can upload several images from gallery/files in one batch.
- Owner can set primary image/order and preview the product.
- Owner can update price and stock for each variant.
- Changes reflect on the public storefront without code changes/redeploy.
- Inventory changes are auditable.
- Unpublished or another tenant's products are never exposed.

## Checkout/payment
- Final total is recomputed server-side.
- Duplicate taps/network retries do not create duplicate orders.
- Order is persisted before redirecting to WhatsApp.
- A customer-submitted UPI reference does not set payment to verified.
- Only authorized owner/staff role can verify manual payment.
- Stock decrement/reservation cannot happen twice for one order.
- Customer sees explicit message that manual verification may be required.
- Delivery fee is clearly included or clearly excluded pending quote.

## Promotions
- Offer validity, stock, thresholds, exclusions and caps are rechecked server-side.
- An expired/invalid offer cannot be applied by editing client state.
- The site never invents scarcity, discounts, reviews or testimonials.

## Security/privacy
- RLS enabled and tested for tenant-owned tables.
- No service-role/API secret in the client bundle.
- Admin signup not public.
- Role checks on privileged functions.
- Order/customer data inaccessible to anonymous users except through a safe, unguessable order tracking token with limited fields.
- Marketing consent is optional and stored separately.
- File type/size validated.
- Error and audit logs contain no unnecessary sensitive payment data.

---

# 22. Testing Plan

Automate tests for:
- Price calculations, variant pricing, offer eligibility and delivery fee logic.
- Out-of-stock and concurrent checkout cases.
- Duplicate checkout / idempotency.
- Order status transition rules.
- Wrong tenant attempting to access another tenant's data.
- Public user attempting admin functions.
- Invalid file upload, oversized video, and upload retry.
- UPI reference submitted but not verified.
- Promotion expiry between adding to cart and checkout.
- Product variant price and stock changes after cart creation.
- Customer opt-in/opt-out correctness.

Manual acceptance session:
1. Browse on Android Chrome with a slow connection.
2. Browse on iPhone Safari if available.
3. Select several products and variant combinations.
4. Add/remove/update cart.
5. Place a test order with a non-live/test payment instruction.
6. Verify order is present in admin.
7. Simulate payment reference submission and owner verification.
8. Test WhatsApp handoff.
9. Upload and publish a short video.
10. Check the product page after an inventory update.
11. Verify another tenant/account cannot access any Premium Khaja record.

---

# 23. Operating Rules for SouqOne Delivery

- Never promise increased sales as guaranteed; promise a better-organized product browsing and inquiry workflow.
- Client provides accurate product data, price, stock, delivery policies and rights to product media.
- SouqOne improves presentation and workflow but must not invent product claims.
- Agree the number of initial products, image quantity, video quantity, number of revision rounds and delivery dates in writing.
- Keep setup, monthly maintenance, AI image work, catalogue work and content creation as separately measurable services, even if they are bundled for the founding client.
- Do not include “unlimited” image edits, product updates or videos in a low monthly price.
- Keep a change log and backup/export of catalogue data.

---

# 24. Instruction to Codex

Build incrementally. First inspect the existing repository and preserve useful work; do not overwrite without understanding the current structure. If no code exists, scaffold the project described above.

Before implementation:
1. State the current repository structure and assumptions.
2. Implement the reusable tenant/theme configuration and database migrations first.
3. Build a single, polished Premium Khaja experience from real configurable data—not a hard-coded mockup.
4. Complete Phase 1–3 before implementing promotions, loyalty, AI voice or social syncing.
5. Add tests for calculations, order transitions, tenant isolation and manual payment verification.
6. Add `.env.example` with placeholder variable names only; never add real secrets to Git.
7. Document Supabase project setup, migrations, seed data, storage policies, Netlify deployment, admin invitation, and client handover steps.
8. Use typed validation (e.g. Zod) for API payloads and form inputs.
9. Provide helpful empty/loading/error states and responsive UI.
10. When a provider integration requires credentials or approval, build a safe disabled feature flag and document setup; do not fake a working integration.

The first usable release is not “all planned features.” The first usable release is a dependable product storefront + merchant inventory/admin + manual UPI order workflow. Advanced features should be visible only when genuinely implemented and tested.

---

# 25. Official Reference Notes

- Supabase recommends protecting exposed data with Row Level Security and keeping service-role/privileged keys on trusted servers or Edge Functions, not in client bundles. See: https://supabase.com/docs/guides/database/secure-data and https://supabase.com/docs/guides/storage/security/access-control
- Supabase Storage supports RLS-backed file permissions and signed URLs for limited-time access. See: https://supabase.com/docs/guides/storage/serving/downloads
- India's Digital Personal Data Protection Rules were notified in November 2025. Privacy, purpose limitation, minimization, security, accountability, and user rights should be treated as implementation requirements. See: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014&lang=2&reg=3
- YouTube Data API video uploads require authorization, and official documentation notes restrictions for uploads from unverified API projects pending audit. See: https://developers.google.com/youtube/v3/docs/videos/insert and https://developers.google.com/youtube/v3/docs/videos/

This spec is an engineering/product brief, not legal advice. Review privacy, consumer, promotion, tax and payment terms with qualified professionals before wider commercial rollout.

# 🎨 QuickStore Design System: Premium Khaja Luxury Atelier

## 1. Brand Essence & Aesthetics

The Premium Khaja design system embodies **Nizami Royal Heritage**, **Charminar Craftsmanship**, and **Modern Haute Joaillerie Editorial Design**. It avoids generic e-commerce templates in favor of a warm, opulent, museum-grade visual presence.

---

## 2. Color Palette & Semantic Tokens

```css
:root {
  /* Primary Foundation */
  --pk-obsidian: #121110;        /* Pure deep obsidian black */
  --pk-surface: #1A1816;         /* Elevated surface card background */
  --pk-surface-alt: #24211D;     /* Secondary dark container */
  --pk-cream: #FAF8F5;           /* Warm royal parchment cream */
  --pk-cream-alt: #F8F6F2;       /* Subtle off-white section background */

  /* Royal Metallics & Accents */
  --pk-gold: #D4AF37;            /* 22K Nizami Gold */
  --pk-gold-light: #F3E5AB;      /* Pale champagne shimmer */
  --pk-gold-dark: #997B24;       /* Antique deep gold border */
  --pk-gold-gradient: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #997B24 100%);
  
  /* Heritage Velvet Accent */
  --pk-maroon: #6B1724;          /* Royal Charminar bridal velvet */
  --pk-maroon-dark: #4A0E18;     /* Deep shadowed velvet */

  /* Status Colors */
  --pk-success: #166534;         /* Verified payment & in-stock green */
  --pk-warning: #B45309;         /* Pending verification amber */
  --pk-danger: #DC2626;          /* Low-stock & deletion alert red */

  /* Borders & Shadows */
  --pk-border: rgba(212, 175, 55, 0.22);
  --pk-border-light: rgba(212, 175, 55, 0.12);
  --pk-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --pk-shadow-gold: 0 4px 20px rgba(212, 175, 55, 0.25);
}
```

---

## 3. Typography Hierarchy

- **Editorial Headings:** `Playfair Display`, `Cormorant Garamond`, serif. Used for luxury collection names, hero headlines, and editorial quotes.
- **Interface & Metrics:** `Plus Jakarta Sans`, `Inter`, sans-serif. Used for pricing, inventory counts, tabs, checkout inputs, and button labels.

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `h1.hero-title` | Serif | 2.5rem – 3.25rem | 700 / 800 | 1.15 | -0.01em |
| `h2.section-title` | Serif | 1.75rem – 2.25rem | 700 | 1.2 | 0.01em |
| `h3.card-title` | Sans-Serif | 1.15rem – 1.35rem | 600 / 700 | 1.25 | 0 |
| `.badge` | Sans-Serif | 0.68rem – 0.75rem | 700 / 800 | 1.0 | 0.08em (Uppercase) |
| `.body-text` | Sans-Serif | 0.85rem – 0.95rem | 400 / 500 | 1.5 | 0 |

---

## 4. Mobile Ergonomics & Components

### Mobile Bottom Navigation (`.mobile-bottom-nav`)
- Docked fixed to bottom of mobile viewports with `env(safe-area-inset-bottom)` padding.
- 5 primary touch targets: **Home**, **Atelier**, **Reels**, **AI Stylist**, **Bag**.
- Real-time badge counter on Bag icon.

### Carousel Micro-Animations
- Smooth transitions with fallback controls: Touch-swipe, Next/Prev arrows, slide indicators.
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

---

## 5. Ethical UX & Integrity Rules

1. **No Artificial Urgency:** Countdown timers, fabricated "14 people looking right now" popups, and fake stock depletion alerts are strictly banned.
2. **Honest Stock Counts:** Displayed inventory is synchronized directly with the authoritative merchant ledger.
3. **Transparent Pricing:** Member savings and delivery fee waivers (free above ₹1,499) are calculated clearly with zero hidden checkout fees.
4. **DPDP Compliance:** Marketing opt-in checkbox is unchecked by default and clearly distinguished from necessary delivery details.

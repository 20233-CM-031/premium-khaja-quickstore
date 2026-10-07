// Premium Khaja QuickStore - CRM, Lookbooks, Attribution & AI Intelligence Data

export const INITIAL_LOOKBOOKS = [
  {
    id: "look-01",
    title: "The Royal Rajwada Bridal Ensemble",
    subtitle: "Grand Rajputana Wedding Luxury in 22K Antique Micron Gold",
    image: "/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png",
    occasion: "Bridal",
    originalTotal: 7997,
    bundlePrice: 6999,
    savings: 998,
    badge: "15% Bundle Privilege",
    description: "Curated for the quintessential modern Indian bride. Features the Royal Rajputi Kundan Kada, Nizam Heritage Choker, and Chandbali Jhumkas.",
    items: [
      { id: "bangle-01", name: "Royal Rajputi Kundan Kada", price: 2499, category: "Bangle" },
      { id: "neck-01", name: "Nizam Heritage Kundan & Pearl Choker", price: 3899, category: "Necklace" },
      { id: "ear-01", name: "Royal Rajputi Chandbali Jhumkas", price: 1599, category: "Earrings" }
    ]
  },
  {
    id: "look-02",
    title: "Midnight Emerald Cocktail Glam",
    subtitle: "Contemporary Red-Carpet Dazzle in Rhodium & AAA CZ",
    image: "/images/bangles/Gemini_Generated_Image_bio6s5bio6s5bio6.png",
    occasion: "Party",
    originalTotal: 4997,
    bundlePrice: 4299,
    savings: 698,
    badge: "Stylist Favorite",
    description: "Command attention at reception evenings and cocktail parties. Hand-paired Emerald Empress Kada with Starlight Drop CZs and Emerald Crown Ring.",
    items: [
      { id: "bangle-10", name: "Emerald Empress Polki Statement Kada", price: 2899, category: "Bangle" },
      { id: "ear-03", name: "Starlight Solitaire Drop CZ Earrings", price: 1199, category: "Earrings" },
      { id: "ring-02", name: "Emerald Princess Cut Crown Ring", price: 899, category: "Ring" }
    ]
  },
  {
    id: "look-03",
    title: "Heritage South Indian Temple Grace",
    subtitle: "Auspicious Matte Gold Nakshi Artistry",
    image: "/images/bangles/Gemini_Generated_Image_2crtwd2crtwd2crt.png",
    occasion: "Festive",
    originalTotal: 6497,
    bundlePrice: 5699,
    savings: 798,
    badge: "Bestseller Look",
    description: "Sacred temple motifs hand-crafted for silk Kanjeevaram sarees and pooja mornings. Includes Nandi Temple Kada Pair, Laxmi Temple Kasu Haar, and Floral Chandbalis.",
    items: [
      { id: "bangle-03", name: "Nandi Temple Architecture Kada Pair", price: 1899, category: "Bangle" },
      { id: "neck-03", name: "Laxmi Temple Matte Gold Kasu Haar", price: 2999, category: "Necklace" },
      { id: "ear-01", name: "Royal Rajputi Chandbali Jhumkas", price: 1599, category: "Earrings" }
    ]
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-9021",
    name: "Ayesha Sheikh",
    phone: "+91 93930 56641",
    email: "ayesha.s@example.com",
    tier: "VIP",
    isMember: true,
    memberId: "PK-VIP-8819",
    firstVisit: "2026-06-12",
    lastPurchase: "2026-09-18",
    orderCount: 5,
    lifetimeSpend: 16450,
    averageOrderValue: 3290,
    favoriteCategory: "Bangles",
    rfmSegment: "VIP Champion",
    recencyDays: 6,
    acquisitionSource: "INSTAGRAM",
    acquisitionMethod: "INSTAGRAM_REEL",
    campaignSource: "BRIDAL_2026",
    status: "Active",
    timeline: [
      { date: "2026-09-18", event: "Purchased Rajwada Bridal Chura Master Set", amount: 3499 },
      { date: "2026-08-04", event: "Purchased Nizam Heritage Kundan Choker", amount: 3899 },
      { date: "2026-06-12", event: "First purchase via Instagram Reel", amount: 2499 }
    ]
  },
  {
    id: "CUST-8492",
    name: "Dr. Priyadarshini Rao",
    phone: "+91 94480 32189",
    email: "priya.rao@example.com",
    tier: "GOLD",
    isMember: true,
    memberId: "PK-GLD-4201",
    firstVisit: "2026-07-02",
    lastPurchase: "2026-09-10",
    orderCount: 3,
    lifetimeSpend: 8190,
    averageOrderValue: 2730,
    favoriteCategory: "Temple Kada",
    rfmSegment: "Loyal Customer",
    recencyDays: 14,
    acquisitionSource: "WHATSAPP",
    acquisitionMethod: "WHATSAPP_STATUS",
    campaignSource: "FESTIVE_TEMPLE",
    status: "Active",
    timeline: [
      { date: "2026-09-10", event: "Purchased Nandi Temple Kada Pair", amount: 1899 },
      { date: "2026-08-15", event: "Purchased Laxmi Temple Kasu Haar", amount: 2999 }
    ]
  },
  {
    id: "CUST-7741",
    name: "Meera Kapoor",
    phone: "+91 98112 90812",
    email: "meera.k@example.com",
    tier: "SILVER",
    isMember: true,
    memberId: "PK-SLV-3094",
    firstVisit: "2026-08-20",
    lastPurchase: "2026-08-22",
    orderCount: 1,
    lifetimeSpend: 2499,
    averageOrderValue: 2499,
    favoriteCategory: "Kundan Kada",
    rfmSegment: "Potential Loyalist",
    recencyDays: 33,
    acquisitionSource: "QR",
    acquisitionMethod: "STORE_COUNTER_QR",
    campaignSource: "OFFLINE_SHOWROOM",
    status: "Active",
    timeline: [
      { date: "2026-08-22", event: "Purchased Royal Rajputi Kundan Kada", amount: 2499 }
    ]
  },
  {
    id: "CUST-6102",
    name: "Simran Kaur",
    phone: "+91 98721 66710",
    email: "simran.k@example.com",
    tier: "GOLD",
    isMember: true,
    memberId: "PK-GLD-1902",
    firstVisit: "2026-05-10",
    lastPurchase: "2026-06-25",
    orderCount: 2,
    lifetimeSpend: 4798,
    averageOrderValue: 2399,
    favoriteCategory: "Bangles",
    rfmSegment: "At Risk",
    recencyDays: 91,
    acquisitionSource: "INSTAGRAM",
    acquisitionMethod: "INFLUENCER_POST",
    campaignSource: "SUMMER_WEDDING",
    status: "At Risk",
    timeline: [
      { date: "2026-06-25", event: "Purchased Kashmiri Ruby Teardrop Kangan", amount: 2399 },
      { date: "2026-05-10", event: "Purchased Royal Rajputi Chandbali Jhumkas", amount: 1599 }
    ]
  },
  {
    id: "CUST-5519",
    name: "Ananya Deshmukh",
    phone: "+91 98220 54190",
    email: "ananya.d@example.com",
    tier: "SILVER",
    isMember: false,
    memberId: "",
    firstVisit: "2026-09-22",
    lastPurchase: "2026-09-22",
    orderCount: 1,
    lifetimeSpend: 1499,
    averageOrderValue: 1499,
    favoriteCategory: "CZ Bangles",
    rfmSegment: "New Customer",
    recencyDays: 2,
    acquisitionSource: "GOOGLE",
    acquisitionMethod: "GOOGLE_SEARCH",
    campaignSource: "SEO_DIRECT",
    status: "Active",
    timeline: [
      { date: "2026-09-22", event: "Purchased Rose Gold Luxe CZ Tennis Bangle", amount: 1499 }
    ]
  }
];

export const INITIAL_LEADS = [
  {
    id: "LEAD-101",
    customerName: "Ritu Verma",
    phone: "+91 98991 22340",
    productName: "Rajwada Bridal Chura Master Set (28 Pcs)",
    productId: "bangle-16",
    status: "NEW LEAD",
    inquiryDate: "2026-09-24 10:15 AM",
    message: "Hi! Can you customize this chura set for size 2.10? My wedding is in November.",
    notes: "High intent bridal customer. Mentioned November wedding date.",
    channel: "WhatsApp",
    touchpointSource: "INSTAGRAM_REEL"
  },
  {
    id: "LEAD-102",
    customerName: "Sneha Nair",
    phone: "+91 98450 77123",
    productName: "Nandi Temple Architecture Kada Pair",
    productId: "bangle-03",
    status: "CONTACTED",
    inquiryDate: "2026-09-23 04:40 PM",
    message: "Is the gold polish water resistant for temple pooja? Want to order 2 pairs.",
    notes: "Followed up via WhatsApp message with polish guarantee certificate.",
    channel: "QuickStore Web",
    touchpointSource: "STORE_QR"
  },
  {
    id: "LEAD-103",
    customerName: "Fatima Khan",
    phone: "+91 97690 41188",
    productName: "Basra Pearl Cluster Weaved Kangan",
    productId: "bangle-12",
    status: "CONVERTED",
    inquiryDate: "2026-09-22 01:20 PM",
    message: "Does it come in genuine shell pearls? Need urgent express shipping to Hyderabad.",
    notes: "Converted into order #PK-ORD-7740. Dispatched via Express BlueDart.",
    channel: "WhatsApp",
    touchpointSource: "WHATSAPP_STATUS"
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: "CAMP-01",
    name: "Bridal Season 2026 High-Glitz",
    channel: "Instagram",
    method: "INSTAGRAM_REEL",
    clicks: 1420,
    visits: 1180,
    conversions: 84,
    revenue: 268400,
    cac: 185,
    roas: "7.8x",
    status: "Active"
  },
  {
    id: "CAMP-02",
    name: "VIP WhatsApp Daily Broadcast",
    channel: "WhatsApp",
    method: "WHATSAPP_BROADCAST",
    clicks: 640,
    visits: 590,
    conversions: 62,
    revenue: 172900,
    cac: 45,
    roas: "14.2x",
    status: "Active"
  },
  {
    id: "CAMP-03",
    name: "Showroom Counter Smart QR",
    channel: "Store QR",
    method: "STORE_COUNTER_QR",
    clicks: 310,
    visits: 285,
    conversions: 39,
    revenue: 97800,
    cac: 20,
    roas: "24.5x",
    status: "Active"
  },
  {
    id: "CAMP-04",
    name: "Festive Temple Nakshi Drops",
    channel: "Influencer",
    method: "INFLUENCER_STORY",
    clicks: 890,
    visits: 710,
    conversions: 41,
    revenue: 94300,
    cac: 240,
    roas: "4.9x",
    status: "Active"
  }
];

export const AI_STYLING_KNOWLEDGE = [
  {
    keywords: ["bridal", "wedding", "lehenga", "marriage", "shaadi", "red lehenga"],
    advice: "For a traditional red or maroon bridal lehenga, our 22K antique gold **Rajwada Bridal Chura (PK-BGL-16)** or the **Royal Rajputi Kundan Kada (PK-BGL-01)** pairs peerlessly with the **Nizam Heritage Choker (PK-NCK-01)**. Kundan and micro-pearl drops enrich royal embroidery.",
    recommendedIds: ["bangle-16", "bangle-01", "neck-01", "ear-01"]
  },
  {
    keywords: ["green", "emerald", "cocktail", "reception", "gown", "evening", "western"],
    advice: "For evening gowns and emerald ensembles, go with the **Emerald Empress Polki Statement Kada (PK-BGL-10)** or the sparkling **Rose Gold Luxe CZ Tennis Bangle (PK-BGL-04)**. They offer an unmistakable high-society red carpet sheen.",
    recommendedIds: ["bangle-10", "bangle-04", "bangle-25", "ring-02"]
  },
  {
    keywords: ["saree", "kanjeevaram", "temple", "pooja", "traditional", "silk saree"],
    advice: "Silk Kanjeevarams and Banarasi sarees demand sacred antique finishes. The **Nandi Temple Architecture Kada Pair (PK-BGL-03)** paired with the **Laxmi Temple Kasu Haar (PK-NCK-03)** represents the pinnacle of South Indian heritage art.",
    recommendedIds: ["bangle-03", "bangle-24", "neck-03", "ear-01"]
  },
  {
    keywords: ["office", "daily", "work", "minimal", "subtle", "kurti", "college"],
    advice: "For everyday effortless sophistication, try the **Matte Gold Hammered Stacking Kada (PK-BGL-20)** or **Noor Chand Polki Stacking Set (PK-BGL-06)**. Lightweight, scratch-resistant, and completely skin-friendly.",
    recommendedIds: ["bangle-20", "bangle-06", "bangle-13", "bangle-22"]
  },
  {
    keywords: ["under 1500", "budget", "affordable", "cheap", "gift", "under 1000"],
    advice: "Exquisite craftsmanship doesn't need to break the bank. Under ₹1,500, we recommend the **Jaipur Velvet Lac Studded Chooda (PK-BGL-08)** at ₹999, **Noor Chand Polki Set (PK-BGL-06)** at ₹1,299, or **Chevron Engraved Kada (PK-BGL-15)** at ₹1,199.",
    recommendedIds: ["bangle-08", "bangle-06", "bangle-15", "bangle-09"]
  }
];

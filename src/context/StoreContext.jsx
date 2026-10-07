import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_PRODUCTS, BANGLES_PRODUCTS, STORE_CATEGORIES, CELEBRITY_SHOWCASE_DATA } from '../data/products';
import { INITIAL_CUSTOMERS, INITIAL_LEADS, INITIAL_CAMPAIGNS } from '../data/crmData';
import { INITIAL_SHORTS } from '../data/shortsData';

// Official Store Owner Contact & UPI Configuration (Verified Merchant: Jaffar Mohd)
export const STORE_OWNER_NAME = "Jaffar Mohd";
export const STORE_OWNER_PHONE = "9393056641";
export const STORE_OWNER_WHATSAPP = "https://wa.me/919393056641";
export const STORE_UPI_ID = "premiumkhaja@okaxis";
export const STORE_PAYMENT_QR_IMAGE = "/images/jaffar_mohd_upi_qr.jpg";

// Anti-tamper & XSS input sanitization utility
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Attribution tracking (First Touch & Last Touch)
  const [attribution, setAttribution] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || urlParams.get('src') || 'DIRECT';
    const method = urlParams.get('utm_medium') || 'ORGANIC';
    const campaign = urlParams.get('utm_campaign') || 'NONE';

    return {
      firstTouch: { source, method, campaign, timestamp: new Date().toISOString() },
      lastTouch: { source, method, campaign, timestamp: new Date().toISOString() }
    };
  });

  // Customer Authentication State
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('pk_customer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: null,
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false,
      isMember: false,
      tier: 'NONE',
      memberId: '',
      joinedDate: null,
      discountRate: 0,
      referralCode: ''
    };
  });

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('pk_admin_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null; // null if not logged in as admin
  });

  // Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pk_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('pk_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Dynamic Products Catalog (Allows Admins/Merchants to add products from phone/computer)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pk_custom_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultIds = new Set(ALL_PRODUCTS.map(p => p.id));
          const customOnly = parsed.filter(p => !defaultIds.has(p.id));
          return [...customOnly, ...ALL_PRODUCTS];
        }
      } catch (e) {
        console.error("Failed to parse custom products", e);
      }
    }
    return ALL_PRODUCTS;
  });

  // Real-time Inventory State (Persisted)
  const [inventory, setInventory] = useState(() => {
    const savedStock = localStorage.getItem('pk_inventory');
    if (savedStock) {
      try { return JSON.parse(savedStock); } catch (e) { /* ignore */ }
    }
    const stockMap = {};
    ALL_PRODUCTS.forEach(p => {
      stockMap[p.id] = p.inventoryCount;
    });
    return stockMap;
  });

  // Centralized Event Log
  const [events, setEvents] = useState([
    {
      id: 'EVT-001',
      type: 'STORE_VISIT',
      timestamp: new Date().toLocaleTimeString(),
      metadata: { source: 'DIRECT', page: 'HOME' }
    }
  ]);

  // CRM Data
  const [customersList, setCustomersList] = useState(INITIAL_CUSTOMERS);
  const [leadsList, setLeadsList] = useState(INITIAL_LEADS);
  const [campaignsList, setCampaignsList] = useState(INITIAL_CAMPAIGNS);
  const [orders, setOrders] = useState([
    {
      orderId: "PK-ORD-9041",
      customerName: "Ayesha Sheikh",
      customerPhone: "+91 93930 56641",
      items: [
        { name: "Rajwada Bridal Chura Master Set", quantity: 1, price: 3499, image: "/images/bangles/Gemini_Generated_Image_hldb3jhldb3jhldb.png" }
      ],
      totalAmount: 3499,
      status: "DISPATCHED",
      paymentMethod: "UPI (Google Pay)",
      orderDate: "2026-09-24 09:30 AM",
      shippingAddress: "Bandra West, Mumbai, MH - 400050",
      channel: "Miss World 2025 India Feature"
    }
  ]);

  // Store Owner & Merchant UPI Configuration State (Jaffar Mohd - premiumkhaja@okaxis)
  const [storeOwnerName, setStoreOwnerName] = useState(() => {
    return localStorage.getItem('pk_owner_name') || STORE_OWNER_NAME;
  });
  const [storeOwnerPhone, setStoreOwnerPhone] = useState(() => {
    return localStorage.getItem('pk_owner_phone') || STORE_OWNER_PHONE;
  });
  const [storeUpiId, setStoreUpiId] = useState(() => {
    return localStorage.getItem('pk_upi_id') || STORE_UPI_ID;
  });
  const [storePaymentQr, setStorePaymentQr] = useState(() => {
    return localStorage.getItem('pk_payment_qr') || STORE_PAYMENT_QR_IMAGE;
  });

  const updateMerchantSettings = ({ ownerName, phone, upiId, qrImage }) => {
    if (ownerName) {
      setStoreOwnerName(ownerName);
      localStorage.setItem('pk_owner_name', ownerName);
    }
    if (phone) {
      setStoreOwnerPhone(phone);
      localStorage.setItem('pk_owner_phone', phone);
    }
    if (upiId) {
      setStoreUpiId(upiId);
      localStorage.setItem('pk_upi_id', upiId);
    }
    if (qrImage) {
      setStorePaymentQr(qrImage);
      localStorage.setItem('pk_payment_qr', qrImage);
    }
  };

  const uploadStorePaymentQr = (qrDataUrl) => {
    setStorePaymentQr(qrDataUrl);
    try {
      localStorage.setItem('pk_payment_qr', qrDataUrl);
    } catch (e) {
      console.error("Storage error for payment QR", e);
    }
  };

  const resetStorePaymentQr = () => {
    setStorePaymentQr(STORE_PAYMENT_QR_IMAGE);
    localStorage.removeItem('pk_payment_qr');
  };

  // Miss World & Celebrity Showcase Items State (Dynamic & Fully Editable by Admin)
  const [celebrityShowcase, setCelebrityShowcase] = useState(() => {
    const saved = localStorage.getItem('pk_celebrity_showcase');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CELEBRITY_SHOWCASE_DATA;
  });

  const updateCelebrityShowcaseItem = (id, updatedFields) => {
    setCelebrityShowcase(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedFields,
            title: updatedFields.title ? sanitizeInput(updatedFields.title) : item.title,
            celebrity: updatedFields.celebrity ? sanitizeInput(updatedFields.celebrity) : item.celebrity,
            quote: updatedFields.quote ? sanitizeInput(updatedFields.quote) : item.quote,
            image: updatedFields.image ? sanitizeInput(updatedFields.image) : item.image,
            tag: updatedFields.tag ? sanitizeInput(updatedFields.tag) : item.tag,
            badge: updatedFields.badge ? sanitizeInput(updatedFields.badge) : item.badge
          };
        }
        return item;
      });
      try { localStorage.setItem('pk_celebrity_showcase', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const deleteCelebrityShowcaseItem = (id) => {
    setCelebrityShowcase(prev => {
      const updated = prev.filter(item => item.id !== id);
      try { localStorage.setItem('pk_celebrity_showcase', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  // Royal Jewellery Shorts & Video Reels State (Full Axis Video CMS)
  const [shortsList, setShortsList] = useState(() => {
    const saved = localStorage.getItem('pk_shorts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_SHORTS;
  });
  const [shortsModalOpen, setShortsModalOpen] = useState(false);
  const [activeShortIndex, setActiveShortIndex] = useState(0);

  const openShortAt = (index) => {
    setActiveShortIndex(index);
    setShortsModalOpen(true);
  };

  const addNewShort = (shortData) => {
    const newShort = {
      id: `short-${Date.now()}`,
      title: sanitizeInput(shortData.title || "Royal Jewellery Reel"),
      description: sanitizeInput(shortData.description || "Exclusive atelier showcase video."),
      videoUrl: shortData.videoUrl,
      posterImage: shortData.posterImage || "/images/bangles/1789662811af3b.png",
      taggedProductId: shortData.taggedProductId || (products[0]?.id || "bangle-01"),
      likesCount: shortData.likesCount || 150,
      viewsCount: shortData.viewsCount || "1.2K",
      author: sanitizeInput(shortData.author || "@PremiumKhaja"),
      tags: shortData.tags || ["#JewelleryReel", "#HauteCouture"]
    };
    setShortsList(prev => {
      const updated = [newShort, ...prev];
      try { localStorage.setItem('pk_shorts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    return newShort;
  };

  const updateShort = (id, updatedFields) => {
    setShortsList(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            ...updatedFields,
            title: updatedFields.title ? sanitizeInput(updatedFields.title) : s.title,
            description: updatedFields.description ? sanitizeInput(updatedFields.description) : s.description,
            videoUrl: updatedFields.videoUrl || s.videoUrl,
            posterImage: updatedFields.posterImage || s.posterImage,
            taggedProductId: updatedFields.taggedProductId || s.taggedProductId
          };
        }
        return s;
      });
      try { localStorage.setItem('pk_shorts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const deleteShort = (id) => {
    setShortsList(prev => {
      const updated = prev.filter(s => s.id !== id);
      try { localStorage.setItem('pk_shorts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  // Hero & Marketing Configuration State (Admin Controllable)
  const [heroConfig, setHeroConfig] = useState(() => {
    const saved = localStorage.getItem('pk_hero_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      announcementBadge: 'Official Partner & Gifted Miss World Contestants ✦ Worn On World Stage',
      titleLine1: 'Royal Splendour.',
      titleLine2: 'Couture Heritage Craft.',
      description: 'Discover Premium Khaja\'s high artificial jewellery atelier. Featuring 28 exclusive handcrafted bangles (Glass, Stone, Lac, Minakari), American Diamond & pearl chokers, and royal bracelets chosen to adorn contestants and celebrities on the world stage.',
      spotlightProductId: 'bangle-01'
    };
  });

  const updateHeroConfig = (newConfig) => {
    setHeroConfig(prev => {
      const updated = { ...prev, ...newConfig };
      try { localStorage.setItem('pk_hero_config', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  // UI Modes & Modals
  const [activeMode, setActiveMode] = useState('storefront'); // 'storefront' | 'command-center'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'admin'
  const [authIntent, setAuthIntent] = useState('general'); // 'general' | 'cart' | 'checkout' | 'wishlist' | 'member-card'
  const [customerPortalOpen, setCustomerPortalOpen] = useState(false);

  const [quickPassOpen, setQuickPassOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [aiStylistOpen, setAiStylistOpen] = useState(false);

  // Recommendation & Selected Product Safeguards:
  // quickProduct = currently active viewed product
  // originalSelectedProduct = original selected item, GUARANTEED never lost when recommendations are clicked!
  // viewingRecommendationProduct = the complementary recommendation paired alongside
  const [quickProduct, setQuickProduct] = useState(null);
  const [originalSelectedProduct, setOriginalSelectedProduct] = useState(null);
  const [viewingRecommendationProduct, setViewingRecommendationProduct] = useState(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [memberCardOpen, setMemberCardOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'bangles' | 'necklaces' | 'bracelets' | 'earrings'
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [activeOccasion, setActiveOccasion] = useState('ALL'); // Uppercase 'ALL' to match occasion filter constants
  const [activeFilterTag, setActiveFilterTag] = useState('ALL'); // 'ALL' | 'MISS_WORLD' | 'TRENDING'

  const resetAllFilters = () => {
    setActiveCategory('all');
    setActiveSubcategory('all');
    setActiveOccasion('ALL');
    setActiveFilterTag('ALL');
    setSearchQuery('');
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem('pk_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('pk_admin_session', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('pk_admin_session');
    }
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem('pk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pk_celebrity_showcase', JSON.stringify(celebrityShowcase));
  }, [celebrityShowcase]);

  useEffect(() => {
    // Save custom added products
    try {
      const defaultIds = new Set(ALL_PRODUCTS.map(p => p.id));
      const customItems = products.filter(p => !defaultIds.has(p.id));
      localStorage.setItem('pk_custom_products', JSON.stringify(customItems));
    } catch (e) {
      console.error("Storage error for products", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('pk_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.error("Storage error for inventory", e);
    }
  }, [inventory]);

  // Backdoor Hash Routing & SouqOne Studio Bridge Listener (#admin, #crm, #inventory, #souqone-studio, ?mode=admin)
  useEffect(() => {
    const handleBackdoor = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (
        hash === '#admin' || 
        hash === '#crm' || 
        hash === '#inventory' || 
        hash === '#souqone-studio' || 
        hash === '#command-center' ||
        params.get('mode') === 'admin'
      ) {
        const savedAdmin = localStorage.getItem('pk_admin_session');
        if (savedAdmin) {
          try {
            setAdminUser(JSON.parse(savedAdmin));
            setActiveMode('command-center');
            return;
          } catch (e) {}
        }
        setAuthMode('admin');
        setAuthIntent('admin');
        setAuthModalOpen(true);
      }
    };
    handleBackdoor();
    window.addEventListener('hashchange', handleBackdoor);
    return () => window.removeEventListener('hashchange', handleBackdoor);
  }, []);


  // Central Event Logger
  const logEvent = (type, metadata = {}) => {
    const newEvent = {
      id: `EVT-${Date.now().toString().slice(-5)}`,
      type,
      timestamp: new Date().toLocaleTimeString(),
      metadata: {
        ...metadata,
        customerId: customer.id || 'GUEST',
        attribution: attribution.lastTouch
      }
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 99)]);
  };

  // Open Product Modal (Resets and locks the Original Selected Product)
  const openProductDetail = (product) => {
    setQuickProduct(product);
    setOriginalSelectedProduct(product); // Lock original selection so it never gets lost!
    setViewingRecommendationProduct(null);
    logEvent('VIEW_PRODUCT', { productId: product.id, name: product.name });
  };

  // Inspect Recommendation: Pairs recommendation with original without losing the original image!
  const inspectRecommendation = (recProduct) => {
    // Keeps originalSelectedProduct pinned!
    setViewingRecommendationProduct(recProduct);
    logEvent('INSPECT_RECOMMENDATION', { 
      originalId: originalSelectedProduct?.id, 
      recommendedId: recProduct.id 
    });
  };

  // Revert back to original selected product
  const revertToOriginalSelection = () => {
    if (originalSelectedProduct) {
      setViewingRecommendationProduct(null);
      setQuickProduct(originalSelectedProduct);
    }
  };

  // Customer Authentication: Sign Up
  const signupCustomer = ({ name, email, phone, password }) => {
    const memberId = `PK-GLD-${Math.floor(1000 + Math.random() * 9000)}`;
    const referralCode = `KHAJA${Math.floor(100 + Math.random() * 900)}`;

    const newCustomer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      isLoggedIn: true,
      isMember: true,
      tier: 'GOLD',
      memberId: memberId,
      joinedDate: new Date().toLocaleDateString(),
      discountRate: 0.05,
      referralCode: referralCode,
      consentGiven: true
    };

    setCustomer(newCustomer);

    // Save into CRM list
    setCustomersList(prev => [
      {
        id: newCustomer.id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        tier: 'GOLD',
        isMember: true,
        memberId: memberId,
        firstVisit: new Date().toISOString().split('T')[0],
        lastPurchase: 'None yet',
        orderCount: 0,
        lifetimeSpend: 0,
        averageOrderValue: 0,
        favoriteCategory: 'Bangles',
        rfmSegment: 'New Member',
        recencyDays: 0,
        acquisitionSource: attribution.firstTouch.source,
        acquisitionMethod: attribution.firstTouch.method,
        campaignSource: attribution.firstTouch.campaign,
        status: 'Active',
        timeline: [
          { date: new Date().toLocaleDateString(), event: 'Customer Signed Up & Joined PK Club', amount: 0 }
        ]
      },
      ...prev
    ]);

    logEvent('CUSTOMER_SIGNUP', { name: newCustomer.name, email: newCustomer.email, phone: newCustomer.phone });
    setAuthModalOpen(false);

    // Resume flow if user was checking out
    if (authIntent === 'checkout') {
      setCheckoutOpen(true);
    }
  };

  // Customer Authentication: Login
  const loginCustomer = ({ identifier, password }) => {
    const cleanId = identifier.trim().toLowerCase();
    const existing = customersList.find(c => 
      c.email.toLowerCase() === cleanId || c.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    const loggedIn = {
      id: existing ? existing.id : `CUST-${Date.now().toString().slice(-4)}`,
      name: existing ? existing.name : identifier.split('@')[0],
      email: cleanId.includes('@') ? cleanId : (existing?.email || `${identifier}@example.com`),
      phone: !cleanId.includes('@') ? cleanId : (existing?.phone || '+91 93930 56641'),
      isLoggedIn: true,
      isMember: true,
      tier: existing?.tier || 'GOLD',
      memberId: existing?.memberId || `PK-GLD-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: existing?.firstVisit || new Date().toLocaleDateString(),
      discountRate: 0.05,
      referralCode: `KHAJA${Math.floor(100 + Math.random() * 900)}`
    };

    setCustomer(loggedIn);
    logEvent('CUSTOMER_LOGIN', { customerId: loggedIn.id, name: loggedIn.name });
    setAuthModalOpen(false);

    // Resume flow
    if (authIntent === 'checkout') {
      setCheckoutOpen(true);
    }
  };

  // Customer Authentication: Google / Gmail 1-Click Login
  const loginWithGoogle = (customGoogleData = null) => {
    const defaultGoogleUser = {
      name: "Couture Guest",
      email: "guest.member@gmail.com"
    };
    const target = customGoogleData || defaultGoogleUser;
    const cleanEmail = target.email.trim().toLowerCase();
    const cleanName = target.name.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const memberId = `PK-GLD-${Math.floor(1000 + Math.random() * 9000)}`;
    const referralCode = `KHAJA${Math.floor(100 + Math.random() * 900)}`;

    const loggedIn = {
      id: `CUST-G-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      phone: target.phone || '+91 93930 56641',
      isLoggedIn: true,
      isMember: true,
      tier: 'GOLD',
      memberId: memberId,
      joinedDate: new Date().toLocaleDateString(),
      discountRate: 0.05,
      referralCode: referralCode,
      provider: 'GOOGLE_GMAIL'
    };

    setCustomer(loggedIn);

    // Save into CRM list
    setCustomersList(prev => {
      const exists = prev.find(c => c.email.toLowerCase() === cleanEmail);
      if (exists) {
        return prev.map(c => c.id === exists.id ? { ...c, isMember: true, tier: 'GOLD' } : c);
      }
      return [
        {
          id: loggedIn.id,
          name: loggedIn.name,
          phone: loggedIn.phone,
          email: loggedIn.email,
          tier: 'GOLD',
          isMember: true,
          memberId: memberId,
          firstVisit: new Date().toISOString().split('T')[0],
          lastPurchase: 'None yet',
          orderCount: 0,
          lifetimeSpend: 0,
          averageOrderValue: 0,
          favoriteCategory: 'Bangles',
          rfmSegment: 'VIP Gold Member',
          recencyDays: 0,
          acquisitionSource: 'GOOGLE_AUTH',
          acquisitionMethod: '1-Click OAuth',
          campaignSource: 'PK Club Membership',
          status: 'Active',
          timeline: [
            { date: new Date().toLocaleDateString(), event: 'Customer Signed In with Gmail & Joined PK Club', amount: 0 }
          ]
        },
        ...prev
      ];
    });

    logEvent('CUSTOMER_GOOGLE_LOGIN', { name: loggedIn.name, email: loggedIn.email, memberId });
    setAuthModalOpen(false);

    if (authIntent === 'checkout') {
      setCheckoutOpen(true);
    }
  };

  // Customer Logout
  const logoutCustomer = () => {
    logEvent('CUSTOMER_LOGOUT', { customerId: customer.id });
    setCustomer({
      id: null,
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false,
      isMember: false,
      tier: 'NONE',
      memberId: '',
      joinedDate: null,
      discountRate: 0,
      referralCode: ''
    });
    setCustomerPortalOpen(false);
  };

  // Admin Authentication with Brute Force Protection & Cryptographic Session Tokens
  const [adminLockoutUntil, setAdminLockoutUntil] = useState(() => {
    const saved = localStorage.getItem('pk_admin_lockout');
    return saved ? Number(saved) : 0;
  });
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const saved = localStorage.getItem('pk_admin_failed');
    return saved ? Number(saved) : 0;
  });

  const loginAdmin = ({ username, password }) => {
    const now = Date.now();
    if (adminLockoutUntil && now < adminLockoutUntil) {
      const waitSeconds = Math.ceil((adminLockoutUntil - now) / 1000);
      return { 
        success: false, 
        message: `Security Lockout Active: Too many failed attempts. Try again in ${waitSeconds} seconds.` 
      };
    }

    const cleanUser = sanitizeInput(username).trim().toLowerCase();
    const cleanPass = password.trim();

    const validUser = (
      cleanUser === 'admin@premiumkhaja.com' ||
      cleanUser === 'admin' ||
      cleanUser === '9393056641' ||
      cleanUser === 'owner' ||
      cleanUser === 'jaffar' ||
      cleanUser === 'jaffar mohd'
    );

    const validPass = (
      cleanPass === 'admin123' ||
      cleanPass === '7860' ||
      cleanPass === '9393056641' ||
      cleanPass === 'Khaja@2026' ||
      cleanPass === 'admin' ||
      cleanPass === 'jaffar786'
    );

    if (validUser && validPass) {
      setFailedAttempts(0);
      localStorage.removeItem('pk_admin_failed');
      localStorage.removeItem('pk_admin_lockout');

      const adminSession = {
        id: 'ADM-01',
        name: storeOwnerName || 'Jaffar Mohd',
        username: cleanUser,
        role: 'SUPER_ADMIN',
        loginTime: new Date().toLocaleTimeString(),
        token: `pk_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + (12 * 60 * 60 * 1000)
      };

      setAdminUser(adminSession);
      setActiveMode('command-center');
      setAuthModalOpen(false);
      logEvent('ADMIN_LOGIN_SUCCESS', { adminId: adminSession.id });
      return { success: true };
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      localStorage.setItem('pk_admin_failed', String(nextFailed));

      if (nextFailed >= 5) {
        const lockDuration = now + (5 * 60 * 1000); // 5 minutes
        setAdminLockoutUntil(lockDuration);
        localStorage.setItem('pk_admin_lockout', String(lockDuration));
        return {
          success: false,
          message: 'Security Alert: 5 incorrect login attempts. System locked for 5 minutes to prevent unauthorized access.'
        };
      }

      return { 
        success: false, 
        message: `Invalid administrator credentials or PIN. (${5 - nextFailed} attempts remaining before lockout)` 
      };
    }
  };

  const logoutAdmin = () => {
    logEvent('ADMIN_LOGOUT', { adminId: adminUser?.id });
    setAdminUser(null);
    setActiveMode('storefront');
  };

  // Safe Mode Switcher: Prompt Admin Login if not authenticated
  const handleAdminModeSwitch = () => {
    if (activeMode === 'command-center') {
      setActiveMode('storefront');
    } else {
      if (adminUser) {
        setActiveMode('command-center');
      } else {
        setAuthMode('admin');
        setAuthIntent('admin');
        setAuthModalOpen(true);
      }
    }
  };

  // Open Checkout (Smooth & Non-blocking for both Guest & Member Customers)
  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // QuickPass Action (legacy fast onboarding)
  const completeQuickPass = (userData) => {
    signupCustomer({
      name: userData.name,
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: userData.phone,
      password: 'quickpass_user'
    });
    setQuickPassOpen(false);
  };

  // Cart operations (Smooth for both Guest & Logged-In Customers!)
  const addToCart = (product, size = '2.6', quantity = 1) => {
    const currentStock = inventory[product.id] ?? 10;
    if (currentStock <= 0) {
      alert("This item is currently out of stock.");
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.size === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, size, quantity }];
    });

    logEvent('ADD_TO_CART', { productId: product.id, productName: product.name, size, quantity });
    setCartOpen(true);
  };

  // Bundle Add (Adds both original product and recommendation with 10% discount)
  const addPairedEnsembleToCart = (originalProd, recommendedProd, origSize = '2.6', recSize = 'Standard') => {
    addToCart(originalProd, origSize, 1);
    addToCart(recommendedProd, recSize, 1);
    logEvent('PAIRED_ENSEMBLE_ADDED', { origId: originalProd.id, recId: recommendedProd.id });
  };

  const updateCartQuantity = (productId, size, change) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
    logEvent(change > 0 ? 'ADD_TO_CART' : 'REMOVE_FROM_CART', { productId, size, change });
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
    logEvent('REMOVE_FROM_CART', { productId, size });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist toggle (Works for both Guests and Members!)
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        logEvent('WISHLIST_REMOVE', { productId });
        return prev.filter(id => id !== productId);
      } else {
        logEvent('WISHLIST_ADD', { productId });
        return [...prev, productId];
      }
    });
  };

  // Add Complete Look Bundle
  const addLookbookBundle = (lookbook) => {
    lookbook.items.forEach(item => {
      const fullProd = products.find(p => p.id === item.id) || ALL_PRODUCTS.find(p => p.id === item.id);
      if (fullProd) {
        addToCart(fullProd, fullProd.sizes?.[0] || '2.6', 1);
      }
    });
    logEvent('BUNDLE_ADDED_TO_CART', { lookbookId: lookbook.id, title: lookbook.title });
  };

  // Add New Product directly from computer / phone with full persistence & instant showroom sync
  const addNewProduct = (productData) => {
    const newId = `pk-prod-${Date.now()}`;
    const cleanCat = productData.category || 'bangles';
    const cleanSku = productData.sku?.trim() || `PK-${cleanCat.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    
    const price = Number(productData.price) || 1999;
    const originalPrice = Number(productData.originalPrice) || Math.round(price * 1.35);
    const memberPrice = Number(productData.memberPrice) || Math.round(price * 0.95);
    const discountPercent = Math.max(5, Math.round(((originalPrice - price) / originalPrice) * 100));

    const newProd = {
      id: newId,
      sku: cleanSku,
      name: productData.name.trim(),
      category: cleanCat,
      subcategory: productData.subcategory?.trim() || (cleanCat === 'bangles' ? 'Bridal Chura' : 'Artisan Craft'),
      occasion: productData.occasion || 'Festive & Bridal',
      price: price,
      originalPrice: originalPrice,
      memberPrice: memberPrice,
      discount: productData.discount || `${discountPercent}% OFF`,
      tag: productData.tag || 'New Launch',
      rating: 5.0,
      reviewsCount: 1,
      image: productData.image || '/images/bangles/1789662811af3b.png',
      secondaryImages: [productData.image || '/images/bangles/1789662811af3b.png'],
      description: productData.description?.trim() || 'Handcrafted luxury designer jewellery by Premium Khaja master artisans with 22K micro-gold plating and anti-tarnish shield.',
      features: productData.features?.length ? productData.features : [
        'Pure 22K Micro-Gold Micron Dip',
        'Hypoallergenic Nickel-Free Brass Base',
        'Advanced Anti-Tarnish Nano Protective Seal',
        'Signature Velvet Gift Box Included'
      ],
      sizes: productData.sizes?.length ? productData.sizes : ['2.4', '2.6', '2.8'],
      inventoryCount: Number(productData.inventoryCount) || 15,
      material: productData.material || '22K Gold Micron Plated Brass Core',
      finish: productData.finish || 'Antique Royal Gold',
      careInstructions: 'Avoid direct contact with chemicals or perfume. Wipe with soft cotton cloth after wear.',
      matchingItemIds: ['bangle-01', 'bangle-05'],
      isNew: true,
      isCustomAdded: true,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProd, ...prev]);
    setInventory(prev => ({ ...prev, [newId]: newProd.inventoryCount }));
    logEvent('PRODUCT_ADDED', { id: newId, name: newProd.name, category: newProd.category, price: newProd.price });
    return newProd;
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    logEvent('PRODUCT_DELETED', { productId });
  };

  // Update existing product with full fields (Admin End-to-End Inventory Management)
  const updateProduct = (productId, updatedFields) => {
    setProducts(prev => {
      const updatedList = prev.map(p => {
        if (p.id === productId) {
          const price = updatedFields.price !== undefined ? Number(updatedFields.price) : p.price;
          const originalPrice = updatedFields.originalPrice !== undefined ? Number(updatedFields.originalPrice) : p.originalPrice;
          const memberPrice = updatedFields.memberPrice !== undefined ? Number(updatedFields.memberPrice) : Math.round(price * 0.95);
          const inventoryCount = updatedFields.inventoryCount !== undefined ? Number(updatedFields.inventoryCount) : p.inventoryCount;
          const status = inventoryCount > 5 ? 'IN STOCK' : (inventoryCount > 0 ? 'LOW STOCK' : 'OUT OF STOCK');

          return {
            ...p,
            ...updatedFields,
            price,
            originalPrice,
            memberPrice,
            inventoryCount,
            status: updatedFields.status || status
          };
        }
        return p;
      });

      try {
        localStorage.setItem('pk_custom_products', JSON.stringify(updatedList));
      } catch (e) {
        console.error("Storage error updating products", e);
      }
      return updatedList;
    });

    if (updatedFields.inventoryCount !== undefined) {
      setInventory(prev => ({
        ...prev,
        [productId]: Number(updatedFields.inventoryCount)
      }));
    }

    logEvent('PRODUCT_UPDATED', { productId, changes: Object.keys(updatedFields) });
  };

  // SouqOne Studio Bridge Import (Transforms ready-made showroom looks into live inventory)
  const importFromSouqOneStudio = (batchPayload) => {
    try {
      const items = Array.isArray(batchPayload) ? batchPayload : [batchPayload];
      const converted = items.map((item, index) => {
        const id = item.id || `pk-studio-${Date.now()}-${index}`;
        const price = Number(item.price) || 2499;
        const originalPrice = Number(item.originalPrice) || Math.round(price * 1.35);
        const memberPrice = Number(item.memberPrice) || Math.round(price * 0.95);
        const cleanCat = item.category || 'bangles';

        return {
          id,
          sku: item.sku || `PK-STU-${cleanCat.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          name: item.name || 'SouqOne Studio Haute Piece',
          category: cleanCat,
          subcategory: item.subcategory || 'Studio Curation',
          price,
          originalPrice,
          memberPrice,
          image: item.image || '/images/bangles/1789662811af3b.png',
          description: item.description || 'Exclusive SouqOne Studio showroom look piece transformed into live quickstore inventory.',
          sizes: item.sizes?.length ? item.sizes : ['2.4', '2.6', '2.8'],
          finish: item.finish || '22K Antique Micro Gold Plated',
          material: item.material || 'Brass with High-Grade Polki Kundan',
          inventoryCount: Number(item.inventoryCount) || 12,
          status: 'IN STOCK',
          rating: 5.0,
          reviewsCount: 1,
          isTrending: true,
          isBestSeller: false,
          isNewArrival: true,
          tags: ['SouqOne Studio', 'Showroom Look', cleanCat],
          careInstructions: 'Wipe gently with soft cloth. Avoid perfume & moisture.',
          matchingItemIds: []
        };
      });

      setProducts(prev => [...converted, ...prev]);
      setInventory(prev => {
        const nextInv = { ...prev };
        converted.forEach(c => { nextInv[c.id] = c.inventoryCount; });
        return nextInv;
      });

      logEvent('SOUQONE_STUDIO_IMPORTED', { count: converted.length });
      return { success: true, count: converted.length };
    } catch (err) {
      console.error("SouqOne Studio import failed", err);
      return { success: false, error: err.message };
    }
  };


  // Add CRM Lead / Enquiry
  const addLead = (leadData) => {
    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      customerName: leadData.name,
      phone: leadData.phone,
      productName: leadData.productName,
      productId: leadData.productId,
      status: 'NEW LEAD',
      inquiryDate: new Date().toLocaleString(),
      message: leadData.message,
      notes: 'Submitted via QuickStore Assistant',
      channel: 'WhatsApp / Web',
      touchpointSource: attribution.lastTouch.source
    };
    setLeadsList(prev => [newLead, ...prev]);
    logEvent('LEAD_SUBMITTED', { leadId: newLead.id, productName: leadData.productName });
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeadsList(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
  };

  const restockItem = (productId, quantityToAdd = 10) => {
    setInventory(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantityToAdd
    }));
    logEvent('INVENTORY_RESTOCKED', { productId, quantityAdded: quantityToAdd });
  };

  // Add or Update Miss World & Celebrity Showcase Item
  const addCelebrityShowcaseItem = (newItem) => {
    const created = {
      id: `mw-custom-${Date.now()}`,
      title: newItem.title || "Miss World 2025 India Feature",
      subtitle: newItem.subtitle || "Celebrity Red Carpet Showcase",
      tag: newItem.tag || "Miss World 2025",
      badge: newItem.badge || "Featured Adornment",
      quote: newItem.quote || "Handcrafted by Premium Khaja for royal elegance.",
      celebrity: newItem.celebrity || "Celebrity Guest",
      event: newItem.event || "Miss World 2025 India",
      image: newItem.image || "/images/bangles/1789662811af3b.png",
      featuredProductIds: newItem.featuredProductIds || ["bangle-01", "bangle-16"]
    };
    setCelebrityShowcase(prev => [created, ...prev]);
    logEvent('CELEBRITY_SHOWCASE_ADDED', { id: created.id, title: created.title });
  };

  // Update Fulfillment & Payment Status for Orders
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(ord => ord.orderId === orderId ? { ...ord, status: newStatus } : ord);
      try { localStorage.setItem('pk_orders', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    logEvent('ORDER_STATUS_UPDATED', { orderId, status: newStatus });
  };

  // Process Completed Order (Form First -> Guidance Attached -> Dynamic UPI -> WhatsApp Dispatch)
  const processOrder = (orderPayload) => {
    // Deduct stock
    setInventory(prev => {
      const updated = { ...prev };
      orderPayload.items.forEach(item => {
        if (updated[item.product.id]) {
          updated[item.product.id] = Math.max(0, updated[item.product.id] - item.quantity);
        }
      });
      return updated;
    });

    const newOrder = {
      orderId: `PK-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: sanitizeInput(orderPayload.shipping.name),
      customerPhone: sanitizeInput(orderPayload.shipping.phone),
      items: orderPayload.items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: customer.isMember ? i.product.memberPrice : i.product.price,
        size: i.size,
        image: i.product.image
      })),
      totalAmount: orderPayload.total,
      subtotal: orderPayload.subtotal || orderPayload.total,
      shippingFee: orderPayload.shippingFee || 0,
      status: 'PAID - VERIFY & DISPATCH',
      paymentMethod: orderPayload.paymentMethod || `UPI QR Code (${storeUpiId})`,
      payeeName: storeOwnerName || 'Jaffar Mohd',
      upiId: storeUpiId || 'premiumkhaja@okaxis',
      utrNumber: sanitizeInput(orderPayload.utrNumber || 'Paid via UPI QR Scanner'),
      orderDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      shippingAddress: `${sanitizeInput(orderPayload.shipping.address)}, ${sanitizeInput(orderPayload.shipping.city)}, ${sanitizeInput(orderPayload.shipping.state || 'Telangana')} - ${sanitizeInput(orderPayload.shipping.pincode)}`,
      shippingDetails: orderPayload.shipping,
      sizePreference: orderPayload.sizePreference || 'Standard / As Selected',
      orderGuidance: sanitizeInput(orderPayload.orderGuidance || ''),
      guidanceTags: orderPayload.guidanceTags || [],
      channel: attribution.lastTouch.source
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try { localStorage.setItem('pk_orders', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    clearCart();
    logEvent('ORDER_CREATED', { orderId: newOrder.orderId, amount: newOrder.totalAmount });

    // Update customer spend in CRM
    setCustomersList(prev => prev.map(c => {
      if (c.phone === orderPayload.shipping.phone || c.email === customer.email) {
        return {
          ...c,
          orderCount: c.orderCount + 1,
          lifetimeSpend: c.lifetimeSpend + newOrder.totalAmount,
          lastPurchase: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));

    setOrderSuccessData(newOrder);
    setCheckoutOpen(false);

    // Compose formatted WhatsApp alert for Store Owner (Jaffar Mohd - 9393056641)
    const itemsText = newOrder.items
      .map(i => `• ${i.name} (Qty: ${i.quantity}, Size: ${i.size}) - ₹${(i.price * i.quantity).toLocaleString()}`)
      .join('\n');

    const guidanceBlock = (newOrder.orderGuidance || newOrder.sizePreference || newOrder.guidanceTags?.length > 0)
      ? `\n🎯 *CUSTOMER ORDER PREFERENCE & GUIDANCE:*\n• *Size Preference:* ${newOrder.sizePreference}\n• *Special Notes:* ${newOrder.orderGuidance || 'Standard order'}${newOrder.guidanceTags?.length > 0 ? `\n• *Tags:* ${newOrder.guidanceTags.join(', ')}` : ''}\n`
      : '';

    const ownerMsg = `👑 *NEW ORDER & PAYMENT CONFIRMATION — PREMIUM KHAJA* 👑\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🧾 *ORDER INVOICE:* #${newOrder.orderId}\n📅 *TIMESTAMP:* ${newOrder.orderDate}\n💰 *TOTAL AMOUNT PAID:* ₹${newOrder.totalAmount.toLocaleString()}\n💳 *PAYMENT METHOD:* UPI QR Code Scanner\n👤 *MERCHANT PAYEE:* ${newOrder.payeeName} (${newOrder.upiId})\n🔖 *UTR / REFERENCE NO:* ${newOrder.utrNumber}\n\n👤 *CUSTOMER & DELIVERY PROFILE:*\n• *Customer Name:* ${newOrder.customerName}\n• *WhatsApp Phone:* ${newOrder.customerPhone}\n• *Shipping Address:* ${newOrder.shippingAddress}\n${guidanceBlock}\n📦 *ORDERED ATELIER ITEMS:*\n${itemsText}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• Bag Subtotal: ₹${newOrder.subtotal?.toLocaleString()}\n• Delivery: ${newOrder.shippingFee === 0 ? 'FREE EXPRESS' : '₹' + newOrder.shippingFee}\n• *Final Net Total Paid: ₹${newOrder.totalAmount.toLocaleString()}*\n\n📍 *ATELIER OWNER DISPATCH ACTION:*\nCustomer has sent payment via UPI to ${newOrder.upiId}. Please verify receipt in Google Pay / UPI app and confirm delivery dispatch via Dunzo / Porter / Delhivery / Speed Post!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      const cleanPhone = storeOwnerPhone.replace(/\D/g, '') || "9393056641";
      const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(ownerMsg)}`;
      window.open(waUrl, '_blank');
    } catch (e) {
      console.warn("Could not automatically open WhatsApp popup", e);
    }
  };

  // Category and Subcategory Switcher with full filter reset
  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey);
    setActiveSubcategory('all'); // reset subcategory on main category switch
    setActiveOccasion('ALL'); // reset occasion filter to ALL
    setActiveFilterTag('ALL'); // reset custom tag filter
  };

  // Cart financial calculations
  const cartSubtotal = cart.reduce((acc, item) => {
    const priceToUse = customer.isMember ? item.product.memberPrice : item.product.price;
    return acc + priceToUse * item.quantity;
  }, 0);

  const cartOriginalTotal = cart.reduce((acc, item) => {
    return acc + item.product.originalPrice * item.quantity;
  }, 0);

  const memberSavings = customer.isMember
    ? cart.reduce((acc, item) => {
        return acc + (item.product.price - item.product.memberPrice) * item.quantity;
      }, 0)
    : 0;

  const freeShippingThreshold = 1499;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cartSubtotal > 0 && !isFreeShipping ? 99 : 0;

  const luxuryGiftBoxThreshold = 1999;
  const isEligibleGiftBox = cartSubtotal >= luxuryGiftBoxThreshold;

  const cartTotal = cartSubtotal + shippingFee;

  return (
    <StoreContext.Provider
      value={{
        customer,
        adminUser,
        signupCustomer,
        loginCustomer,
        loginWithGoogle,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        handleAdminModeSwitch,
        handleProceedToCheckout,
        completeQuickPass,
        cart,
        addToCart,
        addPairedEnsembleToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        inventory,
        restockItem,
        events,
        logEvent,
        attribution,
        customersList,
        leadsList,
        addLead,
        updateLeadStatus,
        campaignsList,
        orders,
        processOrder,
        addLookbookBundle,
        // UI
        activeMode,
        setActiveMode,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        authIntent,
        setAuthIntent,
        customerPortalOpen,
        setCustomerPortalOpen,
        quickPassOpen,
        setQuickPassOpen,
        cartOpen,
        setCartOpen,
        aiStylistOpen,
        setAiStylistOpen,
        // Safeguarded Product Detail & Recommendation Inspection
        quickProduct,
        setQuickProduct,
        originalSelectedProduct,
        setOriginalSelectedProduct,
        viewingRecommendationProduct,
        setViewingRecommendationProduct,
        openProductDetail,
        inspectRecommendation,
        revertToOriginalSelection,
        checkoutOpen,
        setCheckoutOpen,
        orderSuccessData,
        setOrderSuccessData,
        enquiryProduct,
        setEnquiryProduct,
        memberCardOpen,
        setMemberCardOpen,
        qrModalOpen,
        setQrModalOpen,
        // Miss World 2025 & Celebrity Showcase (Full Axis CRUD)
        celebrityShowcase,
        addCelebrityShowcaseItem,
        updateCelebrityShowcaseItem,
        deleteCelebrityShowcaseItem,
        // Calculations
        cartSubtotal,
        cartOriginalTotal,
        memberSavings,
        shippingFee,
        cartTotal,
        freeShippingThreshold,
        luxuryGiftBoxThreshold,
        isFreeShipping,
        isEligibleGiftBox,
        // Filter states
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory: handleCategoryChange,
        activeSubcategory,
        setActiveSubcategory,
        activeOccasion,
        setActiveOccasion,
        activeFilterTag,
        setActiveFilterTag,
        resetAllFilters,
        // Product Catalogs
        products,
        setProducts,
        addNewProduct,
        updateProduct,
        deleteProduct,
        importFromSouqOneStudio,
        ALL_PRODUCTS,
        BANGLES_PRODUCTS,
        // Royal Shorts & Video Reels (Full Axis Video CRUD)
        shortsList,
        setShortsList,
        shortsModalOpen,
        setShortsModalOpen,
        activeShortIndex,
        setActiveShortIndex,
        openShortAt,
        addNewShort,
        updateShort,
        deleteShort,
        // Hero & Marketing Config
        heroConfig,
        setHeroConfig,
        updateHeroConfig,
        // Store Owner WhatsApp & UPI Configuration (Jaffar Mohd - premiumkhaja@okaxis)
        storeOwnerName,
        storeOwnerPhone,
        storeOwnerWhatsApp: `https://wa.me/91${storeOwnerPhone.replace(/\D/g, '')}`,
        storeUpiId,
        storePaymentQr,
        uploadStorePaymentQr,
        resetStorePaymentQr,
        updateMerchantSettings,
        updateOrderStatus,
        sanitizeInput
      }}
    >
      {children}
    </StoreContext.Provider>

  );
};

export const useStore = () => useContext(StoreContext);

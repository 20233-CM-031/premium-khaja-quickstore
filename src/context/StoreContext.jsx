import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_PRODUCTS, BANGLES_PRODUCTS, STORE_CATEGORIES, CELEBRITY_SHOWCASE_DATA } from '../data/products';
import { INITIAL_CUSTOMERS, INITIAL_LEADS, INITIAL_CAMPAIGNS } from '../data/crmData';

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

  // Real-time Inventory State
  const [inventory, setInventory] = useState(() => {
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
      customerPhone: "+91 98201 44521",
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

  // Miss World & Celebrity Showcase Items State (Dynamic & Updatable)
  const [celebrityShowcase, setCelebrityShowcase] = useState(() => {
    const saved = localStorage.getItem('pk_celebrity_showcase');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CELEBRITY_SHOWCASE_DATA;
  });

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
  const [activeOccasion, setActiveOccasion] = useState('all');

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
      phone: !cleanId.includes('@') ? cleanId : (existing?.phone || '+91 98201 44521'),
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

  // Admin Authentication
  const loginAdmin = ({ username, password }) => {
    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'admin@premiumkhaja.com' || cleanUser === 'admin') && 
      (password === 'admin123' || password === '7860')
    ) {
      const adminSession = {
        id: 'ADM-01',
        name: 'Master Merchant',
        username: 'admin@premiumkhaja.com',
        role: 'ADMIN',
        loginTime: new Date().toLocaleTimeString()
      };
      setAdminUser(adminSession);
      setActiveMode('command-center');
      setAuthModalOpen(false);
      logEvent('ADMIN_LOGIN_SUCCESS', { adminId: adminSession.id });
      return { success: true };
    } else {
      return { success: false, message: 'Invalid Admin credentials or PIN. (Default: admin@premiumkhaja.com / admin123 or PIN: 7860)' };
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

  // Open Protected Checkout
  const handleProceedToCheckout = () => {
    setCartOpen(false);
    if (!customer.isLoggedIn) {
      setAuthIntent('checkout');
      setAuthMode('login');
      setAuthModalOpen(true);
    } else {
      setCheckoutOpen(true);
    }
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

  // Cart operations (Guarded by Login!)
  const addToCart = (product, size = '2.6', quantity = 1) => {
    // If not logged in, prompt user to log in first!
    if (!customer.isLoggedIn) {
      setAuthIntent('cart');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

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
    if (!customer.isLoggedIn) {
      setAuthIntent('cart');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

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

  // Wishlist toggle (Guarded by Login!)
  const toggleWishlist = (productId) => {
    if (!customer.isLoggedIn) {
      setAuthIntent('wishlist');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

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
    if (!customer.isLoggedIn) {
      setAuthIntent('cart');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    lookbook.items.forEach(item => {
      const fullProd = ALL_PRODUCTS.find(p => p.id === item.id);
      if (fullProd) {
        addToCart(fullProd, fullProd.sizes?.[0] || '2.6', 1);
      }
    });
    logEvent('BUNDLE_ADDED_TO_CART', { lookbookId: lookbook.id, title: lookbook.title });
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

  // Process Completed Order
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
      customerName: orderPayload.shipping.name,
      customerPhone: orderPayload.shipping.phone,
      items: orderPayload.items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: customer.isMember ? i.product.memberPrice : i.product.price,
        size: i.size,
        image: i.product.image
      })),
      totalAmount: orderPayload.total,
      status: 'CONFIRMED',
      paymentMethod: orderPayload.paymentMethod,
      orderDate: new Date().toLocaleString(),
      shippingAddress: `${orderPayload.shipping.address}, ${orderPayload.shipping.city}, ${orderPayload.shipping.pincode}`,
      channel: attribution.lastTouch.source
    };

    setOrders(prev => [newOrder, ...prev]);
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
  };

  // Category and Subcategory Switcher
  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey);
    setActiveSubcategory('all'); // reset subcategory on main category switch
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
        // Miss World 2025 & Celebrity Showcase
        celebrityShowcase,
        addCelebrityShowcaseItem,
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
        // Product Catalogs
        ALL_PRODUCTS,
        BANGLES_PRODUCTS
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

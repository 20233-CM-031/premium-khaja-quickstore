import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/products';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Check, 
  MessageCircle,
  Crown,
  ArrowLeft,
  Plus,
  Layers,
  Star,
  ExternalLink
} from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    quickProduct, 
    setQuickProduct,
    originalSelectedProduct,
    viewingRecommendationProduct,
    inspectRecommendation,
    revertToOriginalSelection,
    addToCart, 
    addPairedEnsembleToCart,
    wishlist, 
    toggleWishlist, 
    customer, 
    inventory, 
    setEnquiryProduct,
    setMemberCardOpen,
    products,
    storeOwnerPhone
  } = useStore();

  const allAvailableProducts = products || ALL_PRODUCTS || [];

  const [selectedSize, setSelectedSize] = useState('2.6');
  const [selectedColor, setSelectedColor] = useState('Antique Gold Polish');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('SPEC'); // 'SPEC' | 'CARE' | 'STYLING'
  const [sizeError, setSizeError] = useState('');

  const POLISH_OPTIONS = [
    { id: 'antique-gold', name: 'Antique Gold Polish', color: '#D4AF37' },
    { id: 'rose-gold', name: 'Royal Rose Polish', color: '#B76E79' },
    { id: 'yellow-gold', name: 'Classic Gold Finish', color: '#ECC04C' },
    { id: 'silver-rhodium', name: 'Silver Rhodium Finish', color: '#94A3B8' }
  ];

  const formatINR = (val) => {
    const n = Number(val);
    if (isNaN(n) || n === null || n === undefined) return '0';
    return n.toLocaleString('en-IN');
  };

  // Close modal
  const handleClose = () => {
    setQuickProduct(null);
    revertToOriginalSelection();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Support phone hardware back button
    window.history.pushState({ modal: 'product-detail' }, '');
    const handlePopState = () => {
      setQuickProduct(null);
      revertToOriginalSelection();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!quickProduct) return null;

  const currentProduct = quickProduct;
  const stock = inventory[currentProduct.id] ?? 10;
  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(currentProduct.id);

  // Safe pricing calculation (Never crash if fields are missing or strings)
  const productPrice = Number(currentProduct.price) || 0;
  const productOriginalPrice = Number(currentProduct.originalPrice) || Math.round(productPrice * 1.35) || productPrice;
  const productMemberPrice = Number(currentProduct.memberPrice) || Math.round(productPrice * 0.95) || productPrice;
  const displayPrice = customer?.isMember ? productMemberPrice : productPrice;

  const discountPercent = productOriginalPrice > productPrice && productOriginalPrice > 0
    ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)
    : 0;

  // Safe sizes list
  const availableSizes = Array.isArray(currentProduct.sizes) && currentProduct.sizes.length > 0 
    ? currentProduct.sizes 
    : ['2.4', '2.6', '2.8', 'Free Size'];

  // Safe tags
  const productTags = Array.isArray(currentProduct.tags) 
    ? currentProduct.tags.filter(t => typeof t === 'string') 
    : [];

  // Matching items for recommendation
  const matchingItems = (Array.isArray(currentProduct.matchingItemIds) ? currentProduct.matchingItemIds : [])
    .map(id => allAvailableProducts.find(p => p && p.id === id))
    .filter(Boolean);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select your preferred bangle size before adding to bag.');
      return;
    }
    setSizeError('');
    addToCart({ ...currentProduct, selectedColor }, selectedSize, quantity);
  };

  const handleWhatsAppOrder = () => {
    const text = `🛍️ *ORDER INQUIRY - PREMIUM KHAJA*\n----------------------------------------\n• *Product:* ${currentProduct.name || 'Jewellery Piece'}\n• *SKU:* ${currentProduct.sku || 'PK-CUSTOM'}\n• *Type:* Artificial / Imitation Jewellery\n• *Size Selected:* ${selectedSize}\n• *Finish / Polish:* ${selectedColor}\n• *Quantity:* ${quantity}\n• *Total Price:* ₹${formatINR(displayPrice * quantity)}\n\nHello, I would like to order this piece via online delivery. Please confirm availability and UPI QR payment!`;
    const cleanPhone = (storeOwnerPhone || '9393056641').replace(/\D/g, '');
    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: viewingRecommendationProduct ? '940px' : '820px', 
          padding: '0', 
          overflowY: 'auto',
          maxHeight: '92vh',
          WebkitOverflowScrolling: 'touch',
          transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
      >
        
        {/* Top Header / Breadcrumb Bar */}
        <div style={{ 
          background: '#181614', 
          color: '#FAF8F5', 
          padding: '0.85rem 1.25rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="gold-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.6rem' }}>
              {currentProduct.category?.toUpperCase() || 'ARTIFICIAL JEWELLERY'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 600 }}>
              {currentProduct.subcategory || 'Artisan Bangle'}
            </span>
            {viewingRecommendationProduct && (
              <span style={{ fontSize: '0.75rem', color: '#A89E92', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>•</span>
                <span style={{ color: '#E4C88A' }}>Coordinated Pairing Active</span>
              </span>
            )}
          </div>

          <button 
            type="button"
            className="btn-icon" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Close product view"
            style={{ 
              color: '#FAF8F5', 
              background: 'rgba(255,255,255,0.25)', 
              width: '44px', 
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 30
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* IF IN PAIRED RECOMMENDATION VIEW: Show Split Ensemble Comparison */}
        {viewingRecommendationProduct ? (
          <div style={{ padding: '1.25rem', maxHeight: '82vh', overflowY: 'auto' }}>
            
            {/* Return Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--pk-surface-alt)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--pk-border-gold)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                onClick={revertToOriginalSelection}
                className="btn-outline"
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', background: '#FFFFFF' }}
              >
                <ArrowLeft size={14} />
                <span>Return to Single Item View</span>
              </button>
              
              <div style={{ fontSize: '0.78rem', color: 'var(--pk-gold-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} />
                <span>Curated Pairing by Premium Khaja</span>
              </div>
            </div>

            {/* Split Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
              
              {/* Box 1: Original Selected Item */}
              <div style={{ border: '2px solid var(--pk-gold)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#FFFFFF', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--pk-obsidian)', color: '#FAF8F5', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Crown size={12} style={{ color: '#E4C88A' }} />
                  <span>ORIGINAL SELECTION</span>
                </div>

                <div style={{ height: '200px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#F4EFEB', marginBottom: '0.85rem' }}>
                  <img 
                    src={originalSelectedProduct?.image || currentProduct.image} 
                    alt={originalSelectedProduct?.name || currentProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {originalSelectedProduct?.subcategory || currentProduct.subcategory}
                </span>
                <h4 style={{ fontSize: '0.98rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0.5rem', lineHeight: 1.3 }}>
                  {originalSelectedProduct?.name || currentProduct.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{formatINR(customer?.isMember ? (originalSelectedProduct?.memberPrice || productMemberPrice) : (originalSelectedProduct?.price || productPrice))}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                    ₹{formatINR(originalSelectedProduct?.originalPrice || productOriginalPrice)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(originalSelectedProduct || currentProduct, selectedSize, 1)}
                  className="btn-outline"
                  style={{ width: '100%', marginTop: 'auto', padding: '0.6rem', fontSize: '0.8rem' }}
                >
                  <ShoppingBag size={14} />
                  <span>Add Only This Item</span>
                </button>
              </div>

              {/* Box 2: Recommended Match Item */}
              <div style={{ border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#FAFAF8', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--pk-gold-gradient)', color: '#121110', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={12} />
                  <span>RECOMMENDED PAIR</span>
                </div>

                <div style={{ height: '200px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#F4EFEB', marginBottom: '0.85rem' }}>
                  <img 
                    src={viewingRecommendationProduct.image} 
                    alt={viewingRecommendationProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {viewingRecommendationProduct.subcategory}
                </span>
                <h4 style={{ fontSize: '0.98rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0.5rem', lineHeight: 1.3 }}>
                  {viewingRecommendationProduct.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{formatINR(customer?.isMember ? viewingRecommendationProduct.memberPrice : viewingRecommendationProduct.price)}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                    ₹{formatINR(viewingRecommendationProduct.originalPrice || viewingRecommendationProduct.price * 1.3)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => addToCart(viewingRecommendationProduct, viewingRecommendationProduct.sizes?.[0] || 'Standard', 1)}
                    className="btn-outline"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
                  >
                    <ShoppingBag size={14} />
                    <span>Add Pair</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickProduct(viewingRecommendationProduct);
                    }}
                    className="btn-primary"
                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Details
                  </button>
                </div>
              </div>

            </div>

            {/* Combined Bundle Action Banner */}
            <div style={{ 
              marginTop: '1.25rem', 
              background: 'linear-gradient(135deg, #181614 0%, #2A2420 100%)', 
              color: '#FAF8F5', 
              padding: '1.1rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              border: '1px solid var(--pk-border-gold)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <Crown size={15} style={{ color: '#E4C88A' }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E4C88A' }}>
                    Complete Ensemble Pairing
                  </span>
                  <span style={{ background: '#7D1A25', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    BUNDLE OFFER
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#C8BEB2' }}>
                  Get both <strong>{originalSelectedProduct?.name || currentProduct.name}</strong> + <strong>{viewingRecommendationProduct.name}</strong> dispatched together.
                </div>
              </div>

              <button
                onClick={() => addPairedEnsembleToCart(originalSelectedProduct || currentProduct, viewingRecommendationProduct, selectedSize, viewingRecommendationProduct.sizes?.[0] || 'Standard')}
                className="btn-gold"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.86rem' }}
              >
                <ShoppingBag size={16} />
                <span>Add Both To Bag (₹{formatINR((customer?.isMember ? (originalSelectedProduct?.memberPrice || productMemberPrice) : (originalSelectedProduct?.price || productPrice)) + (customer?.isMember ? viewingRecommendationProduct.memberPrice : viewingRecommendationProduct.price))})</span>
              </button>
            </div>

          </div>
        ) : (

          /* STANDARD SINGLE PRODUCT VIEW */
          <div className="product-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            
            {/* Left Column: Image Viewer */}
            <div className="product-modal-image-col" style={{ background: '#F4EFEB', position: 'relative', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={currentProduct.image || '/images/bangles/Screenshot 2026-09-17 202420.png'} 
                alt={currentProduct.name || 'Jewellery piece'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/bangles/Screenshot 2026-09-17 202420.png';
                }}
                style={{ width: '100%', height: '100%', maxHeight: '360px', objectFit: 'contain', padding: '12px' }}
              />
            </div>

            {/* Right Column: Information & Actions */}
            <div className="product-modal-info-col" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '85vh', overflowY: 'auto', boxSizing: 'border-box' }}>
              
              {/* Badges in natural flow - Zero overlap */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span className="gold-badge">
                  {currentProduct.subcategory || 'Fashion Jewellery'}
                </span>
                {currentProduct.isTrending && (
                  <span style={{ background: '#121110', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ★ TRENDING
                  </span>
                )}
                <span style={{ background: '#1E4635', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  ✓ 100% ARTIFICIAL JEWELLERY
                </span>
              </div>
              
              {/* Product Header & SKU */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', fontFamily: 'monospace' }}>
                    SKU: {currentProduct.sku || 'PK-CUSTOM'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pk-gold-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={13} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>Handcrafted Imitation Craft</span>
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', color: 'var(--pk-obsidian)', lineHeight: 1.25, margin: 0, fontWeight: 700 }}>
                  {currentProduct.name}
                </h2>
              </div>

              {/* Price Banner */}
              <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{formatINR(displayPrice * quantity)}
                  </span>
                  {productOriginalPrice > productPrice && (
                    <span style={{ fontSize: '0.92rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                      ₹{formatINR(productOriginalPrice * quantity)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 700 }}>
                      ({discountPercent}% Off)
                    </span>
                  )}
                </div>

                {customer?.isLoggedIn && customer?.isMember ? (
                  <div style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Crown size={12} />
                    <span>PK Club VIP 5% Privilege applied automatically!</span>
                  </div>
                ) : (
                  <div 
                    onClick={() => setMemberCardOpen(true)}
                    style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontWeight: 600 }}
                    title="Click to view member benefits"
                  >
                    <Crown size={12} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>VIP Member Price: <strong>₹{formatINR(productMemberPrice * quantity)}</strong> (Save 5%)</span>
                  </div>
                )}
              </div>

              {/* 1. COLOR & POLISH FINISH SELECTOR */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>
                    Select Finish / Polish:
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
                    {selectedColor}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.45rem' }}>
                  {POLISH_OPTIONS.map(opt => {
                    const isSelected = selectedColor === opt.name;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedColor(opt.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '2px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
                          background: isSelected ? '#FFFFFF' : 'var(--pk-bg)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                        }}
                      >
                        <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: opt.color, display: 'inline-block', border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.74rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--pk-obsidian)' : 'var(--pk-text-secondary)', whiteSpace: 'nowrap' }}>
                          {opt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SIZE SELECTOR WITH UNDO/CLEAR CAPABILITY */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>
                    Select Size: <span style={{ fontWeight: 400, color: 'var(--pk-text-muted)', fontSize: '0.7rem' }}>(Tap again to deselect)</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: selectedSize ? 'var(--pk-gold-dark)' : 'var(--pk-text-muted)', fontWeight: 600 }}>
                      {selectedSize ? `Size: ${selectedSize}` : 'No size chosen'}
                    </span>
                    {selectedSize && (
                      <button
                        type="button"
                        onClick={() => setSelectedSize('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C92A2A',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '0 0.2rem',
                          textDecoration: 'underline'
                        }}
                      >
                        ✕ Clear
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {availableSizes.map(size => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(isSelected ? '' : size)}
                        aria-pressed={isSelected}
                        title={isSelected ? `Size ${size} selected - tap to deselect` : `Select size ${size}`}
                        style={{
                          padding: '0.45rem 0.95rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 600,
                          border: isSelected ? '2px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
                          background: isSelected ? 'var(--pk-obsidian)' : '#FFFFFF',
                          color: isSelected ? '#FAF8F5' : 'var(--pk-text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {size}
                        {isSelected && <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-light)' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. QUANTITY & SELECTION SUMMARY ROW */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#FBF9F5', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pk-border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>
                    Quantity:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid var(--pk-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                  ✨ {selectedSize} • {selectedColor}
                </div>
              </div>

              {/* 4. SPECIFICATIONS, CARE & STYLING TABS */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--pk-border)', marginBottom: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('SPEC')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === 'SPEC' ? '2px solid var(--pk-gold-dark)' : 'none',
                      fontSize: '0.78rem',
                      fontWeight: activeTab === 'SPEC' ? 700 : 500,
                      color: activeTab === 'SPEC' ? 'var(--pk-gold-dark)' : 'var(--pk-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    Specifications
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('CARE')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === 'CARE' ? '2px solid var(--pk-gold-dark)' : 'none',
                      fontSize: '0.78rem',
                      fontWeight: activeTab === 'CARE' ? 700 : 500,
                      color: activeTab === 'CARE' ? 'var(--pk-gold-dark)' : 'var(--pk-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    Care &amp; Guarantee
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('STYLING')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === 'STYLING' ? '2px solid var(--pk-gold-dark)' : 'none',
                      fontSize: '0.78rem',
                      fontWeight: activeTab === 'STYLING' ? 700 : 500,
                      color: activeTab === 'STYLING' ? 'var(--pk-gold-dark)' : 'var(--pk-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    Styling Notes
                  </button>
                </div>

                {/* Tab Content Box */}
                <div style={{ 
                  background: '#FAF8F5', 
                  border: '1px solid var(--pk-border)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '0.85rem', 
                  fontSize: '0.82rem', 
                  color: 'var(--pk-text-secondary)', 
                  lineHeight: 1.55 
                }}>
                  {activeTab === 'SPEC' && (
                    <div>
                      <p style={{ marginBottom: '0.6rem', color: 'var(--pk-obsidian)', fontWeight: 500 }}>
                        {currentProduct.description || 'Artisan handcrafted artificial and imitation jewellery created with royal Hyderabadi precision.'}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', background: '#FFFFFF', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--pk-border)' }}>
                        <div><strong>Craft Type:</strong> Artificial / Imitation</div>
                        <div><strong>Finish:</strong> {currentProduct.finish || selectedColor}</div>
                        <div><strong>Core Base:</strong> {currentProduct.material || 'Hypoallergenic Nickel-Free Brass'}</div>
                        <div><strong>Occasion:</strong> {currentProduct.occasion || 'Festive & Bridal'}</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'CARE' && (
                    <div>
                      <p style={{ marginBottom: '0.4rem' }}>
                        <strong>Imitation Jewellery Longevity Guide:</strong>
                      </p>
                      <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <li>1-Year Polish &amp; Anti-Tarnish Guarantee on premium micron finishes.</li>
                        <li>Keep away from direct moisture, sanitizers, and chemical perfumes.</li>
                        <li>Store in individual zip pouches or cloth-lined boxes away from humidity.</li>
                        <li>Wipe gently with dry soft cotton cloth after every wear.</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 'STYLING' && (
                    <div>
                      <p style={{ marginBottom: '0.4rem' }}>
                        <strong>Stylist Recommendation:</strong> Pair this {currentProduct.subcategory || 'piece'} with coordinating artificial Kundan or AD American Diamond bangles and chokers.
                      </p>
                      <p>
                        Perfect for: <strong>{currentProduct.occasion || 'Festive & Bridal'}</strong> ceremonies, parties, and weddings.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. MATCHING "COORDINATE THE LOOK" SUGGESTIONS */}
              {matchingItems.length > 0 && (
                <div style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid var(--pk-border)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '0.85rem', 
                  flexShrink: 0 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--pk-gold-dark)', letterSpacing: '0.04em' }}>
                      ✨ COORDINATE THE LOOK • RECOMMENDED PAIRS
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)' }}>
                      Tap to bundle
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                    {matchingItems.slice(0, 3).map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => inspectRecommendation(item)}
                        style={{ 
                          border: '1px solid var(--pk-border)', 
                          borderRadius: 'var(--radius-sm)', 
                          padding: '0.5rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          cursor: 'pointer', 
                          background: 'var(--pk-bg)',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--pk-gold)'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--pk-border)'}
                      >
                        <img src={item.image} alt={item.name} style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0, background: '#fff' }} />
                        <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pk-gold-dark)' }}>
                            ₹{formatINR(item.price)}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                          + Pair
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection error feedback */}
              {sizeError && (
                <div style={{ color: '#E11D48', fontSize: '0.78rem', fontWeight: 600, background: '#FFF1F2', padding: '0.45rem 0.75rem', borderRadius: '4px', border: '1px solid #FECDD3' }}>
                  ⚠️ {sizeError}
                </div>
              )}

              {/* 6. PRIMARY CTAs */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.5rem', flexShrink: 0 }}>
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-gold" 
                  style={{ flex: 1, padding: '0.85rem 1rem', minWidth: '170px', fontSize: '0.88rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag (₹{formatINR(displayPrice * quantity)})</span>
                </button>

                <button 
                  type="button"
                  onClick={handleWhatsAppOrder}
                  style={{
                    background: 'transparent',
                    border: '1.5px solid #1E4635',
                    color: '#1E4635',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <MessageCircle size={16} style={{ color: '#25D366' }} />
                  <span>WhatsApp</span>
                </button>

                <button 
                  type="button"
                  onClick={() => toggleWishlist(currentProduct.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--pk-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Save to Wishlist"
                >
                  <Heart size={18} style={{ color: isWishlisted ? '#7D1A25' : '#888', fill: isWishlisted ? '#7D1A25' : 'none' }} />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

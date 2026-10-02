import React, { useState } from 'react';
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
    products 
  } = useStore();

  const allAvailableProducts = products || ALL_PRODUCTS;

  const [selectedSize, setSelectedSize] = useState('2.6');
  const [selectedColor, setSelectedColor] = useState('22K Antique Micron Gold');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('SPEC'); // 'SPEC' | 'CARE' | 'STYLING'

  const POLISH_OPTIONS = [
    { id: '22k-antique', name: '22K Antique Gold', color: '#D4AF37' },
    { id: 'rose-gold', name: 'Royal Rose Gold', color: '#B76E79' },
    { id: 'yellow-gold', name: 'Classic Yellow Gold', color: '#ECC04C' },
    { id: 'silver-rhodium', name: 'Silver Rhodium', color: '#94A3B8' }
  ];

  if (!quickProduct) return null;

  const currentProduct = quickProduct;
  const stock = inventory[currentProduct.id] ?? 10;
  const isWishlisted = wishlist.includes(currentProduct.id);
  const displayPrice = customer.isMember ? currentProduct.memberPrice : currentProduct.price;

  // Matching items for recommendation
  const matchingItems = (currentProduct.matchingItemIds || [])
    .map(id => allAvailableProducts.find(p => p.id === id))
    .filter(Boolean);

  // Close modal
  const handleClose = () => {
    setQuickProduct(null);
    revertToOriginalSelection();
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = () => {
    addToCart({ ...currentProduct, selectedColor }, selectedSize, quantity);
  };

  const handleWhatsAppOrder = () => {
    const text = `🛍️ *ORDER INQUIRY - PREMIUM KHAJA*\n----------------------------------------\n• *Product:* ${currentProduct.name}\n• *SKU:* ${currentProduct.sku}\n• *Size Selected:* ${selectedSize}\n• *Finish / Polish:* ${selectedColor}\n• *Quantity:* ${quantity}\n• *Total Price:* ₹${(displayPrice * quantity).toLocaleString()}\n\nHello, I would like to order this piece via online delivery. Please confirm availability and UPI QR payment!`;
    window.open(`https://wa.me/919393056641?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: viewingRecommendationProduct ? '940px' : '820px', 
          padding: '0', 
          overflow: 'hidden',
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
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="gold-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.6rem' }}>
              {currentProduct.category?.toUpperCase() || 'HAUTE JEWELLERY'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 600 }}>
              {currentProduct.subcategory}
            </span>
            {viewingRecommendationProduct && (
              <span style={{ fontSize: '0.75rem', color: '#A89E92', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>•</span>
                <span style={{ color: '#E4C88A' }}>Coordinated Pairing Mode Active</span>
              </span>
            )}
          </div>

          <button 
            className="btn-icon" 
            onClick={handleClose}
            style={{ 
              color: '#FAF8F5', 
              background: 'rgba(255,255,255,0.1)', 
              width: '32px', 
              height: '32px',
              padding: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* IF IN PAIRED RECOMMENDATION VIEW: Show Split Ensemble Comparison without losing original selected image! */}
        {viewingRecommendationProduct ? (
          <div style={{ padding: '1.5rem', maxHeight: '82vh', overflowY: 'auto' }}>
            
            {/* Return Bar to never lose original */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--pk-surface-alt)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--pk-border-gold)' }}>
              <button
                onClick={revertToOriginalSelection}
                className="btn-outline"
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', background: '#FFFFFF' }}
              >
                <ArrowLeft size={14} />
                <span>Return to Original Item Only</span>
              </button>
              
              <div style={{ fontSize: '0.78rem', color: 'var(--pk-gold-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} />
                <span>Pairing recommendations styled by Premium Khaja Atelier</span>
              </div>
            </div>

            {/* Split Grid: Original Selected Product (Left) + Recommended Product (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
              
              {/* Box 1: Original Selected Item (PERMANENTLY SAFE & PINNED) */}
              <div style={{ border: '2px solid var(--pk-gold)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#FFFFFF', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--pk-obsidian)', color: '#FAF8F5', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Crown size={12} style={{ color: '#E4C88A' }} />
                  <span>ORIGINAL SELECTION</span>
                </div>

                <div style={{ height: '220px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#F4EFEB', marginBottom: '0.85rem' }}>
                  <img 
                    src={originalSelectedProduct?.image || currentProduct.image} 
                    alt={originalSelectedProduct?.name || currentProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {originalSelectedProduct?.subcategory || currentProduct.subcategory}
                </span>
                <h4 style={{ fontSize: '1rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0.5rem', lineHeight: 1.3 }}>
                  {originalSelectedProduct?.name || currentProduct.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{(customer.isMember ? (originalSelectedProduct?.memberPrice || currentProduct.memberPrice) : (originalSelectedProduct?.price || currentProduct.price)).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                    ₹{(originalSelectedProduct?.originalPrice || currentProduct.originalPrice).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(originalSelectedProduct || currentProduct, selectedSize, 1)}
                  className="btn-outline"
                  style={{ width: '100%', marginTop: 'auto', padding: '0.6rem', fontSize: '0.8rem' }}
                >
                  <ShoppingBag size={14} />
                  <span>Add Only This Selected Item</span>
                </button>
              </div>

              {/* Box 2: Recommended Match Item */}
              <div style={{ border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#FAFAF8', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--pk-gold-gradient)', color: '#121110', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={12} />
                  <span>RECOMMENDED PAIR</span>
                </div>

                <div style={{ height: '220px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#F4EFEB', marginBottom: '0.85rem' }}>
                  <img 
                    src={viewingRecommendationProduct.image} 
                    alt={viewingRecommendationProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {viewingRecommendationProduct.subcategory}
                </span>
                <h4 style={{ fontSize: '1rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0.5rem', lineHeight: 1.3 }}>
                  {viewingRecommendationProduct.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{(customer.isMember ? viewingRecommendationProduct.memberPrice : viewingRecommendationProduct.price).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                    ₹{viewingRecommendationProduct.originalPrice.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => addToCart(viewingRecommendationProduct, viewingRecommendationProduct.sizes?.[0] || 'Standard', 1)}
                    className="btn-outline"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
                  >
                    <ShoppingBag size={14} />
                    <span>Add Only Pair</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickProduct(viewingRecommendationProduct);
                      setViewingRecommendationProduct(null);
                    }}
                    title="Make this the primary piece to inspect specifications"
                    className="btn-outline"
                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.78rem' }}
                  >
                    View Specs →
                  </button>
                </div>
              </div>

            </div>

            {/* Combined Bundle Action Banner */}
            <div style={{ 
              marginTop: '1.5rem', 
              background: 'linear-gradient(135deg, #181614 0%, #2A2420 100%)', 
              color: '#FAF8F5', 
              padding: '1.25rem', 
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
                    Complete Ensemble Bundle
                  </span>
                  <span style={{ background: '#7D1A25', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    SAVE 10%
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#C8BEB2' }}>
                  Get both the <strong>{originalSelectedProduct?.name || currentProduct.name}</strong> + <strong>{viewingRecommendationProduct.name}</strong> delivered in luxury velvet box.
                </div>
              </div>

              <button
                onClick={() => addPairedEnsembleToCart(originalSelectedProduct || currentProduct, viewingRecommendationProduct, selectedSize, viewingRecommendationProduct.sizes?.[0] || 'Standard')}
                className="btn-gold"
                style={{ padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
              >
                <ShoppingBag size={16} />
                <span>Add Both To Bag (₹{((customer.isMember ? (originalSelectedProduct?.memberPrice || currentProduct.memberPrice) : (originalSelectedProduct?.price || currentProduct.price)) + (customer.isMember ? viewingRecommendationProduct.memberPrice : viewingRecommendationProduct.price)).toLocaleString()})</span>
              </button>
            </div>

          </div>
        ) : (

          /* STANDARD SINGLE PRODUCT VIEW (With Unbreakable Recommendations Dock) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            
            {/* Left Column: Image Viewer */}
            <div style={{ background: '#F4EFEB', position: 'relative', minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span className="gold-badge">
                  {currentProduct.subcategory}
                </span>
                {currentProduct.isTrending && (
                  <span style={{ background: '#121110', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ★ TRENDING 2026
                  </span>
                )}
                {currentProduct.tags?.includes("Miss World 2025 Featured") && (
                  <span style={{ background: 'linear-gradient(135deg, #7D1A25 0%, #AA822A 100%)', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ✨ MISS WORLD 2025 SELECTION
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Information & Actions - Protected Flow, Zero Overlaps */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '85vh', overflowY: 'auto', boxSizing: 'border-box' }}>
              
              {/* Product Header & SKU */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', fontFamily: 'monospace' }}>
                    SKU: {currentProduct.sku}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pk-gold-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Star size={13} fill="#D4AF37" style={{ color: '#D4AF37' }} />
                    <span>{currentProduct.rating} ({currentProduct.reviewsCount} reviews)</span>
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)', color: 'var(--pk-obsidian)', lineHeight: 1.25, margin: 0, fontWeight: 700 }}>
                  {currentProduct.name}
                </h2>
              </div>

              {/* Miss World 2025 Authenticity Badge */}
              {currentProduct.tags && currentProduct.tags.some(t => t.toLowerCase().includes('miss world')) && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(125,26,37,0.08) 0%, rgba(212,175,55,0.12) 100%)',
                  border: '1px solid rgba(212,175,55,0.5)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  flexShrink: 0
                }}>
                  <Crown size={18} style={{ color: '#AA822A', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.74rem', color: '#181614', lineHeight: 1.35 }}>
                    <strong style={{ color: '#7D1A25' }}>MISS WORLD 2025 OFFICIAL SELECTION:</strong> Handcrafted &amp; gifted to Miss World delegates for national runway presentation.
                  </div>
                </div>
              )}

              {/* Price Banner */}
              <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{(displayPrice * quantity).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.92rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                    ₹{(currentProduct.originalPrice * quantity).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 700 }}>
                    ({Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% Off)
                  </span>
                </div>

                {customer.isLoggedIn && customer.isMember ? (
                  <div style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Crown size={12} />
                    <span>PK Club VIP 5% Privilege applied automatically!</span>
                  </div>
                ) : (
                  <div 
                    onClick={() => setMemberCardOpen(true)}
                    style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontWeight: 600 }}
                    title="Click to unlock with Gmail"
                  >
                    <Crown size={12} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>VIP Member Price: <strong>₹{(currentProduct.memberPrice * quantity).toLocaleString()}</strong> (Save 5%)</span>
                  </div>
                )}
              </div>

              {/* 1. COLOR & POLISH FINISH SELECTOR */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>
                    Select Polish / Color Finish:
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
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: opt.color, display: 'inline-block', border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--pk-obsidian)' : 'var(--pk-text-secondary)', whiteSpace: 'nowrap' }}>
                          {opt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SIZE SELECTOR */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>
                    Select Size:
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', cursor: 'pointer', fontWeight: 600 }}>
                    Size Guide (2.4, 2.6, 2.8)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(currentProduct.sizes && currentProduct.sizes.length > 0 ? currentProduct.sizes : ['2.4', '2.6', '2.8', 'Free Size Adjustable']).map(size => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 600,
                          border: isSelected ? '2px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
                          background: isSelected ? 'var(--pk-obsidian)' : '#FFFFFF',
                          color: isSelected ? '#FAF8F5' : 'var(--pk-text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {size}
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

              {/* 4. SPECIFICATIONS, CARE & STYLING TABS (Structured Card, Zero Clashing) */}
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
                    Care &amp; Warranty
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
                    Styling Advice
                  </button>
                </div>

                {/* Tab Content Box - Distinct background and clear bounds */}
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
                        {currentProduct.description}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', background: '#FFFFFF', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--pk-border)' }}>
                        <div><strong>Finish:</strong> {currentProduct.finish}</div>
                        <div><strong>Material:</strong> {currentProduct.material}</div>
                        <div><strong>Stones:</strong> {currentProduct.stoneType}</div>
                        <div><strong>Occasion:</strong> {currentProduct.occasion}</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'CARE' && (
                    <div>
                      <p style={{ marginBottom: '0.4rem' }}>
                        <strong>Longevity Care:</strong> {currentProduct.careInstructions}
                      </p>
                      <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <li>1-Year Micro-Polish Warranty against premature tarnishing.</li>
                        <li>Always put on jewellery AFTER applying perfumes, hairspray, and lotions.</li>
                        <li>Store in individual velvet zip pouches provided with your order.</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 'STYLING' && (
                    <div>
                      <p style={{ marginBottom: '0.4rem' }}>
                        <strong>Stylist Note:</strong> Pair this {currentProduct.subcategory} with coordinating royal Kundan or American Diamond sets.
                      </p>
                      <p>
                        Ideal for: <strong>{currentProduct.occasion}</strong> events, galas, and celebrations.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. MATCHING "COORDINATE THE LOOK" SUGGESTIONS (Clean Separate Container) */}
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
                      Tap to compare &amp; bundle
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
                        <img src={item.image} alt={item.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pk-gold-dark)' }}>
                            ₹{item.price.toLocaleString()}
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

              {/* 6. PRIMARY CTAs - Prominent, Generous Touch Targets, Zero Overlap */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.5rem', flexShrink: 0 }}>
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-gold" 
                  style={{ flex: 1, padding: '0.85rem 1rem', minWidth: '180px', fontSize: '0.88rem', fontWeight: 700 }}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag (₹{(displayPrice * quantity).toLocaleString()})</span>
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

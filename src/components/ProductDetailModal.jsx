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
  const [activeTab, setActiveTab] = useState('SPEC'); // 'SPEC' | 'CARE' | 'STYLING'

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

            {/* Right Column: Information & Actions */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', maxHeight: '82vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', fontFamily: 'monospace' }}>
                  SKU: {currentProduct.sku}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
                  ★ {currentProduct.rating} ({currentProduct.reviewsCount} verified reviews)
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', lineHeight: 1.25, marginBottom: '0.6rem' }}>
                {currentProduct.name}
              </h2>

              {/* Price Box */}
              <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                    ₹{displayPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.92rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                    ₹{currentProduct.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 700 }}>
                    ({Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% Off)
                  </span>
                </div>

                {customer.isLoggedIn && customer.isMember ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--pk-gold-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Crown size={12} />
                    <span>PK Club VIP 5% Privilege applied automatically!</span>
                  </div>
                ) : (
                  <div 
                    onClick={() => setMemberCardOpen(true)}
                    style={{ fontSize: '0.75rem', color: 'var(--pk-gold-dark)', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontWeight: 600 }}
                    title="Click to unlock with Gmail"
                  >
                    <Crown size={12} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>Member Price: <strong>₹{currentProduct.memberPrice.toLocaleString()}</strong> (Login with Gmail to Save 5%)</span>
                  </div>
                )}
              </div>

              {/* Sizes */}
              {currentProduct.sizes && (
                <div style={{ marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>
                      Select Size:
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', cursor: 'pointer' }}>
                      Size Guide (2.4, 2.6, 2.8)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {currentProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: selectedSize === size ? '2px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
                          background: selectedSize === size ? 'var(--pk-obsidian)' : '#FFFFFF',
                          color: selectedSize === size ? '#FAF8F5' : 'var(--pk-text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--pk-border)', marginBottom: '0.85rem' }}>
                <button
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
                  Care & Warranty
                </button>
                <button
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

              {/* Tab Content */}
              <div style={{ fontSize: '0.82rem', color: 'var(--pk-text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem', minHeight: '60px' }}>
                {activeTab === 'SPEC' && (
                  <div>
                    <p style={{ marginBottom: '0.6rem' }}>{currentProduct.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: '#FBF9F5', padding: '0.6rem', borderRadius: '4px' }}>
                      <div><strong>Finish:</strong> {currentProduct.finish}</div>
                      <div><strong>Material:</strong> {currentProduct.material}</div>
                      <div><strong>Stones:</strong> {currentProduct.stoneType}</div>
                      <div><strong>Occasion:</strong> {currentProduct.occasion}</div>
                    </div>
                  </div>
                )}

                {activeTab === 'CARE' && (
                  <div>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Longevity Care:</strong> {currentProduct.careInstructions}</p>
                    <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <li>1-Year Micro-Polish Warranty against premature tarnishing.</li>
                      <li>Always put on jewellery AFTER applying perfumes, hairspray, and lotion.</li>
                      <li>Store in individual zip pouches provided with your order.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'STYLING' && (
                  <div>
                    <p style={{ marginBottom: '0.4rem' }}>
                      <strong>Stylist Note:</strong> Pair this {currentProduct.subcategory} with coordinating Kundan or American Diamond chokers.
                    </p>
                    <p>
                      Ideal for: <strong>{currentProduct.occasion}</strong> events and grand festivities.
                    </p>
                  </div>
                )}
              </div>

              {/* Matching "Complete the Look" suggestions (SAFE: Inspects recommendation WITHOUT losing original selection!) */}
              {matchingItems.length > 0 && (
                <div style={{ marginBottom: '1.25rem', borderTop: '1px solid var(--pk-border)', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pk-gold-dark)', letterSpacing: '0.04em' }}>
                      ✨ COORDINATE THE LOOK • RECOMMENDED PAIRS
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>
                      Click to compare pair
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
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
                          background: '#FFFFFF',
                          transition: 'all 0.2s',
                          position: 'relative'
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

              {/* CTAs */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => addToCart(currentProduct, selectedSize, 1)}
                  className="btn-gold" 
                  style={{ flex: 1, padding: '0.8rem', minWidth: '180px' }}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag (₹{displayPrice.toLocaleString()})</span>
                </button>

                <button 
                  onClick={() => setEnquiryProduct(currentProduct)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #1E4635',
                    color: '#1E4635',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 0.9rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <MessageCircle size={15} style={{ color: '#25D366' }} />
                  <span>WhatsApp</span>
                </button>

                <button 
                  onClick={() => toggleWishlist(currentProduct.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--pk-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
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

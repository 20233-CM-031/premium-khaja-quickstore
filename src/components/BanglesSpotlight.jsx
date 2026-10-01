import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ALL_PRODUCTS, 
  BANGLES_PRODUCTS, 
  CATEGORY_CONFIG 
} from '../data/products';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Eye, 
  MessageCircle, 
  Flame, 
  Crown,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Check
} from 'lucide-react';

export const BanglesSpotlight = () => {
  const { 
    products,
    addToCart, 
    wishlist, 
    toggleWishlist, 
    customer, 
    inventory, 
    openProductDetail, 
    setEnquiryProduct,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    activeOccasion,
    setActiveOccasion,
    setMemberCardOpen
  } = useStore();

  const allAvailableProducts = products || ALL_PRODUCTS;

  const [selectedPriceBracket, setSelectedPriceBracket] = useState('ALL');
  const [selectedSizes, setSelectedSizes] = useState({}); // mapped by productId -> size

  const occasions = ['ALL', 'Bridal', 'Festive', 'Party', 'Office', 'Casual'];

  // Current category config
  const currentCatConfig = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG.bangles;

  // Filter Logic across ALL products (including custom admin added products!) with active category & subcategory support
  const filteredProducts = allAvailableProducts.filter(item => {
    // 1. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q) ||
                    item.subcategory.toLowerCase().includes(q) ||
                    (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
                    (item.finish && item.finish.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Main Category Filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }

    // 3. Subcategory Filter
    if (activeSubcategory !== 'all' && item.subcategory.toLowerCase() !== activeSubcategory.toLowerCase()) {
      return false;
    }

    // 4. Occasion
    if (activeOccasion !== 'ALL' && item.occasion !== activeOccasion) {
      return false;
    }

    // 5. Price bracket
    if (selectedPriceBracket === 'UNDER_1000' && item.price >= 1000) return false;
    if (selectedPriceBracket === 'UNDER_2000' && (item.price < 1000 || item.price > 2000)) return false;
    if (selectedPriceBracket === 'PREMIUM' && item.price <= 2000) return false;

    return true;
  });

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const getCategoryCount = (catKey) => {
    if (catKey === 'all') return allAvailableProducts.length;
    return allAvailableProducts.filter(p => p.category === catKey).length;
  };

  return (
    <section id="bangles-atelier" style={{ padding: '4.5rem 0', background: 'var(--pk-bg)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--pk-gold-bg)', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.9rem', marginBottom: '0.8rem' }}>
            <Sparkles size={14} style={{ color: 'var(--pk-gold-dark)' }} />
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
              The Master Haute Atelier
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.9rem)', color: 'var(--pk-obsidian)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Heirloom Bangles & Royal Adornments
          </h2>
          
          <p style={{ fontSize: '0.98rem', color: 'var(--pk-text-secondary)', lineHeight: 1.6 }}>
            Each piece is micro-plated in pure 22K gold alloys with certified anti-tarnish coating. Explore authentic glass bangles, stone kadas, organic lac creations, real pearls, and American Diamond couture.
          </p>
        </div>

        {/* 1. PRIMARY CATEGORY TABS (Bangle, Neclace, Bracelet, Earings) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.6rem', 
          flexWrap: 'wrap', 
          marginBottom: '1.5rem' 
        }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              background: activeCategory === 'all' ? 'var(--pk-obsidian)' : '#FFFFFF',
              color: activeCategory === 'all' ? '#FAF8F5' : 'var(--pk-text-primary)',
              border: activeCategory === 'all' ? '1px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeCategory === 'all' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>All Collections</span>
            <span style={{ background: activeCategory === 'all' ? '#D4AF37' : 'var(--pk-surface-alt)', color: activeCategory === 'all' ? '#121110' : 'var(--pk-text-muted)', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {getCategoryCount('all')}
            </span>
          </button>

          {/* Bangles Category */}
          <button
            onClick={() => setActiveCategory('bangles')}
            style={{
              background: activeCategory === 'bangles' ? 'var(--pk-obsidian)' : '#FFFFFF',
              color: activeCategory === 'bangles' ? '#FAF8F5' : 'var(--pk-text-primary)',
              border: activeCategory === 'bangles' ? '1px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeCategory === 'bangles' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>Bangle (28 Designs)</span>
            <span style={{ background: activeCategory === 'bangles' ? '#D4AF37' : 'var(--pk-surface-alt)', color: activeCategory === 'bangles' ? '#121110' : 'var(--pk-text-muted)', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {getCategoryCount('bangles')}
            </span>
          </button>

          {/* Necklace Category */}
          <button
            onClick={() => setActiveCategory('necklaces')}
            style={{
              background: activeCategory === 'necklaces' ? 'var(--pk-obsidian)' : '#FFFFFF',
              color: activeCategory === 'necklaces' ? '#FAF8F5' : 'var(--pk-text-primary)',
              border: activeCategory === 'necklaces' ? '1px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeCategory === 'necklaces' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>Neclace (Cz, AD, Real Pearls)</span>
            <span style={{ background: activeCategory === 'necklaces' ? '#D4AF37' : 'var(--pk-surface-alt)', color: activeCategory === 'necklaces' ? '#121110' : 'var(--pk-text-muted)', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {getCategoryCount('necklaces')}
            </span>
          </button>

          {/* Bracelet Category */}
          <button
            onClick={() => setActiveCategory('bracelets')}
            style={{
              background: activeCategory === 'bracelets' ? 'var(--pk-obsidian)' : '#FFFFFF',
              color: activeCategory === 'bracelets' ? '#FAF8F5' : 'var(--pk-text-primary)',
              border: activeCategory === 'bracelets' ? '1px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeCategory === 'bracelets' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>Bracelet (Collage, Party, Family)</span>
            <span style={{ background: activeCategory === 'bracelets' ? '#D4AF37' : 'var(--pk-surface-alt)', color: activeCategory === 'bracelets' ? '#121110' : 'var(--pk-text-muted)', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {getCategoryCount('bracelets')}
            </span>
          </button>

          {/* Earrings Category */}
          <button
            onClick={() => setActiveCategory('earrings')}
            style={{
              background: activeCategory === 'earrings' ? 'var(--pk-obsidian)' : '#FFFFFF',
              color: activeCategory === 'earrings' ? '#FAF8F5' : 'var(--pk-text-primary)',
              border: activeCategory === 'earrings' ? '1px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeCategory === 'earrings' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>Earings (Traditions, Simple, Party...)</span>
            <span style={{ background: activeCategory === 'earrings' ? '#D4AF37' : 'var(--pk-surface-alt)', color: activeCategory === 'earrings' ? '#121110' : 'var(--pk-text-muted)', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {getCategoryCount('earrings')}
            </span>
          </button>
        </div>

        {/* 2. SUBCATEGORY PILLS & FILTER CONTROLS BAR (Spacious & Clean) */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '1px solid var(--pk-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem', 
          marginBottom: '2.5rem', 
          boxShadow: 'var(--shadow-sm)' 
        }}>
          
          {/* Subcategory Pills Row */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            overflowX: 'auto', 
            paddingBottom: '0.85rem', 
            borderBottom: '1px solid var(--pk-surface-alt)' 
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pk-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              Subcategories:
            </span>

            {/* If All Categories selected */}
            {activeCategory === 'all' ? (
              <>
                <button
                  onClick={() => setActiveSubcategory('all')}
                  style={{
                    background: activeSubcategory === 'all' ? 'var(--pk-gold-gradient)' : 'var(--pk-surface-alt)',
                    color: activeSubcategory === 'all' ? '#121110' : 'var(--pk-text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.8rem',
                    fontWeight: activeSubcategory === 'all' ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  All Subcategories ({allAvailableProducts.length})
                </button>
                {['Glass Bangle', 'Stone Bangle', 'Lac Bangles', 'Minakari Bangles', 'Cz', 'AD', 'Real Pearls', 'simple Collage', 'Party', 'family Editon', 'Traditions', 'SImple', 'Tradictnal Were'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    style={{
                      background: activeSubcategory.toLowerCase() === sub.toLowerCase() ? 'var(--pk-gold-gradient)' : 'var(--pk-surface-alt)',
                      color: activeSubcategory.toLowerCase() === sub.toLowerCase() ? '#121110' : 'var(--pk-text-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.4rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: activeSubcategory.toLowerCase() === sub.toLowerCase() ? 700 : 500,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </>
            ) : (
              /* Specific Category Subcategories */
              currentCatConfig.subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.id)}
                  style={{
                    background: activeSubcategory.toLowerCase() === sub.id.toLowerCase() ? 'var(--pk-gold-gradient)' : 'var(--pk-surface-alt)',
                    color: activeSubcategory.toLowerCase() === sub.id.toLowerCase() ? '#121110' : 'var(--pk-text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.8rem',
                    fontWeight: activeSubcategory.toLowerCase() === sub.id.toLowerCase() ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {sub.label}
                </button>
              ))
            )}
          </div>

          {/* Occasion & Price Filters (Spacious, No Overlap) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.9rem' }}>
            
            {/* Occasion filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pk-text-muted)', textTransform: 'uppercase' }}>
                Occasion:
              </span>
              {occasions.map(occ => (
                <button
                  key={occ}
                  onClick={() => setActiveOccasion(occ)}
                  style={{
                    background: activeOccasion === occ ? 'var(--pk-gold-bg)' : 'transparent',
                    color: activeOccasion === occ ? 'var(--pk-gold-dark)' : 'var(--pk-text-secondary)',
                    border: activeOccasion === occ ? '1px solid var(--pk-border-gold)' : '1px solid var(--pk-border)',
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {occ}
                </button>
              ))}
            </div>

            {/* Price bracket filter & Results Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--pk-text-muted)', textTransform: 'uppercase' }}>
                  Budget:
                </span>
                <select
                  value={selectedPriceBracket}
                  onChange={(e) => setSelectedPriceBracket(e.target.value)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--pk-border)',
                    fontSize: '0.8rem',
                    background: 'var(--pk-surface-alt)',
                    color: 'var(--pk-text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">All Budgets</option>
                  <option value="UNDER_1000">Under ₹1,000</option>
                  <option value="UNDER_2000">₹1,000 - ₹2,000</option>
                  <option value="PREMIUM">Heirloom (Above ₹2,000)</option>
                </select>
              </div>

              <span style={{ fontSize: '0.78rem', color: 'var(--pk-text-muted)', fontWeight: 600 }}>
                Showing <strong>{filteredProducts.length}</strong> items
              </span>
            </div>

          </div>

        </div>

        {/* 3. PRODUCT CARDS GRID (Breathable, Elegant, No Text Congestion) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.75rem' }}>
          {filteredProducts.map(product => {
            const stock = inventory[product.id] ?? 10;
            const isWishlisted = wishlist.includes(product.id);
            const activeSize = selectedSizes[product.id] || product.sizes?.[0] || '2.6';
            const displayPrice = customer.isLoggedIn && customer.isMember ? product.memberPrice : product.price;

            return (
              <div key={product.id} className="product-card">
                
                {/* Image Container with Badges & Wishlist */}
                <div className="img-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    loading="lazy"
                    onClick={() => openProductDetail(product)}
                    style={{ cursor: 'pointer' }}
                  />

                  {/* Top Badges (Organized cleanly with spacing) */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
                    {product.tags?.includes("Miss World 2025 Featured") && (
                      <span style={{ background: 'linear-gradient(135deg, #7D1A25 0%, #AA822A 100%)', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        ★ MISS WORLD 2025
                      </span>
                    )}
                    {product.isTrending && (
                      <span style={{ background: 'rgba(18, 17, 16, 0.88)', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
                        <Flame size={10} style={{ color: '#E4C88A' }} />
                        TRENDING
                      </span>
                    )}
                    {stock <= 8 && stock > 0 && (
                      <span style={{ background: '#7D1A25', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        ONLY {stock} LEFT
                      </span>
                    )}
                    {stock === 0 && (
                      <span style={{ background: '#444', color: '#FAF8F5', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        OUT OF STOCK
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255,255,255,0.92)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      zIndex: 2
                    }}
                  >
                    <Heart 
                      size={16} 
                      style={{ 
                        color: isWishlisted ? '#7D1A25' : '#181614',
                        fill: isWishlisted ? '#7D1A25' : 'none' 
                      }} 
                    />
                  </button>

                  {/* Quick Inspect Button on Hover Overlay */}
                  <button
                    onClick={() => openProductDetail(product)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(18, 17, 16, 0.88)',
                      color: '#FAF8F5',
                      border: '1px solid rgba(212,175,55,0.4)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.35rem 0.95rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backdropFilter: 'blur(5px)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Eye size={12} />
                    <span>Quick View & Details</span>
                  </button>
                </div>

                {/* Card Content - Clean Typography without Overlap */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  {/* Category & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.74rem' }}>
                    <span style={{ color: 'var(--pk-gold-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {product.subcategory}
                    </span>
                    <span style={{ color: 'var(--pk-text-muted)', fontWeight: 600 }}>
                      ★ {product.rating} ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Title (Clean 2-line clamp to avoid any height mismatch or congestion) */}
                  <h3 
                    onClick={() => openProductDetail(product)}
                    style={{ 
                      fontSize: '1.05rem', 
                      color: 'var(--pk-obsidian)', 
                      marginBottom: '0.45rem', 
                      cursor: 'pointer',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.7rem'
                    }}
                  >
                    {product.name}
                  </h3>

                  {/* Material summary */}
                  <div style={{ fontSize: '0.76rem', color: 'var(--pk-text-muted)', marginBottom: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.finish || product.material}
                  </div>

                  {/* Size Selector (If applicable) */}
                  {product.sizes && product.sizes.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-secondary)', fontWeight: 600 }}>Size:</span>
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(product.id, size)}
                          style={{
                            background: activeSize === size ? 'var(--pk-obsidian)' : 'var(--pk-surface-alt)',
                            color: activeSize === size ? '#FAF8F5' : 'var(--pk-text-primary)',
                            border: activeSize === size ? 'none' : '1px solid var(--pk-border)',
                            borderRadius: '4px',
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price Section */}
                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--pk-surface-alt)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.85rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      {customer.isLoggedIn && customer.isMember ? (
                        <div style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                          ✓ VIP 5% Privilege Applied
                        </div>
                      ) : (
                        <div 
                          onClick={() => setMemberCardOpen(true)}
                          style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', cursor: 'pointer', fontWeight: 600 }}
                          title="Click to view VIP Member Benefits"
                        >
                          Member: <strong>₹{product.memberPrice.toLocaleString()}</strong> (Unlock 5%)
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setEnquiryProduct(product)}
                      title="Ask on WhatsApp"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--pk-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.35rem 0.55rem',
                        cursor: 'pointer',
                        color: '#1B4332',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem'
                      }}
                    >
                      <MessageCircle size={14} style={{ color: '#25D366' }} />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  {/* Add To Bag CTA (Enabled for both Guests & Logged-in Customers!) */}
                  <button 
                    disabled={stock === 0}
                    onClick={() => addToCart(product, activeSize, 1)}
                    className="btn-primary"
                    style={{ 
                      width: '100%', 
                      padding: '0.7rem', 
                      fontSize: '0.85rem',
                      opacity: stock === 0 ? 0.5 : 1,
                      cursor: stock === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ShoppingBag size={14} style={{ color: '#E4C88A' }} />
                    <span>{stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* Empty Search Result Fallback */}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
            <p style={{ fontSize: '1.15rem', color: 'var(--pk-text-secondary)', marginBottom: '1.25rem' }}>
              No jewellery pieces found matching your current filter selection.
            </p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setActiveSubcategory('all');
                setActiveOccasion('ALL');
                setSelectedPriceBracket('ALL');
                setSearchQuery('');
              }}
              className="btn-gold"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

import React, { useState, useMemo } from 'react';
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
  Search,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpDown,
  PlusCircle,
  ShieldCheck
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
    activeFilterTag,
    setActiveFilterTag,
    resetAllFilters,
    setMemberCardOpen,
    handleAdminModeSwitch
  } = useStore();

  const allAvailableProducts = products || [];

  const [sortBy, setSortBy] = useState('FEATURED'); // FEATURED, PRICE_LOW, PRICE_HIGH, RATING
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('ALL');
  const [selectedSizes, setSelectedSizes] = useState({}); // mapped by productId -> size

  const occasions = ['ALL', 'Bridal', 'Festive', 'Party', 'Office', 'Casual'];

  // Current category config
  const currentCatConfig = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG.bangles;

  const getCategoryCount = (catKey) => {
    if (catKey === 'all') return allAvailableProducts.length;
    return allAvailableProducts.filter(p => p.category === catKey).length;
  };

  const handleCategoryClick = (catKey) => {
    setActiveCategory(catKey);
    setActiveSubcategory('all');
    setActiveOccasion('ALL');
    setSelectedPriceBracket('ALL');
    if (setActiveFilterTag) setActiveFilterTag('ALL');
    setSearchQuery('');
  };

  // Filter & Sort Logic (Flipkart & Amazon style responsive listing)
  const filteredProducts = useMemo(() => {
    let result = allAvailableProducts.filter(item => {
      // 1. Search query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = (item.name && item.name.toLowerCase().includes(q)) ||
                      (item.description && item.description.toLowerCase().includes(q)) ||
                      (item.subcategory && item.subcategory.toLowerCase().includes(q)) ||
                      (item.category && item.category.toLowerCase().includes(q)) ||
                      (item.material && item.material.toLowerCase().includes(q)) ||
                      (item.finish && item.finish.toLowerCase().includes(q)) ||
                      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
        if (!match) return false;
      }

      // 2. Main Category Filter
      if ((!searchQuery || !searchQuery.trim()) && activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 3. Subcategory Filter
      if ((!searchQuery || !searchQuery.trim()) && activeSubcategory !== 'all') {
        if (!item.subcategory || item.subcategory.toLowerCase() !== activeSubcategory.toLowerCase()) {
          return false;
        }
      }

      // 4. Occasion
      if (activeOccasion && activeOccasion.toUpperCase() !== 'ALL') {
        if (!item.occasion || item.occasion.toUpperCase() !== activeOccasion.toUpperCase()) {
          return false;
        }
      }

      // 5. Price bracket
      if (selectedPriceBracket === 'UNDER_1000' && item.price >= 1000) return false;
      if (selectedPriceBracket === 'UNDER_2000' && (item.price < 1000 || item.price > 2000)) return false;
      if (selectedPriceBracket === 'PREMIUM' && item.price <= 2000) return false;

      return true;
    });

    // Apply Sorting
    if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [allAvailableProducts, searchQuery, activeCategory, activeSubcategory, activeOccasion, selectedPriceBracket, sortBy]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: prev[productId] === size ? '' : size
    }));
  };

  const CATEGORY_TABS = [
    {
      id: 'all',
      name: 'All Products',
      subtitle: `${allAvailableProducts.length} Items`,
      count: getCategoryCount('all'),
      image: '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png'
    },
    {
      id: 'bangles',
      name: 'Bangles',
      subtitle: 'Kadas & Sets',
      count: getCategoryCount('bangles'),
      image: '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png'
    },
    {
      id: 'necklaces',
      name: 'Necklaces',
      subtitle: 'Chokers & Sets',
      count: getCategoryCount('necklaces'),
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=140&q=80'
    },
    {
      id: 'bracelets',
      name: 'Bracelets',
      subtitle: 'Collage & Everyday',
      count: getCategoryCount('bracelets'),
      image: 'https://images.unsplash.com/photo-1611591475847-f5dc837f40ba?auto=format&fit=crop&w=140&q=80'
    },
    {
      id: 'earrings',
      name: 'Earrings',
      subtitle: 'Jhumkas & Tops',
      count: getCategoryCount('earrings'),
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=140&q=80'
    }
  ];

  return (
    <section id="bangles-atelier" style={{ padding: '2.5rem 0 4rem', background: '#F8F6F2' }}>
      <style>{`
        .pk-product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .pk-product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
        @media (max-width: 640px) {
          .pk-product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.65rem;
          }
          .pk-product-card {
            border-radius: 8px !important;
          }
          .pk-product-card .card-content {
            padding: 0.65rem !important;
          }
          .pk-product-card h3 {
            font-size: 0.82rem !important;
            min-height: 2.2rem !important;
          }
          .pk-product-card .price-val {
            font-size: 1.05rem !important;
          }
          .pk-product-card .orig-price {
            font-size: 0.72rem !important;
          }
          .pk-product-card .add-btn {
            padding: 0.45rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>

      <div className="container">
        
        {/* Simple & Clear Section Header (No pretentiousness, user sees directly) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--pk-obsidian)', lineHeight: 1.2, margin: '0 0 0.35rem', fontWeight: 800 }}>
              Jewellery &amp; Bangles Collection
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--pk-text-secondary)', margin: 0 }}>
              100% Handcrafted Artificial &amp; Imitation Jewellery • Free Shipping Across India
            </p>
          </div>

          {/* Quick Stats / Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pk-border)' }}>
              <ArrowUpDown size={14} style={{ color: 'var(--pk-text-muted)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pk-text-muted)' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-obsidian)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="FEATURED">Popularity / Featured</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="RATING">Top Customer Rated</option>
              </select>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--pk-text-muted)', fontWeight: 600 }}>
              {filteredProducts.length} items
            </span>
          </div>
        </div>

        {/* 1. VISUAL CATEGORY TABS (Flipkart/Amazon Style horizontal swipe) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          gap: '0.6rem', 
          overflowX: 'auto', 
          paddingBottom: '0.85rem', 
          marginBottom: '1.25rem',
          WebkitOverflowScrolling: 'touch'
        }}>
          {CATEGORY_TABS.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '2px solid var(--pk-obsidian)' : '1px solid var(--pk-border)',
                  background: isSelected ? 'var(--pk-obsidian)' : '#FFFFFF',
                  color: isSelected ? '#FAF8F5' : 'var(--pk-text-primary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s'
                }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png';
                  }}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 600 }}>
                  {cat.name}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--pk-surface-alt)', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700 
                }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. FILTER PILLS & BUDGET BAR */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '1px solid var(--pk-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '0.75rem 1rem', 
          marginBottom: '1.5rem', 
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          {/* Subcategory Pills Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => setActiveSubcategory('all')}
              style={{
                background: activeSubcategory === 'all' ? 'var(--pk-gold-gradient)' : 'var(--pk-surface-alt)',
                color: activeSubcategory === 'all' ? '#121110' : 'var(--pk-text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: activeSubcategory === 'all' ? 700 : 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              All Types
            </button>
            {(activeCategory === 'all' 
              ? ['Glass Bangle', 'Stone Bangle', 'Lac Bangles', 'Minakari Bangles', 'Choker', 'Everyday'] 
              : currentCatConfig.subcategories.map(s => s.id)
            ).map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                style={{
                  background: activeSubcategory.toLowerCase() === sub.toLowerCase() ? 'var(--pk-gold-gradient)' : 'var(--pk-surface-alt)',
                  color: activeSubcategory.toLowerCase() === sub.toLowerCase() ? '#121110' : 'var(--pk-text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: activeSubcategory.toLowerCase() === sub.toLowerCase() ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Budget filter select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pk-text-muted)' }}>Budget:</span>
            <select
              value={selectedPriceBracket}
              onChange={(e) => setSelectedPriceBracket(e.target.value)}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid var(--pk-border)',
                fontSize: '0.75rem',
                background: '#FAF8F5',
                color: 'var(--pk-text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Prices</option>
              <option value="UNDER_1000">Under ₹1,000</option>
              <option value="UNDER_2000">₹1,000 - ₹2,000</option>
              <option value="PREMIUM">Above ₹2,000</option>
            </select>
          </div>
        </div>

        {/* 3. PRODUCT CARDS GRID (Flipkart/Amazon 2-column mobile, 4-column desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="pk-product-grid">
            {filteredProducts.map(product => {
              const stock = inventory[product.id] ?? 10;
              const isWishlisted = wishlist.includes(product.id);
              const activeSize = selectedSizes[product.id] || product.sizes?.[0] || '2.6';
              const displayPrice = customer.isLoggedIn && customer.isMember ? product.memberPrice : product.price;
              const discountPct = product.originalPrice > displayPrice 
                ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100) 
                : 0;

              return (
                <div 
                  key={product.id} 
                  className="product-card pk-product-card" 
                  style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid var(--pk-border)', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  
                  {/* Image Container with Badges & Wishlist */}
                  <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#F5F2EB', overflow: 'hidden' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png';
                      }}
                      onClick={() => openProductDetail(product)}
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                      }}
                    />

                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '3px', zIndex: 2 }}>
                      {product.isTrending && (
                        <span style={{ background: '#121110', color: '#FAF8F5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                          TRENDING
                        </span>
                      )}
                      {discountPct > 0 && (
                        <span style={{ background: '#166534', color: '#FAF8F5', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                          {discountPct}% OFF
                        </span>
                      )}
                      {stock <= 5 && stock > 0 && (
                        <span style={{ background: '#991B1B', color: '#FAF8F5', fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                          Only {stock} left
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(255,255,255,0.92)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        zIndex: 2
                      }}
                      title="Add to Wishlist"
                    >
                      <Heart 
                        size={15} 
                        style={{ 
                          color: isWishlisted ? '#C92A2A' : '#181614',
                          fill: isWishlisted ? '#C92A2A' : 'none' 
                        }} 
                      />
                    </button>
                  </div>

                  {/* Card Content - Amazon/Flipkart clean layout */}
                  <div className="card-content" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    
                    {/* Category & Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.7rem' }}>
                      <span style={{ color: 'var(--pk-gold-dark)', fontWeight: 800, textTransform: 'uppercase' }}>
                        {product.subcategory || product.category}
                      </span>
                      <span style={{ color: '#F59E0B', fontWeight: 700 }}>
                        ★ {product.rating || '4.8'}
                      </span>
                    </div>

                    {/* Title (Clean 2-line clamp) */}
                    <h3 
                      onClick={() => openProductDetail(product)}
                      style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--pk-obsidian)', 
                        margin: '0 0 0.35rem 0', 
                        cursor: 'pointer',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.4rem',
                        fontWeight: 600
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.35rem', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span className="price-val" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        {product.originalPrice > displayPrice && (
                          <span className="orig-price" style={{ fontSize: '0.78rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800 }}>
                            ({discountPct}% off)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 700, marginTop: '2px' }}>
                        FREE Delivery Across India
                      </div>
                    </div>

                    {/* Action buttons (Add to Bag & Details) */}
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => openProductDetail(product)}
                        style={{
                          background: '#FAF8F5',
                          border: '1px solid var(--pk-border)',
                          borderRadius: '6px',
                          padding: '0.5rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: 'var(--pk-obsidian)'
                        }}
                        title="View Details"
                      >
                        Details
                      </button>
                      <button 
                        type="button"
                        disabled={stock === 0}
                        onClick={() => addToCart(product, activeSize, 1)}
                        className="btn-primary add-btn"
                        style={{ 
                          flex: 1, 
                          padding: '0.5rem 0.75rem', 
                          fontSize: '0.8rem',
                          borderRadius: '6px',
                          opacity: stock === 0 ? 0.5 : 1,
                          cursor: stock === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          fontWeight: 700
                        }}
                      >
                        <ShoppingBag size={13} style={{ color: '#E4C88A' }} />
                        <span>{stock === 0 ? 'Sold Out' : 'Add to Bag'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Catalog / No Results State */
          <div style={{ 
            textAlign: 'center', 
            padding: '3.5rem 1.5rem', 
            background: '#FFFFFF', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--pk-border)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {allAvailableProducts.length === 0 ? (
              <>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--pk-gold-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--pk-gold-dark)' }}>
                  <PlusCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)', marginBottom: '0.5rem', fontWeight: 700 }}>
                  Catalog Empty — Ready for New Products
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--pk-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  The storefront catalog has been cleared. Store Admin can now upload new products, update hero star images, set pricing, and publish real items directly from the Merchant Command Center.
                </p>
                <button 
                  type="button"
                  onClick={handleAdminModeSwitch}
                  className="btn-gold"
                  style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <ShieldCheck size={16} />
                  <span>Open Admin Command Center</span>
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.05rem', color: 'var(--pk-text-secondary)', marginBottom: '1.25rem' }}>
                  No jewellery pieces found matching your current filter selection.
                </p>
                <button 
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveSubcategory('all');
                    setActiveOccasion('ALL');
                    setSelectedPriceBracket('ALL');
                    if (setActiveFilterTag) setActiveFilterTag('ALL');
                    setSearchQuery('');
                  }}
                  className="btn-gold"
                >
                  Reset All Filters
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

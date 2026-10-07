import React from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS, BANGLES_PRODUCTS, NECKLACES_PRODUCTS, BRACELETS_PRODUCTS, EARRINGS_PRODUCTS } from '../data/products';
import { Sparkles, ShieldCheck, Truck, Award, ArrowRight, Crown, Flame, Eye, ShoppingBag } from 'lucide-react';

export const HeroBanner = () => {
  const { 
    setQuickPassOpen, 
    setAiStylistOpen, 
    customer, 
    openProductDetail, 
    products, 
    setActiveCategory,
    setActiveSubcategory,
    addToCart,
    heroConfig,
    setShortsModalOpen,
    setActiveShortIndex
  } = useStore();

  const allAvailableProducts = products || ALL_PRODUCTS;
  const spotlightProduct = allAvailableProducts.find(p => p.id === (heroConfig?.spotlightProductId || 'bangle-01')) || allAvailableProducts[0];

  // Hot trending items for the continuous fast horizontal marquee
  const hotTrendingProducts = allAvailableProducts.filter(p => p.isTrending || p.isBestSeller || p.category === 'bangles').slice(0, 10);

  // Category objects with realistic images and subcategory lists
  const categoryObjects = [
    {
      id: 'bangles',
      name: 'Bangle Atelier',
      subtitle: 'Glass, Stone, Lac, Minakari',
      count: '28 Designs',
      image: '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png',
      badge: '👑 Royal Heritage',
      targetId: 'bangles-atelier'
    },
    {
      id: 'necklaces',
      name: 'Neclace Sets',
      subtitle: 'Cz, AD & Real Pearls',
      count: '6 Haute Sets',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      badge: '💎 Miss World Selection',
      targetId: 'celebrity-spotlight'
    },
    {
      id: 'bracelets',
      name: 'Bracelet & Cuffs',
      subtitle: 'Simple, Party, Family',
      count: 'Handcrafted',
      image: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=400&q=80',
      badge: '✨ Party & Formal',
      targetId: 'bangles-atelier'
    },
    {
      id: 'earrings',
      name: 'Earings & Jhumkas',
      subtitle: 'Traditions, Party, Family',
      count: 'Mughal Style',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
      badge: '🌸 Traditional Wear',
      targetId: 'bangles-atelier'
    },
    {
      id: 'shorts',
      name: 'Royal Shorts',
      subtitle: 'Watch & Shop Video Reels',
      count: 'Runway Clips',
      image: '/images/bangles/Gemini_Generated_Image_hldb3jhldb3jhldb.png',
      badge: '🎬 Video Shopping',
      isShortsTrigger: true
    }
  ];

  const handleCategoryClick = (cat) => {
    if (cat.isShortsTrigger) {
      setActiveShortIndex(0);
      setShortsModalOpen(true);
      return;
    }
    setActiveCategory(cat.id);
    setActiveSubcategory('all');
    const targetElement = document.getElementById(cat.targetId || 'bangles-atelier');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', background: '#121110', color: '#FAF8F5' }}>
      
      {/* Background Subtle Gradient & Glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.16) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ padding: '3.5rem 1.25rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Brand Story & Miss World Highlight */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.5)', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.95rem', marginBottom: '1.25rem' }}>
              <Crown size={14} style={{ color: '#E4C88A' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {heroConfig?.announcementBadge || 'Official Partner & Gifted Miss World Contestants ✦ Worn On World Stage'}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.3rem, 4.8vw, 3.7rem)', lineHeight: 1.12, marginBottom: '1.2rem', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
              {heroConfig?.titleLine1 || 'Royal Splendour.'}<br />
              <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontWeight: 600 }}>
                {heroConfig?.titleLine2 || 'Couture Heritage Craft.'}
              </span>
            </h1>

            <p style={{ fontSize: '1.02rem', color: '#D4C9BC', lineHeight: 1.6, maxWidth: '540px', marginBottom: '1.8rem', fontWeight: 300 }}>
              {heroConfig?.description || (
                <>
                  Discover <strong>Premium Khaja</strong>'s high artificial jewellery atelier. Featuring 28 exclusive handcrafted bangles (Glass, Stone, Lac, Minakari), American Diamond & pearl chokers, and royal bracelets chosen to adorn contestants and celebrities on the world stage.
                </>
              )}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '2.25rem' }}>
              <a 
                href="#bangles-atelier"
                className="btn-gold"
                style={{ textDecoration: 'none' }}
              >
                <span>Explore All Collections</span>
                <ArrowRight size={16} />
              </a>

              <a 
                href="#celebrity-spotlight"
                className="btn-outline"
                style={{ color: '#FAF8F5', borderColor: 'rgba(212, 175, 55, 0.5)', background: 'rgba(255,255,255,0.04)', textDecoration: 'none' }}
              >
                <Crown size={15} style={{ color: '#E4C88A' }} />
                <span>Miss World Contestants Adornment</span>
              </a>

              <button 
                onClick={() => setAiStylistOpen(true)}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#FAF8F5', 
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1.15rem',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Sparkles size={14} style={{ color: '#E4C88A' }} />
                <span>Ask AI Stylist</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: '#C5A059' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Skin Safe</div>
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>100% Nickel-Free</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: '#C5A059' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Micro-Plating</div>
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>1-Year Polish Guarantee</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} style={{ color: '#C5A059' }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Express Ship</div>
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>Free &gt; ₹1,499 &amp; COD</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Spotlight Card */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)', 
              border: '1px solid rgba(212, 175, 55, 0.35)',
              position: 'relative',
              background: '#1A1816'
            }}>
              <img 
                src={spotlightProduct.image} 
                alt={`${spotlightProduct.name} - Masterpiece by Premium Khaja`}
                style={{ width: '100%', height: '420px', objectFit: 'contain', background: '#181614', display: 'block', padding: '1rem' }}
              />
              
              {/* Overlay Glass Card */}
              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                left: '15px', 
                right: '15px', 
                background: 'rgba(18, 17, 16, 0.90)', 
                backdropFilter: 'blur(10px)', 
                padding: '1.1rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#E4C88A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                      Miss World 2025 India Spotlight Piece
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: '#FAF8F5', margin: '0.1rem 0 0.3rem' }}>
                    {spotlightProduct.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#E4C88A', fontWeight: 800, fontSize: '1.15rem' }}>
                      ₹{spotlightProduct.price.toLocaleString()}
                    </span>
                    <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                      ₹{spotlightProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="gold-badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                      VIP: ₹{spotlightProduct.memberPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => openProductDetail(spotlightProduct)}
                  className="btn-gold" 
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.8rem' }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ─── REALISTIC 3D CATEGORY OBJECTS DISCOVERY BAR ────────────────── */}
        <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <span style={{ color: '#E4C88A', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ✦ Visual Jewellery Atelier Discovery ✦
            </span>
            <h3 style={{ fontSize: '1.45rem', color: '#FAF8F5', margin: '0.25rem 0 0', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
              Explore By Royal Category Objects
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem'
          }}>
            {categoryObjects.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  background: 'rgba(28, 25, 22, 0.75)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.2rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'var(--pk-gold)';
                  e.currentTarget.style.boxShadow = '0 16px 30px rgba(212, 175, 55, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                }}
              >
                {/* 3D Round Object with Halo Ring */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'var(--pk-gold-gradient)',
                  boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
                  marginBottom: '0.9rem',
                  position: 'relative'
                }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      background: '#121110',
                      display: 'block'
                    }}
                  />
                  {cat.isShortsTrigger && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E4C88A'
                    }}>
                      <Flame size={26} />
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '0.65rem', color: '#E4C88A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                  {cat.badge}
                </span>

                <h4 style={{ fontSize: '0.98rem', color: '#FAF8F5', margin: '0 0 0.25rem', fontWeight: 600 }}>
                  {cat.name}
                </h4>

                <p style={{ fontSize: '0.72rem', color: '#A89E92', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                  {cat.subtitle}
                </p>

                <span className="gold-badge" style={{ fontSize: '0.62rem', padding: '0.1rem 0.5rem' }}>
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── CONTINUOUS FAST HORIZONTAL PRODUCT MARQUEE TICKER ───────────── */}
      <div 
        style={{ 
          background: 'linear-gradient(90deg, #1C1A17 0%, #26221D 50%, #1C1A17 100%)',
          borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '1rem 0 1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ marginBottom: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={16} style={{ color: '#E11D48' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🔥 FAST RUNWAY TICKER • HOT TRENDING DESIGNS ADORNED BY MISS WORLD CONTESTANTS
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#A89E92', fontStyle: 'italic', display: 'none', smDisplay: 'block' }}>
            Hover to pause &amp; tap to inspect
          </span>
        </div>

        {/* Marquee Wrapper */}
        <div className="marquee-container" style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div className="marquee-track" style={{ display: 'inline-flex', gap: '1rem', animation: 'marqueeScroll 26s linear infinite' }}>
            {/* Double the list for seamless continuous infinite glide */}
            {[...hotTrendingProducts, ...hotTrendingProducts].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: 'rgba(18, 17, 16, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 0.85rem 0.5rem 0.5rem',
                  minWidth: '290px',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onClick={() => openProductDetail(item)}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--pk-gold)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)'}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'contain',
                    background: '#161412',
                    padding: '2px',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    flexShrink: 0
                  }}
                />

                <div style={{ overflow: 'hidden', whiteSpace: 'normal', textAlign: 'left', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.62rem', color: '#E4C88A', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.subcategory || item.category}
                    </span>
                    {item.isBestSeller && (
                      <span style={{ background: '#7D1A25', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.05rem 0.3rem', borderRadius: '3px' }}>
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  <h5 style={{ fontSize: '0.82rem', color: '#FAF8F5', fontWeight: 600, margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h5>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                      <span style={{ color: '#E4C88A', fontWeight: 800, fontSize: '0.9rem' }}>
                        ₹{item.price.toLocaleString()}
                      </span>
                      <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.72rem' }}>
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, item.sizes?.[0] || '2.6', 1);
                      }}
                      className="btn-gold"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.68rem', borderRadius: '3px' }}
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag size={11} style={{ marginRight: '2px' }} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

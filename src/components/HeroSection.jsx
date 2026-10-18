import React, { useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Award, 
  ArrowRight, 
  Crown, 
  Flame, 
  ShoppingBag,
  ExternalLink,
  Play,
  Heart
} from 'lucide-react';

export const HeroSection = () => {
  const { 
    customer, 
    openProductDetail, 
    addToCart, 
    setAiStylistOpen, 
    setShortsModalOpen, 
    setActiveShortIndex,
    setActiveCategory,
    setActiveSubcategory,
    heroConfig,
    heroStarProducts,
    wishlist,
    toggleWishlist
  } = useStore();

  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);

  // Default Star Products fallback if state is empty
  const starList = (Array.isArray(heroStarProducts) && heroStarProducts.length > 0) 
    ? heroStarProducts 
    : [
        {
          id: 'star-01',
          name: 'Choti kada pink',
          image: '/images/bangles/Screenshot 2026-09-17 202420.png',
          price: 300,
          originalPrice: 405,
          memberPrice: 285,
          marketingReputation: 'Miss World Gifting Spotlight Piece',
          subcategory: 'Kada',
          category: 'bangles',
          sizes: ['2.4', '2.6', '2.8']
        },
        {
          id: 'star-02',
          name: 'Royal Rajputi Kundan Kada',
          image: '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png',
          price: 1899,
          originalPrice: 2599,
          memberPrice: 1799,
          marketingReputation: 'Celebrity Runway Feature',
          subcategory: 'Kundan Kada',
          category: 'bangles',
          sizes: ['2.4', '2.6', '2.8']
        },
        {
          id: 'star-03',
          name: 'Hyderabadi Nizam Bridal Chura',
          image: '/images/bangles/Gemini_Generated_Image_hldb3jhldb3jhldb.png',
          price: 2499,
          originalPrice: 3499,
          memberPrice: 2349,
          marketingReputation: 'Heritage Pageant Showcase',
          subcategory: 'Bridal Chura',
          category: 'bangles',
          sizes: ['2.4', '2.6', '2.8']
        }
      ];

  // Seamless infinite loop by duplicating list
  const displayStarItems = [...starList, ...starList];

  const formatINR = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-IN');
  };

  // 3D Category circular objects
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
      name: 'Necklace Sets',
      subtitle: 'CZ, AD & Real Pearls',
      count: '6 Haute Sets',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      badge: '💎 Haute Sets',
      targetId: 'bangles-atelier'
    },
    {
      id: 'bracelets',
      name: 'Bracelet & Cuffs',
      subtitle: 'Formal, Wedding, Festive',
      count: 'Handcrafted',
      image: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=400&q=80',
      badge: '✨ Party & Formal',
      targetId: 'bangles-atelier'
    },
    {
      id: 'earrings',
      name: 'Earrings & Jhumkas',
      subtitle: 'Traditional Nizam Craft',
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
    <section 
      className="hero-section" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#121110', 
        color: '#FAF8F5',
        padding: '2.5rem 0 3rem'
      }}
    >
      {/* Subtle Golden Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.16) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(75px)',
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* ========================================================================= */}
        {/* MAIN HERO SPLIT: SHARP BRAND ON ONE SIDE + CONSTANT-TIME MOVING STAR LANE */}
        {/* ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          
          {/* ─── SIDE 1: SHARP CLEAR DESIGN OF BUSINESS NAME "PREMIUM KHAJA" ─── */}
          <div className="hero-brand-card" style={{
            background: 'linear-gradient(135deg, rgba(28, 25, 22, 0.85) 0%, rgba(18, 17, 16, 0.95) 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {/* Top Emblem & Heritage Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--pk-border-gold)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.85rem'
              }}>
                <Crown size={14} style={{ color: '#E4C88A' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#E4C88A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  HYDERABAD HERITAGE • SINCE 1950
                </span>
              </div>
              <span className="gold-badge" style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}>
                100% ARTIFICIAL JEWELLERY
              </span>
            </div>

            {/* Bold, Sharp Business Name Presentation */}
            <div style={{ marginBottom: '1.1rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                lineHeight: 1.08,
                margin: '0 0 0.35rem',
                color: '#FAF8F5'
              }}>
                PREMIUM KHAJA
              </h1>
              <div style={{
                fontSize: '0.86rem',
                letterSpacing: '0.14em',
                color: '#E4C88A',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                High Fashion Artificial &amp; Imitation Jewellery
              </div>
            </div>

            {/* Heritage Tagline & Positioning */}
            <p style={{
              fontSize: '0.96rem',
              color: '#D4C9BC',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
              fontWeight: 300
            }}>
              Discover Hyderabad’s renowned craftsmanship in handcrafted <strong>Glass, Lac, Stone &amp; Minakari Bangles</strong>, bridal chura sets, kundan necklaces, and royal accessories. Curated for wedding splendor, galas, and festive celebrations.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('bangles-atelier');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gold"
                style={{ cursor: 'pointer', border: 'none', padding: '0.8rem 1.4rem' }}
              >
                <span>Explore Bangles Collection</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => {
                  setActiveShortIndex(0);
                  setShortsModalOpen(true);
                }}
                className="btn-outline"
                style={{
                  color: '#FAF8F5',
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                  background: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  padding: '0.8rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Play size={13} fill="#E4C88A" style={{ color: '#E4C88A' }} />
                <span>Watch Shorts</span>
              </button>

              <button
                onClick={() => setAiStylistOpen(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FAF8F5',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.8rem 1.15rem',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Sparkles size={14} style={{ color: '#E4C88A' }} />
                <span>AI Stylist</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: '#C5A059', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Skin-Safe Core</div>
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>Nickel-Free Brass</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: '#C5A059', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Micro-Polish</div>
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>1-Yr Anti-Tarnish</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} style={{ color: '#C5A059', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Express Ship</div>
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>All-India Delivery</div>
                </div>
              </div>
            </div>

          </div>

          {/* ─── SIDE 2: STAR PRODUCTS MOVING IN HORIZONTAL LANE ON CONSTANT TIME ─── */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            
            {/* Lane Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '0.85rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Flame size={16} style={{ color: '#E11D48' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  ★ STAR PRODUCTS • RUNWAY &amp; MARKETING LANE
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#A89E92', fontStyle: 'italic' }}>
                Moving constant lane • Tap card to view
              </span>
            </div>

            {/* Constant Time Marquee Scrolling Track */}
            <div 
              className="marquee-container"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              style={{ 
                width: '100%', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap',
                padding: '0.5rem 0'
              }}
            >
              <div 
                ref={marqueeRef}
                className="hero-star-lane"
                style={{ 
                  display: 'inline-flex', 
                  gap: '1.25rem', 
                  animation: `marqueeScrollConstant 26s linear infinite`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                  willChange: 'transform'
                }}
              >
                {displayStarItems.map((item, idx) => {
                  const displayPrice = customer?.isMember ? (item.memberPrice || item.price) : item.price;
                  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(item.id);

                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        width: '280px',
                        background: 'rgba(24, 21, 18, 0.95)',
                        border: '1.5px solid rgba(212, 175, 55, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
                        cursor: 'pointer',
                        transition: 'transform 0.25s ease, border-color 0.25s ease',
                        position: 'relative'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'var(--pk-gold)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      
                      {/* Marketing / Reputation Top Banner */}
                      <div style={{
                        background: 'linear-gradient(135deg, #7D1A25 0%, #AA822A 100%)',
                        color: '#FAF8F5',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          ★ {item.marketingReputation || 'Pageant & Runway Feature'}
                        </span>
                        <Crown size={11} style={{ flexShrink: 0, marginLeft: '4px' }} />
                      </div>

                      {/* Product Image Frame */}
                      <div 
                        onClick={() => openProductDetail(item)}
                        style={{ 
                          height: '210px', 
                          background: '#161412', 
                          position: 'relative', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          padding: '10px'
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block',
                              transition: 'transform 0.3s'
                            }}
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', height: '100%' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem' }}>
                              <Sparkles size={20} style={{ color: '#D4AF37' }} />
                            </div>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#E4C88A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Artisan Star Piece
                            </span>
                          </div>
                        )}

                        {/* Subcategory Pill */}
                        <span style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          background: 'rgba(18, 17, 16, 0.85)',
                          color: '#E4C88A',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          textTransform: 'uppercase'
                        }}>
                          {item.subcategory || 'Collection'}
                        </span>

                        {/* Wishlist quick tap */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(item.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(18, 17, 16, 0.75)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Heart size={14} style={{ color: isWishlisted ? '#E11D48' : '#FAF8F5', fill: isWishlisted ? '#E11D48' : 'none' }} />
                        </button>
                      </div>

                      {/* Product Details & Actions */}
                      <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        
                        <h4 
                          onClick={() => openProductDetail(item)}
                          style={{
                            fontSize: '0.95rem',
                            color: '#FAF8F5',
                            fontWeight: 700,
                            margin: 0,
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                          }}
                          title={item.name}
                        >
                          {item.name}
                        </h4>

                        {/* Price Row */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ color: '#E4C88A', fontWeight: 800, fontSize: '1.15rem' }}>
                            ₹{formatINR(displayPrice)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.8rem' }}>
                              ₹{formatINR(item.originalPrice)}
                            </span>
                          )}
                          <span className="gold-badge" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                            VIP: ₹{formatINR(item.memberPrice || item.price * 0.95)}
                          </span>
                        </div>

                        {/* Action Buttons: View Details & Add to Bag */}
                        <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.2rem' }}>
                          <button
                            type="button"
                            onClick={() => openProductDetail(item)}
                            className="btn-gold"
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: 'none',
                              borderRadius: '4px',
                              textAlign: 'center'
                            }}
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item, item.sizes?.[0] || '2.6', 1);
                            }}
                            className="btn-primary"
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Add to Bag"
                          >
                            <ShoppingBag size={12} style={{ color: '#E4C88A' }} />
                            <span>+Bag</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* CATEGORY OBJECTS DISCOVERY BAR                                            */}
        {/* ========================================================================= */}
        <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <span style={{ color: '#E4C88A', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ✦ Visual Jewellery Discovery ✦
            </span>
            <h3 style={{ fontSize: '1.45rem', color: '#FAF8F5', margin: '0.25rem 0 0', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
              Explore By Royal Category Objects
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1.15rem'
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
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'var(--pk-gold)';
                  e.currentTarget.style.boxShadow = '0 16px 30px rgba(212, 175, 55, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'var(--pk-gold-gradient)',
                  boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
                  marginBottom: '0.85rem',
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

                <h4 style={{ fontSize: '0.96rem', color: '#FAF8F5', margin: '0 0 0.25rem', fontWeight: 600 }}>
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
    </section>
  );
};

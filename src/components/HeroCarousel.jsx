import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Flame, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export const HeroCarousel = () => {
  const { 
    campaignSlides, 
    claimGate, 
    setShortsModalOpen, 
    setActiveShortIndex,
    setAiStylistOpen,
    setActiveCategory,
    setActiveSubcategory,
    openProductDetail,
    products,
    ALL_PRODUCTS,
    addToCart
  } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter slides based on claim gate and published status
  const visibleSlides = (campaignSlides || []).filter(slide => {
    if (slide.status !== 'published') return false;
    // If it's a gated campaign slide (like Miss World claim), ensure claimGate is published!
    if (slide.isGatedCampaign && claimGate?.claimStatus !== 'published') {
      return false;
    }
    return true;
  });

  const activeSlides = visibleSlides.length > 0 ? visibleSlides : [
    {
      id: 'fallback-01',
      headline: 'Timeless Elegance, in Every Detail',
      subheadline: 'Handcrafted 22K Micro-Gold Plated Heritage Jewellery Atelier from Hyderabad.',
      image: '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png',
      primaryCtaLabel: 'Explore the Collection',
      primaryCtaLink: '#bangles-atelier',
      secondaryCtaLabel: 'Discover Craft',
      secondaryCtaLink: '#craft-promise',
      badge: '👑 Royal Heritage Atelier',
      status: 'published'
    }
  ];

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
  }, []);

  // Automatic Rotation
  useEffect(() => {
    if (!isPlaying || isHovered || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, activeSlides.length]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
  };

  const slide = activeSlides[currentSlide] || activeSlides[0];

  const handleCtaClick = (ctaLink, isShorts) => {
    if (isShorts) {
      setActiveShortIndex(0);
      setShortsModalOpen(true);
      return;
    }
    if (ctaLink?.startsWith('#')) {
      const target = document.querySelector(ctaLink);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (ctaLink) {
      window.location.href = ctaLink;
    }
  };

  // Category discovery objects
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

  const allAvailableProducts = products || ALL_PRODUCTS || [];
  const hotTrendingProducts = allAvailableProducts.slice(0, 10);

  return (
    <section 
      className="hero-carousel-section"
      aria-label="Featured Collection Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#121110', 
        color: '#FAF8F5' 
      }}
    >
      {/* Background Subtle Gradient & Glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.16) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(75px)',
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ padding: '3.5rem 1.25rem 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Main Editorial Hero Slide */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '3rem', 
          alignItems: 'center',
          minHeight: '440px'
        }}>
          
          {/* Left Column: Slide Typography & Actions */}
          <div style={{ animation: 'fadeIn 0.5s ease' }} key={`text-${slide.id}`}>
            
            {/* Slide Badge */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(212, 175, 55, 0.16)', 
              border: '1px solid rgba(212, 175, 55, 0.45)', 
              borderRadius: 'var(--radius-full)', 
              padding: '0.35rem 0.95rem', 
              marginBottom: '1.25rem' 
            }}>
              <Crown size={14} style={{ color: '#E4C88A' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {slide.badge || 'Royal Heritage Atelier'}
              </span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', 
              lineHeight: 1.12, 
              marginBottom: '1.2rem', 
              fontFamily: 'var(--font-serif)', 
              fontWeight: 500 
            }}>
              {slide.headline}
            </h1>

            <p style={{ 
              fontSize: '1.02rem', 
              color: '#D4C9BC', 
              lineHeight: 1.6, 
              maxWidth: '540px', 
              marginBottom: '1.8rem', 
              fontWeight: 300 
            }}>
              {slide.subheadline}
            </p>

            {/* Slide Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '2.25rem' }}>
              <button
                onClick={() => handleCtaClick(slide.primaryCtaLink, slide.isShortsTrigger)}
                className="btn-gold"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <span>{slide.primaryCtaLabel || 'Explore the Collection'}</span>
                <ArrowRight size={16} />
              </button>

              {slide.secondaryCtaLabel && (
                <button
                  onClick={() => handleCtaClick(slide.secondaryCtaLink, false)}
                  className="btn-outline"
                  style={{ 
                    color: '#FAF8F5', 
                    borderColor: 'rgba(212, 175, 55, 0.5)', 
                    background: 'rgba(255,255,255,0.04)', 
                    cursor: 'pointer' 
                  }}
                >
                  <Sparkles size={15} style={{ color: '#E4C88A' }} />
                  <span>{slide.secondaryCtaLabel}</span>
                </button>
              )}

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
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '1.25rem', 
              borderTop: '1px solid rgba(255,255,255,0.1)', 
              paddingTop: '1.5rem' 
            }}>
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
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>Free &gt; ₹1,499 &amp; Twin Cities</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Slide Image Spotlight Card */}
          <div style={{ position: 'relative' }} key={`img-${slide.id}`}>
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)', 
              border: '1px solid rgba(212, 175, 55, 0.35)',
              position: 'relative',
              background: '#1A1816'
            }}>
              <img 
                src={slide.image} 
                alt={slide.headline}
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                style={{ 
                  width: '100%', 
                  height: '420px', 
                  objectFit: 'contain', 
                  background: '#181614', 
                  display: 'block', 
                  padding: '1.2rem',
                  transition: 'opacity 0.4s ease'
                }}
              />
              
              {/* Overlay Glass Card */}
              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                left: '15px', 
                right: '15px', 
                background: 'rgba(18, 17, 16, 0.92)', 
                backdropFilter: 'blur(10px)', 
                padding: '1rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#E4C88A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                      Campaign Focus {currentSlide + 1} of {activeSlides.length}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', color: '#FAF8F5', margin: '0.1rem 0 0.2rem' }}>
                    {slide.headline}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#D4C9BC' }}>
                    {slide.badge}
                  </div>
                </div>

                <button 
                  onClick={() => handleCtaClick(slide.primaryCtaLink, slide.isShortsTrigger)}
                  className="btn-gold" 
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}
                >
                  {slide.primaryCtaLabel || 'Discover'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Controls Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '2rem', 
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Slide Indicator Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {activeSlides.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: currentSlide === idx ? '28px' : '9px',
                  height: '9px',
                  borderRadius: 'var(--radius-full)',
                  background: currentSlide === idx ? 'var(--pk-gold)' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0
                }}
              />
            ))}
          </div>

          {/* Navigation Arrows & Play/Pause */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsPlaying(p => !p)}
              title={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FAF8F5',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>

            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FAF8F5',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FAF8F5',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ─── 3D CATEGORY OBJECTS DISCOVERY BAR ────────────────── */}
        <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
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
                onClick={() => {
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
                }}
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

      {/* ─── CONTINUOUS FAST RUNWAY PRODUCT MARQUEE TICKER ───────────── */}
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
              🔥 FAST RUNWAY TICKER • SIGNATURE HANDCRAFTED BANGLES &amp; KADAS
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#A89E92', fontStyle: 'italic' }}>
            Hover to pause &amp; tap to inspect
          </span>
        </div>

        <div className="marquee-container" style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div className="marquee-track" style={{ display: 'inline-flex', gap: '1rem', animation: 'marqueeScroll 26s linear infinite' }}>
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
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.68rem', borderRadius: '3px', cursor: 'pointer', border: 'none' }}
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

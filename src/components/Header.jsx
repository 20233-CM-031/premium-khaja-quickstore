import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Search, 
  Crown, 
  X, 
  LayoutDashboard,
  LogOut,
  User,
  Play
} from 'lucide-react';

export const Header = () => {
  const { 
    customer, 
    adminUser,
    logoutCustomer,
    logoutAdmin,
    cart, 
    wishlist, 
    setCartOpen, 
    setMemberCardOpen, 
    setAiStylistOpen,
    setAuthModalOpen,
    setAuthMode,
    setAuthIntent,
    handleAdminModeSwitch,
    searchQuery,
    setSearchQuery,
    setShortsModalOpen,
    setActiveShortIndex,
    products,
    ALL_PRODUCTS,
    openProductDetail,
    setActiveCategory,
    heroConfig
  } = useStore();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  const allAvailable = products || ALL_PRODUCTS || [];
  const searchMatches = searchQuery.trim() ? allAvailable.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    return (item.name && item.name.toLowerCase().includes(q)) ||
           (item.subcategory && item.subcategory.toLowerCase().includes(q)) ||
           (item.category && item.category.toLowerCase().includes(q)) ||
           (item.finish && item.finish.toLowerCase().includes(q));
  }).slice(0, 5) : [];

  const handleOpenAuth = (mode = 'login', intent = 'general') => {
    setAuthMode(mode);
    setAuthIntent(intent);
    setAuthModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchFocused(false);
    setMobileSearchOpen(false);
    setActiveCategory('all');
    const el = document.getElementById('bangles-atelier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header-wrapper" style={{ position: 'relative', zIndex: 100 }}>
      
      {/* 1. TOP ANNOUNCEMENT BAR (In natural flow: scrolls away on mobile so it doesn't freeze the screen!) */}
      <div style={{ 
        background: '#121110', 
        color: '#FAF8F5', 
        padding: '0.4rem 1rem', 
        fontSize: '0.74rem', 
        letterSpacing: '0.04em',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="live-pulse"></span>
            <span style={{ color: '#E4C88A', fontWeight: 600 }}>
              {heroConfig?.announcementBadge || "PREMIUM KHAJA • HYDERABAD'S ARTIFICIAL & IMITATION JEWELLERY ATELIER"}
            </span>
            <span style={{ opacity: 0.4 }} className="desktop-only">|</span>
            <span style={{ color: '#D4C9BC' }} className="desktop-only">Handcrafted Lac, Glass, Kundan &amp; AD Fashion Jewellery</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ color: '#E4C88A', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} className="desktop-only">
              <Sparkles size={12} />
              <span>100% Artificial / Imitation Jewellery</span>
            </span>

            {/* Admin Session Badge */}
            {adminUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button 
                  onClick={handleAdminModeSwitch}
                  style={{ 
                    background: '#D4AF37', 
                    color: '#121110',
                    border: 'none', 
                    borderRadius: '4px',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.7rem', 
                    fontWeight: 700,
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem'
                  }}
                >
                  <LayoutDashboard size={11} />
                  <span>Admin Panel</span>
                </button>
                <button 
                  onClick={logoutAdmin}
                  title="Log out of Admin mode"
                  style={{ background: 'transparent', border: 'none', color: '#FFB4B4', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  <LogOut size={11} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. STICKY NAVIGATION BAR (Slim, sleek, mobile-optimized height: ~54px) */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(255, 255, 255, 0.96)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--pk-border)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.25s ease'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.55rem 1rem', 
          gap: '0.75rem',
          minHeight: '52px'
        }}>
          
          {/* Brand Emblem & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(1.2rem, 2.6vw, 1.65rem)', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                color: 'var(--pk-obsidian)',
                lineHeight: 1
              }}>
                PREMIUM KHAJA
              </span>
              <span style={{ 
                fontSize: '0.56rem', 
                letterSpacing: '0.18em', 
                color: 'var(--pk-gold-dark)', 
                textTransform: 'uppercase',
                fontWeight: 700,
                marginTop: '0.15rem'
              }}>
                Heritage Artificial Jewellery • Est. 1950
              </span>
            </a>
          </div>

          {/* Desktop Search Bar with Live Instant Results */}
          <div className="desktop-search-box" style={{ flex: '1', maxWidth: '360px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)', pointerEvents: 'none', zIndex: 2 }} />
            <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
              <input 
                type="text" 
                placeholder="Search bangles, kadas, chokers, lac..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem 2.2rem 0.5rem 2.2rem', 
                  borderRadius: 'var(--radius-full)', 
                  border: '1px solid var(--pk-border)',
                  background: 'var(--pk-surface-alt)',
                  fontSize: '0.82rem',
                  color: 'var(--pk-text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </form>
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setSearchFocused(false); }}
                style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pk-text-muted)', zIndex: 2 }}
              >
                <X size={14} />
              </button>
            )}

            {/* Instant Live Search Results Floating Panel */}
            {searchFocused && searchQuery.trim() && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                background: '#FFFFFF',
                border: '1px solid var(--pk-border-gold)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200,
                padding: '0.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                maxHeight: '340px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', padding: '0.2rem 0.5rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Found {searchMatches.length} matching pieces</span>
                  <span onClick={handleSearchSubmit} style={{ color: 'var(--pk-gold-dark)', cursor: 'pointer', fontWeight: 700 }}>View All in Showroom ↓</span>
                </div>

                {searchMatches.length > 0 ? (
                  searchMatches.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        openProductDetail(item);
                        setSearchFocused(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        background: 'var(--pk-bg)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--pk-surface-alt)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'var(--pk-bg)'}
                    >
                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0, background: '#fff' }} />
                      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                          ₹{Number(item.price || 0).toLocaleString('en-IN')} • <span style={{ color: 'var(--pk-text-muted)', fontWeight: 500 }}>{item.subcategory || 'Bangle'}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        View →
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--pk-text-muted)' }}>
                    No exact match found. Press Enter to view full catalogue.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Action Buttons (Shorts & AI Stylist on Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            
            {/* Royal Shorts Video Reels Button (Desktop) */}
            <button 
              onClick={() => {
                setActiveShortIndex(0);
                setShortsModalOpen(true);
              }}
              className="desktop-only"
              style={{ 
                background: 'linear-gradient(135deg, #221F1B 0%, #302A24 100%)', 
                color: '#FAF8F5', 
                border: '1px solid var(--pk-border-gold)',
                borderRadius: 'var(--radius-full)',
                padding: '0.42rem 0.8rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Watch Royal Jewellery Shorts & Video Reels"
            >
              <Play size={11} fill="#E4C88A" style={{ color: '#E4C88A' }} />
              <span>Shorts</span>
            </button>

            {/* AI Stylist Button (Desktop) */}
            <button 
              onClick={() => setAiStylistOpen(true)}
              className="desktop-only"
              style={{ 
                background: 'linear-gradient(135deg, #1E1C1A 0%, #352F2B 100%)', 
                color: '#FAF8F5', 
                border: '1px solid var(--pk-border-gold)',
                borderRadius: 'var(--radius-full)',
                padding: '0.42rem 0.8rem',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Sparkles size={13} style={{ color: '#E4C88A' }} />
              <span>AI Stylist</span>
            </button>

            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setMobileSearchOpen(prev => !prev)}
              aria-label="Toggle mobile search"
              className="mobile-only-icon"
              style={{
                background: mobileSearchOpen ? 'var(--pk-surface-alt)' : 'transparent',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--pk-obsidian)'
              }}
            >
              <Search size={18} />
            </button>

            {/* Member VIP & Login (Desktop) */}
            <div className="desktop-only">
              {customer?.isLoggedIn ? (
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    style={{ 
                      background: 'rgba(197, 160, 89, 0.12)', 
                      border: '1px solid var(--pk-border-gold)', 
                      borderRadius: 'var(--radius-full)',
                      padding: '0.42rem 0.8rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--pk-gold-dark)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Crown size={13} />
                    <span>{customer.name?.split(' ')[0] || 'Member'} (VIP 5%)</span>
                  </button>

                  {profileDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '120%',
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid var(--pk-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      width: '210px',
                      padding: '0.5rem',
                      zIndex: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--pk-surface-alt)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                          {customer.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>
                          {customer.email || customer.phone}
                        </div>
                      </div>

                      <button
                        onClick={() => { setMemberCardOpen(true); setProfileDropdownOpen(false); }}
                        style={{ background: 'transparent', border: 'none', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--pk-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '4px' }}
                      >
                        <Crown size={14} style={{ color: 'var(--pk-gold-dark)' }} />
                        <span>Digital Member Card</span>
                      </button>

                      <button
                        onClick={() => { logoutCustomer(); setProfileDropdownOpen(false); }}
                        style={{ background: 'transparent', border: 'none', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', color: '#9F1239', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '4px' }}
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button 
                    onClick={() => setMemberCardOpen(true)}
                    style={{ 
                      background: 'rgba(212, 175, 55, 0.12)', 
                      border: '1px solid var(--pk-border-gold)', 
                      borderRadius: 'var(--radius-full)',
                      padding: '0.42rem 0.75rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--pk-gold-dark)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Crown size={12} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>VIP Club</span>
                  </button>

                  <button 
                    onClick={() => handleOpenAuth('login', 'general')}
                    style={{ 
                      background: 'var(--pk-surface-alt)', 
                      border: '1px solid var(--pk-border)', 
                      borderRadius: 'var(--radius-full)',
                      padding: '0.42rem 0.75rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: 'var(--pk-text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <User size={12} />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button 
              className="btn-icon" 
              title="Saved Items"
              onClick={() => {
                if (!customer?.isLoggedIn) {
                  handleOpenAuth('login', 'wishlist');
                  return;
                }
                if (wishlistCount === 0) {
                  alert("Your wishlist is empty. Tap the heart icon on any bangle or jewelry piece to save it!");
                }
              }}
              style={{ 
                position: 'relative', 
                width: '36px', 
                height: '36px', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--pk-obsidian)'
              }}
            >
              <Heart size={19} style={{ color: wishlistCount > 0 ? '#7D1A25' : 'inherit', fill: wishlistCount > 0 ? '#7D1A25' : 'none' }} />
              {wishlistCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '1px', 
                  right: '1px', 
                  background: '#7D1A25', 
                  color: '#fff', 
                  fontSize: '0.62rem', 
                  borderRadius: '50%', 
                  width: '15px', 
                  height: '15px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700 
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag Icon */}
            <button 
              onClick={() => setCartOpen(true)}
              style={{ 
                background: 'var(--pk-obsidian)', 
                color: '#FAF8F5', 
                border: 'none', 
                borderRadius: 'var(--radius-full)',
                padding: '0.42rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem',
                position: 'relative'
              }}
            >
              <ShoppingBag size={16} style={{ color: '#E4C88A' }} />
              <span className="desktop-only">Bag</span>
              {cartItemsCount > 0 && (
                <span style={{ 
                  background: 'var(--pk-gold-gradient)', 
                  color: '#121110', 
                  borderRadius: '50%', 
                  width: '18px', 
                  height: '18px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.68rem', 
                  fontWeight: 800 
                }}>
                  {cartItemsCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* 3. MOBILE SEARCH ROW (Expands smoothly on tap, doesn't permanently clutter the screen) */}
        {mobileSearchOpen && (
          <div style={{ 
            padding: '0.5rem 1rem 0.75rem', 
            background: '#FFFFFF', 
            borderTop: '1px solid var(--pk-border)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pk-text-muted)', pointerEvents: 'none' }} />
              <input 
                type="text" 
                placeholder="Search bangles, kadas, chokers, lac..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.55rem 2.2rem 0.55rem 2.2rem', 
                  borderRadius: 'var(--radius-full)', 
                  border: '1px solid var(--pk-border)',
                  background: 'var(--pk-surface-alt)',
                  fontSize: '0.84rem',
                  color: 'var(--pk-text-primary)',
                  outline: 'none'
                }}
              />
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setMobileSearchOpen(false); }}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pk-text-muted)' }}
              >
                <X size={15} />
              </button>
            </form>

            {/* Mobile Instant Results */}
            {searchQuery.trim() && searchMatches.length > 0 && (
              <div style={{ marginTop: '0.5rem', background: '#FAFAF8', borderRadius: '6px', border: '1px solid var(--pk-border)', padding: '0.4rem' }}>
                {searchMatches.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      openProductDetail(item);
                      setMobileSearchOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem',
                      borderBottom: '1px solid #EFEAE4',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', background: '#fff' }} />
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 4. MOBILE QUICK ACCESS CHIP LANE (In standard flow: scrolls with page, zero rigid screen block!) */}
      <div className="mobile-quick-pills-row" style={{
        background: '#FAF8F5',
        borderBottom: '1px solid var(--pk-border)',
        padding: '0.5rem 0.85rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        display: 'none', // Shown on mobile via CSS
        whiteSpace: 'nowrap',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => {
            setActiveShortIndex(0);
            setShortsModalOpen(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #181614 0%, #2A2420 100%)',
            color: '#FAF8F5',
            border: '1px solid var(--pk-border-gold)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <Play size={10} fill="#E4C88A" style={{ color: '#E4C88A' }} />
          <span>Shorts</span>
        </button>

        <button
          onClick={() => setAiStylistOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #181614 0%, #2A2420 100%)',
            color: '#FAF8F5',
            border: '1px solid var(--pk-border-gold)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={11} style={{ color: '#E4C88A' }} />
          <span>AI Stylist</span>
        </button>

        <button
          onClick={() => setMemberCardOpen(true)}
          style={{
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--pk-gold-dark)',
            border: '1px solid var(--pk-border-gold)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <Crown size={11} style={{ color: 'var(--pk-gold-dark)' }} />
          <span>VIP 5% Off</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('bangles-atelier');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            background: '#FFFFFF',
            color: 'var(--pk-text-primary)',
            border: '1px solid var(--pk-border)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <span>All Bangles</span>
        </button>

        {!customer?.isLoggedIn && (
          <button
            onClick={() => handleOpenAuth('login', 'general')}
            style={{
              background: '#FFFFFF',
              color: 'var(--pk-text-primary)',
              border: '1px solid var(--pk-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <User size={11} />
            <span>Login</span>
          </button>
        )}
      </div>

    </header>
  );
};

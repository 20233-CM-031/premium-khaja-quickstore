import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Search, 
  Crown, 
  ShieldAlert, 
  Menu, 
  X, 
  Store, 
  LayoutDashboard,
  QrCode,
  UserCheck,
  User,
  LogOut,
  KeyRound,
  Award,
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
    setQrModalOpen,
    setAuthModalOpen,
    setAuthMode,
    setAuthIntent,
    activeMode, 
    handleAdminModeSwitch,
    searchQuery,
    setSearchQuery,
    setShortsModalOpen,
    setActiveShortIndex,
    products,
    ALL_PRODUCTS,
    openProductDetail,
    setActiveCategory
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const allAvailable = products || ALL_PRODUCTS || [];
  const searchMatches = searchQuery.trim() ? allAvailable.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    return (item.name && item.name.toLowerCase().includes(q)) ||
           (item.subcategory && item.subcategory.toLowerCase().includes(q)) ||
           (item.category && item.category.toLowerCase().includes(q)) ||
           (item.stoneType && item.stoneType.toLowerCase().includes(q)) ||
           (item.finish && item.finish.toLowerCase().includes(q)) ||
           (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
  }).slice(0, 5) : [];

  const handleOpenAuth = (mode = 'login', intent = 'general') => {
    setAuthMode(mode);
    setAuthIntent(intent);
    setAuthModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchFocused(false);
    setActiveCategory('all');
    const el = document.getElementById('bangles-atelier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid var(--pk-border)' }}>
      
      {/* Top Luxury Announcement Bar - Clean, Customer-Centric */}
      <div style={{ background: '#121110', color: '#FAF8F5', padding: '0.42rem 1rem', fontSize: '0.78rem', letterSpacing: '0.03em' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="live-pulse"></span>
            <span>
              <strong style={{ color: '#E4C88A' }}>MISS WORLD 2025:</strong> Official Cultural Adornment Atelier
            </span>
            <span style={{ opacity: 0.4 }} className="desktop-only">|</span>
            <span style={{ color: '#D4C9BC' }} className="desktop-only">Complimentary Velvet Jewellery Box on orders &gt; ₹1,999</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ color: '#E4C88A', fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={12} />
              <span>Certified 22K Micro-Gold</span>
            </span>

            {/* If Admin session is ACTIVE, show subtle Command Center badge */}
            {adminUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button 
                  onClick={handleAdminModeSwitch}
                  style={{ 
                    background: '#D4AF37', 
                    color: '#121110',
                    border: 'none', 
                    borderRadius: '4px',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.72rem', 
                    fontWeight: 700,
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem'
                  }}
                >
                  <LayoutDashboard size={12} />
                  <span>Command Center</span>
                </button>
                <button 
                  onClick={logoutAdmin}
                  title="Log out of Admin mode"
                  style={{ background: 'transparent', border: 'none', color: '#FFB4B4', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <LogOut size={12} />
                  <span>Exit</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand Emblem & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(1.25rem, 2.8vw, 1.75rem)', 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              color: 'var(--pk-obsidian)',
              lineHeight: 1
            }}>
              PREMIUM KHAJA
            </span>
            <span style={{ 
              fontSize: '0.58rem', 
              letterSpacing: '0.2em', 
              color: 'var(--pk-gold-dark)', 
              textTransform: 'uppercase',
              fontWeight: 700,
              marginTop: '0.2rem'
            }}>
              Miss World 2025 Haute Atelier
            </span>
          </a>
        </div>

        {/* Search Bar / Input (Desktop) with Live Instant Results */}
        <div className="header-search-container desktop-search-box" style={{ flex: '1', maxWidth: '380px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)', pointerEvents: 'none', zIndex: 2 }} />
          <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search bangles, kadas, neck, cz, lac..."
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.55rem 2.2rem 0.55rem 2.3rem', 
                borderRadius: 'var(--radius-full)', 
                border: '1px solid var(--pk-border)',
                background: 'var(--pk-surface-alt)',
                fontSize: '0.84rem',
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
                <span onClick={handleSearchSubmit} style={{ color: 'var(--pk-gold-dark)', cursor: 'pointer', fontWeight: 700 }}>View All in Catalog ↓</span>
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
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                        ₹{item.price.toLocaleString()} • <span style={{ color: 'var(--pk-text-muted)', fontWeight: 500 }}>{item.subcategory}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      View →
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--pk-text-muted)' }}>
                  No exact match. Press Enter to search entire catalog.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Role-Based Customer Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          
          {/* Royal Shorts Video Reels Button */}
          <button 
            onClick={() => {
              setActiveShortIndex(0);
              setShortsModalOpen(true);
            }}
            style={{ 
              background: 'linear-gradient(135deg, #221F1B 0%, #302A24 100%)', 
              color: '#FAF8F5', 
              border: '1px solid var(--pk-border-gold)',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}
            title="Watch Royal Jewellery Shorts & Video Reels"
          >
            <Play size={12} fill="#E4C88A" style={{ color: '#E4C88A' }} />
            <span>Shorts</span>
          </button>

          {/* AI Stylist Button */}
          <button 
            onClick={() => setAiStylistOpen(true)}
            style={{ 
              background: 'linear-gradient(135deg, #1E1C1A 0%, #352F2B 100%)', 
              color: '#FAF8F5', 
              border: '1px solid var(--pk-border-gold)',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}
          >
            <Sparkles size={14} style={{ color: '#E4C88A' }} />
            <span>AI Stylist</span>
          </button>


          {/* User / Member Role Status */}
          {customer.isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{ 
                  background: 'rgba(197, 160, 89, 0.12)', 
                  border: '1px solid var(--pk-border-gold)', 
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--pk-gold-dark)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Crown size={14} />
                <span>{customer.name?.split(' ')[0] || 'Member'} (VIP 5%)</span>
              </button>

              {/* Profile Dropdown */}
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
                    style={{ background: 'transparent', border: 'none', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--pk-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '4px' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--pk-surface-alt)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Crown size={14} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>Digital Member Card</span>
                  </button>

                  <button
                    onClick={() => { logoutCustomer(); setProfileDropdownOpen(false); }}
                    style={{ background: 'transparent', border: 'none', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#9F1239', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '4px' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#FFF1F2'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest / Public Mode: Member Benefits + Sign In */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                onClick={() => setMemberCardOpen(true)}
                title="Explore PK Club VIP Membership Perks"
                style={{ 
                  background: 'rgba(212, 175, 55, 0.15)', 
                  border: '1px solid var(--pk-border-gold)', 
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--pk-gold-dark)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s'
                }}
              >
                <Crown size={13} style={{ color: 'var(--pk-gold-dark)' }} />
                <span>VIP Club (Save 5%)</span>
              </button>

              <button 
                onClick={() => handleOpenAuth('login', 'general')}
                style={{ 
                  background: 'var(--pk-surface-alt)', 
                  border: '1px solid var(--pk-border)', 
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--pk-text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s'
                }}
              >
                <User size={13} />
                <span>Login</span>
              </button>
            </div>
          )}

          {/* Wishlist */}
          <button 
            className="btn-icon" 
            title="Saved Items"
            onClick={() => {
              if (!customer.isLoggedIn) {
                handleOpenAuth('login', 'wishlist');
                return;
              }
              if (wishlist.length === 0) {
                alert("Your wishlist is empty. Tap the heart icon on any bangle or jewelry piece to save it!");
              }
            }}
            style={{ position: 'relative' }}
          >
            <Heart size={20} style={{ color: wishlist.length > 0 ? '#7D1A25' : 'inherit', fill: wishlist.length > 0 ? '#7D1A25' : 'none' }} />
            {wishlist.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '2px', 
                right: '2px', 
                background: '#7D1A25', 
                color: '#fff', 
                fontSize: '0.65rem', 
                borderRadius: '50%', 
                width: '16px', 
                height: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700 
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button 
            onClick={() => setCartOpen(true)}
            style={{ 
              background: 'var(--pk-obsidian)', 
              color: '#FAF8F5', 
              border: 'none', 
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 1.05rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              position: 'relative'
            }}
          >
            <ShoppingBag size={17} style={{ color: '#E4C88A' }} />
            <span>Bag</span>
            {cartItemsCount > 0 && (
              <span style={{ 
                background: 'var(--pk-gold-gradient)', 
                color: '#121110', 
                borderRadius: '50%', 
                width: '20px', 
                height: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.72rem', 
                fontWeight: 800 
              }}>
                {cartItemsCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Dedicated Mobile Search Row (Mobile Viewport Only) */}
      <div className="mobile-search-row" style={{ padding: '0 1rem 0.75rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pk-text-muted)', pointerEvents: 'none' }} />
          <input 
            type="text" 
            placeholder="Search 42+ bangles, kadas, neck, cz, lac..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.55rem 2.2rem 0.55rem 2.2rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--pk-border)',
              background: 'var(--pk-surface-alt)',
              fontSize: '0.82rem',
              color: 'var(--pk-text-primary)',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pk-text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>
    </header>
  );
};

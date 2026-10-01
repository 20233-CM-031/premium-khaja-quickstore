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
  Award
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
    setSearchQuery
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenAuth = (mode = 'login', intent = 'general') => {
    setAuthMode(mode);
    setAuthIntent(intent);
    setAuthModalOpen(true);
  };

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid var(--pk-border)' }}>
      
      {/* Top Luxury Announcement Bar (Spacious, Breathable) */}
      <div style={{ background: '#121110', color: '#FAF8F5', padding: '0.45rem 1rem', fontSize: '0.78rem', letterSpacing: '0.03em' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="live-pulse"></span>
            <span>
              <strong style={{ color: '#E4C88A' }}>MISS WORLD 2025 INDIA:</strong> Official Pageant Adornment Atelier
            </span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ color: '#D4C9BC' }}>Complimentary Velvet Jewellery Box &gt; ₹1,999</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setQrModalOpen(true)}
              style={{ background: 'transparent', border: 'none', color: '#FAF8F5', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.9 }}
            >
              <QrCode size={13} style={{ color: '#E4C88A' }} />
              <span>Offline QR Bridge</span>
            </button>

            {/* Merchant Command Center Button (Protected with Admin Login!) */}
            <button 
              onClick={handleAdminModeSwitch}
              style={{ 
                background: adminUser ? '#D4AF37' : 'rgba(255,255,255,0.12)', 
                color: adminUser ? '#121110' : '#FAF8F5',
                border: 'none', 
                borderRadius: '4px',
                padding: '0.22rem 0.65rem',
                fontSize: '0.74rem', 
                fontWeight: 700,
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem',
                transition: 'all 0.2s'
              }}
            >
              <LayoutDashboard size={13} />
              <span>{adminUser ? 'Merchant Command Center' : 'Admin Portal'}</span>
            </button>

            {adminUser && (
              <button 
                onClick={logoutAdmin}
                title="Log out of Admin mode"
                style={{ background: 'transparent', border: 'none', color: '#FFB4B4', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <LogOut size={12} />
                <span>Exit Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', gap: '1.25rem' }}>
        
        {/* Brand Emblem & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em', 
              color: 'var(--pk-obsidian)',
              lineHeight: 1
            }}>
              PREMIUM KHAJA
            </span>
            <span style={{ 
              fontSize: '0.62rem', 
              letterSpacing: '0.24em', 
              color: 'var(--pk-gold-dark)', 
              textTransform: 'uppercase',
              fontWeight: 700,
              marginTop: '0.25rem'
            }}>
              Miss World 2025 India Haute Atelier
            </span>
          </a>
        </div>

        {/* Search Bar / Input (Spacious with clear icon) */}
        <div style={{ flex: '1', maxWidth: '400px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)', pointerEvents: 'none' }} />
          <input 
            type="text" 
            placeholder="Search bangles, glass, lac, AD, cz, pearls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.6rem 1rem 0.6rem 2.4rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--pk-border)',
              background: 'var(--pk-surface-alt)',
              fontSize: '0.85rem',
              color: 'var(--pk-text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pk-text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right Action Icons & Role-Based Customer Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
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
            /* Guest / Public Mode: Sign In Button */
            <button 
              onClick={() => handleOpenAuth('login', 'general')}
              style={{ 
                background: 'var(--pk-surface-alt)', 
                border: '1px solid var(--pk-border)', 
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--pk-text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              <User size={14} />
              <span>Sign In / Register</span>
            </button>
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
    </header>
  );
};

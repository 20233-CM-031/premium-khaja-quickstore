import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Home, 
  Layers, 
  Flame, 
  Heart, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { 
    cart, 
    wishlist, 
    setCartOpen, 
    setShortsModalOpen, 
    setActiveShortIndex,
    setAiStylistOpen,
    setActiveCategory,
    setActiveSubcategory
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleHomeClick = () => {
    setActiveCategory('all');
    setActiveSubcategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    const el = document.getElementById('bangles-atelier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShortsClick = () => {
    setActiveShortIndex(0);
    setShortsModalOpen(true);
  };

  return (
    <nav 
      className="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: 'rgba(18, 17, 16, 0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.35)',
        display: 'none', // Handled via CSS @media or inline display on small screens
        padding: '0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        
        {/* Home */}
        <button
          onClick={handleHomeClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 600
          }}
        >
          <Home size={18} style={{ color: '#E4C88A' }} />
          <span>Home</span>
        </button>

        {/* Products / Shop */}
        <button
          onClick={handleCategoriesClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 600
          }}
        >
          <Layers size={18} style={{ color: '#E4C88A' }} />
          <span>Shop</span>
        </button>

        {/* Shorts */}
        <button
          onClick={handleShortsClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 600
          }}
        >
          <Flame size={18} style={{ color: '#E11D48' }} />
          <span>Reels</span>
        </button>

        {/* AI Stylist */}
        <button
          onClick={() => setAiStylistOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 600
          }}
        >
          <Sparkles size={18} style={{ color: '#E4C88A' }} />
          <span>Stylist</span>
        </button>

        {/* Bag */}
        <button
          onClick={() => setCartOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontWeight: 600,
            position: 'relative'
          }}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={18} style={{ color: '#E4C88A' }} />
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-10px',
                background: '#E11D48',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
                fontWeight: 900
              }}>
                {totalCartCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>

      </div>
    </nav>
  );
};

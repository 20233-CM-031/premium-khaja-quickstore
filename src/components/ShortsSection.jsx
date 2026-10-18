import React from 'react';
import { useStore } from '../context/StoreContext';
import { Play, Sparkles, Eye, Flame, Bell, Star } from 'lucide-react';

export const ShortsSection = () => {
  const { shortsList, openShortAt, products, openProductDetail } = useStore();

  if (!shortsList || shortsList.length === 0) return null;

  return (
    <section 
      id="shorts-showcase" 
      style={{ 
        padding: '1.75rem 0 2.25rem', 
        background: '#151311', 
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Unnamed Section Flow: Sleek Horizontal Scroll / Grid of Exotic Drops & Announcements */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1rem' 
          }}
        >
          {shortsList.map((short, idx) => {
            const product = products.find(p => p.id === short.taggedProductId);
            const isAnnouncement = short.type === 'announcement' || short.badge?.toLowerCase().includes('announcement');

            return (
              <div
                key={short.id}
                onClick={() => {
                  if (short.videoUrl) {
                    openShortAt(idx);
                  } else if (product) {
                    openProductDetail(product);
                  } else {
                    openShortAt(idx);
                  }
                }}
                style={{
                  position: 'relative',
                  minHeight: '260px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isAnnouncement ? '1.5px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(212, 175, 55, 0.25)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: 'linear-gradient(145deg, #1E1B17 0%, #11100E 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.15rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--pk-gold)';
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.55)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isAnnouncement ? 'rgba(212, 175, 55, 0.5)' : 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
                }}
              >
                {/* Poster Image if uploaded by Admin */}
                {short.posterImage ? (
                  <img
                    src={short.posterImage}
                    alt={short.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      zIndex: 1
                    }}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.08, background: 'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 70%)', pointerEvents: 'none' }} />
                )}

                {/* Top Badge: Exotic Drop or Announcement */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isAnnouncement ? 'rgba(212, 175, 55, 0.22)' : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#E4C88A',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px'
                  }}>
                    {isAnnouncement ? <Bell size={11} /> : <Star size={11} />}
                    <span>{short.badge || (isAnnouncement ? 'Announcement' : 'Exotic Product')}</span>
                  </span>

                  <span style={{ fontSize: '0.68rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Eye size={12} style={{ color: '#D4AF37' }} />
                    <span>{short.viewsCount || '18K'}</span>
                  </span>
                </div>

                {/* Center Video/Reel Indicator */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: '1rem 0' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1.5px solid #D4AF37',
                    color: '#FAF8F5',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    transition: 'transform 0.2s'
                  }}>
                    <Play size={18} fill="#D4AF37" style={{ marginLeft: '2px', color: '#D4AF37' }} />
                  </div>
                </div>

                {/* Bottom Content: Title & Tagged Product */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h4 style={{
                    color: '#FAF8F5',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    margin: '0 0 0.3rem',
                    lineHeight: 1.35
                  }}>
                    {short.title}
                  </h4>

                  <p style={{
                    color: '#BDB3A6',
                    fontSize: '0.74rem',
                    margin: '0 0 0.65rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {short.description}
                  </p>

                  {product && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      <span style={{ fontSize: '0.74rem', color: '#FAF8F5', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {product.name}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#E4C88A', fontWeight: 800 }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

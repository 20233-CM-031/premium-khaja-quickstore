import React from 'react';
import { useStore } from '../context/StoreContext';
import { Play, Sparkles, Eye, Heart, Flame } from 'lucide-react';

export const ShortsSection = () => {
  const { shortsList, openShortAt, products } = useStore();

  if (!shortsList || shortsList.length === 0) return null;

  return (
    <section 
      id="royal-shorts-section" 
      style={{ 
        padding: '3.5rem 0', 
        background: '#161412', 
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem', marginBottom: '0.6rem' }}>
              <Flame size={14} style={{ color: '#E4C88A' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E4C88A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Runway & Atelier Reels
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#FAF8F5', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
              Royal Shorts <span className="gold-gradient-text" style={{ fontStyle: 'italic' }}>— Watch & Shop</span>
            </h2>
            <p style={{ color: '#C5BAAB', fontSize: '0.92rem', margin: '0.4rem 0 0', maxWidth: '600px' }}>
              Experience handcrafted bridal jewellery in dynamic motion. Tap any reel to watch in full-screen and shop the featured adornment in 1-click.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
              {shortsList.length} Curated Reels
            </span>
          </div>
        </div>

        {/* Reels Horizontal Showcase */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.25rem' 
          }}
        >
          {shortsList.map((short, idx) => {
            const product = products.find(p => p.id === short.taggedProductId);

            return (
              <div
                key={short.id}
                onClick={() => openShortAt(idx)}
                style={{
                  position: 'relative',
                  aspectRatio: '9 / 16',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: '#1F1C18'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'var(--pk-gold)';
                  e.currentTarget.style.boxShadow = '0 18px 35px rgba(0,0,0,0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
                }}
              >
                {/* Poster / Thumbnail Image */}
                <img
                  src={short.posterImage}
                  alt={short.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Top Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(18, 17, 16, 0.75)',
                  backdropFilter: 'blur(5px)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#FAF8F5',
                  fontSize: '0.68rem',
                  fontWeight: 600
                }}>
                  <Eye size={12} style={{ color: '#E4C88A' }} />
                  <span>{short.viewsCount || '15K'}</span>
                </div>

                {/* Play Button Icon Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.85)',
                  color: '#121110',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s'
                }}>
                  <Play size={22} fill="#121110" style={{ marginLeft: '3px' }} />
                </div>

                {/* Bottom Card Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1rem 0.85rem 0.85rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 70%, transparent 100%)'
                }}>
                  <h4 style={{
                    color: '#FAF8F5',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    margin: '0 0 0.4rem',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {short.title}
                  </h4>

                  {product && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(6px)',
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#FAF8F5', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                        {product.name}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#E4C88A', fontWeight: 800 }}>
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

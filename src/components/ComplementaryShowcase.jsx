import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { COMPLEMENTARY_PRODUCTS } from '../data/products';
import { ShoppingBag, Eye, Heart, Sparkles } from 'lucide-react';

export const ComplementaryShowcase = () => {
  const { addToCart, wishlist, toggleWishlist, customer, openProductDetail } = useStore();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Adornments' },
    { id: 'necklaces', label: 'Necklaces (Cz, AD, Pearls)' },
    { id: 'bracelets', label: 'Bracelets (Party & Family)' },
    { id: 'earrings', label: 'Earrings & Jhumkas' }
  ];

  const filtered = COMPLEMENTARY_PRODUCTS.filter(item => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    return true;
  });

  return (
    <section style={{ padding: '4.5rem 0', background: '#FFFFFF', borderTop: '1px solid var(--pk-border)' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--pk-gold-bg)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', marginBottom: '0.6rem' }}>
              <Sparkles size={13} style={{ color: 'var(--pk-gold-dark)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Coordinated Adornments
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--pk-obsidian)', lineHeight: 1.2 }}>
              Necklaces, Bracelets & Haute Earrings
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--pk-text-secondary)', marginTop: '0.35rem' }}>
              Stylist-matched pieces curated to complement your Premium Khaja bangles and pageant looks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: activeCategory === cat.id ? 'var(--pk-obsidian)' : 'transparent',
                  color: activeCategory === cat.id ? '#FAF8F5' : 'var(--pk-text-primary)',
                  border: activeCategory === cat.id ? 'none' : '1px solid var(--pk-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {filtered.map(item => {
            const isWishlisted = wishlist.includes(item.id);
            const displayPrice = customer.isLoggedIn && customer.isMember ? item.memberPrice : item.price;

            return (
              <div key={item.id} className="product-card">
                <div className="img-wrapper">
                  <img src={item.image} alt={item.name} loading="lazy" onClick={() => openProductDetail(item)} style={{ cursor: 'pointer' }} />
                  
                  <button 
                    onClick={() => toggleWishlist(item.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255,255,255,0.92)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Heart size={16} style={{ color: isWishlisted ? '#7D1A25' : '#181614', fill: isWishlisted ? '#7D1A25' : 'none' }} />
                  </button>

                  <button
                    onClick={() => openProductDetail(item)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(18, 17, 16, 0.88)',
                      color: '#FAF8F5',
                      border: '1px solid rgba(212,175,55,0.4)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.35rem 0.95rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backdropFilter: 'blur(5px)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Eye size={12} />
                    <span>Quick View & Details</span>
                  </button>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.subcategory}
                  </span>
                  
                  <h4 
                    onClick={() => openProductDetail(item)} 
                    style={{ 
                      fontSize: '1.02rem', 
                      color: 'var(--pk-obsidian)', 
                      margin: '0.35rem 0 0.6rem', 
                      cursor: 'pointer', 
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.7rem'
                    }}
                  >
                    {item.name}
                  </h4>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--pk-surface-alt)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                        ₹{displayPrice.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through', marginLeft: '0.4rem' }}>
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button 
                      onClick={() => addToCart(item, item.sizes?.[0] || 'Standard', 1)}
                      className="btn-gold"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}
                    >
                      <ShoppingBag size={14} />
                      <span>{customer.isLoggedIn ? 'Add' : 'Sign In'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

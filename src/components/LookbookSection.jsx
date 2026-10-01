import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/products';
import { INITIAL_LOOKBOOKS } from '../data/crmData';
import { Sparkles, ShoppingBag, CheckCircle, Tag, ArrowRight } from 'lucide-react';

export const LookbookSection = () => {
  const { addLookbookBundle, openProductDetail, setQuickProduct } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  const currentLook = INITIAL_LOOKBOOKS[activeTab];

  return (
    <section style={{ padding: '4.5rem 0', background: '#181614', color: '#FAF8F5' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: 'var(--radius-full)', padding: '0.25rem 0.8rem', marginBottom: '0.6rem' }}>
              <Sparkles size={13} style={{ color: '#E4C88A' }} />
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#E4C88A', fontWeight: 700 }}>
                Digital Jewellery Showroom
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', color: '#FAF8F5', lineHeight: 1.15 }}>
              Shop The Look • Curated Ensembles
            </h2>
          </div>

          {/* Lookbook Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
            {INITIAL_LOOKBOOKS.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => setActiveTab(idx)}
                style={{
                  background: activeTab === idx ? 'var(--pk-gold-gradient)' : 'transparent',
                  color: activeTab === idx ? '#121110' : '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === idx ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {look.occasion} Look
              </button>
            ))}
          </div>
        </div>

        {/* Active Look Container */}
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(212, 175, 55, 0.25)', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          padding: '2rem'
        }}>
          
          {/* Main Visual Image with Badge */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: '360px', background: '#121110' }}>
            <img 
              src={currentLook.image} 
              alt={currentLook.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ 
              position: 'absolute', 
              top: '15px', 
              left: '15px', 
              background: 'rgba(18,17,16,0.85)', 
              color: '#E4C88A', 
              border: '1px solid #D4AF37', 
              borderRadius: 'var(--radius-full)', 
              padding: '0.3rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              backdropFilter: 'blur(6px)'
            }}>
              {currentLook.badge}
            </div>
          </div>

          {/* Look Details & Individual Items List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <span style={{ fontSize: '0.78rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {currentLook.subtitle}
            </span>
            <h3 style={{ fontSize: '1.9rem', color: '#FAF8F5', margin: '0.4rem 0 0.8rem', lineHeight: 1.2 }}>
              {currentLook.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#BDB4A8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {currentLook.description}
            </p>

            {/* Included Pieces List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E4C88A', letterSpacing: '0.05em' }}>
                INCLUDED PIECES IN THIS STYLED SET:
              </span>

              {currentLook.items.map(item => {
                return (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: 'rgba(255,255,255,0.04)', 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#C5A059', fontWeight: 600, textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FAF8F5' }}>
                        {item.name}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E4C88A' }}>
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bundle Pricing Breakdown & CTA */}
            <div style={{ 
              marginTop: 'auto', 
              background: 'rgba(212, 175, 55, 0.08)', 
              border: '1px solid rgba(212, 175, 55, 0.3)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#A89E92' }}>Individual Pieces Total:</div>
                  <div style={{ fontSize: '1rem', color: '#A89E92', textDecoration: 'line-through' }}>
                    ₹{currentLook.originalTotal.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#55C57A', fontWeight: 700 }}>
                    YOU SAVE ₹{currentLook.savings.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E4C88A' }}>
                    ₹{currentLook.bundlePrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => addLookbookBundle(currentLook)}
                className="btn-gold"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                <ShoppingBag size={17} />
                <span>Add Complete Look to Bag (Save ₹{currentLook.savings})</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

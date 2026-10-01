import React from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/products';
import { Sparkles, ShieldCheck, Truck, Award, ArrowRight, Crown } from 'lucide-react';

export const HeroBanner = () => {
  const { setQuickPassOpen, setAiStylistOpen, customer, openProductDetail, products } = useStore();
  const allAvailableProducts = products || ALL_PRODUCTS;

  const spotlightProduct = allAvailableProducts.find(p => p.id === 'bangle-01') || allAvailableProducts[0];

  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', background: '#121110', color: '#FAF8F5' }}>
      
      {/* Background Subtle Gradient & Glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.16) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ padding: '3.5rem 1.25rem 3.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Brand Story & Miss World Highlight */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.5)', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.95rem', marginBottom: '1.25rem' }}>
              <Crown size={14} style={{ color: '#E4C88A' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Featured At Miss World 2025 India • Red Carpet Spotlight
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.3rem, 4.8vw, 3.7rem)', lineHeight: 1.12, marginBottom: '1.2rem', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
              Royal Splendour.<br />
              <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontWeight: 600 }}>Couture Heritage Craft.</span>
            </h1>

            <p style={{ fontSize: '1.02rem', color: '#D4C9BC', lineHeight: 1.6, maxWidth: '540px', marginBottom: '1.8rem', fontWeight: 300 }}>
              Discover <strong>Premium Khaja</strong>'s high artificial jewellery atelier. Featuring 28 exclusive handcrafted bangles (Glass, Stone, Lac, Minakari), American Diamond & pearl chokers, and royal bracelets chosen to adorn contestants and celebrities on the world stage.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '2.25rem' }}>
              <a 
                href="#bangles-atelier"
                className="btn-gold"
                style={{ textDecoration: 'none' }}
              >
                <span>Explore Bangles Atelier (28)</span>
                <ArrowRight size={16} />
              </a>

              <a 
                href="#celebrity-spotlight"
                className="btn-outline"
                style={{ color: '#FAF8F5', borderColor: 'rgba(212, 175, 55, 0.5)', background: 'rgba(255,255,255,0.04)', textDecoration: 'none' }}
              >
                <Crown size={15} style={{ color: '#E4C88A' }} />
                <span>Miss World 2025 Story</span>
              </a>

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
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
                  <div style={{ fontSize: '0.68rem', color: '#A89E92' }}>Free &gt; ₹1,499 & COD</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)', 
              border: '1px solid rgba(212, 175, 55, 0.35)',
              position: 'relative',
              background: '#1A1816'
            }}>
              <img 
                src="/images/bangles/1789662811af3b.png" 
                alt="Royal Rajputi Kundan Kada - Masterpiece Bangles by Premium Khaja"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              
              {/* Overlay Glass Card */}
              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                left: '15px', 
                right: '15px', 
                background: 'rgba(18, 17, 16, 0.88)', 
                backdropFilter: 'blur(10px)', 
                padding: '1.1rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#E4C88A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                      Miss World 2025 India Spotlight Kada
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: '#FAF8F5', margin: '0.1rem 0 0.3rem' }}>
                    Royal Rajputi Kundan Kada
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#E4C88A', fontWeight: 800, fontSize: '1.15rem' }}>₹2,499</span>
                    <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.85rem' }}>₹3,899</span>
                    <span className="gold-badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>VIP: ₹2,249</span>
                  </div>
                </div>

                <button 
                  onClick={() => openProductDetail(spotlightProduct)}
                  className="btn-gold" 
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.8rem' }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

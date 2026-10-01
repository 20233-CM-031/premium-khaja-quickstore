import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/products';
import { 
  Crown, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Award, 
  Camera, 
  Plus, 
  X, 
  ExternalLink, 
  CheckCircle,
  Quote
} from 'lucide-react';

export const CelebrityMissWorldSpotlight = () => {
  const { 
    celebrityShowcase, 
    addCelebrityShowcaseItem, 
    openProductDetail, 
    setActiveCategory, 
    setActiveSubcategory,
    adminUser,
    setAuthMode,
    setAuthModalOpen
  } = useStore();

  const [activeTab, setActiveTab] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for updating new photos/celebrities
  const [newTitle, setNewTitle] = useState('');
  const [newCelebrity, setNewCelebrity] = useState('');
  const [newEvent, setNewEvent] = useState('Miss World 2025 India');
  const [newQuote, setNewQuote] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('Miss World 2025 India');
  const [newBadge, setNewBadge] = useState('Celebrity Choice');

  const filteredShowcase = celebrityShowcase.filter(item => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PAGEANT' && item.tag.includes('Miss World')) return true;
    if (activeTab === 'CELEBRITY' && item.tag.includes('Red Carpet')) return true;
    if (activeTab === 'PRESS' && item.tag.includes('Editorial')) return true;
    return true;
  });

  const handleCreateHighlight = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCelebrityShowcaseItem({
      title: newTitle,
      subtitle: newCelebrity ? `Worn by ${newCelebrity}` : "Miss World 2025 India Official Appearance",
      celebrity: newCelebrity || "Miss World 2025 Dignitary",
      event: newEvent || "Miss World 2025 India",
      quote: newQuote || "Crafted by Premium Khaja for royal stage brilliance.",
      image: newImageUrl || "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80",
      tag: newTag,
      badge: newBadge
    });

    setModalOpen(false);
    setNewTitle('');
    setNewCelebrity('');
    setNewQuote('');
    setNewImageUrl('');
  };

  return (
    <section className="miss-world-spotlight-section" style={{ 
      position: 'relative', 
      background: 'linear-gradient(180deg, #121110 0%, #1D1A17 50%, #141311 100%)', 
      color: '#FAF8F5', 
      padding: '4.5rem 0',
      borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Golden Ambiance Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(125, 26, 37, 0.14) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Top Prestige Emblem & Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3rem' }}>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(125, 26, 37, 0.3) 100%)', 
            border: '1px solid rgba(212, 175, 55, 0.6)', 
            borderRadius: 'var(--radius-full)', 
            padding: '0.4rem 1.1rem', 
            marginBottom: '1.25rem',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)'
          }}>
            <Crown size={15} style={{ color: '#E4C88A' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E4C88A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              OFFICIAL PARTICIPANT • MISS WORLD 2025 INDIA
            </span>
            <Sparkles size={15} style={{ color: '#E4C88A' }} />
          </div>

          <h2 style={{ 
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', 
            lineHeight: 1.15, 
            marginBottom: '1rem', 
            fontFamily: 'var(--font-serif)',
            color: '#FAF8F5'
          }}>
            Adorning Miss World 2025 India<br />
            <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontWeight: 600 }}>
              & Celebrities on the World Stage
            </span>
          </h2>

          <p style={{ fontSize: '1.02rem', color: '#D4C9BC', lineHeight: 1.6, fontWeight: 300, marginBottom: '1.75rem' }}>
            When the finalists of <strong>Miss World 2025 India</strong> and leading celebrities illuminated the national gala runway, they were adorned in <strong>Premium Khaja's</strong> handcrafted 22K micro-gold plated bangles, royal polki kadas, and couture necklaces. An extraordinary milestone in authentic Indian jewellery craft.
          </p>

          {/* Interactive Navigation Filter & Add Photo Button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.3rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => setActiveTab('ALL')}
                style={{
                  background: activeTab === 'ALL' ? 'var(--pk-gold-gradient)' : 'transparent',
                  color: activeTab === 'ALL' ? '#121110' : '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'ALL' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                All Accolades ({celebrityShowcase.length})
              </button>
              <button
                onClick={() => setActiveTab('PAGEANT')}
                style={{
                  background: activeTab === 'PAGEANT' ? 'var(--pk-gold-gradient)' : 'transparent',
                  color: activeTab === 'PAGEANT' ? '#121110' : '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'PAGEANT' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Miss World 2025 India
              </button>
              <button
                onClick={() => setActiveTab('CELEBRITY')}
                style={{
                  background: activeTab === 'CELEBRITY' ? 'var(--pk-gold-gradient)' : 'transparent',
                  color: activeTab === 'CELEBRITY' ? '#121110' : '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'CELEBRITY' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Celebrity Red Carpet
              </button>
              <button
                onClick={() => setActiveTab('PRESS')}
                style={{
                  background: activeTab === 'PRESS' ? 'var(--pk-gold-gradient)' : 'transparent',
                  color: activeTab === 'PRESS' ? '#121110' : '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'PRESS' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Vogue & Press
              </button>
            </div>

            {/* Quick Update Button (Open to user to update new photos as requested) */}
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#E4C88A',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              <Camera size={14} />
              <span>+ Update Photos & Celebrities</span>
            </button>
          </div>

        </div>

        {/* Extraordinary Showcase Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          
          {filteredShowcase.map((item) => {
            const featuredItems = (item.featuredProductIds || [])
              .map(id => ALL_PRODUCTS.find(p => p.id === id))
              .filter(Boolean);

            return (
              <div 
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }}
              >
                
                {/* Visual Image Banner with Luxury Badges */}
                <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', background: '#1A1816' }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                  />

                  {/* Gradient Overlay for contrast */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(18,17,16,0.85) 100%)'
                  }}></div>

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ 
                      background: 'rgba(18, 17, 16, 0.85)', 
                      color: '#E4C88A', 
                      border: '1px solid #D4AF37', 
                      fontSize: '0.68rem', 
                      fontWeight: 700, 
                      padding: '0.25rem 0.65rem', 
                      borderRadius: 'var(--radius-full)',
                      backdropFilter: 'blur(6px)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Crown size={12} />
                      <span>{item.badge}</span>
                    </span>

                    <span style={{ 
                      background: '#7D1A25', 
                      color: '#FAF8F5', 
                      fontSize: '0.65rem', 
                      fontWeight: 700, 
                      padding: '0.2rem 0.55rem', 
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Event Caption on Image */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#E4C88A', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                      {item.event}
                    </div>
                  </div>
                </div>

                {/* Card Content & Quotes */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  <h3 style={{ fontSize: '1.25rem', color: '#FAF8F5', lineHeight: 1.3, marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                    {item.title}
                  </h3>
                  
                  <div style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {item.subtitle}
                  </div>

                  {/* Quote block */}
                  <div style={{ 
                    background: 'rgba(255,255,255,0.04)', 
                    borderLeft: '3px solid #D4AF37', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '0 8px 8px 0', 
                    marginBottom: '1.25rem',
                    position: 'relative'
                  }}>
                    <p style={{ fontSize: '0.85rem', color: '#D4C9BC', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{item.quote}"
                    </p>
                    <div style={{ fontSize: '0.72rem', color: '#A89E92', marginTop: '0.35rem', fontWeight: 600 }}>
                      — {item.celebrity}
                    </div>
                  </div>

                  {/* Worn Pieces Quick Carousel / Pills */}
                  {featuredItems.length > 0 && (
                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#A89E92', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>
                        Official Pieces Featured:
                      </span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {featuredItems.map(prod => (
                          <div 
                            key={prod.id} 
                            onClick={() => openProductDetail(prod)}
                            style={{ 
                              background: 'rgba(255,255,255,0.06)', 
                              border: '1px solid rgba(212, 175, 55, 0.25)', 
                              borderRadius: 'var(--radius-sm)', 
                              padding: '0.4rem 0.65rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                              <img src={prod.image} alt={prod.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                              <span style={{ fontSize: '0.76rem', color: '#FAF8F5', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </span>
                            </div>

                            <span style={{ fontSize: '0.74rem', color: '#E4C88A', fontWeight: 700, marginLeft: '0.5rem', flexShrink: 0 }}>
                              ₹{prod.price.toLocaleString()} →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom Banner with Direct Atelier Link */}
        <div style={{ 
          marginTop: '3.5rem', 
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(125, 26, 37, 0.18) 100%)', 
          border: '1px solid rgba(212, 175, 55, 0.4)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.75rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Award size={18} style={{ color: '#E4C88A' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#FAF8F5', fontFamily: 'var(--font-serif)' }}>
                Experience The Miss World 2025 Royal Collection
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#D4C9BC' }}>
              Browse the 28 authentic bangles, polki kadas, American Diamond chokers, and heritage lac sets selected for international pageant glamour.
            </p>
          </div>

          <a 
            href="#bangles-atelier" 
            className="btn-gold" 
            style={{ textDecoration: 'none', padding: '0.85rem 1.6rem' }}
          >
            <span>Explore The Collection (28 Bangles)</span>
            <ArrowRight size={16} />
          </a>
        </div>

      </div>

      {/* MODAL: Update Miss World 2025 India & Celebrity Photos */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '0', overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{ background: '#181614', color: '#FAF8F5', padding: '1.25rem 1.5rem', position: 'relative', borderBottom: '1px solid var(--pk-border-gold)' }}>
              <button 
                className="btn-icon" 
                onClick={() => setModalOpen(false)}
                style={{ position: 'absolute', top: '14px', right: '14px', color: '#FAF8F5', background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Camera size={18} style={{ color: '#E4C88A' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#FAF8F5', fontFamily: 'var(--font-serif)' }}>
                  Update Miss World & Celebrity Showcase
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#C8BEB2' }}>
                Add newly released photoshoot pictures, celebrity red carpet moments, or pageant press features.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateHighlight} style={{ padding: '1.5rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Showcase Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Miss World 2025 India Winner Coronation Walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Celebrity or Dignitary Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Miss World 2025 India Winner / Celebrity Star"
                  value={newCelebrity}
                  onChange={(e) => setNewCelebrity(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Photo Image URL or Local Asset Path</label>
                <input 
                  type="text" 
                  placeholder="e.g. /images/bangles/1789662811af3b.png or https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="form-input"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
                  Tip: Use any image from public/images/bangles or a high-res photo URL.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Quote or Press Description</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Adorned in Premium Khaja's signature handcrafted Rajwada kada and polki choker on the pageant stage."
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '70px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category Tag</label>
                  <select 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
                    className="form-select"
                  >
                    <option value="Miss World 2025 India">Miss World 2025 India</option>
                    <option value="Red Carpet Gala">Red Carpet Gala</option>
                    <option value="Fashion Editorial">Fashion Editorial</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Badge Label</label>
                  <input 
                    type="text" 
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-gold" 
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                <Sparkles size={16} />
                <span>Publish to Extraordinary Showcase</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

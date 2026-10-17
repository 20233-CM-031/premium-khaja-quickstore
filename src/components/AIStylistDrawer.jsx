import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/products';
import { X, Sparkles, Send, ShoppingBag, Bot, User, ArrowRight, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';

export const AIStylistDrawer = () => {
  const { 
    aiStylistOpen, 
    setAiStylistOpen, 
    products, 
    addToCart, 
    setCartOpen, 
    openProductDetail,
    customer
  } = useStore();

  // Active product source (context products if available, fallback to catalog)
  const availableCatalog = (products && products.length > 0) ? products : ALL_PRODUCTS;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Namaste! I am your **Autonomous AI Shopping Assistant & Jewellery Stylist**.\n\nI can style you or **do the complete shopping for you**! Tell me what you're looking for, or let me know your **occasion, wrist size, finish/color, and budget**, and I will automatically find the best piece and add it directly to your cart.",
      recommendations: [],
      addedItem: null
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Hardware Back Button listener
  useEffect(() => {
    if (!aiStylistOpen) return;
    window.history.pushState({ pkModal: 'aiStylist' }, '');

    const handlePopState = () => {
      setAiStylistOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [aiStylistOpen, setAiStylistOpen]);

  if (!aiStylistOpen) return null;

  const quickPrompts = [
    "Shop for me: Size 2.6 under ₹1,500",
    "Best Bangles Under ₹1,500",
    "Red Bridal Lehenga Bangles",
    "Antique Gold Bangles Size 2.4",
    "Office Wear Minimal Kada"
  ];

  // Helper: extract budget from user query
  const extractBudget = (text) => {
    const lower = text.toLowerCase();
    // Patterns: "under 1500", "below 1500", "less than 1500", "max 1500", "within 1500", "upto 1500", "budget 1500", "rs 1500", "₹1500"
    const match = lower.match(/(?:under|below|less than|max|budget of|within|upto|up to|rs\.?|₹)\s*(\d{3,6})/i) 
      || lower.match(/(\d{3,6})\s*(?:budget|rs|inr|or less|max)/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  };

  // Helper: extract size preference
  const extractSize = (text) => {
    const match = text.match(/\b(2\.[2468]|2\.10)\b/i);
    return match ? match[1] : null;
  };

  // Helper: extract color / finish preference
  const extractColor = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('gold') || lower.includes('antique')) return 'gold';
    if (lower.includes('rose') || lower.includes('pink')) return 'rose';
    if (lower.includes('silver') || lower.includes('rhodium')) return 'silver';
    if (lower.includes('green') || lower.includes('emerald')) return 'green';
    if (lower.includes('red') || lower.includes('maroon') || lower.includes('ruby')) return 'red';
    if (lower.includes('white') || lower.includes('pearl')) return 'pearl';
    return null;
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      const maxBudget = extractBudget(query);
      const preferredSize = extractSize(query) || '2.6';
      const preferredColor = extractColor(query);

      const isAutonomousShopping = 
        lower.includes('shop for me') || 
        lower.includes('add to cart') || 
        lower.includes('add to bag') || 
        lower.includes('buy for me') || 
        lower.includes('buy me') || 
        lower.includes('order for me') ||
        lower.includes('select and add') ||
        (maxBudget !== null && (lower.includes('get') || lower.includes('add') || lower.includes('pick') || lower.includes('choose')));

      // Filter catalog strictly adhering to constraints
      let candidatePool = [...availableCatalog];

      // 1. STRICT BUDGET ENFORCEMENT: Price must NEVER exceed maxBudget
      if (maxBudget !== null) {
        candidatePool = candidatePool.filter(p => {
          const itemPrice = customer?.isMember && p.memberPrice ? p.memberPrice : p.price;
          return itemPrice <= maxBudget;
        });
      }

      // 2. Color / Style filtering if specified
      if (preferredColor) {
        const colorMatches = candidatePool.filter(p => {
          const str = `${p.name} ${p.finish || ''} ${p.description || ''} ${p.material || ''} ${p.subcategory || ''}`.toLowerCase();
          return str.includes(preferredColor);
        });
        if (colorMatches.length > 0) {
          candidatePool = colorMatches;
        }
      }

      // 3. Keyword / Occasion filtering if no color matches or as secondary score
      if (lower.includes('bridal') || lower.includes('wedding')) {
        const bridal = candidatePool.filter(p => (p.occasion || '').toLowerCase().includes('bridal') || p.name.toLowerCase().includes('chura') || p.name.toLowerCase().includes('kada'));
        if (bridal.length > 0) candidatePool = bridal;
      } else if (lower.includes('office') || lower.includes('daily') || lower.includes('minimal')) {
        const minimal = candidatePool.filter(p => (p.subcategory || '').toLowerCase().includes('minimal') || p.price < 1500);
        if (minimal.length > 0) candidatePool = minimal;
      }

      // Sort by best price/value
      candidatePool.sort((a, b) => b.rating - a.rating || a.price - b.price);

      // Branch 1: Autonomous Shopping Action (Direct Add to Cart)
      if (isAutonomousShopping) {
        if (candidatePool.length > 0) {
          const selectedProduct = candidatePool[0];
          // Auto add to cart!
          addToCart(selectedProduct, preferredSize, 1);

          const responseText = `🎉 **I've completed the shopping for you!**\n\nI handpicked the **${selectedProduct.name}**:\n• **Price**: ₹${selectedProduct.price.toLocaleString()} ${maxBudget ? `(strictly under your ₹${maxBudget.toLocaleString()} limit)` : ''}\n• **Selected Size**: ${preferredSize}\n• **Finish**: ${selectedProduct.finish || 'Handcrafted Artificial Jewellery'}\n• **Shipping**: Free Delivery Included!\n\nIt is now safely in your shopping bag. You can review your cart or checkout anytime!`;

          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: responseText,
              recommendations: candidatePool.slice(0, 3).map(p => p.id),
              addedItem: { product: selectedProduct, size: preferredSize }
            }
          ]);
        } else {
          // No items found within budget
          const minPrice = availableCatalog.reduce((min, p) => p.price < min ? p.price : min, Infinity);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: `I searched our entire collection, but we currently do not have items under ₹${maxBudget?.toLocaleString()}.\n\nOur most affordable handcrafted piece starts at **₹${minPrice.toLocaleString()}**. Would you like me to show you pieces starting around ₹${minPrice.toLocaleString()}?`,
              recommendations: availableCatalog.slice(0, 2).map(p => p.id),
              addedItem: null
            }
          ]);
        }
      } else {
        // Branch 2: Informative Styling & Recommendations with Strict Budget Checks
        if (maxBudget !== null && candidatePool.length === 0) {
          const minPrice = availableCatalog.reduce((min, p) => p.price < min ? p.price : min, Infinity);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: `I checked all items in our store, but none are currently priced under ₹${maxBudget.toLocaleString()}.\n\nOur authentic handcrafted pieces start from **₹${minPrice.toLocaleString()}**. Here are our top budget-friendly choices:`,
              recommendations: availableCatalog.slice(0, 3).map(p => p.id),
              addedItem: null
            }
          ]);
        } else if (candidatePool.length > 0) {
          const budgetNotice = maxBudget ? ` strictly priced under ₹${maxBudget.toLocaleString()}` : '';
          const responseText = `Here are the best pieces matched to your request${budgetNotice}:\n\nEvery item is 100% artificial & imitation jewellery with anti-tarnish protective coating. Tap **"+ Bag"** or tell me **"Add to cart"** and I'll do it automatically for you!`;

          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: responseText,
              recommendations: candidatePool.slice(0, 4).map(p => p.id),
              addedItem: null
            }
          ]);
        } else {
          // General assistance asking for details
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: `To give you the most accurate curation or do the shopping for you, please share:\n\n1. **Your Wrist Size** (2.4, 2.6, or 2.8)\n2. **Preferred Color / Polish** (Gold, Rose Gold, Emerald Green, Ruby Red)\n3. **Budget Limit** (e.g. Under ₹1,500)\n\nOr click one of the quick options below:`,
              recommendations: availableCatalog.slice(0, 2).map(p => p.id),
              addedItem: null
            }
          ]);
        }
      }

      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setAiStylistOpen(false)}>
      <div 
        className="drawer-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '440px', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          background: '#FAF8F5' 
        }}
      >
        
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', background: '#161412', color: '#FAF8F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'var(--pk-gold-gradient)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121110' }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#FAF8F5', margin: 0, fontWeight: 700 }}>
                  Khaja AI Shopping Agent
                </h3>
                <span style={{ fontSize: '0.65rem', background: '#2E7D32', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 700 }}>
                  LIVE
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#E4C88A', letterSpacing: '0.02em' }}>
                Autonomous Shopping & Strict Budget Curation
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setAiStylistOpen(false)} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#FAF8F5',
              cursor: 'pointer'
            }}
            title="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {messages.map(msg => {
            const isAi = msg.sender === 'ai';
            const recProducts = (msg.recommendations || [])
              .map(id => availableCatalog.find(p => p.id === id))
              .filter(Boolean);

            return (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: isAi ? 'flex-start' : 'flex-end',
                  width: '100%'
                }}
              >
                <div 
                  style={{ 
                    maxWidth: '92%', 
                    background: isAi ? '#FFFFFF' : 'var(--pk-obsidian)', 
                    color: isAi ? 'var(--pk-text-primary)' : '#FAF8F5',
                    padding: '0.8rem 1rem', 
                    borderRadius: isAi ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                    border: isAi ? '1px solid var(--pk-border)' : 'none',
                    fontSize: '0.83rem',
                    lineHeight: 1.5,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.text}</p>

                  {/* Added to cart confirmation banner */}
                  {msg.addedItem && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <CheckCircle2 size={16} color="#16A34A" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
                          In Your Bag (Size: {msg.addedItem.size})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAiStylistOpen(false);
                          setCartOpen(true);
                        }}
                        style={{
                          background: '#166534',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <ShoppingBag size={12} /> View Cart
                      </button>
                    </div>
                  )}
                </div>

                {/* Recommended Product Cards inside chat */}
                {recProducts.length > 0 && (
                  <div style={{ width: '100%', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {recProducts.map(prod => (
                      <div 
                        key={prod.id} 
                        style={{ 
                          background: '#FFFFFF', 
                          border: '1px solid var(--pk-border-gold)', 
                          borderRadius: '8px', 
                          padding: '0.55rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                        }}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/bangles/Gemini_Generated_Image_srf5bnsrf5bnsrf5.png';
                          }}
                          style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '6px' }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pk-gold-dark)' }}>
                              ₹{prod.price.toLocaleString()}
                            </span>
                            {prod.originalPrice > prod.price && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                                ₹{prod.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            type="button"
                            onClick={() => openProductDetail(prod)}
                            style={{ 
                              background: '#FAF8F5', 
                              border: '1px solid var(--pk-border)', 
                              borderRadius: '4px',
                              padding: '0.35rem 0.55rem', 
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              cursor: 'pointer' 
                            }}
                            title="View Details"
                          >
                            Details
                          </button>
                          <button 
                            type="button"
                            onClick={() => addToCart(prod, prod.sizes?.[0] || '2.6', 1)}
                            className="btn-gold"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', borderRadius: '4px', fontWeight: 700 }}
                          >
                            + Bag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', padding: '0.6rem 0.9rem', borderRadius: '12px', border: '1px solid var(--pk-border)', fontSize: '0.75rem', color: 'var(--pk-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={12} className="spin" />
              Agent is finding best match & checking prices...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '0.5rem 0.85rem', background: '#FFFFFF', borderTop: '1px solid #ECE7E1', display: 'flex', gap: '0.4rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              style={{
                background: '#FAF8F5',
                border: '1px solid var(--pk-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.72rem',
                color: 'var(--pk-text-primary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '0.75rem 1rem', background: '#FFFFFF', borderTop: '1px solid var(--pk-border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="E.g., 'Shop for me: size 2.6 under 1500'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              flex: 1, 
              padding: '0.65rem 0.95rem', 
              border: '1px solid var(--pk-border)', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#FDFBF9'
            }}
          />
          <button 
            type="button"
            onClick={() => handleSend()}
            className="btn-gold" 
            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            title="Send to Shopping Agent"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

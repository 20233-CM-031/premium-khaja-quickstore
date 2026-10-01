import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS, BANGLES_PRODUCTS } from '../data/products';
import { AI_STYLING_KNOWLEDGE } from '../data/crmData';
import { X, Sparkles, Send, ShoppingBag, Bot, User, ArrowRight } from 'lucide-react';

export const AIStylistDrawer = () => {
  const { aiStylistOpen, setAiStylistOpen, addToCart, setQuickProduct } = useStore();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Namaste! I am your **Premium Khaja AI Jewellery Stylist**. Tell me about your outfit (e.g. red bridal lehenga, green silk saree, office kurti) or budget, and I'll hand-pair the ideal handcrafted bangles and jewelry pieces from our atelier!",
      recommendations: ["bangle-01", "bangle-16"]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!aiStylistOpen) return null;

  const quickPrompts = [
    "Red Bridal Lehenga Bangles",
    "Best Bangles Under ₹1,500",
    "Emerald Green Saree Pairings",
    "Everyday Minimal Office Kada"
  ];

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      // Find matching response in AI_STYLING_KNOWLEDGE or search products
      const lower = query.toLowerCase();
      let matchedEntry = AI_STYLING_KNOWLEDGE.find(entry => 
        entry.keywords.some(k => lower.includes(k))
      );

      let responseText = "";
      let matchedProdIds = [];

      if (matchedEntry) {
        responseText = matchedEntry.advice;
        matchedProdIds = matchedEntry.recommendedIds;
      } else {
        // Fallback intelligent search across all products
        const matches = ALL_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(lower) || 
          p.description.toLowerCase().includes(lower) ||
          p.style.toLowerCase().includes(lower) ||
          p.occasion.toLowerCase().includes(lower)
        ).slice(0, 3);

        if (matches.length > 0) {
          responseText = `Based on your request for "${query}", I recommend these authentic hand-crafted pieces from our atelier:`;
          matchedProdIds = matches.map(m => m.id);
        } else {
          responseText = `For ${query}, I recommend exploring our signature **Royal Rajputi Kundan Kada (PK-BGL-01)** or **Basra Pearl Cluster Kangan (PK-BGL-12)**. Both pair gracefully with contemporary and ethnic silhouettes.`;
          matchedProdIds = ["bangle-01", "bangle-12"];
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: responseText,
          recommendations: matchedProdIds
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setAiStylistOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#181614', color: '#FAF8F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--pk-gold-gradient)', borderRadius: '50%', padding: '0.4rem', color: '#121110', display: 'flex' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FAF8F5', lineHeight: 1.2 }}>
                Khaja AI Stylist
              </h3>
              <span style={{ fontSize: '0.68rem', color: '#E4C88A', letterSpacing: '0.04em' }}>
                Jewellery Discovery & Pairing Intelligence
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setAiStylistOpen(false)} style={{ color: '#FAF8F5' }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FAF8F5' }}>
          
          {messages.map(msg => {
            const isAi = msg.sender === 'ai';
            const recProducts = (msg.recommendations || [])
              .map(id => ALL_PRODUCTS.find(p => p.id === id))
              .filter(Boolean);

            return (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: isAi ? 'flex-start' : 'flex-end'
                }}
              >
                <div 
                  style={{ 
                    maxWidth: '88%', 
                    background: isAi ? '#FFFFFF' : 'var(--pk-obsidian)', 
                    color: isAi ? 'var(--pk-text-primary)' : '#FAF8F5',
                    padding: '0.85rem 1rem', 
                    borderRadius: 'var(--radius-md)',
                    border: isAi ? '1px solid var(--pk-border)' : 'none',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                </div>

                {/* Recommended Product Cards inside chat */}
                {recProducts.length > 0 && (
                  <div style={{ width: '100%', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {recProducts.map(prod => (
                      <div 
                        key={prod.id} 
                        style={{ 
                          background: '#FFFFFF', 
                          border: '1px solid var(--pk-border-gold)', 
                          borderRadius: 'var(--radius-sm)', 
                          padding: '0.5rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem'
                        }}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--pk-obsidian)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-gold-dark)' }}>
                            ₹{prod.price.toLocaleString()}
                          </div>
                        </div>

                        <button 
                          onClick={() => addToCart(prod, prod.sizes?.[0] || '2.6', 1)}
                          className="btn-gold"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
                        >
                          + Bag
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', padding: '0.6rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', fontSize: '0.75rem', color: 'var(--pk-text-muted)' }}>
              Stylist is consulting catalogue...
            </div>
          )}

        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '0.5rem 1rem', background: '#FFFFFF', borderTop: '1px solid var(--pk-surface-alt)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                background: 'var(--pk-surface-alt)',
                border: '1px solid var(--pk-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.65rem',
                fontSize: '0.72rem',
                color: 'var(--pk-text-secondary)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderTop: '1px solid var(--pk-border)', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Ask stylist about jewellery or styling..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              flex: 1, 
              padding: '0.65rem 0.85rem', 
              border: '1px solid var(--pk-border)', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => handleSend()}
            className="btn-gold" 
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
          >
            <Send size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};

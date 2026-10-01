import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, MessageCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';

export const EnquiryModal = () => {
  const { enquiryProduct, setEnquiryProduct, addLead, customer } = useStore();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!enquiryProduct) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Please provide your name and WhatsApp contact number.");
      return;
    }

    addLead({
      name: name.trim(),
      phone: phone.trim(),
      productId: enquiryProduct.id,
      productName: enquiryProduct.name,
      message: message.trim() || `Inquiry regarding ${enquiryProduct.name} (SKU: ${enquiryProduct.sku})`
    });

    // Open WhatsApp directly
    const encoded = encodeURIComponent(`Hi Premium Khaja! I have a question about ${enquiryProduct.name} (SKU: ${enquiryProduct.sku}):\n\n${message || 'Please share available sizes and delivery timelines.'}\n\nMy Name: ${name}`);
    window.open(`https://wa.me/919820144521?text=${encoded}`, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEnquiryProduct(null);
    }, 1800);
  };

  return (
    <div className="modal-backdrop" onClick={() => setEnquiryProduct(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '1.75rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#25D366', color: '#fff', borderRadius: '50%', padding: '0.35rem', display: 'flex' }}>
              <MessageCircle size={18} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)' }}>
              Ask Concierge on WhatsApp
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setEnquiryProduct(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Product snapshot */}
        <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--pk-surface-alt)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
          <img src={enquiryProduct.image} alt={enquiryProduct.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pk-obsidian)' }}>
              {enquiryProduct.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
              ₹{enquiryProduct.price.toLocaleString()} • {enquiryProduct.subcategory}
            </div>
          </div>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <span style={{ fontSize: '1.2rem', color: '#1E4635', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              ✓ Inquiry Dispatched!
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--pk-text-secondary)' }}>
              Redirecting to WhatsApp and logged into your concierge profile...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Your Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Priyadarshini Rao" 
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>WhatsApp Mobile Number *</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="e.g. 9845077123" 
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Your Specific Question</label>
              <textarea 
                rows="2" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="e.g. Can you make this in size 2.10? Or what choker set goes best with this?" 
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem', resize: 'none' }} 
              />
            </div>

            <button 
              type="submit" 
              style={{
                background: '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              <MessageCircle size={18} />
              <span>Connect with Stylist on WhatsApp</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

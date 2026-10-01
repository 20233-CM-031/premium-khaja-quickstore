import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Crown, Sparkles, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export const QuickPassModal = () => {
  const { quickPassOpen, setQuickPassOpen, completeQuickPass } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [error, setError] = useState('');

  if (!quickPassOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit WhatsApp number');
      return;
    }

    setError('');
    completeQuickPass({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      whatsappConsent
    });
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickPassOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--pk-gold-bg)', padding: '0.5rem', borderRadius: '50%', color: 'var(--pk-gold-dark)' }}>
              <Crown size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                QuickStore Identity
              </span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', lineHeight: 1.2 }}>
                Unlock PK Club Privileges
              </h3>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setQuickPassOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--pk-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Experience <strong>Premium Khaja</strong> as an insider. Get progressive customer identity with zero tedious passwords.
        </p>

        {/* Benefits Preview */}
        <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.9rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--pk-text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={14} style={{ color: '#1E4635' }} />
              <span><strong>Instant 5% VIP Off</strong> on all Bangles</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={14} style={{ color: '#1E4635' }} />
              <span>Digital Member Pass</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={14} style={{ color: '#1E4635' }} />
              <span>WhatsApp Order Bridge</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={14} style={{ color: '#1E4635' }} />
              <span>Early Festive Drops</span>
            </div>
          </div>
        </div>

        {/* QuickPass Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pk-text-primary)', marginBottom: '0.35rem' }}>
              Full Name *
            </label>
            <input 
              type="text" 
              placeholder="e.g. Ayesha Sheikh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--pk-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pk-text-primary)', marginBottom: '0.35rem' }}>
              Mobile / WhatsApp Number *
            </label>
            <input 
              type="tel" 
              placeholder="e.g. 9393056641"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--pk-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--pk-text-primary)', marginBottom: '0.35rem' }}>
              Email Address <span style={{ fontWeight: 400, color: 'var(--pk-text-muted)' }}>(Optional for invoices)</span>
            </label>
            <input 
              type="email" 
              placeholder="e.g. ayesha@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--pk-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.2rem' }}>
            <input 
              type="checkbox" 
              id="whatsappConsent" 
              checked={whatsappConsent}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
              style={{ marginTop: '0.2rem', accentColor: 'var(--pk-gold-dark)' }}
            />
            <label htmlFor="whatsappConsent" style={{ fontSize: '0.76rem', color: 'var(--pk-text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
              Send order updates, tracking, and member-only styling previews on WhatsApp. (No spam, opt-out anytime).
            </label>
          </div>

          {error && (
            <div style={{ color: '#7D1A25', fontSize: '0.8rem', background: '#FBEBEB', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-gold" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
          >
            <span>Activate Instant PK Club Pass</span>
            <ArrowRight size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
            <Shield size={12} />
            <span>256-Bit Encrypted • Never Shared with Third Parties</span>
          </div>

        </form>

      </div>
    </div>
  );
};

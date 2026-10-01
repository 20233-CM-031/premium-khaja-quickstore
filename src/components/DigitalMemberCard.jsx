import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Crown, Sparkles, Copy, Check, QrCode, Share2, Award, Zap } from 'lucide-react';

export const DigitalMemberCard = () => {
  const { memberCardOpen, setMemberCardOpen, customer } = useStore();
  const [copied, setCopied] = useState(false);

  if (!memberCardOpen || !customer.isMember) return null;

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://premiumkhaja.store?ref=${customer.referralCode || 'VIP'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={() => setMemberCardOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '1.75rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={20} style={{ color: 'var(--pk-gold-dark)' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--pk-obsidian)' }}>PK Club VIP Pass</h3>
          </div>
          <button className="btn-icon" onClick={() => setMemberCardOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* The Holographic Metallic VIP Card */}
        <div className="member-vip-card" style={{ marginBottom: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Haute Artificial Jewellery
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.1em', color: '#FAF8F5' }}>
                PREMIUM KHAJA
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(212, 175, 55, 0.25)', border: '1px solid #D4AF37', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              <Sparkles size={11} style={{ color: '#E4C88A' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FAF8F5', letterSpacing: '0.08em' }}>
                {customer.tier || 'GOLD'} TIER
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#C5A059', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Privilege Member</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FAF8F5' }}>{customer.name || 'Valued Member'}</div>
            <div style={{ fontSize: '0.78rem', color: '#A89E92', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              {customer.memberId || 'PK-GLD-7701'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(212, 175, 55, 0.25)', paddingTop: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#A89E92' }}>ACTIVE BENEFIT</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E4C88A' }}>5% Instant VIP Privilege</div>
            </div>

            <div style={{ background: '#FAF8F5', padding: '4px', borderRadius: '4px' }}>
              <QrCode size={38} color="#121110" />
            </div>
          </div>

        </div>

        {/* Member Privileges List */}
        <div style={{ background: 'var(--pk-surface-alt)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-text-primary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={14} style={{ color: 'var(--pk-gold-dark)' }} />
            <span>YOUR PRIVILEGES:</span>
          </div>

          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--pk-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#1E4635' }}>✓</span> 5% instant discount applied automatically at checkout
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#1E4635' }}>✓</span> Free Premium Velvet Box upgrade on orders &gt; ₹1,999
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#1E4635' }}>✓</span> Priority concierge dispatch & WhatsApp live support
            </li>
          </ul>
        </div>

        {/* Share & Earn Referral Engine */}
        <div style={{ border: '1px dashed var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-gold-dark)' }}>
              SHARE & EARN STORE CREDIT
            </span>
            <span style={{ fontSize: '0.7rem', background: 'var(--pk-gold-bg)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
              Give ₹150, Get ₹150
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--pk-text-secondary)', marginBottom: '0.6rem' }}>
            Invite friends to Premium Khaja. When they make their first purchase, they get ₹150 off and you get ₹150 store credit.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              readOnly 
              value={`https://premiumkhaja.store?ref=${customer.referralCode || 'VIP'}`}
              style={{ flex: 1, padding: '0.45rem 0.65rem', fontSize: '0.75rem', background: '#FFFFFF', border: '1px solid var(--pk-border)', borderRadius: '4px', outline: 'none' }}
            />
            <button 
              onClick={copyReferral}
              className="btn-gold"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

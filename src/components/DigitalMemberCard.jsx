import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Crown, Sparkles, Copy, Check, QrCode, Share2, Award, Zap, ArrowRight, Lock } from 'lucide-react';

export const DigitalMemberCard = () => {
  const { 
    memberCardOpen, 
    setMemberCardOpen, 
    customer, 
    loginWithGoogle,
    setAuthModalOpen,
    setAuthMode,
    setAuthIntent 
  } = useStore();
  const [copied, setCopied] = useState(false);

  if (!memberCardOpen) return null;

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://premiumkhaja.store?ref=${customer.referralCode || 'VIP'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={() => setMemberCardOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '1.75rem', borderRadius: 'var(--radius-md)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={20} style={{ color: 'var(--pk-gold-dark)' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--pk-obsidian)', margin: 0 }}>
              {customer.isMember ? 'PK Club VIP Pass' : 'PK Club Exclusive Membership'}
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setMemberCardOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* If user is ALREADY a member: Show active holographic VIP card */}
        {customer.isMember ? (
          <>
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
                <span>ACTIVE PRIVILEGES:</span>
              </div>

              <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--pk-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#1E4635', fontWeight: 700 }}>✓</span> 5% instant discount applied automatically at checkout
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#1E4635', fontWeight: 700 }}>✓</span> Free Premium Velvet Box upgrade on orders &gt; ₹1,999
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#1E4635', fontWeight: 700 }}>✓</span> Priority concierge dispatch & WhatsApp live support
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
          </>
        ) : (
          /* If guest customer: Show Invitation & Overview to Know More and Login with Gmail */
          <div>
            {/* VIP Card Teaser with Locked Overlay */}
            <div style={{ 
              position: 'relative', 
              background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)', 
              border: '1px solid rgba(212, 175, 55, 0.4)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.5rem', 
              color: '#FAF8F5',
              marginBottom: '1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 700 }}>
                    PREMIUM KHAJA ATELIER
                  </span>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: '#FAF8F5' }}>
                    PK Club VIP Gold Pass
                  </div>
                </div>
                <div style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid #D4AF37', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', color: '#E4C88A', fontWeight: 700 }}>
                  5% Lifetime Off
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Lock size={16} style={{ color: '#E4C88A' }} />
                <span style={{ fontSize: '0.78rem', color: '#E8E2D9' }}>
                  Sign in with your Gmail to generate your personalized pass & member QR.
                </span>
              </div>

              {/* 1-Click Google / Gmail Button */}
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'var(--pk-gold-gradient)',
                  color: '#121110',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.35)',
                  transition: 'transform 0.2s'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                </svg>
                <span>Login with Gmail & Claim Member Pass</span>
              </button>
            </div>

            {/* Complete Membership Breakdown & Know More */}
            <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pk-obsidian)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                <span>What You Get as a PK Club Member:</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--pk-text-primary)' }}>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div style={{ color: 'var(--pk-gold-dark)', fontWeight: 800 }}>01.</div>
                  <div>
                    <strong>5% Automatic Price Reduction:</strong> Member prices apply immediately to all handcrafted bangles, chokers, and royal jewellery.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div style={{ color: 'var(--pk-gold-dark)', fontWeight: 800 }}>02.</div>
                  <div>
                    <strong>Complimentary Velvet Jewelry Case:</strong> Upgrade to heirloom-grade travel velvet case on eligible festive orders.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div style={{ color: 'var(--pk-gold-dark)', fontWeight: 800 }}>03.</div>
                  <div>
                    <strong>Early Access to Miss World 2025 Edits:</strong> First right to reserve limited-edition artisan pieces worn on the runway.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div style={{ color: 'var(--pk-gold-dark)', fontWeight: 800 }}>04.</div>
                  <div>
                    <strong>Guest Freedom:</strong> Both guests and members can shop anytime, but members enjoy guaranteed price cuts.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setMemberCardOpen(false);
                  setAuthMode('login');
                  setAuthIntent('member');
                  setAuthModalOpen(true);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--pk-gold-dark)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Or enter details manually via sign in portal →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React from 'react';
import { useStore } from '../context/StoreContext';
import { Crown, MessageCircle, QrCode, Shield, Sparkles, LayoutDashboard } from 'lucide-react';

export const Footer = () => {
  const { setQuickPassOpen, setMemberCardOpen, setQrModalOpen, setAiStylistOpen, setActiveMode } = useStore();

  return (
    <footer style={{ background: '#121110', color: '#FAF8F5', borderTop: '1px solid #282522', padding: '4rem 0 2rem' }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', letterSpacing: '0.1em', color: '#FAF8F5', marginBottom: '0.6rem' }}>
              PREMIUM KHAJA
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '1rem', fontWeight: 600 }}>
              Haute Artificial Jewellery QuickStore
            </span>
            <p style={{ fontSize: '0.82rem', color: '#A89E92', lineHeight: 1.6, maxWidth: '280px', marginBottom: '1.25rem' }}>
              A reimagined digital commerce system connecting artisanal micro-plated gold bangles, AI styling, and bespoke customer retention.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#E4C88A' }}>
              <Shield size={14} />
              <span>Certified 100% Skin-Friendly &amp; Nickel-Free</span>
            </div>
          </div>

          {/* QuickStore Architecture Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
              Storefront &amp; Discovery
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#D1C7BA' }}>
              <li><a href="#bangles-atelier" style={{ color: 'inherit', textDecoration: 'none' }}>Bangles Atelier (28 Designs)</a></li>
              <li><a href="#bangles-atelier" style={{ color: 'inherit', textDecoration: 'none' }}>Royal Kundan &amp; Temple Kadas</a></li>
              <li><a href="#bangles-atelier" style={{ color: 'inherit', textDecoration: 'none' }}>Bridal Chooda Sets</a></li>
              <li><button onClick={() => setAiStylistOpen(true)} style={{ background: 'transparent', border: 'none', color: '#E4C88A', padding: 0, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Sparkles size={12} /> Khaja AI Stylist Assistant</button></li>
            </ul>
          </div>

          {/* Customer Retention & Privileges */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
              Membership &amp; Engagement
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#D1C7BA' }}>
              <li><button onClick={() => setQuickPassOpen(true)} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', fontSize: '0.82rem' }}>QuickPass Customer Entry</button></li>
              <li><button onClick={() => setMemberCardOpen(true)} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', fontSize: '0.82rem' }}>Digital Member Pass &amp; Privileges</button></li>
              <li><button onClick={() => setQrModalOpen(true)} style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><QrCode size={12} /> Offline QR Attribution Generator</button></li>
              <li><button onClick={() => setActiveMode('command-center')} style={{ background: 'transparent', border: 'none', color: '#D4AF37', padding: 0, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><LayoutDashboard size={12} /> Merchant Command Center</button></li>
            </ul>
          </div>

          {/* Direct Concierge Contact */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
              WhatsApp Concierge
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#A89E92', marginBottom: '1rem', lineHeight: 1.5 }}>
              Have questions regarding custom bangle sizing (2.4, 2.6, 2.8) or wedding trousseau matching?
            </p>
            <a 
              href="https://wa.me/919820144521?text=Hello%20Premium%20Khaja!%20I%20need%20assistance%20with%20jewellery%20styling."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#25D366',
                color: '#fff',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: 700
              }}
            >
              <MessageCircle size={16} />
              <span>Chat with Concierge</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#7E766D' }}>
          <div>
            © {new Date().getFullYear()} <strong>Premium Khaja QuickStore</strong>. Artificial Jewellery Edition. All rights reserved.
          </div>
          <div>
            SouqOne QuickStore Engine • Integrated CRM + Realtime Inventory + AI Style Intelligence
          </div>
        </div>

      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, QrCode, Copy, Check, Download, ExternalLink } from 'lucide-react';

export const QRCommerceModal = () => {
  const { qrModalOpen, setQrModalOpen } = useStore();
  const [selectedChannel, setSelectedChannel] = useState('STORE_COUNTER_QR');
  const [copied, setCopied] = useState(false);

  if (!qrModalOpen) return null;

  const channels = [
    { id: 'STORE_COUNTER_QR', name: 'Showroom Counter Standee', utm: '?utm_source=QR&utm_medium=STORE_COUNTER_QR&utm_campaign=OFFLINE_SHOWROOM' },
    { id: 'QR_PACKAGING', name: 'Jewellery Box Packaging Slip', utm: '?utm_source=QR&utm_medium=PACKAGING_QR&utm_campaign=REPEAT_ORDERS' },
    { id: 'QR_INSTAGRAM', name: 'Instagram Bio / Reel QR', utm: '?utm_source=INSTAGRAM&utm_medium=INSTAGRAM_REEL&utm_campaign=BRIDAL_2026' },
    { id: 'QR_EXHIBITION', name: 'Wedding Expo / Exhibition Banner', utm: '?utm_source=QR&utm_medium=EXHIBITION_QR&utm_campaign=BRIDAL_EXPO' }
  ];

  const currentChannel = channels.find(c => c.id === selectedChannel) || channels[0];
  const fullUrl = `https://premiumkhaja.store${currentChannel.utm}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={() => setQrModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--pk-gold-bg)', padding: '0.4rem', borderRadius: '50%', color: 'var(--pk-gold-dark)' }}>
              <QrCode size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)', lineHeight: 1.2 }}>
                QR Commerce Hub
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
                Offline-to-Digital Attribution Engine
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setQrModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--pk-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Print these smart QRs for in-store physical counters, packaging boxes, or exhibition stands to automatically attribute offline footfall into repeat QuickStore customers.
        </p>

        {/* Channel Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pk-text-primary)' }}>SELECT QR PLACEMENT:</span>
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: selectedChannel === ch.id ? '2px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
                background: selectedChannel === ch.id ? 'var(--pk-gold-bg)' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pk-obsidian)' }}>
                {ch.name}
              </span>
              <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--pk-gold-dark)' }}>
                {ch.id}
              </span>
            </button>
          ))}
        </div>

        {/* QR Code Preview Box */}
        <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', boxShadow: 'var(--shadow-sm)', marginBottom: '0.75rem' }}>
            <QrCode size={160} color="#121110" />
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
            PREMIUM KHAJA QUICKSTORE
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
            Scanned Destination: {currentChannel.name}
          </div>
        </div>

        {/* Attributed URL & Copy */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            readOnly 
            value={fullUrl}
            style={{ flex: 1, padding: '0.55rem', fontSize: '0.72rem', border: '1px solid var(--pk-border)', borderRadius: '4px', background: '#FFFFFF' }}
          />
          <button 
            onClick={copyUrl}
            className="btn-gold" 
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

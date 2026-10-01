import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Share2, Copy, Download, Sparkles, ArrowRight } from 'lucide-react';

export const OrderSuccessModal = () => {
  const { orderSuccessData, setOrderSuccessData, customer } = useStore();

  useEffect(() => {
    if (orderSuccessData) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [orderSuccessData]);

  if (!orderSuccessData) return null;

  // WhatsApp formatted order slip text
  const generateWhatsAppMessage = () => {
    const itemsList = orderSuccessData.items
      .map(i => `• ${i.name} (Qty: ${i.quantity}, Size: ${i.size}) - ₹${i.price * i.quantity}`)
      .join('%0A');

    return `https://wa.me/919820144521?text=Hello%20Premium%20Khaja!%20I%20just%20placed%20an%20order:%0A%0A*Order%20ID:*%20${orderSuccessData.orderId}%0A*Name:*%20${orderSuccessData.customerName}%0A*Address:*%20${orderSuccessData.shippingAddress}%0A%0A*Items:*%0A${itemsList}%0A%0A*Total%20Paid:*%20₹${orderSuccessData.totalAmount}%0A*Payment%20Mode:*%20${orderSuccessData.paymentMethod}%0A%0APlease%20confirm%20dispatch%20timeline!`;
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '580px', padding: '2.5rem', textAlign: 'center' }}>
        
        {/* Success Icon */}
        <div style={{ width: '70px', height: '70px', background: 'rgba(30, 70, 53, 0.1)', color: '#1E4635', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle2 size={40} />
        </div>

        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
          Order Confirmed & Logged
        </span>
        <h2 style={{ fontSize: '1.9rem', color: 'var(--pk-obsidian)', margin: '0.3rem 0 0.5rem' }}>
          Thank You, {orderSuccessData.customerName}!
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--pk-text-secondary)', marginBottom: '1.75rem' }}>
          Your handcrafted artificial jewellery order <strong>{orderSuccessData.orderId}</strong> has been received by our atelier concierge.
        </p>

        {/* Order Details Card */}
        <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>ORDER NUMBER</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pk-obsidian)', fontFamily: 'monospace' }}>
                {orderSuccessData.orderId}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>TOTAL PAID</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pk-gold-dark)' }}>
                ₹{orderSuccessData.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {orderSuccessData.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1, color: 'var(--pk-text-primary)' }}>
                  <strong>{item.quantity}x</strong> {item.name} <span style={{ color: 'var(--pk-text-muted)' }}>({item.size})</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--pk-obsidian)' }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)', borderTop: '1px dashed var(--pk-border)', paddingTop: '0.6rem' }}>
            <strong>Shipping to:</strong> {orderSuccessData.shippingAddress}
          </div>
        </div>

        {/* WhatsApp Bridge Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              background: '#25D366', 
              color: '#FFFFFF', 
              textDecoration: 'none', 
              padding: '0.85rem 1.25rem', 
              borderRadius: 'var(--radius-sm)', 
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
            }}
          >
            <MessageCircle size={18} />
            <span>Send Order Confirmation Slip to WhatsApp</span>
          </a>

          <button 
            onClick={() => setOrderSuccessData(null)}
            className="btn-outline" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
          >
            <span>Continue Browsing Atelier</span>
          </button>
        </div>

        {/* Post purchase care tip */}
        <div style={{ background: '#FAF7F2', borderRadius: 'var(--radius-sm)', padding: '0.8rem', fontSize: '0.75rem', color: 'var(--pk-text-secondary)', textAlign: 'left' }}>
          <span style={{ fontWeight: 700, color: 'var(--pk-gold-dark)' }}>Jewellery Longevity Tip: </span>
          Your bangles come sealed in anti-tarnish sleeves. Keep them away from high moisture and alcohol sprays to enjoy their golden brilliance for years.
        </div>

      </div>
    </div>
  );
};

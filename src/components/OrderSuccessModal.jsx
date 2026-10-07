import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MessageCircle, 
  Share2, 
  Copy, 
  Download, 
  Sparkles, 
  ArrowRight,
  Printer,
  Check,
  ShieldCheck,
  Package,
  Clock,
  HeartHandshake
} from 'lucide-react';

export const OrderSuccessModal = () => {
  const { orderSuccessData, setOrderSuccessData, storeOwnerName, storeOwnerPhone, storeUpiId } = useStore();
  const [copiedSlip, setCopiedSlip] = useState(false);

  useEffect(() => {
    if (orderSuccessData) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [orderSuccessData]);

  if (!orderSuccessData) return null;

  const activeOwnerName = storeOwnerName || orderSuccessData.payeeName || "Jaffar Mohd";
  const activeOwnerPhone = storeOwnerPhone || "9393056641";
  const activeUpiId = storeUpiId || orderSuccessData.upiId || "premiumkhaja@okaxis";

  // Structured Shareable Order Slip matching Screenshot 4 template exactly
  const generateSlipText = () => {
    const itemsList = orderSuccessData.items
      .map(i => `• ${i.name} (Qty: ${i.quantity}${i.size ? `, Size: ${i.size}` : ''}) - ₹${(i.price * i.quantity).toLocaleString()}`)
      .join('\n');

    const cleanCustomerPhone = (orderSuccessData.customerPhone || '').replace(/\D/g, '') || '9393056641';

    const guidanceBlock = (orderSuccessData.orderGuidance || (orderSuccessData.guidanceTags && orderSuccessData.guidanceTags.length > 0))
      ? `\n🎯 *CUSTOMER PREFERENCE / GUIDANCE:*\n• ${orderSuccessData.orderGuidance || 'Standard order'}${orderSuccessData.guidanceTags?.length ? ` (${orderSuccessData.guidanceTags.join(', ')})` : ''}\n`
      : '';

    return `• *Name:* ${orderSuccessData.customerName}
• *Phone:* ${cleanCustomerPhone}
• *Delivery Address:* ${orderSuccessData.shippingAddress}

🛒 *ITEMS ORDERED:*
${itemsList}
${guidanceBlock}
💳 *PAYMENT REFERENCE:*
• Total: ₹${orderSuccessData.totalAmount.toLocaleString()}
• UTR / Ref: ${orderSuccessData.utrNumber}
• Payee: ${activeOwnerName} (${activeUpiId})

📍 *DELIVERY DISPATCH ACTION:*
Customer has made payment via QR code. Please confirm receipt in your UPI App and message customer to request exact location / pin to book online delivery via Dunzo / Porter / Delhivery!`;
  };

  const handleShareToWhatsApp = () => {
    const text = generateSlipText();
    const cleanPhone = activeOwnerPhone.replace(/\D/g, '') || "9393056641";
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopySlip = () => {
    navigator.clipboard?.writeText(generateSlipText());
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '640px', 
          maxHeight: '94vh', 
          overflowY: 'auto', 
          padding: '2.25rem 2rem', 
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
          background: '#FFFFFF'
        }}
      >
        
        {/* Success Icon */}
        <div style={{ width: '70px', height: '70px', background: 'rgba(30, 70, 53, 0.1)', color: '#1E4635', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle2 size={40} />
        </div>

        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
          Order Confirmed &amp; Payment Slip Generated
        </span>
        <h2 style={{ fontSize: '1.9rem', color: 'var(--pk-obsidian)', margin: '0.3rem 0 0.4rem', fontFamily: 'var(--font-serif)' }}>
          Thank You, {orderSuccessData.customerName}!
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--pk-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.45 }}>
          Your handcrafted jewellery order <strong>#{orderSuccessData.orderId}</strong> has been registered. Your payment of <strong>₹{orderSuccessData.totalAmount.toLocaleString()}</strong> to <strong>{activeOwnerName} ({activeUpiId})</strong> is confirmed.
        </p>

        {/* Official Printable Receipt Slip */}
        <div style={{ 
          background: '#FAF8F5', 
          border: '1.5px solid var(--pk-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.5rem', 
          textAlign: 'left', 
          marginBottom: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          
          {/* Header of Invoice */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.85rem', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Official Atelier Receipt
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--pk-obsidian)', fontFamily: 'monospace' }}>
                #{orderSuccessData.orderId}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', marginTop: '0.15rem' }}>
                {orderSuccessData.orderDate}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Paid
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--pk-obsidian)' }}>
                ₹{orderSuccessData.totalAmount.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.68rem', background: '#E6F4EA', color: '#137333', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                ✓ Paid to {activeOwnerName}
              </span>
            </div>
          </div>

          {/* Payment & UTR Reference */}
          <div style={{ background: '#FFFFFF', padding: '0.75rem 0.9rem', borderRadius: '6px', border: '1px solid var(--pk-border)', marginBottom: '0.85rem', fontSize: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div>
              <span style={{ color: 'var(--pk-text-muted)' }}>UPI Merchant:</span>{' '}
              <strong>{activeOwnerName}</strong> ({activeUpiId})
            </div>
            <div>
              <span style={{ color: 'var(--pk-text-muted)' }}>Transaction Ref / UTR:</span>{' '}
              <strong style={{ fontFamily: 'monospace', color: 'var(--pk-gold-dark)' }}>{orderSuccessData.utrNumber || 'Verified'}</strong>
            </div>
          </div>

          {/* Customer Preferences & Order Guidance (Prominent Highlight) */}
          {(orderSuccessData.orderGuidance || orderSuccessData.sizePreference || orderSuccessData.guidanceTags?.length > 0) && (
            <div style={{ 
              background: '#FFFDF9', 
              border: '1.5px dashed var(--pk-gold-dark)', 
              borderRadius: '6px', 
              padding: '0.85rem 1rem', 
              marginBottom: '0.85rem' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <Sparkles size={14} style={{ color: 'var(--pk-gold-dark)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--pk-gold-dark)', letterSpacing: '0.06em' }}>
                  Customer Customization &amp; Guidance Notes:
                </span>
              </div>

              {orderSuccessData.sizePreference && (
                <div style={{ fontSize: '0.78rem', color: 'var(--pk-obsidian)', marginBottom: '0.2rem' }}>
                  <strong>Selected Size:</strong> {orderSuccessData.sizePreference}
                </div>
              )}

              {orderSuccessData.orderGuidance && (
                <div style={{ fontSize: '0.78rem', color: 'var(--pk-text-secondary)', fontStyle: 'italic', marginBottom: '0.35rem' }}>
                  "{orderSuccessData.orderGuidance}"
                </div>
              )}

              {orderSuccessData.guidanceTags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {orderSuccessData.guidanceTags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#8C6D1F', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ordered Pieces Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Ordered Pieces ({orderSuccessData.items.length}):
            </div>

            {orderSuccessData.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--pk-border)' }}>
                <img src={item.image} alt={item.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1, color: 'var(--pk-text-primary)' }}>
                  <strong>{item.quantity}x</strong> {item.name}{' '}
                  <span style={{ color: 'var(--pk-text-muted)', fontSize: '0.72rem' }}>({item.size})</span>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div style={{ fontSize: '0.75rem', color: 'var(--pk-text-secondary)', borderTop: '1px dashed var(--pk-border)', paddingTop: '0.75rem' }}>
            <strong>Shipping Destination:</strong> {orderSuccessData.shippingAddress}
          </div>

        </div>

        {/* Primary Action: WhatsApp Auto-Bridge to Owner (Jaffar Mohd) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          
          <button
            onClick={handleShareToWhatsApp}
            style={{ 
              background: '#25D366', 
              color: '#FFFFFF', 
              border: 'none', 
              padding: '0.95rem 1.4rem', 
              borderRadius: 'var(--radius-sm)', 
              fontWeight: 800,
              fontSize: '0.98rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <MessageCircle size={20} />
            <span>Open WhatsApp &amp; Share Slip to Owner {activeOwnerName} (+91 {activeOwnerPhone})</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button 
              onClick={handleCopySlip}
              className="btn-outline" 
              style={{ padding: '0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              {copiedSlip ? <Check size={14} style={{ color: '#137333' }} /> : <Copy size={14} />}
              <span>{copiedSlip ? 'Slip Copied!' : 'Copy Order Slip'}</span>
            </button>

            <button 
              onClick={handlePrint}
              className="btn-outline" 
              style={{ padding: '0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Printer size={14} />
              <span>Print Tax Invoice</span>
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', lineHeight: 1.4 }}>
            WhatsApp links directly to store owner <strong>+91 {activeOwnerPhone}</strong> to confirm your payment and book online courier delivery to your address.
          </div>

          <button 
            onClick={() => setOrderSuccessData(null)}
            className="btn-gold" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', marginTop: '0.25rem' }}
          >
            <span>Continue Browsing Atelier</span>
          </button>
        </div>

        {/* Post-Purchase Assurance Note */}
        <div style={{ background: '#FAF7F2', borderRadius: 'var(--radius-sm)', padding: '0.85rem', fontSize: '0.75rem', color: 'var(--pk-text-secondary)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HeartHandshake size={20} style={{ color: 'var(--pk-gold-dark)', flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'var(--pk-gold-dark)' }}>Artisan Quality Guarantee:</strong> Every piece is individually inspected for stone setting security and micro-gold plating depth before dispatch.
          </div>
        </div>

      </div>
    </div>
  );
};

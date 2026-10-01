import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, Truck, CreditCard, Banknote, QrCode, ArrowRight, Lock } from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    checkoutOpen, 
    setCheckoutOpen, 
    cart, 
    customer, 
    cartTotal, 
    shippingFee, 
    processOrder 
  } = useStore();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'COD'
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name');
    if (!phone.trim() || phone.length < 10) return setError('Please enter a valid 10-digit phone number');
    if (!address.trim()) return setError('Please enter your delivery street address');
    if (!city.trim()) return setError('Please enter your city');
    if (!pincode.trim() || pincode.length < 6) return setError('Please enter a valid 6-digit PIN code');

    setError('');
    setIsProcessing(true);

    setTimeout(() => {
      processOrder({
        items: cart,
        total: cartTotal,
        shippingFee,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI (GPay / PhonePe)' : paymentMethod === 'CARD' ? 'Credit/Debit Card' : 'Cash On Delivery',
        shipping: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim()
        }
      });
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
              QuickStore Secure Checkout
            </span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)' }}>
              Delivery & Payment
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setCheckoutOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section 1: Customer & Address */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pk-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              1. Delivery Information
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Recipient Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Ayesha Sheikh" 
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Mobile / WhatsApp *</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. 9820144521" 
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem' }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Complete Street Address *</label>
              <textarea 
                rows="2" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Flat / House No., Building Name, Street / Locality" 
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem', resize: 'none' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>City *</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g. Mumbai" 
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>PIN Code *</label>
                <input 
                  type="text" 
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  placeholder="e.g. 400050" 
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.85rem' }} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pk-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              2. Choose Payment Mode
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              
              {/* UPI */}
              <div 
                onClick={() => setPaymentMethod('UPI')}
                style={{ 
                  border: paymentMethod === 'UPI' ? '2px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
                  background: paymentMethod === 'UPI' ? 'var(--pk-gold-bg)' : '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--pk-gold-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <QrCode size={16} />
                  <span>Instant UPI</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>GPay, PhonePe, Paytm QR</div>
              </div>

              {/* CARD */}
              <div 
                onClick={() => setPaymentMethod('CARD')}
                style={{ 
                  border: paymentMethod === 'CARD' ? '2px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
                  background: paymentMethod === 'CARD' ? 'var(--pk-gold-bg)' : '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--pk-obsidian)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <CreditCard size={16} />
                  <span>Cards / NetBanking</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>Visa, Mastercard, RuPay</div>
              </div>

              {/* COD */}
              <div 
                onClick={() => setPaymentMethod('COD')}
                style={{ 
                  border: paymentMethod === 'COD' ? '2px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
                  background: paymentMethod === 'COD' ? 'var(--pk-gold-bg)' : '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--pk-obsidian)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Banknote size={16} />
                  <span>Cash On Delivery</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>Pay cash at doorstep</div>
              </div>

            </div>
          </div>

          {/* Order Summary & Final Total */}
          <div style={{ background: 'var(--pk-surface-alt)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--pk-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--pk-text-secondary)', marginBottom: '0.3rem' }}>
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{cartTotal - shippingFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--pk-text-secondary)', marginBottom: '0.5rem' }}>
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? <strong style={{ color: '#1E4635' }}>FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--pk-obsidian)', borderTop: '1px solid var(--pk-border)', paddingTop: '0.5rem' }}>
              <span>Final Payable</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div style={{ color: '#7D1A25', fontSize: '0.8rem', background: '#FBEBEB', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isProcessing}
            className="btn-gold" 
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}
          >
            <Lock size={16} />
            <span>{isProcessing ? 'Confirming Your Order...' : `Place Order (₹${cartTotal.toLocaleString()})`}</span>
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
            <ShieldCheck size={14} style={{ color: '#1E4635' }} />
            <span>100% Verified Purchase Guarantee • Instant WhatsApp Tracking</span>
          </div>

        </form>

      </div>
    </div>
  );
};

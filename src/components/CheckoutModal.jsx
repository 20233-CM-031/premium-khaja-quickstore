import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, QrCode, Lock, Copy, Check, Smartphone, Sparkles, MessageCircle, AlertCircle, ShoppingBag } from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    checkoutOpen, 
    setCheckoutOpen, 
    cart, 
    customer, 
    cartTotal, 
    shippingFee, 
    processOrder,
    storeOwnerPhone,
    storeUpiId,
    storePaymentQr
  } = useStore();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutOpen) return null;

  const upiId = storeUpiId || "9393056641@upi";
  const upiPayIntentUrl = `upi://pay?pa=${upiId}&pn=Premium%20Khaja&am=${cartTotal}&cu=INR&tn=Order%20Payment`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiPayIntentUrl)}`;
  const displayQrImage = storePaymentQr || dynamicQrUrl;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter recipient full name');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid 10-digit mobile number');
    if (!address.trim()) return setError('Please enter complete delivery street address');
    if (!city.trim()) return setError('Please enter your city');
    if (!pincode.trim() || pincode.trim().length < 6) return setError('Please enter a valid 6-digit postal PIN code');

    setError('');
    setIsProcessing(true);

    setTimeout(() => {
      processOrder({
        items: cart,
        total: cartTotal,
        shippingFee,
        paymentMethod: 'UPI QR Code',
        utrNumber: utrNumber.trim() || 'Paid via UPI QR',
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
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          maxHeight: '92vh', 
          overflowY: 'auto', 
          padding: '2rem 1.75rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
        }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="live-pulse"></span>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                Direct QR Payment & Delivery
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0' }}>
              Checkout & Pay via UPI QR
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setCheckoutOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* PROMINENT TOTAL AMOUNT DISPLAY BANNER */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1A1917 0%, #2A2621 100%)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '1.25rem 1.5rem', 
          color: '#FAF8F5', 
          marginBottom: '1.5rem',
          border: '1px solid var(--pk-gold-dark)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4AF37', fontWeight: 700 }}>
              Total Payable Amount
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#FAF8F5', lineHeight: 1.1, marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
              ₹{cartTotal.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#A89E92', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>•</span>
              <span style={{ color: '#25D366', fontWeight: 600 }}>Zero Transaction Fee</span>
              <span>•</span>
              <span style={{ color: '#E4C88A' }}>Free Express Delivery</span>
            </div>
          </div>

          <div style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '0.6rem 0.9rem', borderRadius: '6px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#E4C88A', textTransform: 'uppercase', fontWeight: 700 }}>
              Store WhatsApp Hotline
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FAF8F5' }}>
              +91 {storeOwnerPhone || "9393056641"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <div style={{ background: '#FAF8F5', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pk-border)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ background: 'var(--pk-gold-dark)', color: '#121110', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900 }}>1</span>
              <span>Customer & Delivery Details</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Ayesha Sheikh" 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  WhatsApp / Contact Phone *
                </label>
                <input 
                  type="tel" 
                  required
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. 9393056641" 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Complete Delivery Street Address *
              </label>
              <textarea 
                rows="2" 
                required
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Flat / House No., Apartment / Wing, Street, Landmark" 
                className="form-input"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', resize: 'none' }} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  City *
                </label>
                <input 
                  type="text" 
                  required
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="e.g. Hyderabad / Mumbai" 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Postal PIN Code *
                </label>
                <input 
                  type="text" 
                  required
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  placeholder="e.g. 500001" 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                />
              </div>
            </div>
          </div>

          {/* STEP 2: UPI QR CODE PAYMENT SETUP (EXCLUSIVE) */}
          <div style={{ border: '2px solid var(--pk-gold-dark)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', padding: '1.35rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ background: 'var(--pk-gold-dark)', color: '#121110', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900 }}>2</span>
                <span>Official UPI QR Code Payment</span>
              </h4>
              <span style={{ background: '#E6F4EA', color: '#137333', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                ✓ Only Verified Payment Mode
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-secondary)', marginBottom: '1.25rem' }}>
              Scan the QR below with any UPI application (<strong>Google Pay, PhonePe, Paytm, BHIM, Cred</strong>) to make payment of <strong>₹{cartTotal.toLocaleString()}</strong>.
            </p>

            {/* QR Centerpiece Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
              
              {/* QR Code Frame */}
              <div style={{ textAlign: 'center', background: '#F8F6F2', border: '1px solid var(--pk-border)', padding: '1.25rem', borderRadius: '8px' }}>
                <div style={{ position: 'relative', display: 'inline-block', padding: '8px', background: '#FFFFFF', borderRadius: '8px', border: '2px dashed var(--pk-gold-dark)' }}>
                  <img 
                    src={displayQrImage} 
                    alt="Premium Khaja Official Payment QR" 
                    style={{ width: '200px', height: '200px', display: 'block', objectFit: 'contain' }}
                  />
                  <div style={{ marginTop: '0.35rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--pk-obsidian)', letterSpacing: '0.05em' }}>
                    SCAN TO PAY ₹{cartTotal.toLocaleString()}
                  </div>
                </div>

                {/* Mobile Direct Pay Button */}
                <div style={{ marginTop: '0.85rem' }}>
                  <a 
                    href={upiPayIntentUrl}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      background: '#121110', 
                      color: '#FAF8F5', 
                      padding: '0.5rem 0.9rem', 
                      borderRadius: '4px', 
                      fontSize: '0.78rem', 
                      fontWeight: 700, 
                      textDecoration: 'none' 
                    }}
                  >
                    <Smartphone size={14} style={{ color: '#D4AF37' }} />
                    <span>Open in GPay / PhonePe / Paytm</span>
                  </a>
                </div>
              </div>

              {/* UPI Credentials & Reference Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                
                {/* Official Store UPI ID with 1-Click Copy */}
                <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border)', borderRadius: '6px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Official Merchant UPI ID
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pk-obsidian)', fontFamily: 'monospace' }}>
                      {upiId}
                    </code>
                    <button 
                      type="button" 
                      onClick={handleCopyUpi} 
                      className="btn-outline" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {copiedUpi ? <Check size={12} style={{ color: '#137333' }} /> : <Copy size={12} />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7E766D', marginTop: '0.35rem' }}>
                    Receiver: <strong>Premium Khaja Atelier</strong>
                  </div>
                </div>

                {/* 12-Digit UTR Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
                    UPI Reference / UTR Number (Optional / Recommended)
                  </label>
                  <input 
                    type="text" 
                    value={utrNumber} 
                    onChange={(e) => setUtrNumber(e.target.value)} 
                    placeholder="e.g. 428190382910 (from payment receipt)" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                  <div style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)', marginTop: '0.25rem' }}>
                    Found in your Google Pay / PhonePe / Paytm payment receipt under "UPI Transaction ID" or "UTR".
                  </div>
                </div>

                {/* WhatsApp Dispatch Notice */}
                <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '0.75rem', borderRadius: '6px', fontSize: '0.74rem', color: '#1B5E20', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <MessageCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Instant Owner WhatsApp Alert:</strong> When you place this order, an official order notification will automatically be sent to Owner <strong>+91 {storeOwnerPhone || "9393056641"}</strong> to confirm your payment and book online delivery to your address.
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div style={{ color: '#7D1A25', fontSize: '0.82rem', background: '#FBEBEB', padding: '0.65rem 0.85rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #F5C6CB' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Place Order & Notify WhatsApp Button */}
          <button 
            type="submit" 
            disabled={isProcessing}
            className="btn-gold" 
            style={{ 
              width: '100%', 
              padding: '1.05rem', 
              fontSize: '1.05rem', 
              fontWeight: 800,
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem'
            }}
          >
            <Lock size={18} />
            <span>
              {isProcessing ? 'Verifying & Generating WhatsApp Slip...' : `Confirm Payment & Place Order (₹${cartTotal.toLocaleString()})`}
            </span>
          </button>

          {/* Footer Security Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} style={{ color: '#137333' }} />
              <span>Direct Bank-to-Bank UPI Security</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MessageCircle size={14} style={{ color: '#25D366' }} />
              <span>Instant WhatsApp Confirmation to Owner (9393056641)</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

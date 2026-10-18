import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  Copy, 
  Check, 
  Smartphone, 
  Sparkles, 
  MessageCircle, 
  AlertCircle, 
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Truck,
  Building2,
  ChevronRight
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    checkoutOpen, 
    setCheckoutOpen, 
    cart, 
    customer, 
    cartSubtotal, 
    cartTotal, 
    shippingFee, 
    processOrder, 
    storeOwnerName, 
    storeOwnerPhone, 
    storeUpiId, 
    storePaymentQr,
    paymentSettings,
    discountAmount,
    appliedCoupon
  } = useStore();

  // Multi-step Checkout Flow (Amazon/Flipkart Style: 1. Address -> 2. Payment)
  const [step, setStep] = useState(1);

  // Step 1: Customer Profile & Delivery Address
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [orderGuidance, setOrderGuidance] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Step 2: Payment Method Selection (UPI, WhatsApp Direct)
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'WHATSAPP'
  const [utrNumber, setUtrNumber] = useState('');
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutOpen) return null;

  const activeOwnerName = storeOwnerName || "Jaffar Mohd";
  const activeUpiId = storeUpiId || "premiumkhaja@okaxis";
  const activePhone = storeOwnerPhone || "9393056641";

  // Clean UPI Intent (safe format without strict NPCI bank limit parameters)
  const safeUpiIntent = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activeOwnerName)}&cu=INR&tn=${encodeURIComponent('QuickStore Order')}`;
  const upiQrCodeUrl = storePaymentQr || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(safeUpiIntent)}`;

  const itemsSizeSummary = cart.map(i => `${i.product.name} (${i.size || 'Standard'})`).join(', ');

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // STEP 1 VALIDATION
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name for delivery');
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) return setError('Please enter a valid 10-digit mobile number');
    if (!address.trim()) return setError('Please enter your street / door delivery address');
    if (!city.trim()) return setError('Please enter your delivery city');
    if (!pincode.trim() || pincode.trim().length < 6) return setError('Please enter a valid 6-digit postal PIN code');

    setError('');
    setStep(2);
  };

  // STEP 2 SUBMIT & PROCESS ORDER
  const handlePlaceOrder = (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsProcessing(true);

    let methodLabel = `Direct UPI (${activeUpiId})`;
    let refNum = utrNumber.trim() || 'Paid via UPI App / QR';

    if (paymentMethod === 'WHATSAPP') {
      methodLabel = `WhatsApp Direct Concierge (+91 ${activePhone})`;
      refNum = 'WhatsApp Assisted Order';
    }

    const orderPayload = {
      items: cart,
      subtotal: cartSubtotal,
      total: cartTotal,
      shippingFee,
      discountAmount,
      appliedCoupon: appliedCoupon?.code || null,
      marketingConsent,
      paymentMethod: methodLabel,
      utrNumber: refNum,
      shipping: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim()
      },
      sizePreference: itemsSizeSummary || 'As Selected in Cart',
      orderGuidance: orderGuidance.trim(),
      guidanceTags: []
    };

    setTimeout(() => {
      processOrder(orderPayload);
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '780px', 
          maxHeight: '94vh', 
          overflowY: 'auto', 
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
          background: '#FFFFFF',
          border: '1px solid #E5E0D8'
        }}
      >
        
        {/* Amazon/Flipkart Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #EAE5DE', paddingBottom: '0.85rem', position: 'sticky', top: 0, zIndex: 10, background: '#FFFFFF' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <Lock size={14} style={{ color: '#16A34A' }} />
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16A34A', fontWeight: 800 }}>
                256-Bit SSL Encrypted Checkout
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#121110', margin: 0, fontWeight: 800 }}>
              {step === 1 ? '1. Delivery Address' : '2. Select Payment Method'}
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setCheckoutOpen(false)} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Amazon / Flipkart Style Steps Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8rem', fontWeight: 700 }}>
          <div 
            onClick={() => setStep(1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              cursor: 'pointer',
              color: step === 1 ? '#D4AF37' : '#16A34A'
            }}
          >
            <span style={{ 
              width: '22px', 
              height: '22px', 
              borderRadius: '50%', 
              background: step === 1 ? '#121110' : '#DCFCE7', 
              color: step === 1 ? '#D4AF37' : '#16A34A', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.72rem'
            }}>
              {step > 1 ? <Check size={12} strokeWidth={3} /> : '1'}
            </span>
            <span>Delivery Address</span>
          </div>

          <ChevronRight size={14} style={{ color: '#9CA3AF' }} />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            color: step === 2 ? '#D4AF37' : '#9CA3AF'
          }}>
            <span style={{ 
              width: '22px', 
              height: '22px', 
              borderRadius: '50%', 
              background: step === 2 ? '#121110' : '#F3F4F6', 
              color: step === 2 ? '#D4AF37' : '#6B7280', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.72rem'
            }}>
              2
            </span>
            <span>Payment Options</span>
          </div>
        </div>

        {/* PROMINENT ORDER SUMMARY BANNER */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1A1815 0%, #2A2520 100%)', 
          borderRadius: '8px', 
          padding: '1rem 1.25rem', 
          color: '#FAF8F5', 
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4AF37', fontWeight: 700 }}>
              Total Payable Amount
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#FAF8F5', lineHeight: 1.1, marginTop: '0.15rem' }}>
              ₹{cartTotal.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#D1C7BA', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span>{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
              <span>•</span>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>✓ Free Express Shipping</span>
              <span>•</span>
              <span style={{ color: '#FDE047', fontWeight: 600 }}>✓ Zero Payment Surcharge</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.5rem 0.85rem', borderRadius: '6px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: '#E4C88A', textTransform: 'uppercase', fontWeight: 700 }}>
              Verified Store Payee
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
              {activeOwnerName}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#D4AF37', fontFamily: 'monospace' }}>
              {activeUpiId}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{ color: '#991B1B', fontSize: '0.8rem', background: '#FEF2F2', padding: '0.6rem 0.85rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #FCA5A5', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: DELIVERY ADDRESS (AMAZON / FLIPKART STYLE)                        */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ background: '#FAF8F5', padding: '1.25rem', borderRadius: '8px', border: '1px solid #EAE5DE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
                <MapPin size={18} style={{ color: '#D4AF37' }} />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#121110', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Enter Delivery Address
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: '#121110' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Priya Sharma / Ayesha Sheikh" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: '#121110' }}>
                    Mobile Number (10 Digits) *
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="e.g. 9876543210" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: '#121110' }}>
                  Flat, House No., Building, Street Address *
                </label>
                <textarea 
                  rows="2" 
                  required
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="e.g. Flat 301, Lakeview Residency, Road No. 12, Banjara Hills" 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', resize: 'none' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: '#121110' }}>
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: '#121110' }}>
                    State *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={state} 
                    onChange={(e) => setState(e.target.value)} 
                    placeholder="e.g. Telangana" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: '#121110' }}>
                    PIN Code *
                  </label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={pincode} 
                    onChange={(e) => setPincode(e.target.value)} 
                    placeholder="e.g. 500002" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>
            </div>

            {/* Optional Guidance / Special Notes */}
            <div style={{ background: '#FFFDF9', padding: '1rem', borderRadius: '8px', border: '1px solid #EAE0D0' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem', color: '#121110' }}>
                Special Notes / Sizing Customization (Optional):
              </label>
              <textarea 
                rows="2" 
                value={orderGuidance} 
                onChange={(e) => setOrderGuidance(e.target.value)} 
                placeholder="e.g. Color match with pink bridal outfit, specific bangle sizing (2.4, 2.6, 2.8), or gift message..." 
                className="form-input"
                style={{ width: '100%', padding: '0.55rem', fontSize: '0.8rem', resize: 'vertical' }} 
              />
            </div>

            {/* Proceed Button */}
            <button 
              type="submit" 
              className="btn-gold" 
              style={{ 
                width: '100%', 
                padding: '0.95rem', 
                fontSize: '1rem', 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <span>Proceed to Payment (₹{cartTotal.toLocaleString()})</span>
              <ArrowRight size={18} />
            </button>

          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: PAYMENT METHOD (AMAZON / FLIPKART STYLE NO-LIMIT CHECKOUT)        */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Delivery Recap Chip */}
            <div style={{ background: '#F8F6F2', border: '1px solid #EAE5DE', padding: '0.65rem 0.95rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.76rem', color: '#121110' }}>
                <strong>Deliver to:</strong> {name} ({phone}) • {city}, {pincode}
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn-outline" 
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <ArrowLeft size={12} />
                <span>Change</span>
              </button>
            </div>

            {/* Payment Method Options (Instant UPI & WhatsApp Direct) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              {/* Option 1: UPI Direct Pay & QR */}
              <div 
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  border: paymentMethod === 'UPI' ? '2px solid #D4AF37' : '1px solid #E5E0D8',
                  background: paymentMethod === 'UPI' ? '#FFFDF8' : '#FFFFFF',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'UPI' ? '0.85rem' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input 
                      type="radio" 
                      name="payment_choice" 
                      checked={paymentMethod === 'UPI'} 
                      onChange={() => setPaymentMethod('UPI')}
                      style={{ accentColor: '#D4AF37', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#121110', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Smartphone size={17} style={{ color: '#D4AF37' }} />
                        <span>UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                        Pay directly via any UPI app with verified merchant VPA ({activeUpiId}). Zero limit issues.
                      </div>
                    </div>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    RECOMMENDED • INSTANT
                  </span>
                </div>

                {/* Expanded UPI options when selected */}
                {paymentMethod === 'UPI' && (
                  <div style={{ borderTop: '1px solid #EAE5DE', paddingTop: '0.85rem', marginTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                    
                    {/* Direct App Launch Links */}
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#121110', marginBottom: '0.4rem' }}>
                      1-Click Pay on Mobile (Tap to Open App):
                    </div>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                      <a 
                        href={safeUpiIntent}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#121110', color: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                      >
                        <Smartphone size={13} style={{ color: '#D4AF37' }} />
                        <span>Google Pay</span>
                      </a>
                      <a 
                        href={safeUpiIntent}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#5F259F', color: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                      >
                        <span>PhonePe</span>
                      </a>
                      <a 
                        href={safeUpiIntent}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#00BAF2', color: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                      >
                        <span>Paytm</span>
                      </a>
                      <button 
                        type="button"
                        onClick={handleCopyUpi}
                        className="btn-outline"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        {copiedUpi ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                        <span>{copiedUpi ? 'UPI Copied!' : `Copy UPI: ${activeUpiId}`}</span>
                      </button>
                    </div>

                    {/* QR Code Toggle */}
                    <div style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: '6px', padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setShowUpiQr(!showUpiQr)}
                        style={{ background: 'transparent', border: 'none', color: '#D4AF37', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <QrCode size={16} />
                        <span>{showUpiQr ? 'Hide UPI QR Code' : 'Show UPI QR Code to Scan'}</span>
                      </button>

                      {showUpiQr && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <img 
                            src={upiQrCodeUrl} 
                            alt={`Pay to ${activeOwnerName}`}
                            style={{ width: '180px', height: '180px', margin: '0 auto', display: 'block', borderRadius: '6px', border: '1px solid #D4AF37' }}
                          />
                          <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.35rem' }}>
                            Scan with GPay, PhonePe, Paytm, or any BHIM UPI app
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Optional UTR Ref */}
                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#4B5563', fontWeight: 600, marginBottom: '0.2rem' }}>
                        UPI Reference / UTR Number (Optional):
                      </label>
                      <input 
                        type="text" 
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 428190382910 or leave blank to auto-confirm"
                        className="form-input"
                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.78rem' }}
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* Option 2: Direct WhatsApp Order Assistance */}
              <div 
                onClick={() => setPaymentMethod('WHATSAPP')}
                style={{
                  border: paymentMethod === 'WHATSAPP' ? '2px solid #D4AF37' : '1px solid #E5E0D8',
                  background: paymentMethod === 'WHATSAPP' ? '#FFFDF8' : '#FFFFFF',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input 
                      type="radio" 
                      name="payment_choice" 
                      checked={paymentMethod === 'WHATSAPP'} 
                      onChange={() => setPaymentMethod('WHATSAPP')}
                      style={{ accentColor: '#D4AF37', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#121110', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MessageCircle size={17} style={{ color: '#16A34A' }} />
                        <span>Order via WhatsApp Direct (+91 {activePhone})</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem' }}>
                        Have questions? Connect directly with owner {activeOwnerName} to place and confirm your order.
                      </div>
                    </div>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    CHAT &amp; ORDER
                  </span>
                </div>
              </div>

            </div>

            {/* Place Order CTA Button */}
            <button 
              type="button"
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className="btn-gold" 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                fontSize: '1.05rem', 
                fontWeight: 900,
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(212, 175, 55, 0.4)'
              }}
            >
              <CheckCircle2 size={20} />
              <span>
                {isProcessing 
                  ? 'Confirming Order...' 
                  : (paymentMethod === 'WHATSAPP' 
                      ? 'Confirm & Connect on WhatsApp' 
                      : `Confirm & Pay ₹${cartTotal.toLocaleString()} via UPI`
                    )
                }
              </span>
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9CA3AF' }}>
              By placing your order, you agree to Premium Khaja's genuine artisan delivery &amp; care terms.
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

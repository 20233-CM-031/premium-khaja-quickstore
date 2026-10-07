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
  FileText,
  CreditCard,
  MapPin,
  Tag,
  Gift,
  HelpCircle,
  Eye,
  Camera
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
    storePaymentQr
  } = useStore();

  // Multi-step Checkout Flow: Step 1 (Form First & Guidance) -> Step 2 (UPI QR & Share)
  const [step, setStep] = useState(1); // 1 = Customer & Guidance Form, 2 = UPI Payment & Share

  // Step 1: Customer Profile & Order Preferences
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  
  // Customization & Guidance for the Order
  const [sizePreference, setSizePreference] = useState('2.4 (Small / 2-4/16")');
  const [orderGuidance, setOrderGuidance] = useState('');
  const [selectedTags, setSelectedTags] = useState(['🎁 Complimentary Velvet Gift Box']);

  // Step 2: Payment Details
  const [utrNumber, setUtrNumber] = useState('');
  const [qrDisplayMode, setQrDisplayMode] = useState('DYNAMIC'); // 'DYNAMIC' | 'OFFICIAL_SCANNER'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutOpen) return null;

  const activeOwnerName = storeOwnerName || "Jaffar Mohd";
  const activeUpiId = storeUpiId || "premiumkhaja@okaxis";
  const activePhone = storeOwnerPhone || "9393056641";

  // Dynamic UPI URI encoding exact total amount
  const dynamicUpiIntent = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activeOwnerName)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent('Order Payment - Premium Khaja')}`;
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(dynamicUpiIntent)}`;
  
  // Authentic Google Pay standee photo provided by owner
  const officialScannerPhoto = storePaymentQr || '/images/jaffar_mohd_upi_qr.jpg';

  const quickGuidanceTags = [
    '🎁 Complimentary Velvet Gift Box',
    '⚡ Urgent Express Dispatch',
    '📞 Call / WhatsApp Before Delivery',
    '🎨 Custom Bangle Colour Mixing',
    '💌 Handwritten Royal Gift Note',
    '💎 Request Extra Latkan / Tassels'
  ];

  const bangleSizeOptions = [
    { id: '2.2', label: '2.2 (Petite / 2-2/16")' },
    { id: '2.4', label: '2.4 (Small / 2-4/16")' },
    { id: '2.6', label: '2.6 (Standard / 2-6/16")' },
    { id: '2.8', label: '2.8 (Large / 2-8/16")' },
    { id: '2.10', label: '2.10 (Extra Large)' },
    { id: 'CUSTOM', label: 'Custom / Free Size' }
  ];

  const handleToggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // STEP 1 VALIDATION & PROCEED
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid 10-digit mobile number');
    if (!address.trim()) return setError('Please enter your delivery street address');
    if (!city.trim()) return setError('Please enter your delivery city');
    if (!pincode.trim() || pincode.trim().length < 6) return setError('Please enter a valid 6-digit postal PIN code');

    setError('');
    setStep(2);
  };

  // STEP 2 SUBMIT & AUTOMATIC WHATSAPP SHARE
  const handleConfirmAndPay = (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    const orderPayload = {
      items: cart,
      subtotal: cartSubtotal,
      total: cartTotal,
      shippingFee,
      paymentMethod: `UPI QR Scanner (${activeUpiId})`,
      utrNumber: utrNumber.trim() || 'Paid via UPI QR Scanner',
      shipping: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim()
      },
      sizePreference,
      orderGuidance: orderGuidance.trim(),
      guidanceTags: selectedTags
    };

    setTimeout(() => {
      processOrder(orderPayload);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '720px', 
          maxHeight: '94vh', 
          overflowY: 'auto', 
          padding: '1.75rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
          background: '#FFFFFF',
          border: '1px solid var(--pk-border)'
        }}
      >
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="live-pulse"></span>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                Direct UPI QR Checkout • Verified Merchant
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', color: 'var(--pk-obsidian)', margin: 0, fontFamily: 'var(--font-serif)' }}>
              Secure Checkout &amp; UPI Payment
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setCheckoutOpen(false)} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Interactive Steps Progress Indicator */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          
          <div 
            onClick={() => setStep(1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              padding: '0.65rem 0.9rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              background: step === 1 ? 'linear-gradient(135deg, #1A1917 0%, #2A2621 100%)' : '#FAF8F5',
              color: step === 1 ? '#FAF8F5' : 'var(--pk-text-secondary)',
              border: step === 1 ? '1px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              background: step === 1 ? 'var(--pk-gold-dark)' : '#E2DBD0', 
              color: '#121110', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 900 
            }}>
              1
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, color: step === 1 ? '#D4AF37' : 'inherit' }}>
                Step 1: Fill Form First
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                Details &amp; Order Guidance
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              if (name.trim() && phone.trim() && address.trim() && city.trim() && pincode.trim()) {
                setStep(2);
              }
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              padding: '0.65rem 0.9rem', 
              borderRadius: '6px', 
              cursor: (name.trim() && phone.trim()) ? 'pointer' : 'not-allowed',
              background: step === 2 ? 'linear-gradient(135deg, #1A1917 0%, #2A2621 100%)' : '#FAF8F5',
              color: step === 2 ? '#FAF8F5' : 'var(--pk-text-secondary)',
              border: step === 2 ? '1px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
              transition: 'all 0.2s',
              opacity: (name.trim() && phone.trim()) ? 1 : 0.75
            }}
          >
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              background: step === 2 ? 'var(--pk-gold-dark)' : '#E2DBD0', 
              color: '#121110', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.75rem', 
              fontWeight: 900 
            }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, color: step === 2 ? '#D4AF37' : 'inherit' }}>
                Step 2: Pay &amp; Share
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                Dynamic UPI QR ({activeOwnerName})
              </div>
            </div>
          </div>

        </div>

        {/* PROMINENT PAYABLE AMOUNT BANNER */}
        <div style={{ 
          background: 'linear-gradient(135deg, #121110 0%, #231F1B 100%)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '1.15rem 1.4rem', 
          color: '#FAF8F5', 
          marginBottom: '1.35rem',
          border: '1px solid var(--pk-gold-dark)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4AF37', fontWeight: 700 }}>
              Total Payable Amount
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#FAF8F5', lineHeight: 1.1, marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
              ₹{cartTotal.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#B5A99B', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>({cart.reduce((s, i) => s + i.quantity, 0)} handcrafted pieces)</span>
              <span>•</span>
              <span style={{ color: '#25D366', fontWeight: 700 }}>✓ Zero Transaction Fees</span>
              <span>•</span>
              <span style={{ color: '#E4C88A', fontWeight: 600 }}>✓ Free Express Delivery</span>
            </div>
          </div>

          <div style={{ background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.45)', padding: '0.65rem 0.95rem', borderRadius: '6px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#E4C88A', textTransform: 'uppercase', fontWeight: 700 }}>
              Verified Merchant Payee
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FAF8F5' }}>
              {activeOwnerName}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontFamily: 'monospace' }}>
              {activeUpiId}
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div style={{ color: '#7D1A25', fontSize: '0.82rem', background: '#FBEBEB', padding: '0.65rem 0.85rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #F5C6CB', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: FILL FORM FIRST & ADD ORDER PREFERENCES / GUIDANCE                 */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            
            {/* Delivery Details Block */}
            <div style={{ background: '#FAF8F5', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--pk-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MapPin size={17} style={{ color: 'var(--pk-gold-dark)' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  1. Recipient &amp; Delivery Street Address
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Ayesha Sheikh / Priya Sharma" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
                    WhatsApp / Contact Mobile Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="e.g. 9876543210 (10 digits)" 
                    className="form-input"
                    style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
                  Complete Delivery Street Address (House/Flat No, Landmark) *
                </label>
                <textarea 
                  rows="2" 
                  required
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="e.g. Flat 402, Royal Residency, Near Charminar / Bandra West" 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', resize: 'none' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
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

            {/* ORDER PREFERENCES & GUIDANCE BLOCK */}
            <div style={{ background: '#FFFDF9', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--pk-gold-dark)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <Sparkles size={17} style={{ color: 'var(--pk-gold-dark)' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  2. Order Customization &amp; Artisan Guidance
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--pk-text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                Personalize your order instructions directly for master artisan <strong>{activeOwnerName}</strong>. These notes will be attached to your official WhatsApp order slip.
              </p>

              {/* Bangle / Wrist Size Preference */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--pk-obsidian)' }}>
                  Wrist / Bangle Size Preference for Sets:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                  {bangleSizeOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSizePreference(opt.label)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: sizePreference === opt.label ? '2px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)',
                        background: sizePreference === opt.label ? 'var(--pk-gold-gradient)' : '#FFFFFF',
                        color: sizePreference === opt.label ? '#121110' : 'var(--pk-text-primary)',
                        transition: 'all 0.15s',
                        textAlign: 'center'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions & Guidance Notes */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--pk-obsidian)' }}>
                  Special Guidance Notes / Customization Requests:
                </label>
                <textarea 
                  rows="3" 
                  value={orderGuidance} 
                  onChange={(e) => setOrderGuidance(e.target.value)} 
                  placeholder="e.g. Please color-match with my crimson bridal lehenga, request artisan Jaffar Mohd to inspect the stone setting before dispatch, gift message: 'Wishing you eternal grace', or urgent delivery before Friday..." 
                  className="form-input"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.82rem', resize: 'vertical' }} 
                />
              </div>

              {/* Quick Guidance Tags */}
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase' }}>
                  Quick Assistance Tags (Click to attach):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {quickGuidanceTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-full)',
                          border: isSelected ? '1px solid #137333' : '1px dashed var(--pk-border)',
                          background: isSelected ? '#E6F4EA' : '#FFFFFF',
                          color: isSelected ? '#137333' : 'var(--pk-text-secondary)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Next Button */}
            <button 
              type="submit" 
              className="btn-gold" 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                fontSize: '1.02rem', 
                fontWeight: 800,
                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
            >
              <span>Continue to UPI Payment (₹{cartTotal.toLocaleString()})</span>
              <ArrowRight size={18} />
            </button>

          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DYNAMIC UPI QR CODE PAYMENT & INSTANT AUTOMATIC WHATSAPP SHARE     */}
        {/* ========================================================================= */}
        {step === 2 && (
          <form onSubmit={handleConfirmAndPay} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            
            {/* Recipient Recap Badge */}
            <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border)', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--pk-obsidian)' }}>
                <strong>Deliver to:</strong> {name} ({phone}) • {city}, {state}
                {sizePreference && <span style={{ color: 'var(--pk-gold-dark)', display: 'block', fontSize: '0.72rem', marginTop: '0.15rem' }}>Pref: {sizePreference} {selectedTags.length > 0 && `• ${selectedTags.length} tags attached`}</span>}
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn-outline" 
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ArrowLeft size={12} />
                <span>Edit Form</span>
              </button>
            </div>

            {/* Official UPI Gateway Frame */}
            <div style={{ border: '2px solid var(--pk-gold-dark)', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', padding: '1.35rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <QrCode size={18} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Scan &amp; Pay Exact Total: ₹{cartTotal.toLocaleString()}</span>
                </h4>

                {/* QR Display Switcher (Dynamic with Total vs Authentic Scanner Standee) */}
                <div style={{ display: 'flex', gap: '0.3rem', background: '#F0ECE4', padding: '0.2rem', borderRadius: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setQrDisplayMode('DYNAMIC')}
                    style={{
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      background: qrDisplayMode === 'DYNAMIC' ? 'var(--pk-obsidian)' : 'transparent',
                      color: qrDisplayMode === 'DYNAMIC' ? '#FAF8F5' : 'var(--pk-text-secondary)'
                    }}
                  >
                    ⚡ Dynamic Amount QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrDisplayMode('OFFICIAL_SCANNER')}
                    style={{
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      background: qrDisplayMode === 'OFFICIAL_SCANNER' ? 'var(--pk-obsidian)' : 'transparent',
                      color: qrDisplayMode === 'OFFICIAL_SCANNER' ? '#FAF8F5' : 'var(--pk-text-secondary)'
                    }}
                  >
                    📸 Owner Standee Card
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--pk-text-secondary)', marginBottom: '1.25rem' }}>
                Scan with any UPI app (<strong>Google Pay, PhonePe, Paytm, BHIM, Cred</strong>) to make payment of <strong>₹{cartTotal.toLocaleString()}</strong> to <strong>{activeOwnerName}</strong>.
              </p>

              {/* QR Centerpiece Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.35rem', alignItems: 'center' }}>
                
                {/* QR Code Frame */}
                <div style={{ textAlign: 'center', background: '#F8F6F2', border: '1px solid var(--pk-border)', padding: '1.25rem', borderRadius: '8px' }}>
                  <div style={{ position: 'relative', display: 'inline-block', padding: '8px', background: '#FFFFFF', borderRadius: '8px', border: '2px solid var(--pk-gold-dark)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                    
                    {qrDisplayMode === 'DYNAMIC' ? (
                      <div>
                        <img 
                          src={dynamicQrCodeUrl} 
                          alt={`Pay ₹${cartTotal} to ${activeOwnerName}`} 
                          style={{ width: '210px', height: '210px', display: 'block', objectFit: 'contain' }}
                        />
                        <div style={{ marginTop: '0.35rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--pk-obsidian)', letterSpacing: '0.04em' }}>
                          SCAN TO PAY ₹{cartTotal.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#137333', fontWeight: 700 }}>
                          ✓ Exact Amount Pre-populated on Scan
                        </div>
                      </div>
                    ) : (
                      <div>
                        <img 
                          src={officialScannerPhoto} 
                          alt={`Official Standee of ${activeOwnerName}`} 
                          style={{ width: '210px', height: '250px', display: 'block', objectFit: 'contain' }}
                        />
                        <div style={{ marginTop: '0.35rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                          Verified Merchant: {activeOwnerName}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* 1-Click Mobile App Buttons */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Pay Directly via Mobile Apps:
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <a 
                        href={dynamicUpiIntent}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.3rem', 
                          background: '#121110', 
                          color: '#FAF8F5', 
                          padding: '0.45rem 0.75rem', 
                          borderRadius: '4px', 
                          fontSize: '0.74rem', 
                          fontWeight: 700, 
                          textDecoration: 'none' 
                        }}
                      >
                        <Smartphone size={13} style={{ color: '#D4AF37' }} />
                        <span>Google Pay</span>
                      </a>

                      <a 
                        href={dynamicUpiIntent}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.3rem', 
                          background: '#5f259f', 
                          color: '#FAF8F5', 
                          padding: '0.45rem 0.75rem', 
                          borderRadius: '4px', 
                          fontSize: '0.74rem', 
                          fontWeight: 700, 
                          textDecoration: 'none' 
                        }}
                      >
                        <span>PhonePe</span>
                      </a>

                      <a 
                        href={dynamicUpiIntent}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.3rem', 
                          background: '#002e6e', 
                          color: '#FAF8F5', 
                          padding: '0.45rem 0.75rem', 
                          borderRadius: '4px', 
                          fontSize: '0.74rem', 
                          fontWeight: 700, 
                          textDecoration: 'none' 
                        }}
                      >
                        <span>Paytm</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* UPI Credentials & UTR Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  
                  {/* Official Merchant Details */}
                  <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border)', borderRadius: '6px', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Official Business Payee &amp; UPI ID
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pk-obsidian)', marginTop: '0.15rem' }}>
                      {activeOwnerName}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                      <code style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--pk-gold-dark)', fontFamily: 'monospace' }}>
                        {activeUpiId}
                      </code>
                      <button 
                        type="button" 
                        onClick={handleCopyUpi} 
                        className="btn-outline" 
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        {copiedUpi ? <Check size={12} style={{ color: '#137333' }} /> : <Copy size={12} />}
                        <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 12-Digit UTR Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--pk-obsidian)' }}>
                      UPI Reference / UTR Number (From Payment Slip)
                    </label>
                    <input 
                      type="text" 
                      value={utrNumber} 
                      onChange={(e) => setUtrNumber(e.target.value)} 
                      placeholder="e.g. 428190382910 (12-digit Ref No.)" 
                      className="form-input"
                      style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} 
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)', marginTop: '0.25rem' }}>
                      Found in your GPay / PhonePe / Paytm receipt under "UPI Transaction ID" or "UTR".
                    </div>
                  </div>

                  {/* Automatic WhatsApp Sharing Callout */}
                  <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '0.85rem', borderRadius: '6px', fontSize: '0.75rem', color: '#1B5E20', display: 'flex', gap: '0.6rem', alignItems: 'flex-start', lineHeight: 1.45 }}>
                    <MessageCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#2E7D32' }} />
                    <div>
                      <strong>Automatic WhatsApp Order Dispatch:</strong> When you confirm, the complete order bill with your delivery address, size preference, and special guidance will automatically be sent to Owner <strong>+91 {activePhone}</strong> to verify payment and schedule online delivery!
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Back & Submit Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="btn-outline" 
                style={{ padding: '0.9rem 1.25rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="btn-gold" 
                style={{ 
                  flex: 1, 
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
                  {isProcessing ? 'Verifying & Opening WhatsApp Slip...' : `Confirm Payment & Share to Owner (₹${cartTotal.toLocaleString()})`}
                </span>
              </button>
            </div>

            {/* Security Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} style={{ color: '#137333' }} />
                <span>Direct Bank-to-Bank UPI Security</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MessageCircle size={14} style={{ color: '#25D366' }} />
                <span>Official WhatsApp Slip to {activeOwnerName} ({activePhone})</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

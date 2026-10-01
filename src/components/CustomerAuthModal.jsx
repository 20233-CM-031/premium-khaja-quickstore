import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export const CustomerAuthModal = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    authIntent,
    loginCustomer, 
    signupCustomer, 
    loginAdmin,
    adminUser,
    customer 
  } = useStore();

  const [activeTab, setActiveTab] = useState(authMode === 'admin' ? 'admin' : (authMode || 'login'));
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Customer Login Form State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Customer Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Admin Login State
  const [adminUsername, setAdminUsername] = useState('admin@premiumkhaja.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  if (!authModalOpen) return null;

  const handleCustomerLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmailOrPhone.trim()) {
      setErrorMsg('Please enter your registered email address or mobile number.');
      return;
    }
    loginCustomer({ identifier: loginEmailOrPhone, password: loginPassword });
    setSuccessMsg('Welcome back! You are now logged in.');
  };

  const handleQuickCustomerDemo = (name, phone, email) => {
    loginCustomer({ identifier: email || phone, password: 'password123' });
    setSuccessMsg(`Logged in as ${name}!`);
  };

  const handleCustomerSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signupName.trim() || !signupPhone.trim()) {
      setErrorMsg('Please enter your full name and mobile number.');
      return;
    }
    signupCustomer({
      name: signupName,
      email: signupEmail || `${signupName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: signupPhone,
      password: signupPassword || 'pass123'
    });
    setSuccessMsg('Account created successfully! PK Club Gold Membership activated.');
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginAdmin({ username: adminUsername, password: adminPassword });
    if (res && res.success) {
      setSuccessMsg('Admin verified! Opening Merchant Command Center...');
    } else {
      setErrorMsg(res?.message || 'Invalid admin credentials. Use admin@premiumkhaja.com / admin123');
    }
  };

  const getHeadingAndSubtitle = () => {
    if (activeTab === 'admin') {
      return {
        title: 'Merchant Command Center Login',
        subtitle: 'Restricted administrative access for store operations, inventory & orders.'
      };
    }
    if (authIntent === 'checkout') {
      return {
        title: 'Sign In to Complete Purchase',
        subtitle: 'Please sign in or create an account to proceed with secure checkout & track delivery.'
      };
    }
    if (authIntent === 'cart') {
      return {
        title: 'Sign In to Add to Bag',
        subtitle: 'Guest browsing is view-only. Log in to select sizes and save items to your shopping bag.'
      };
    }
    if (authIntent === 'wishlist') {
      return {
        title: 'Sign In to Save Wishlist',
        subtitle: 'Sign in to sync your favorite bangles & jewellery pieces across devices.'
      };
    }
    return {
      title: activeTab === 'signup' ? 'Join Premium Khaja Atelier' : 'Welcome to Premium Khaja',
      subtitle: activeTab === 'signup' 
        ? 'Create your free account for 5% VIP privileges & complimentary luxury gift boxing.'
        : 'Sign in to access custom sizes, bag purchases, and exclusive festive collections.'
    };
  };

  const { title, subtitle } = getHeadingAndSubtitle();

  return (
    <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #181614 0%, #2A2420 100%)', 
          color: '#FAF8F5', 
          padding: '1.5rem', 
          position: 'relative',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <button 
            className="btn-icon" 
            onClick={() => setAuthModalOpen(false)}
            style={{ 
              position: 'absolute', 
              top: '14px', 
              right: '14px', 
              color: '#FAF8F5',
              background: 'rgba(255,255,255,0.1)'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(212, 175, 55, 0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', marginBottom: '0.5rem' }}>
            <Sparkles size={12} style={{ color: '#E4C88A' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#E4C88A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Authentication Portal
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', color: '#FAF8F5', lineHeight: 1.25, marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#C8BEB2', lineHeight: 1.45 }}>
            {subtitle}
          </p>

          {/* Role Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem', background: 'rgba(0,0,0,0.25)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '0.45rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'login' ? 'var(--pk-gold-gradient)' : 'transparent',
                color: activeTab === 'login' ? '#121110' : '#E8E2D9',
                transition: 'all 0.2s'
              }}
            >
              Customer Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '0.45rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'signup' ? 'var(--pk-gold-gradient)' : 'transparent',
                color: activeTab === 'signup' ? '#121110' : '#E8E2D9',
                transition: 'all 0.2s'
              }}
            >
              New Register
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
              style={{
                padding: '0.45rem 0.85rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'admin' ? '#D4AF37' : 'transparent',
                color: activeTab === 'admin' ? '#121110' : '#A89E92',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s'
              }}
            >
              <KeyRound size={13} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', background: '#FFFFFF' }}>
          
          {/* Error & Success Alerts */}
          {errorMsg && (
            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#9F1239', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Customer Login */}
          {activeTab === 'login' && (
            <div>
              <form onSubmit={handleCustomerLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <span>Email Address or Mobile Number</span>
                    <span style={{ color: 'var(--pk-ruby)', fontSize: '0.75rem' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)', pointerEvents: 'none' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. ayesha@example.com or 9820144521"
                      value={loginEmailOrPhone}
                      onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                    <span style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', cursor: 'pointer' }} onClick={() => setLoginPassword('customer123')}>
                      Auto-fill Password
                    </span>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)', pointerEvents: 'none' }} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pk-text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-gold" 
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem', fontSize: '0.9rem' }}
                >
                  <User size={16} />
                  <span>Sign In & Continue Shopping</span>
                </button>
              </form>

              {/* 1-Click Demo Profiles for Rapid Testing */}
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--pk-surface-alt)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.6rem' }}>
                  ⚡ Quick Demo Login (Instant Access)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickCustomerDemo("Ayesha Sheikh", "+91 98201 44521", "ayesha.sheikh@gmail.com")}
                    style={{
                      background: 'var(--pk-surface-alt)',
                      border: '1px solid var(--pk-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.55rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                        Ayesha Sheikh (VIP Gold)
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>
                        ayesha.sheikh@gmail.com • +91 98201 44521
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                      Log In →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickCustomerDemo("Priya Sharma", "+91 98110 33421", "priya.sharma@example.com")}
                    style={{
                      background: 'var(--pk-surface-alt)',
                      border: '1px solid var(--pk-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.55rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                        Priya Sharma (Wedding Buyer)
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>
                        priya.sharma@example.com
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                      Log In →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Customer Signup */}
          {activeTab === 'signup' && (
            <form onSubmit={handleCustomerSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>Full Name</span>
                  <span style={{ color: 'var(--pk-ruby)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Meera Kapoor"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>WhatsApp / Mobile Number</span>
                  <span style={{ color: 'var(--pk-ruby)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 98765 43210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address (Optional)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                  <input 
                    type="email" 
                    placeholder="meera@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Set Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                  <input 
                    type="password" 
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--pk-surface-alt)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--pk-text-secondary)' }}>
                <Crown size={15} style={{ color: 'var(--pk-gold-dark)' }} />
                <span>Automatically enrolled in PK Club Gold with 5% off every order.</span>
              </div>

              <button 
                type="submit" 
                className="btn-gold" 
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.3rem', fontSize: '0.9rem' }}
              >
                <Crown size={16} />
                <span>Create Account & Start Buying</span>
              </button>
            </form>
          )}

          {/* TAB 3: Admin Login */}
          {activeTab === 'admin' && (
            <div>
              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.78rem', color: '#92400E' }}>
                <strong>Store Owner & Merchant Portal:</strong> Authorized personnel only. Used to fulfill orders, restock inventory, manage categories, and update Miss World & celebrity showcase.
              </div>

              <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Admin Email or Username</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="admin@premiumkhaja.com"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Admin Password or PIN</label>
                    <span style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', cursor: 'pointer' }} onClick={() => { setAdminUsername('admin@premiumkhaja.com'); setAdminPassword('admin123'); }}>
                      Fill Default (admin123)
                    </span>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="admin123 or PIN 7860"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pk-text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.3rem', fontSize: '0.9rem', background: '#121110' }}
                >
                  <ShieldCheck size={16} style={{ color: '#E4C88A' }} />
                  <span>Verify Credentials & Enter Command Center</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer Note */}
        <div style={{ background: 'var(--pk-surface-alt)', padding: '0.75rem 1.25rem', borderTop: '1px solid var(--pk-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--pk-text-muted)' }}>
          <span>🔒 256-Bit SSL Encrypted Verification</span>
          <span>SouqOne Commerce Engine</span>
        </div>

      </div>
    </div>
  );
};

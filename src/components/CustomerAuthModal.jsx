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
  EyeOff,
  Gift,
  Award
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
    loginWithGoogle,
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

  // Admin Login State (Strictly empty, no default credentials exposed)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Custom Gmail prompt state
  const [customGmail, setCustomGmail] = useState('');
  const [showCustomGmailInput, setShowCustomGmailInput] = useState(false);

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

  const handleGoogleSignIn = (customEmail = null, customName = null) => {
    setErrorMsg('');
    const emailToUse = customEmail || (customGmail.trim() ? customGmail.trim() : 'couture.member@gmail.com');
    const nameToUse = customName || emailToUse.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    loginWithGoogle({
      email: emailToUse,
      name: nameToUse
    });
    setSuccessMsg(`Welcome, ${nameToUse}! PK Club Gold VIP Membership unlocked.`);
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
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setErrorMsg('Please enter both Admin ID and Password.');
      return;
    }
    const res = loginAdmin({ username: adminUsername, password: adminPassword });
    if (res && res.success) {
      setSuccessMsg('Admin verified! Opening Merchant Command Center...');
    } else {
      setErrorMsg('Invalid administrator credentials or PIN. Access restricted.');
    }
  };

  const getHeadingAndSubtitle = () => {
    if (activeTab === 'admin') {
      return {
        title: 'Merchant Command Center',
        subtitle: 'Restricted administrative gateway for inventory management, CRM, and store operations.'
      };
    }
    if (authIntent === 'member' || authIntent === 'member-card') {
      return {
        title: 'Unlock PK Club VIP Membership',
        subtitle: 'Sign in with your Gmail to activate 5% member pricing, digital VIP pass & luxury perks.'
      };
    }
    if (authIntent === 'checkout') {
      return {
        title: 'Sign In or Continue as Guest',
        subtitle: 'Sign in with Gmail for 5% Member Savings, or proceed with guest checkout.'
      };
    }
    return {
      title: activeTab === 'signup' ? 'Join Premium Khaja Atelier' : 'Welcome to Premium Khaja',
      subtitle: activeTab === 'signup' 
        ? 'Create your free account for 5% VIP privileges & complimentary luxury velvet packaging.'
        : 'Sign in with Gmail or your account to access member pricing and saved collections.'
    };
  };

  const { title, subtitle } = getHeadingAndSubtitle();

  return (
    <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}
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
              {activeTab === 'admin' ? 'Security Gateway' : 'Customer & Membership Portal'}
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

          {/* TAB 1: Customer Login & Gmail 1-Click Access */}
          {activeTab === 'login' && (
            <div>
              {/* Primary: 1-Click Google / Gmail Login Button */}
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#1E293B',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#CBD5E1'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                  </svg>
                  <span>Continue with Google / Gmail</span>
                </button>

                {/* Optional Custom Gmail Input toggle */}
                <div style={{ textAlign: 'center', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowCustomGmailInput(!showCustomGmailInput)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--pk-gold-dark)', fontSize: '0.74rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {showCustomGmailInput ? '▲ Hide Custom Gmail Box' : '▼ Or sign in with a specific Gmail address'}
                  </button>
                </div>

                {showCustomGmailInput && (
                  <div style={{ marginTop: '0.5rem', background: '#F8FAFC', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={customGmail}
                      onChange={(e) => setCustomGmail(e.target.value)}
                      style={{ flex: 1, padding: '0.45rem 0.65rem', fontSize: '0.82rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!customGmail.trim()) {
                          setErrorMsg('Please type your Gmail address.');
                          return;
                        }
                        handleGoogleSignIn(customGmail.trim());
                      }}
                      className="btn-gold"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>

              {/* PK Club Membership Benefits Highlight */}
              <div style={{ 
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', 
                border: '1px solid #FDE68A', 
                borderRadius: 'var(--radius-sm)', 
                padding: '0.85rem 1rem', 
                marginBottom: '1.25rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400E', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                  <Crown size={15} style={{ color: '#D97706' }} />
                  <span>PK Club VIP Membership Benefits (Free via Gmail)</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#78350F', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>• <strong>5% Instant Discount</strong> on every jewellery & bangles order</div>
                  <div>• <strong>Digital Holographic Member Card</strong> with instant VIP pass</div>
                  <div>• <strong>Free Luxury Velvet Gift Box</strong> & Authenticity Card</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'var(--pk-text-muted)', fontSize: '0.75rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--pk-border)' }}></div>
                <span style={{ padding: '0 0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Email / Phone Login</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--pk-border)' }}></div>
              </div>

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
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)', pointerEvents: 'none' }} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
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
                  <span>Sign In & Continue</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Customer Signup */}
          {activeTab === 'signup' && (
            <div>
              {/* Quick Google Signup Option */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn()}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                </svg>
                <span>Instant Sign Up with Google / Gmail</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '0.75rem 0', color: 'var(--pk-text-muted)', fontSize: '0.72rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--pk-border)' }}></div>
                <span style={{ padding: '0 0.5rem', textTransform: 'uppercase' }}>Or Manual Registration</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--pk-border)' }}></div>
              </div>

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
                  <label className="form-label">Gmail / Email Address</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                    <input 
                      type="email" 
                      placeholder="meera@gmail.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Create Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                    <input 
                      type="password" 
                      placeholder="Choose a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>

                <div style={{ background: 'var(--pk-surface-alt)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--pk-text-secondary)' }}>
                  <Crown size={15} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Enrolls in PK Club Gold for 5% off every order automatically.</span>
                </div>

                <button 
                  type="submit" 
                  className="btn-gold" 
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.3rem', fontSize: '0.9rem' }}
                >
                  <Crown size={16} />
                  <span>Create Account & Join PK Club</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Admin Login (Secure & Clean, No Exposed Passwords!) */}
          {activeTab === 'admin' && (
            <div>
              <div style={{ 
                background: '#181614', 
                color: '#FAF8F5', 
                border: '1px solid rgba(212, 175, 55, 0.3)', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: '1.25rem', 
                fontSize: '0.8rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E4C88A', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <ShieldCheck size={16} />
                  <span>Merchant Command Center Authorization</span>
                </div>
                <div style={{ color: '#C8BEB2', fontSize: '0.74rem', lineHeight: 1.4 }}>
                  Administrative access restricted to store managers. Enter authorized merchant credentials or PIN to access CRM, product catalog and inventory controls.
                </div>
              </div>

              <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Administrator ID or Email</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="Enter Admin ID"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Security Password or PIN</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--pk-text-muted)' }} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                      autoComplete="current-password"
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
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.3rem', fontSize: '0.9rem', background: '#121110', border: '1px solid #D4AF37' }}
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
          <span>QuickStore Commerce Engine</span>
        </div>

      </div>
    </div>
  );
};

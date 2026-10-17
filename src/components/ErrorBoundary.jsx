import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('QuickStore ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '400px',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: '#FAF8F5',
          color: '#181614',
          borderRadius: '12px',
          margin: '1.5rem auto',
          maxWidth: '600px',
          border: '1px solid #E8E2D9',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(197, 160, 89, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            marginBottom: '1rem'
          }}>
            ✨
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif, serif)' }}>
            Showroom View Refreshed
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#5C554E', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            We encountered a temporary display issue while loading product details. You can safely return to browsing the jewellery collections.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #AA822A 100%)',
              color: '#121110',
              border: 'none',
              borderRadius: '8px',
              padding: '0.7rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Return to Atelier Showroom
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

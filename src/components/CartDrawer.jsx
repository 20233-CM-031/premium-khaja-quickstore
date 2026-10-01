import React from 'react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCTS } from '../data/products';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Gift, 
  Truck, 
  Sparkles, 
  Crown, 
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    customer, 
    cartSubtotal, 
    memberSavings, 
    shippingFee, 
    cartTotal,
    freeShippingThreshold,
    luxuryGiftBoxThreshold,
    isFreeShipping,
    isEligibleGiftBox,
    setCheckoutOpen,
    addToCart,
    setQuickPassOpen
  } = useStore();

  if (!cartOpen) return null;

  // Amount needed for thresholds
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const amountToGiftBox = Math.max(0, luxuryGiftBoxThreshold - cartSubtotal);

  // Recommended complementary item for smart upsell in cart
  const upsellCandidate = ALL_PRODUCTS.find(p => 
    p.category === 'rings' || p.subcategory === 'Contemporary CZ' || p.category === 'earrings'
  );

  return (
    <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Cart Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--pk-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--pk-gold-dark)' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)' }}>
              Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button className="btn-icon" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar for Free Shipping & Luxury Gift Box */}
        <div style={{ background: '#FAF7F2', padding: '0.9rem 1.5rem', borderBottom: '1px solid var(--pk-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isFreeShipping ? '#1E4635' : 'var(--pk-text-primary)' }}>
              <Truck size={14} />
              <span>{isFreeShipping ? '✓ Free Express Shipping Unlocked' : `Add ₹${amountToFreeShipping} for Free Shipping`}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isEligibleGiftBox ? '#1E4635' : 'var(--pk-gold-dark)' }}>
              <Gift size={14} />
              <span>{isEligibleGiftBox ? '✓ Free Luxury Box' : `Add ₹${amountToGiftBox} for Luxury Box`}</span>
            </div>
          </div>

          {/* Progress track */}
          <div style={{ width: '100%', height: '6px', background: '#E2DBD0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, (cartSubtotal / luxuryGiftBoxThreshold) * 100)}%`, 
                background: 'var(--pk-gold-gradient)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem 1rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--pk-surface-alt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--pk-text-muted)' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--pk-obsidian)', marginBottom: '0.4rem' }}>
                Your Bag is Empty
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--pk-text-secondary)', marginBottom: '1.2rem' }}>
                Explore our 28 handcrafted bangles and royal kadas to begin styling.
              </p>
              <button 
                onClick={() => setCartOpen(false)}
                className="btn-gold"
                style={{ fontSize: '0.85rem' }}
              >
                Browse Bangles Atelier
              </button>
            </div>
          ) : (
            cart.map(item => {
              const unitPrice = customer.isMember ? item.product.memberPrice : item.product.price;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div 
                  key={`${item.product.id}-${item.size}`}
                  style={{ 
                    display: 'flex', 
                    gap: '0.85rem', 
                    paddingBottom: '1rem', 
                    borderBottom: '1px solid var(--pk-surface-alt)' 
                  }}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: '#F2EDE6' }} 
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.88rem', color: 'var(--pk-obsidian)', lineHeight: 1.3, maxWidth: '210px' }}>
                        {item.product.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', padding: '0 0 0 5px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', margin: '0.2rem 0' }}>
                      Size: <strong>{item.size}</strong> • {item.product.subcategory}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--pk-border)', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, item.size, -1)}
                          style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.78rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, item.size, 1)}
                          style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                          ₹{itemTotal.toLocaleString()}
                        </span>
                        {customer.isMember && (
                          <div style={{ fontSize: '0.65rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
                            VIP 5% applied
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}

          {/* Smart Complementary Upsell (if cart has items) */}
          {cart.length > 0 && upsellCandidate && !cart.some(i => i.product.id === upsellCandidate.id) && (
            <div style={{ background: 'rgba(197, 160, 89, 0.08)', border: '1px dashed var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--pk-gold-dark)', textTransform: 'uppercase' }}>
                  Complete Your Look
                </span>
                <span style={{ fontSize: '0.65rem', color: '#1E4635', fontWeight: 700 }}>
                  Stylist Recommendation
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img src={upsellCandidate.image} alt={upsellCandidate.name} style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--pk-obsidian)', lineHeight: 1.2 }}>
                    {upsellCandidate.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-gold-dark)' }}>
                    ₹{upsellCandidate.price}
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(upsellCandidate, 'Adjustable Free Size', 1)}
                  className="btn-gold"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
                >
                  + Add
                </button>
              </div>
            </div>
          )}

          {/* Member Banner Prompt if not member */}
          {cart.length > 0 && !customer.isMember && (
            <div style={{ background: '#181614', color: '#FAF8F5', borderRadius: 'var(--radius-sm)', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E4C88A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Crown size={12} />
                  <span>Join PK Club & Save 5% Instantly</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#A89E92' }}>
                  Unlock ₹{Math.round(cartSubtotal * 0.05)} savings on this bag.
                </div>
              </div>
              <button 
                onClick={() => setQuickPassOpen(true)}
                className="btn-gold" 
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
              >
                Join
              </button>
            </div>
          )}

        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--pk-border)', background: '#FFFFFF' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--pk-text-secondary)', marginBottom: '0.35rem' }}>
              <span>Bag Subtotal</span>
              <span>₹{cartSubtotal.toLocaleString()}</span>
            </div>

            {customer.isMember && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--pk-gold-dark)', marginBottom: '0.35rem', fontWeight: 600 }}>
                <span>PK Club VIP Savings</span>
                <span>-₹{memberSavings.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--pk-text-secondary)', marginBottom: '0.75rem' }}>
              <span>Express Delivery</span>
              <span>{isFreeShipping ? <strong style={{ color: '#1E4635' }}>FREE</strong> : `₹${shippingFee}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pk-obsidian)', borderTop: '1px solid var(--pk-border)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
              <span>Total Payable</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <button 
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="btn-gold" 
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
            >
              <span>Proceed to Quick Checkout</span>
              <ArrowRight size={17} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

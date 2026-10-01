import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ALL_PRODUCTS, BANGLES_PRODUCTS, CATEGORY_CONFIG } from '../../data/products';
import { 
  Store, 
  TrendingUp, 
  Package, 
  Users, 
  Megaphone, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Crown,
  Search,
  Filter,
  DollarSign,
  Activity,
  Camera,
  Layers
} from 'lucide-react';

export const CommandCenter = () => {
  const { 
    setActiveMode, 
    inventory, 
    restockItem, 
    customersList, 
    leadsList, 
    updateLeadStatus, 
    campaignsList, 
    orders, 
    events,
    celebrityShowcase,
    addCelebrityShowcaseItem
  } = useStore();

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'CATEGORIES_SHOWCASE' | 'INVENTORY' | 'CRM' | 'MARKETING' | 'LEADS' | 'AI_ASSISTANT'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [crmSearch, setCrmSearch] = useState('');

  // Categories Hub State
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('bangles');
  const [newShowcaseTitle, setNewShowcaseTitle] = useState('');
  const [newShowcaseCelebrity, setNewShowcaseCelebrity] = useState('');
  const [newShowcaseEvent, setNewShowcaseEvent] = useState('Miss World 2025 India');
  const [newShowcaseQuote, setNewShowcaseQuote] = useState('');
  const [newShowcaseImage, setNewShowcaseImage] = useState('');
  const [showcaseSuccess, setShowcaseSuccess] = useState('');

  // AI Assistant State
  const [aiProductPrompt, setAiProductPrompt] = useState('New 22K Antique Filigree Floral Bangle Pair with Seed Pearls');
  const [aiGeneratedOutput, setAiGeneratedOutput] = useState(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 128450; // session + baseline
  const totalOrders = orders.length + 42;
  const aov = Math.round(totalRevenue / totalOrders);
  const lowStockCount = ALL_PRODUCTS.filter(p => (inventory[p.id] ?? 10) <= 8).length;

  // AI copy generator handler
  const handleGenerateAiCopy = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setAiGeneratedOutput({
        title: "Noor Mahal Hand-Carved Filigree Royal Bangle Pair",
        sku: `PK-BGL-${Math.floor(100 + Math.random() * 900)}-FLG`,
        suggestedPrice: "₹2,699",
        memberPrice: "₹2,429",
        category: "Bangles",
        subcategory: "Filigree Kangan",
        tags: ["Bridal", "Filigree", "Royal", "22K Micro-Gold", "Seed Pearls"],
        seoDescription: "Exquisite Noor Mahal hand-carved filigree bangles micro-plated in 22K antique gold. Featuring authentic seed pearls, anti-tarnish coating, and skin-safe brass core. Perfect for bridal and festive styling.",
        stylingPitch: "Pairs majestically with deep emerald or crimson Banarasi silks. Recommend cross-selling with PK-NCK-01 (Nizam Heritage Choker)."
      });
      setIsAiGenerating(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2', color: 'var(--pk-text-primary)' }}>
      
      {/* Top Merchant Bar */}
      <header style={{ background: '#121110', color: '#FAF8F5', borderBottom: '1px solid #2B2824', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ background: 'var(--pk-gold-gradient)', borderRadius: '6px', padding: '0.4rem', color: '#121110' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#FAF8F5', margin: 0, letterSpacing: '0.04em' }}>
              BUSINESS COMMAND CENTER
            </h2>
            <span style={{ fontSize: '0.68rem', color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Premium Khaja • Enterprise QuickStore Engine
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>
            <span className="live-pulse"></span>
            <span>Realtime Event Stream Active</span>
          </div>

          <button 
            onClick={() => setActiveMode('storefront')}
            className="btn-gold"
            style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
          >
            <Store size={14} />
            <span>Return to Storefront</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--pk-border)', padding: '0.5rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'OVERVIEW', label: 'Executive Overview', icon: TrendingUp },
            { id: 'CATEGORIES_SHOWCASE', label: 'Categories & Miss World 2025 Hub', icon: Crown },
            { id: 'INVENTORY', label: `Inventory Hub (${lowStockCount} Alert)`, icon: Package },
            { id: 'CRM', label: `CRM & Customer Profiles (${customersList.length})`, icon: Users },
            { id: 'MARKETING', label: 'Attribution & Campaigns', icon: Megaphone },
            { id: 'LEADS', label: `WhatsApp Leads Queue (${leadsList.length})`, icon: MessageSquare },
            { id: 'AI_ASSISTANT', label: 'AI Business & Merchandising', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'var(--pk-obsidian)' : 'transparent',
                  color: isActive ? '#FAF8F5' : 'var(--pk-text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={15} style={{ color: isActive ? '#E4C88A' : 'inherit' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
        
        {/* ==================== 1. EXECUTIVE OVERVIEW ==================== */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Today's Gross Revenue
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-obsidian)', margin: '0.3rem 0' }}>
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ArrowUpRight size={14} />
                  <span>+18.4% vs last week</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Total Orders
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-obsidian)', margin: '0.3rem 0' }}>
                  {totalOrders} Orders
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ArrowUpRight size={14} />
                  <span>84% conversion rate from Cart</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Average Order Value (AOV)
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-gold-dark)', margin: '0.3rem 0' }}>
                  ₹{aov.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pk-text-secondary)' }}>
                  Boosted by Shop The Look Bundles
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  PK Club Members
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-obsidian)', margin: '0.3rem 0' }}>
                  {customersList.filter(c => c.isMember).length + 318}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 600 }}>
                  Generating 62% of monthly GMV
                </div>
              </div>

            </div>

            {/* AI Business Insights Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1C1A17 0%, #2A241D 100%)', color: '#FAF8F5', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid rgba(212, 175, 55, 0.4)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <Sparkles size={18} style={{ color: '#E4C88A' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E4C88A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  AI Business Intelligence Recommendations
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #D4AF37' }}>
                  <strong>Bridal Chooda Demand Spike:</strong> Instagram Reels brought 84 wedding shoppers this week. Stock on <em>Rajwada Bridal Chura (PK-BGL-16)</em> is down to 5 units. Reorder recommended immediately.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #55C57A' }}>
                  <strong>Cross-Sell Synergy:</strong> 42% of customers viewing Kundan Bangles also view the <em>Nizam Heritage Choker</em>. The "Shop The Look" bundle conversion rate is currently <strong>3.8x higher</strong> than individual listings.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #E4C88A' }}>
                  <strong>Store Counter QR High Conversion:</strong> Offline walk-ins scanning the Counter QR have an average order value of <strong>₹3,290</strong>, outperforming Google Search ads by 40%.
                </div>
              </div>
            </div>

            {/* Split Grid: Live Event Engine Feed vs Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              
              {/* Centralized Event Stream */}
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                    <h3 style={{ fontSize: '1rem', color: 'var(--pk-obsidian)' }}>Realtime Event Engine Stream</h3>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', fontFamily: 'monospace' }}>Live Logs</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '340px', overflowY: 'auto' }}>
                  {events.map((evt, idx) => (
                    <div 
                      key={evt.id || idx}
                      style={{ 
                        padding: '0.55rem 0.75rem', 
                        background: 'var(--pk-surface-alt)', 
                        borderRadius: '4px',
                        borderLeft: '3px solid var(--pk-gold-dark)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--pk-obsidian)' }}>{evt.type}</strong>
                        <div style={{ color: 'var(--pk-text-muted)', fontSize: '0.68rem' }}>
                          Customer: {evt.metadata?.customerId || 'GUEST'} • Source: {evt.metadata?.attribution?.source || 'DIRECT'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)', fontFamily: 'monospace' }}>
                        {evt.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders List */}
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--pk-obsidian)', marginBottom: '1rem' }}>Recent Order Snapshots</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
                  {orders.map(order => (
                    <div 
                      key={order.orderId}
                      style={{ 
                        padding: '0.75rem', 
                        border: '1px solid var(--pk-border)', 
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                          {order.orderId} • {order.customerName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
                          {order.items.length} items • {order.paymentMethod} • {order.orderDate}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pk-gold-dark)' }}>
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.65rem', background: '#E6F4EA', color: '#137333', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 1.5. CATEGORIES & MISS WORLD 2025 HUB ==================== */}
        {activeTab === 'CATEGORIES_SHOWCASE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Top Categories Overview & Subcategory Matrix */}
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--pk-gold-bg)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', marginBottom: '0.4rem' }}>
                    <Crown size={13} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Category & Subcategory Architecture
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                    Official Product Categories & Taxonomy
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)' }}>
                    Manage the 4 primary jewellery collections: Bangle, Neclace, Bracelet, and Earings with all subcategories.
                  </p>
                </div>

                {/* Category Selector Tabs */}
                <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--pk-surface-alt)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
                  {[
                    { id: 'bangles', label: 'Bangles (4 Subcategories)' },
                    { id: 'necklaces', label: 'Necklaces (3 Subcategories)' },
                    { id: 'bracelets', label: 'Bracelets (3 Subcategories)' },
                    { id: 'earrings', label: 'Earrings (5 Subcategories)' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedAdminCategory(cat.id)}
                      style={{
                        background: selectedAdminCategory === cat.id ? 'var(--pk-obsidian)' : 'transparent',
                        color: selectedAdminCategory === cat.id ? '#FAF8F5' : 'var(--pk-text-primary)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories Breakdown Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {(CATEGORY_CONFIG[selectedAdminCategory]?.subcategories || []).filter(s => s.id !== 'all').map(sub => {
                  const subItems = ALL_PRODUCTS.filter(p => p.category === selectedAdminCategory && p.subcategory.toLowerCase() === sub.id.toLowerCase());
                  const subStock = subItems.reduce((sum, p) => sum + (inventory[p.id] ?? 10), 0);
                  const avgPrice = subItems.length > 0 ? Math.round(subItems.reduce((sum, p) => sum + p.price, 0) / subItems.length) : 0;

                  return (
                    <div 
                      key={sub.id}
                      style={{ 
                        border: '1px solid var(--pk-border)', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '1rem', 
                        background: 'var(--pk-surface-alt)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                          {sub.label}
                        </span>
                        <span style={{ background: '#FFFFFF', border: '1px solid var(--pk-border)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                          {subItems.length} Products
                        </span>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--pk-text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span>Total Units In Stock:</span>
                        <strong>{subStock} units</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--pk-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Avg Catalogue Price:</span>
                        <strong style={{ color: 'var(--pk-gold-dark)' }}>₹{avgPrice.toLocaleString()}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Product List for Selected Category */}
              <h4 style={{ fontSize: '0.95rem', color: 'var(--pk-obsidian)', marginBottom: '0.8rem' }}>
                Active Catalog Items in {CATEGORY_CONFIG[selectedAdminCategory]?.name || 'Category'}
              </h4>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--pk-surface-alt)', borderBottom: '2px solid var(--pk-border)' }}>
                      <th style={{ padding: '0.65rem 0.8rem' }}>Item</th>
                      <th style={{ padding: '0.65rem 0.8rem' }}>Subcategory</th>
                      <th style={{ padding: '0.65rem 0.8rem' }}>Occasion</th>
                      <th style={{ padding: '0.65rem 0.8rem' }}>Retail Price</th>
                      <th style={{ padding: '0.65rem 0.8rem' }}>Current Stock</th>
                      <th style={{ padding: '0.65rem 0.8rem' }}>Stock Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_PRODUCTS.filter(p => p.category === selectedAdminCategory).map(prod => {
                      const stock = inventory[prod.id] ?? 10;
                      return (
                        <tr key={prod.id} style={{ borderBottom: '1px solid var(--pk-border)' }}>
                          <td style={{ padding: '0.65rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={prod.image} alt={prod.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--pk-obsidian)' }}>{prod.name}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>{prod.sku}</div>
                            </div>
                          </td>
                          <td style={{ padding: '0.65rem 0.8rem' }}>
                            <span className="gold-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                              {prod.subcategory}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.8rem' }}>{prod.occasion}</td>
                          <td style={{ padding: '0.65rem 0.8rem', fontWeight: 700 }}>₹{prod.price.toLocaleString()}</td>
                          <td style={{ padding: '0.65rem 0.8rem' }}>
                            <span style={{ fontWeight: 700, color: stock <= 8 ? '#7D1A25' : '#1E4635' }}>
                              {stock} units {stock <= 8 && '(Low)'}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.8rem' }}>
                            <button
                              onClick={() => restockItem(prod.id, 10)}
                              className="btn-outline"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.74rem' }}
                            >
                              <Plus size={12} />
                              <span>+10 Stock</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Miss World 2025 India & Celebrity Showcase Management */}
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(125, 26, 37, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', marginBottom: '0.4rem' }}>
                    <Sparkles size={13} style={{ color: '#7D1A25' }} />
                    <span style={{ fontSize: '0.72rem', color: '#7D1A25', fontWeight: 700, textTransform: 'uppercase' }}>
                      Brand Accolades & PR Hub
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                    Miss World 2025 India & Celebrity Showcase Manager
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)' }}>
                    Publish new high-fashion photoshoot photos, celebrity red carpet moments, and national pageant updates.
                  </p>
                </div>
              </div>

              {/* Current Active Showcase Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {celebrityShowcase.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      border: '1px solid var(--pk-border)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      background: 'var(--pk-surface-alt)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(18,17,16,0.85)', color: '#E4C88A', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                        {item.badge}
                      </span>
                    </div>

                    <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--pk-ruby)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.tag}
                      </span>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0.4rem', lineHeight: 1.3 }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.74rem', color: 'var(--pk-text-secondary)', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                        "{item.quote.slice(0, 90)}..."
                      </p>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', marginTop: 'auto', fontWeight: 600 }}>
                        Event: {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Showcase Form */}
              <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border-gold)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.98rem', color: 'var(--pk-obsidian)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Camera size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Publish New Miss World 2025 or Celebrity Moment</span>
                </h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--pk-text-muted)', marginBottom: '1rem' }}>
                  Fill details below to broadcast a newly received photoshoot or celebrity sighting to the live store showcase.
                </p>

                {showcaseSuccess && (
                  <div style={{ background: '#ECFDF5', color: '#065F46', padding: '0.5rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    {showcaseSuccess}
                  </div>
                )}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newShowcaseTitle.trim()) return;
                  addCelebrityShowcaseItem({
                    title: newShowcaseTitle,
                    subtitle: newShowcaseCelebrity ? `Worn by ${newShowcaseCelebrity}` : "Miss World 2025 India Feature",
                    celebrity: newShowcaseCelebrity || "Celebrity Icon",
                    event: newShowcaseEvent || "Miss World 2025 India",
                    quote: newShowcaseQuote || "Adorned in Premium Khaja's authentic jewellery on the world stage.",
                    image: newShowcaseImage || "/images/bangles/1789662811af3b.png",
                    tag: "Miss World 2025 India",
                    badge: "Official Feature"
                  });
                  setShowcaseSuccess('Successfully added to live Miss World 2025 showcase!');
                  setNewShowcaseTitle('');
                  setNewShowcaseCelebrity('');
                  setNewShowcaseQuote('');
                  setNewShowcaseImage('');
                  setTimeout(() => setShowcaseSuccess(''), 4000);
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Showcase Title *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Miss World 2025 National Costume Walk"
                        value={newShowcaseTitle}
                        onChange={(e) => setNewShowcaseTitle(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Celebrity / Winner Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Miss World 2025 India Winner"
                        value={newShowcaseCelebrity}
                        onChange={(e) => setNewShowcaseCelebrity(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Event / Publication</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Miss World 2025 India Grand Finale"
                        value={newShowcaseEvent}
                        onChange={(e) => setNewShowcaseEvent(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Photo URL or Image Path</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /images/bangles/1789662811af3b.png"
                        value={newShowcaseImage}
                        onChange={(e) => setNewShowcaseImage(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Quote / Editorial Caption</label>
                      <input 
                        type="text" 
                        placeholder="e.g. The grand coronation walk featured Khaja's Rajwada bangles."
                        value={newShowcaseQuote}
                        onChange={(e) => setNewShowcaseQuote(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-gold" 
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={14} />
                    <span>Publish to Live Storefront Showcase</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 2. INVENTORY HUB ==================== */}
        {activeTab === 'INVENTORY' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Realtime Jewellery Inventory Management
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)' }}>
                  Monitor stock counts, track SKUs, and replenish low-stock bangles in one click.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                  <input 
                    type="text" 
                    placeholder="Search SKU or name..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    style={{ padding: '0.45rem 0.8rem 0.45rem 2rem', fontSize: '0.8rem', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--pk-surface-alt)', borderBottom: '1px solid var(--pk-border)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                    <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock Level</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Restock Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_PRODUCTS.filter(p => 
                    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                    p.sku.toLowerCase().includes(inventorySearch.toLowerCase())
                  ).map(product => {
                    const stock = inventory[product.id] ?? 10;
                    const isLow = stock <= 8 && stock > 0;
                    const isOut = stock === 0;

                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--pk-surface-alt)' }}>
                        <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img src={product.image} alt={product.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontWeight: 600, color: 'var(--pk-obsidian)', maxWidth: '240px' }}>
                            {product.name}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: 'var(--pk-text-muted)' }}>
                          {product.sku}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: 'var(--pk-surface-alt)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>
                            {product.subcategory}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: isOut ? '#7D1A25' : isLow ? '#C5A059' : '#1E4635' }}>
                          {stock} Units
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {isOut ? (
                            <span style={{ background: '#FCE8E6', color: '#C5221F', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                              OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span style={{ background: '#FEF7E0', color: '#B06000', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                              LOW STOCK ({stock})
                            </span>
                          ) : (
                            <span style={{ background: '#E6F4EA', color: '#137333', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                              HEALTHY
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => restockItem(product.id, 10)}
                            style={{ 
                              background: 'var(--pk-surface-alt)', 
                              border: '1px solid var(--pk-border)', 
                              borderRadius: '4px',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Plus size={12} />
                            <span>+10 Units</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ==================== 3. CRM & CUSTOMER PROFILES ==================== */}
        {activeTab === 'CRM' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                    Customer Relationship Management (CRM)
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)' }}>
                    Track RFM segments, lifetime spend, and acquisition touchpoints.
                  </p>
                </div>

                <input 
                  type="text" 
                  placeholder="Search customer name, phone, or tier..."
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                />
              </div>

              {/* Customer table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--pk-surface-alt)', borderBottom: '1px solid var(--pk-border)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Tier & Member ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>RFM Segment</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Orders</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Lifetime Spend</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Acquisition Source</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersList.filter(c => 
                      c.name.toLowerCase().includes(crmSearch.toLowerCase()) || 
                      c.phone.includes(crmSearch) || 
                      c.tier.toLowerCase().includes(crmSearch.toLowerCase())
                    ).map(cust => (
                      <tr 
                        key={cust.id} 
                        style={{ 
                          borderBottom: '1px solid var(--pk-surface-alt)',
                          background: selectedCustomer?.id === cust.id ? 'var(--pk-gold-bg)' : 'transparent',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedCustomer(cust)}
                      >
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--pk-obsidian)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>{cust.phone}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ 
                            background: cust.tier === 'VIP' ? '#121110' : cust.tier === 'GOLD' ? 'var(--pk-gold-bg)' : '#F0EDE8',
                            color: cust.tier === 'VIP' ? '#E4C88A' : cust.tier === 'GOLD' ? 'var(--pk-gold-dark)' : '#555',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}>
                            {cust.tier} {cust.memberId && `(${cust.memberId})`}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontWeight: 600, color: cust.rfmSegment === 'At Risk' ? '#C5221F' : 'var(--pk-text-primary)' }}>
                            {cust.rfmSegment}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {cust.orderCount} Orders
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--pk-gold-dark)' }}>
                          ₹{cust.lifetimeSpend.toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--pk-text-muted)' }}>
                            {cust.acquisitionSource} / {cust.acquisitionMethod}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <button 
                            className="btn-outline" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(cust);
                            }}
                          >
                            Inspect Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Profile Drawer Card */}
            {selectedCustomer && (
              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Customer Dossier
                    </span>
                    <h4 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0' }}>
                      {selectedCustomer.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)' }}>
                      ID: {selectedCustomer.id}
                    </span>
                  </div>
                  <button className="btn-icon" onClick={() => setSelectedCustomer(null)}>
                    &times;
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                  <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                  <div><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</div>
                  <div><strong>VIP Tier:</strong> {selectedCustomer.tier}</div>
                  <div><strong>Member ID:</strong> {selectedCustomer.memberId || 'Guest'}</div>
                  <div><strong>Lifetime Spend:</strong> ₹{selectedCustomer.lifetimeSpend.toLocaleString()}</div>
                  <div><strong>AOV:</strong> ₹{selectedCustomer.averageOrderValue || 0}</div>
                  <div><strong>Favorite Category:</strong> {selectedCustomer.favoriteCategory}</div>
                  <div><strong>Acquisition:</strong> {selectedCustomer.acquisitionSource} ({selectedCustomer.acquisitionMethod})</div>
                </div>

                <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pk-obsidian)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Touchpoint Timeline
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {(selectedCustomer.timeline || []).map((tl, i) => (
                    <div key={i} style={{ background: 'var(--pk-surface-alt)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 600 }}>{tl.event}</div>
                      <div style={{ color: 'var(--pk-text-muted)', fontSize: '0.68rem' }}>{tl.date} • ₹{tl.amount}</div>
                    </div>
                  ))}
                </div>

                <a 
                  href={`https://wa.me/${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${selectedCustomer.name}!%20Greeting%20from%20Premium%20Khaja.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold" 
                  style={{ textDecoration: 'none', textAlign: 'center', padding: '0.65rem' }}
                >
                  Direct WhatsApp Message
                </a>
              </div>
            )}

          </div>
        )}

        {/* ==================== 4. MARKETING ATTRIBUTION & CAMPAIGNS ==================== */}
        {activeTab === 'MARKETING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--pk-obsidian)', marginBottom: '0.3rem' }}>
                Marketing Attribution Engine
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)', marginBottom: '1.5rem' }}>
                Track exactly which Instagram Reels, WhatsApp broadcasts, and offline Counter QRs drive bottom-line jewellery sales.
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--pk-surface-alt)', borderBottom: '1px solid var(--pk-border)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Campaign Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Channel / Touchpoint</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Store Visits</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Conversions</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Attributed GMV</th>
                      <th style={{ padding: '0.75rem 1rem' }}>CAC</th>
                      <th style={{ padding: '0.75rem 1rem' }}>ROAS</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignsList.map(camp => (
                      <tr key={camp.id} style={{ borderBottom: '1px solid var(--pk-surface-alt)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                          {camp.name}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontFamily: 'monospace', color: 'var(--pk-gold-dark)' }}>
                            {camp.channel} • {camp.method}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>{camp.visits.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{camp.conversions} Orders</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                          ₹{camp.revenue.toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>₹{camp.cac}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#1E4635' }}>
                          {camp.roas}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: '#E6F4EA', color: '#137333', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                            {camp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 5. WHATSAPP LEADS QUEUE ==================== */}
        {activeTab === 'LEADS' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                WhatsApp & Web Enquiries Pipeline
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--pk-text-muted)' }}>
                Direct concierge leads captured from "Ask on WhatsApp" and size queries.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leadsList.map(lead => (
                <div 
                  key={lead.id}
                  style={{ 
                    border: '1px solid var(--pk-border)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: lead.status === 'CONVERTED' ? '#FAFFF9' : '#FFFFFF'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ 
                        background: lead.status === 'NEW LEAD' ? '#FEF7E0' : lead.status === 'CONTACTED' ? '#E8F0FE' : '#E6F4EA',
                        color: lead.status === 'NEW LEAD' ? '#B06000' : lead.status === 'CONTACTED' ? '#1967D2' : '#137333',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {lead.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)', fontFamily: 'monospace' }}>
                        {lead.inquiryDate} • Via {lead.channel}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: 'var(--pk-obsidian)', marginBottom: '0.2rem' }}>
                      {lead.customerName} <span style={{ fontSize: '0.85rem', color: 'var(--pk-text-muted)', fontWeight: 400 }}>({lead.phone})</span>
                    </h4>

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pk-gold-dark)', marginBottom: '0.4rem' }}>
                      Item: {lead.productName}
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--pk-text-secondary)', background: 'var(--pk-surface-alt)', padding: '0.6rem 0.85rem', borderRadius: '4px' }}>
                      "{lead.message}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                    <a 
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi%20${lead.customerName}!%20Replying%20to%20your%20inquiry%20regarding%20${lead.productName}%20from%20Premium%20Khaja.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '0.55rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>Reply on WhatsApp</span>
                    </a>

                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button 
                        onClick={() => updateLeadStatus(lead.id, 'CONTACTED')}
                        className="btn-outline" 
                        style={{ flex: 1, padding: '0.35rem', fontSize: '0.72rem' }}
                      >
                        Contacted
                      </button>
                      <button 
                        onClick={() => updateLeadStatus(lead.id, 'CONVERTED')}
                        style={{ flex: 1, padding: '0.35rem', fontSize: '0.72rem', background: '#1E4635', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Converted
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== 6. AI BUSINESS & MERCHANDISING ASSISTANT ==================== */}
        {activeTab === 'AI_ASSISTANT' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left: AI Generator Tool */}
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={18} style={{ color: 'var(--pk-gold-dark)' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--pk-obsidian)' }}>
                  AI Jewellery Merchandising Engine
                </h3>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--pk-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Input artisan specs for a new arrival bangle or choker. The AI generates verified product copywriting, SEO metadata, tags, and cross-sell pitches.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Artisan Raw Notes or Concept:
                </label>
                <textarea 
                  rows="3" 
                  value={aiProductPrompt}
                  onChange={(e) => setAiProductPrompt(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', resize: 'none' }}
                />
              </div>

              <button 
                onClick={handleGenerateAiCopy}
                disabled={isAiGenerating}
                className="btn-gold"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}
              >
                <Sparkles size={15} />
                <span>{isAiGenerating ? 'Synthesizing Catalogue Intelligence...' : 'Generate Product Listing & Strategy'}</span>
              </button>
            </div>

            {/* Right: AI Output Display */}
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border-gold)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Generated Merchandising Assets
              </span>

              {aiGeneratedOutput ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem', fontSize: '0.82rem' }}>
                  <div>
                    <strong>Suggested Title:</strong>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                      {aiGeneratedOutput.title}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--pk-surface-alt)', padding: '0.6rem', borderRadius: '4px' }}>
                    <div><strong>SKU:</strong> {aiGeneratedOutput.sku}</div>
                    <div><strong>Suggested Price:</strong> {aiGeneratedOutput.suggestedPrice}</div>
                    <div><strong>Member Price:</strong> {aiGeneratedOutput.memberPrice}</div>
                    <div><strong>Category:</strong> {aiGeneratedOutput.subcategory}</div>
                  </div>

                  <div>
                    <strong>SEO Meta Description:</strong>
                    <p style={{ color: 'var(--pk-text-secondary)', background: '#FAF8F5', padding: '0.5rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                      {aiGeneratedOutput.seoDescription}
                    </p>
                  </div>

                  <div>
                    <strong>Styling & Cross-Sell Pitch:</strong>
                    <p style={{ color: '#1E4635', fontWeight: 600, marginTop: '0.2rem' }}>
                      {aiGeneratedOutput.stylingPitch}
                    </p>
                  </div>

                  <button 
                    onClick={() => alert("Product specifications successfully approved and staged for live QuickStore!")}
                    className="btn-primary" 
                    style={{ marginTop: '0.5rem' }}
                  >
                    <span>Approve & Push to Atelier Inventory</span>
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--pk-text-muted)' }}>
                  <Sparkles size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                  <p>Click "Generate Product Listing" to run the AI assistant.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

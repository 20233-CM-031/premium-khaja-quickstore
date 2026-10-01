import React, { useState, useRef } from 'react';
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
  Layers,
  Upload,
  Image as ImageIcon,
  Trash2,
  Smartphone,
  Monitor,
  Wand2,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  QrCode,
  Folder,
  Copy,
  Link as LinkIcon
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
    addCelebrityShowcaseItem,
    products,
    addNewProduct,
    deleteProduct,
    storeOwnerPhone,
    storeOwnerWhatsApp,
    storeUpiId,
    storePaymentQr,
    uploadStorePaymentQr,
    resetStorePaymentQr
  } = useStore();

  const allCatalogueProducts = products || ALL_PRODUCTS;

  const [activeTab, setActiveTab] = useState('PRODUCT_STUDIO'); // 'OVERVIEW' | 'PRODUCT_STUDIO' | 'INVENTORY' | 'CRM' | 'CATEGORIES_SHOWCASE' | 'LEADS'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [crmSearch, setCrmSearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'OUT'

  // ================= ADD NEW PRODUCT STATE (Direct from Computer/Phone) =================
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const qrFileInputRef = useRef(null);

  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('bangles');
  const [newProductSubcategory, setNewProductSubcategory] = useState('Bridal Chura');
  const [newProductOccasion, setNewProductOccasion] = useState('Bridal');
  const [newProductPrice, setNewProductPrice] = useState(2499);
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState(3499);
  const [newProductMemberPrice, setNewProductMemberPrice] = useState(2249);
  const [newProductStock, setNewProductStock] = useState(20);
  const [newProductTag, setNewProductTag] = useState('New Launch');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [isAiAutoFilling, setIsAiAutoFilling] = useState(false);
  const [aiFillSuccess, setAiFillSuccess] = useState('');
  const [addProductSuccess, setAddProductSuccess] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directImageUrl, setDirectImageUrl] = useState('');

  // Catalog list state
  const [catalogFilterTab, setCatalogFilterTab] = useState('ALL'); // 'ALL' | 'CUSTOM'
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [copiedQrUpi, setCopiedQrUpi] = useState(false);

  // Categories Hub State
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('bangles');
  const [newShowcaseTitle, setNewShowcaseTitle] = useState('');
  const [newShowcaseCelebrity, setNewShowcaseCelebrity] = useState('');
  const [newShowcaseEvent, setNewShowcaseEvent] = useState('Miss World 2025 India');
  const [newShowcaseQuote, setNewShowcaseQuote] = useState('');
  const [newShowcaseImage, setNewShowcaseImage] = useState('');
  const [showcaseSuccess, setShowcaseSuccess] = useState('');

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 128450;
  const totalOrders = orders.length + 42;
  const aov = Math.round(totalRevenue / totalOrders);
  const lowStockCount = allCatalogueProducts.filter(p => (inventory[p.id] ?? 10) <= 8).length;

  // Custom added products filter
  const defaultProductIds = new Set(ALL_PRODUCTS.map(p => p.id));
  const customAddedProducts = allCatalogueProducts.filter(p => !defaultProductIds.has(p.id) || p.isCustomAdded);

  // ================= IMAGE UPLOAD FROM COMPUTER OR PHONE (DRIVE/WHATSAPP/FILES/GALLERY) =================
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 720px preserving aspect ratio for safe localStorage quota
        const canvas = document.createElement('canvas');
        const maxDim = 720;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setNewProductImage(compressedDataUrl);
        setImageFileName(file.name);
        setImageUploadLoading(false);
      };
      img.onerror = () => {
        setImageUploadLoading(false);
        alert("Could not process this image file. Please try another PNG or JPEG image.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Direct Web Image URL apply
  const handleApplyWebImageUrl = () => {
    if (!directImageUrl.trim()) return;
    setNewProductImage(directImageUrl.trim());
    setImageFileName('External Image URL Linked');
    setShowUrlInput(false);
  };

  // Store Payment QR Code file uploader (PhonePe / GPay / Paytm / BHIM)
  const handleQrFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');
        uploadStorePaymentQr(dataUrl);
        alert("✓ Store Payment QR Code successfully updated! Customers will now scan this QR during checkout.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ================= AI AUTO-CATEGORIZE & COPYWRITING AUTOMATION =================
  const handleAiAutoCategorize = () => {
    setIsAiAutoFilling(true);
    setTimeout(() => {
      const promptLower = (newProductName || newProductDesc || 'Royal Gold Plated Bridal Chura').toLowerCase();
      
      let detectedCategory = 'bangles';
      let detectedSub = 'Bridal Chura';
      let detectedOccasion = 'Bridal';
      let detectedPrice = 2499;
      let detectedMRP = 3499;
      let detectedOffer = 2249;
      let detectedTag = 'New Launch';

      if (promptLower.includes('necklace') || promptLower.includes('choker') || promptLower.includes('haar')) {
        detectedCategory = 'necklaces';
        detectedSub = promptLower.includes('pearl') ? 'Real Pearls' : promptLower.includes('cz') ? 'Cz' : 'AD Heritage';
        detectedPrice = 3299;
        detectedMRP = 4499;
        detectedOffer = 2969;
        detectedTag = 'Royal Edition';
        detectedOccasion = 'Festive';
      } else if (promptLower.includes('bracelet') || promptLower.includes('kada') || promptLower.includes('cuff')) {
        detectedCategory = 'bracelets';
        detectedSub = promptLower.includes('party') ? 'Party' : 'family Editon';
        detectedPrice = 1899;
        detectedMRP = 2699;
        detectedOffer = 1709;
        detectedTag = 'Bestseller';
        detectedOccasion = 'Party';
      } else if (promptLower.includes('earring') || promptLower.includes('jhumka')) {
        detectedCategory = 'earrings';
        detectedSub = 'Cz';
        detectedPrice = 1499;
        detectedMRP = 2199;
        detectedOffer = 1349;
        detectedTag = 'Special Offer';
        detectedOccasion = 'Festive';
      } else {
        // Bangles detection
        if (promptLower.includes('glass')) {
          detectedSub = 'Glass Bangle';
          detectedPrice = 999;
          detectedMRP = 1499;
          detectedOffer = 899;
          detectedOccasion = 'Everyday';
        } else if (promptLower.includes('stone') || promptLower.includes('kundan')) {
          detectedSub = 'Stone Bangle';
          detectedPrice = 2799;
          detectedMRP = 3999;
          detectedOffer = 2519;
          detectedOccasion = 'Bridal';
        } else if (promptLower.includes('lac')) {
          detectedSub = 'Lac Bangles';
          detectedPrice = 1699;
          detectedMRP = 2399;
          detectedOffer = 1529;
          detectedOccasion = 'Traditions';
        } else if (promptLower.includes('minakari') || promptLower.includes('meenakari')) {
          detectedSub = 'Minakari Bangles';
          detectedPrice = 2299;
          detectedMRP = 3199;
          detectedOffer = 2069;
          detectedOccasion = 'Festive';
        } else {
          detectedSub = 'Traditions';
          detectedPrice = 2199;
          detectedMRP = 2999;
          detectedOffer = 1979;
          detectedOccasion = 'Festive';
        }
      }

      setNewProductCategory(detectedCategory);
      setNewProductSubcategory(detectedSub);
      setNewProductOccasion(detectedOccasion);
      setNewProductPrice(detectedPrice);
      setNewProductOriginalPrice(detectedMRP);
      setNewProductMemberPrice(detectedOffer);
      setNewProductTag(detectedTag);
      
      const luxuryTitle = newProductName.trim() 
        ? (newProductName.includes('Noor') || newProductName.includes('Rajwada') ? newProductName : `Rajwada ${newProductName}`)
        : `Rajwada ${detectedSub} Haute Masterpiece`;
      setNewProductName(luxuryTitle);

      setNewProductDesc(`Handcrafted by Premium Khaja master artisans with 22K antique micro-gold dip plating, hypoallergenic nickel-safe brass core, and anti-tarnish protective sealing. Tailored for regal ${detectedOccasion.toLowerCase()} grace.`);

      setIsAiAutoFilling(false);
      setAiFillSuccess('✨ AI Auto-Categorized, priced and described! Review and publish below.');
      setTimeout(() => setAiFillSuccess(''), 4500);
    }, 550);
  };

  // Auto calculate member discount and MRP
  const handleAutoPricing = (basePrice) => {
    const p = Number(basePrice) || 1999;
    setNewProductPrice(p);
    setNewProductOriginalPrice(Math.round(p * 1.35));
    setNewProductMemberPrice(Math.round(p * 0.95)); // 5% discount
  };

  // Submit and Publish New Product
  const handleAddNewProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      alert("Please enter a product title.");
      return;
    }
    if (!newProductImage) {
      alert("Please upload an image from your computer or phone, or choose one from the library.");
      return;
    }

    const createdProd = addNewProduct({
      name: newProductName,
      category: newProductCategory,
      subcategory: newProductSubcategory,
      occasion: newProductOccasion,
      price: Number(newProductPrice),
      originalPrice: Number(newProductOriginalPrice),
      memberPrice: Number(newProductMemberPrice),
      image: newProductImage,
      tag: newProductTag,
      description: newProductDesc,
      inventoryCount: Number(newProductStock) || 20
    });

    setAddProductSuccess(`✓ "${createdProd.name}" successfully published! It is now live in the showroom for all users.`);
    // Reset inputs
    setNewProductName('');
    setNewProductPrice(2499);
    setNewProductOriginalPrice(3499);
    setNewProductMemberPrice(2249);
    setNewProductDesc('');
    setNewProductImage('');
    setImageFileName('');
    setTimeout(() => setAddProductSuccess(''), 6000);
  };

  // Inventory filtered list
  const filteredInventoryList = allCatalogueProducts.filter(p => {
    const stock = inventory[p.id] ?? 10;
    if (inventoryFilter === 'LOW' && (stock > 8 || stock === 0)) return false;
    if (inventoryFilter === 'OUT' && stock !== 0) return false;
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2', color: 'var(--pk-text-primary)' }}>
      
      {/* Top Merchant Command Bar */}
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
              Premium Khaja • AI CRM & Inventory Suite
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>
            <span className="live-pulse"></span>
            <span>Live Showroom Connected ({allCatalogueProducts.length} Items)</span>
          </div>

          <button 
            onClick={() => setActiveMode('storefront')}
            className="btn-gold"
            style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
          >
            <Store size={14} />
            <span>View Live Showroom</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--pk-border)', padding: '0.5rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'PRODUCT_STUDIO', label: 'Add Products & AI Studio', icon: Plus, highlight: true },
            { id: 'PAYMENT_QR', label: 'Store Payment QR Setup', icon: QrCode, highlight: false },
            { id: 'INVENTORY', label: `Inventory Hub (${lowStockCount} Low Alert)`, icon: Package },
            { id: 'CRM', label: `CRM & Customer AI (${customersList.length})`, icon: Users },
            { id: 'OVERVIEW', label: 'Executive Analytics', icon: TrendingUp },
            { id: 'CATEGORIES_SHOWCASE', label: 'Miss World 2025 PR Hub', icon: Crown },
            { id: 'LEADS', label: `WhatsApp Leads (${leadsList.length})`, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? (tab.highlight ? 'var(--pk-gold-gradient)' : 'var(--pk-obsidian)') : 'transparent',
                  color: isActive ? '#121110' : 'var(--pk-text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={15} style={{ color: isActive ? '#121110' : 'inherit' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
        
        {/* ========================================================================= */}
        {/* TAB 1: ADD PRODUCTS & AI STUDIO (Upload directly from Phone / Computer)   */}
        {/* ========================================================================= */}
        {activeTab === 'PRODUCT_STUDIO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top Alert & Success Feedback */}
            {addProductSuccess && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={20} color="#059669" />
                  <span style={{ fontWeight: 600 }}>{addProductSuccess}</span>
                </div>
                <button 
                  onClick={() => setActiveMode('storefront')}
                  className="btn-gold" 
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                >
                  Go to Showroom →
                </button>
              </div>
            )}

            {aiFillSuccess && (
              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="#D97706" />
                <span>{aiFillSuccess}</span>
              </div>
            )}

            {/* Split Creator Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
              
              {/* Creator Form */}
              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--pk-gold-bg)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', marginBottom: '0.4rem' }}>
                      <Camera size={13} style={{ color: 'var(--pk-gold-dark)' }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Device Upload & AI Automation
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                      Publish New Product to Showroom
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.2rem 0 0' }}>
                      Add items directly from your mobile camera, photo album, or computer files.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAiAutoCategorize}
                    disabled={isAiAutoFilling}
                    className="btn-gold"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                    title="Automatically analyze title, assign category, calculate optimal prices and generate luxury copy"
                  >
                    <Wand2 size={13} />
                    <span>{isAiAutoFilling ? 'AI Categorizing...' : '⚡ AI Auto-Fill'}</span>
                  </button>
                </div>

                <form onSubmit={handleAddNewProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  
                  {/* Photo Upload Zone (Files/Folders/Drive/WhatsApp or Camera) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-text-primary)', marginBottom: '0.4rem' }}>
                      Product Photo (Select from Files, Drive, WhatsApp or Camera) *
                    </label>

                    {/* Standard File Picker: NO capture attribute so mobile shows Drive, WhatsApp, Files, Gallery */}
                    <input 
                      type="file" 
                      accept="image/*,.png,.jpg,.jpeg,.webp" 
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageFileUpload}
                    />

                    {/* Dedicated Camera Trigger */}
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      ref={cameraInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageFileUpload}
                    />

                    {newProductImage ? (
                      <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--pk-gold-dark)', height: '220px', background: '#121110' }}>
                        <img 
                          src={newProductImage} 
                          alt="Product preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                        />
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.85)', padding: '0.4rem 0.75rem', borderRadius: '4px', color: '#FAF8F5', fontSize: '0.74rem' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                            ✓ {imageFileName || 'Image Ready'}
                          </span>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button 
                              type="button" 
                              onClick={() => fileInputRef.current?.click()}
                              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.25rem 0.55rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                              title="Select from Files / Drive / WhatsApp / Gallery"
                            >
                              <Folder size={11} />
                              <span>Files</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => cameraInputRef.current?.click()}
                              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.25rem 0.55rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                              title="Snap Live Photo with Camera"
                            >
                              <Camera size={11} />
                              <span>Camera</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setNewProductImage(''); setImageFileName(''); }}
                              style={{ background: '#7D1A25', border: 'none', color: '#fff', padding: '0.25rem 0.55rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.7rem' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ border: '2px dashed #CBD5E1', borderRadius: 'var(--radius-sm)', padding: '1.25rem 1rem', background: '#F8FAFC', textAlign: 'center' }}>
                        <div style={{ width: '44px', height: '44px', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem', color: 'var(--pk-gold-dark)' }}>
                          <Upload size={20} />
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--pk-obsidian)', marginBottom: '0.2rem' }}>
                          {imageUploadLoading ? 'Optimizing & Scaling Photo...' : 'Add Product Photo'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--pk-text-muted)', marginBottom: '0.85rem' }}>
                          Select directly from folders, Google Drive, WhatsApp media, or take a live camera shot
                        </div>

                        {/* Multi-Source Selection Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.85rem' }}>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-gold"
                            style={{ padding: '0.55rem 0.95rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Folder size={14} />
                            <span>Browse Files, Drive &amp; WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="btn-outline"
                            style={{ padding: '0.55rem 0.95rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fff' }}
                          >
                            <Camera size={14} />
                            <span>Direct Camera Snap</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="btn-outline"
                            style={{ padding: '0.55rem 0.8rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fff' }}
                          >
                            <LinkIcon size={14} />
                            <span>{showUrlInput ? 'Hide URL' : 'Paste Image URL'}</span>
                          </button>
                        </div>

                        {/* Direct URL Input Tray */}
                        {showUrlInput && (
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', marginBottom: '0.5rem', padding: '0.6rem', background: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--pk-border)' }}>
                            <input 
                              type="url"
                              placeholder="Paste public image link (https://...)"
                              value={directImageUrl}
                              onChange={(e) => setDirectImageUrl(e.target.value)}
                              className="form-input"
                              style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem' }}
                            />
                            <button
                              type="button"
                              onClick={handleApplyWebImageUrl}
                              className="btn-gold"
                              style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              Apply
                            </button>
                          </div>
                        )}

                        {/* Mobile Folders Help Alert */}
                        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.72rem', color: '#1E40AF', textAlign: 'left', lineHeight: 1.4 }}>
                          <strong>📁 Mobile Folder Tip:</strong> Tapping <em>"Browse Files, Drive &amp; WhatsApp"</em> opens your phone file manager without forcing camera. You can navigate into Google Drive, WhatsApp Media folders, or Photo Albums to pick any exact image.
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Product Name / Title *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rajwada Bridal Kundan Kada Pair"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.88rem', padding: '0.65rem 0.85rem' }}
                    />
                  </div>

                  {/* Category & Subcategory Selection */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Showroom Category *
                      </label>
                      <select 
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.84rem', padding: '0.6rem 0.8rem' }}
                      >
                        <option value="bangles">Bangles Atelier</option>
                        <option value="necklaces">Necklaces (Cz, AD, Pearl)</option>
                        <option value="bracelets">Bracelets & Kadas</option>
                        <option value="earrings">Earrings & Jhumkas</option>
                        <option value="rings">Finger Rings</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Subcategory / Craft *
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Glass Bangle, Lac, Cz, AD"
                        value={newProductSubcategory}
                        onChange={(e) => setNewProductSubcategory(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.84rem', padding: '0.6rem 0.8rem' }}
                      />
                    </div>
                  </div>

                  {/* Pricing & Offers Matrix */}
                  <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', padding: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                        Pricing & Member Offer Setup
                      </span>
                      <button 
                        type="button" 
                        onClick={() => handleAutoPricing(newProductPrice)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--pk-gold-dark)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        Auto-calculate 5% Member Offer
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                          Selling Price (₹) *
                        </label>
                        <input 
                          type="number" 
                          required
                          value={newProductPrice}
                          onChange={(e) => handleAutoPricing(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.84rem', padding: '0.5rem 0.6rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                          Original MRP (₹)
                        </label>
                        <input 
                          type="number" 
                          value={newProductOriginalPrice}
                          onChange={(e) => setNewProductOriginalPrice(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.84rem', padding: '0.5rem 0.6rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pk-gold-dark)', marginBottom: '0.2rem' }}>
                          VIP Member Price (₹)
                        </label>
                        <input 
                          type="number" 
                          value={newProductMemberPrice}
                          onChange={(e) => setNewProductMemberPrice(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.84rem', padding: '0.5rem 0.6rem', borderColor: 'var(--pk-gold-dark)' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#1E4635', fontWeight: 600 }}>
                      Savings for Members: ₹{newProductPrice - newProductMemberPrice} off (Auto-applied for Gmail VIP members)
                    </div>
                  </div>

                  {/* Occasion, Stock & Tag */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        Occasion
                      </label>
                      <select 
                        value={newProductOccasion}
                        onChange={(e) => setNewProductOccasion(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                      >
                        <option value="Bridal">Bridal</option>
                        <option value="Festive">Festive</option>
                        <option value="Party">Party</option>
                        <option value="Everyday">Everyday</option>
                        <option value="Office">Office</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        Offer Badge / Tag
                      </label>
                      <input 
                        type="text" 
                        value={newProductTag}
                        onChange={(e) => setNewProductTag(e.target.value)}
                        placeholder="e.g. Bestseller, 20% Off"
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        Initial Stock Units
                      </label>
                      <input 
                        type="number" 
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Marketing Description & Artisan Details
                    </label>
                    <textarea 
                      rows="3"
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      placeholder="Describe the gemstone, finish, micro-gold micron plating, and styling tips..."
                      className="form-input"
                      style={{ fontSize: '0.82rem', padding: '0.6rem 0.8rem', resize: 'vertical' }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn-gold" 
                    style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    <Sparkles size={16} />
                    <span>Publish Directly to Live Showroom</span>
                  </button>

                </form>

              </div>

              {/* Realtime Live Preview Card (Shows exact visual appearance in showroom) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                    <Eye size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--pk-obsidian)' }}>
                      Live Showroom Card Simulation
                    </span>
                  </div>

                  {/* Simulated Card */}
                  <div style={{ maxWidth: '320px', margin: '0 auto', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#FFFFFF', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ position: 'relative', height: '240px', background: '#121110', overflow: 'hidden' }}>
                      {newProductImage ? (
                        <img src={newProductImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A89E92', gap: '0.5rem' }}>
                          <ImageIcon size={32} opacity={0.5} />
                          <span style={{ fontSize: '0.78rem' }}>Upload photo to preview</span>
                        </div>
                      )}

                      <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--pk-gold-gradient)', color: '#121110', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                        {newProductTag || 'NEW LAUNCH'}
                      </span>
                    </div>

                    <div style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {newProductCategory.toUpperCase()} • {newProductSubcategory}
                      </span>
                      <h4 style={{ fontSize: '0.98rem', color: 'var(--pk-obsidian)', margin: '0.3rem 0 0.6rem', lineHeight: 1.3 }}>
                        {newProductName || 'Untitled Royal Piece'}
                      </h4>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--pk-surface-alt)', paddingTop: '0.6rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                              ₹{Number(newProductPrice).toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--pk-text-muted)', textDecoration: 'line-through' }}>
                              ₹{Number(newProductOriginalPrice).toLocaleString()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
                            Member: ₹{Number(newProductMemberPrice).toLocaleString()} (5% Off)
                          </div>
                        </div>

                        <span style={{ background: '#121110', color: '#FAF8F5', fontSize: '0.72rem', padding: '0.35rem 0.75rem', borderRadius: '4px', fontWeight: 600 }}>
                          + Add to Bag
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Showroom Products Catalog & Persistence Manager */}
                <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                        All Listed Showroom Products ({allCatalogueProducts.length})
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>
                        Persisted in system memory & visible live in customer showroom
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem', background: '#F1F5F9', padding: '0.2rem', borderRadius: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setCatalogFilterTab('ALL')}
                        style={{
                          background: catalogFilterTab === 'ALL' ? '#121110' : 'transparent',
                          color: catalogFilterTab === 'ALL' ? '#FAF8F5' : 'var(--pk-text-secondary)',
                          border: 'none',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        All ({allCatalogueProducts.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogFilterTab('CUSTOM')}
                        style={{
                          background: catalogFilterTab === 'CUSTOM' ? 'var(--pk-gold-dark)' : 'transparent',
                          color: catalogFilterTab === 'CUSTOM' ? '#121110' : 'var(--pk-text-secondary)',
                          border: 'none',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Custom Added ({customAddedProducts.length})
                      </button>
                    </div>
                  </div>

                  {/* Search and Category Filter */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pk-text-muted)' }} />
                      <input 
                        type="text"
                        placeholder="Search by name, SKU or craft..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="form-input"
                        style={{ width: '100%', padding: '0.4rem 0.6rem 0.4rem 1.8rem', fontSize: '0.75rem' }}
                      />
                    </div>

                    <select
                      value={catalogCategoryFilter}
                      onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', width: 'auto' }}
                    >
                      <option value="all">All Categories</option>
                      <option value="bangles">Bangles</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="earrings">Earrings</option>
                      <option value="rings">Rings</option>
                    </select>
                  </div>

                  {/* Products Scroll List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {allCatalogueProducts
                      .filter(p => {
                        if (catalogFilterTab === 'CUSTOM' && !p.isCustomAdded && defaultProductIds.has(p.id)) return false;
                        if (catalogCategoryFilter !== 'all' && p.category !== catalogCategoryFilter) return false;
                        if (catalogSearch.trim()) {
                          const q = catalogSearch.toLowerCase();
                          return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.subcategory?.toLowerCase().includes(q);
                        }
                        return true;
                      })
                      .map(prod => (
                        <div key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: prod.isCustomAdded ? 'rgba(212, 175, 55, 0.08)' : 'var(--pk-surface-alt)', borderRadius: '4px', border: prod.isCustomAdded ? '1px solid var(--pk-gold-dark)' : '1px solid var(--pk-border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#121110' }} />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>{prod.name}</span>
                                {prod.isCustomAdded && (
                                  <span style={{ background: 'var(--pk-gold-dark)', color: '#121110', fontSize: '0.62rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '2px' }}>
                                    CUSTOM
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--pk-text-muted)', marginTop: '0.15rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--pk-gold-dark)' }}>₹{prod.price}</span> (MRP: ₹{prod.originalPrice || Math.round(prod.price * 1.35)}) • Stock: <strong>{inventory[prod.id] ?? prod.inventoryCount ?? 15}</strong> units • {prod.category}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => restockItem(prod.id, 10)}
                              className="btn-outline"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                              title="Add 10 units of stock"
                            >
                              +10 Stock
                            </button>
                            {prod.isCustomAdded && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete "${prod.name}" from showroom?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#9F1239', cursor: 'pointer', padding: '0.25rem' }}
                                title="Delete custom product"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                </div>

                {/* Quick Payment QR Status Box in Studio */}
                <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-gold-dark)', borderRadius: 'var(--radius-md)', padding: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <QrCode size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--pk-obsidian)' }}>
                        Checkout Payment QR Setup
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-secondary)', marginTop: '0.2rem' }}>
                      Active: {storePaymentQr ? 'Custom Store QR Uploaded' : `Default Dynamic UPI (${storeUpiId || '9393056641@upi'})`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('PAYMENT_QR')}
                    className="btn-gold"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}
                  >
                    Manage Store QR Code
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: STORE PAYMENT QR SETUP & WHATSAPP DISPATCH HUB                       */}
        {/* ========================================================================= */}
        {activeTab === 'PAYMENT_QR' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '1px solid var(--pk-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <div style={{ background: 'var(--pk-gold-gradient)', color: '#121110', padding: '0.35rem', borderRadius: '6px' }}>
                    <QrCode size={18} />
                  </div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                    Exclusive Checkout Gateway
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Store Payment QR Code &amp; Owner WhatsApp Hub
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  All customer payments in checkout are routed exclusively through this UPI QR code. When paid, an automated WhatsApp alert is sent to Owner <strong>+91 {storeOwnerPhone || "9393056641"}</strong>.
                </p>
              </div>

              <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', color: '#1B5E20', fontWeight: 700 }}>
                WhatsApp Receiver: +91 {storeOwnerPhone || "9393056641"}
              </div>
            </div>

            {/* Hidden QR File Input (Supports Files, Drive, WhatsApp, Gallery) */}
            <input 
              type="file" 
              accept="image/*,.png,.jpg,.jpeg,.webp" 
              ref={qrFileInputRef}
              style={{ display: 'none' }}
              onChange={handleQrFileUpload}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
              
              {/* Card 1: Active Store QR Display & Uploader */}
              <div style={{ background: '#FAF8F5', border: '2px solid var(--pk-gold-dark)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  Currently Active Payment QR
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)', marginBottom: '1.25rem' }}>
                  {storePaymentQr ? '✓ Custom Store QR (Merchant Uploaded)' : '✓ Default Dynamic UPI QR with Live Total'}
                </div>

                <div style={{ position: 'relative', display: 'inline-block', padding: '10px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--pk-border)', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                  <img 
                    src={storePaymentQr || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(`upi://pay?pa=${storeUpiId || '9393056641@upi'}&pn=Premium%20Khaja&cu=INR&tn=Order%20Payment`)}`} 
                    alt="Active Store Payment QR" 
                    style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'block' }}
                  />
                  <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                    UPI ID: {storeUpiId || "9393056641@upi"}
                  </div>
                </div>

                {/* Upload & Reset Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => qrFileInputRef.current?.click()}
                    className="btn-gold"
                    style={{ padding: '0.65rem 1.1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Upload size={14} />
                    <span>Upload Store Payment QR Image</span>
                  </button>

                  {storePaymentQr && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Reset back to default dynamic UPI QR code?")) {
                          resetStorePaymentQr();
                        }
                      }}
                      className="btn-outline"
                      style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem' }}
                    >
                      Reset to Default QR
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', marginTop: '0.85rem' }}>
                  Upload your official GPay, PhonePe, Paytm, or BHIM merchant QR code. It instantly appears on all customer checkout screens.
                </div>
              </div>

              {/* Card 2: WhatsApp Automation & Online Delivery Booking Dispatch */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ background: '#FAF8F5', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <MessageCircle size={18} style={{ color: '#25D366' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--pk-obsidian)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Automated WhatsApp Dispatch Template
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--pk-text-secondary)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                    When a customer places an order, the system automatically composes and launches WhatsApp with the following structured dispatch slip to <strong>+91 {storeOwnerPhone || "9393056641"}</strong>:
                  </p>

                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.85rem', fontSize: '0.74rem', fontFamily: 'monospace', color: '#1E293B', whiteSpace: 'pre-line', lineHeight: 1.5, maxHeight: '200px', overflowY: 'auto' }}>
{`🛍️ *NEW ORDER & PAYMENT RECEIVED - PREMIUM KHAJA* 🛍️
----------------------------------------
💰 *TOTAL PAYMENT MADE:* ₹3,499
💳 *Payment Method:* UPI QR Code (UTR/Ref: 428190382910)
📦 *Order ID:* PK-ORD-9041

👤 *CUSTOMER DETAILS:*
• *Name:* Ayesha Sheikh
• *Phone:* 9393056641
• *Delivery Address:* Bandra West, Mumbai - 400050

🛒 *ITEMS ORDERED:*
• Rajwada Bridal Chura Master Set (Qty: 1, Size: 2.6) - ₹3499

📍 *DELIVERY DISPATCH ACTION:*
Customer has made payment via QR code. Please confirm receipt in your UPI App and message customer to request exact location / pin to book online delivery via Dunzo / Porter / Delhivery!`}
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <a
                      href={`https://wa.me/91${storeOwnerPhone || "9393056641"}?text=${encodeURIComponent("Hello Premium Khaja! Test order confirmation from Admin Command Center.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#25D366', color: '#fff', textDecoration: 'none', border: 'none' }}
                    >
                      <MessageCircle size={14} />
                      <span>Test WhatsApp Bridge (+91 {storeOwnerPhone || "9393056641"})</span>
                    </a>
                  </div>
                </div>

                {/* Logistics & Delivery Guidance Card */}
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    Online Delivery Booking Workflow
                  </div>
                  <ol style={{ fontSize: '0.75rem', color: '#1E3A8A', margin: 0, paddingLeft: '1.2rem', lineHeight: 1.5 }}>
                    <li>Check your UPI App (GPay / PhonePe / Paytm) to verify customer payment receipt against the UTR ref number.</li>
                    <li>Reply on WhatsApp to the customer with their order confirmation and ask for their exact Google Maps pin / live location.</li>
                    <li>Open <strong>Dunzo / Porter / Delhivery / Speed Post</strong> to book delivery dispatch directly to their doorstep!</li>
                  </ol>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INVENTORY & AI STOCK HUB                                           */}
        {/* ========================================================================= */}
        {activeTab === 'INVENTORY' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Header & AI Prediction Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Realtime Inventory & AI Demand Restock Hub
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)' }}>
                  Total {allCatalogueProducts.length} items catalogued across bangles, necklaces, bracelets and earrings.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--pk-surface-alt)', padding: '0.25rem', borderRadius: '4px' }}>
                  {['ALL', 'LOW', 'OUT'].map(flt => (
                    <button
                      key={flt}
                      onClick={() => setInventoryFilter(flt)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        background: inventoryFilter === flt ? 'var(--pk-obsidian)' : 'transparent',
                        color: inventoryFilter === flt ? '#FAF8F5' : 'var(--pk-text-primary)'
                      }}
                    >
                      {flt === 'ALL' ? 'All Stock' : flt === 'LOW' ? `Low Stock (${lowStockCount})` : 'Out of Stock'}
                    </button>
                  ))}
                </div>

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

            {/* AI Demand Prediction Box */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={18} style={{ color: '#D97706' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400E' }}>
                    AI Demand Alert: {lowStockCount} items at risk of running out before weekend rush
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#78350F' }}>
                    Automated recommendation: Replenish bridal bangles and filigree collections to maintain unbroken showroom fulfillment.
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  allCatalogueProducts.filter(p => (inventory[p.id] ?? 10) <= 8).forEach(p => restockItem(p.id, 15));
                  alert(`Restocked 15 units each across all ${lowStockCount} low-stock products!`);
                }}
                className="btn-gold" 
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}
              >
                +15 Batch Restock All Low Items
              </button>
            </div>

            {/* Inventory Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--pk-surface-alt)', borderBottom: '1px solid var(--pk-border)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                    <th style={{ padding: '0.75rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price / Member</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock Units</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Restock Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventoryList.map(product => {
                    const stock = inventory[product.id] ?? 10;
                    const isLow = stock <= 8 && stock > 0;
                    const isOut = stock === 0;

                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--pk-surface-alt)' }}>
                        <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img src={product.image} alt={product.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--pk-obsidian)', display: 'block', maxWidth: '240px' }}>
                              {product.name}
                            </span>
                            {product.isCustomAdded && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>Custom Added Piece</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: 'var(--pk-text-muted)' }}>
                          {product.sku}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: 'var(--pk-surface-alt)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', textTransform: 'capitalize' }}>
                            {product.category} • {product.subcategory}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <strong>₹{product.price.toLocaleString()}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--pk-gold-dark)', display: 'block' }}>
                            VIP: ₹{product.memberPrice.toLocaleString()}
                          </span>
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
                          <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                            <button
                              onClick={() => restockItem(product.id, 10)}
                              className="btn-outline"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            >
                              +10 Units
                            </button>
                            <button
                              onClick={() => restockItem(product.id, 25)}
                              className="btn-gold"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            >
                              +25
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CRM & AI CUSTOMER INTELLIGENCE                                     */}
        {/* ========================================================================= */}
        {activeTab === 'CRM' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                    Customer Relationship Management (CRM)
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)' }}>
                    Track RFM segments, Google login profiles, and automated WhatsApp re-engagement.
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
                      <th style={{ padding: '0.75rem 1rem' }}>Tier & Pass</th>
                      <th style={{ padding: '0.75rem 1rem' }}>RFM Segment</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Orders</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Lifetime Spend</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Auth Source</th>
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
                          <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>{cust.phone} • {cust.email}</div>
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
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{cust.orderCount}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>₹{cust.lifetimeSpend.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--pk-text-muted)' }}>
                          {cust.acquisitionSource || 'DIRECT'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedCustomer(cust); }}
                            className="btn-outline"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Selected Customer AI Intelligence Drawer */}
            {selectedCustomer && (
              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--pk-obsidian)' }}>
                    AI Customer Profile
                  </h4>
                  <button onClick={() => setSelectedCustomer(null)} className="btn-icon">
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                  <div><strong>Customer:</strong> {selectedCustomer.name}</div>
                  <div><strong>Contact:</strong> {selectedCustomer.phone}</div>
                  <div><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</div>
                  <div><strong>Tier:</strong> <span style={{ color: 'var(--pk-gold-dark)', fontWeight: 700 }}>{selectedCustomer.tier}</span></div>
                  <div><strong>Member ID:</strong> {selectedCustomer.memberId || 'Guest'}</div>
                  <div><strong>Lifetime Spend:</strong> ₹{selectedCustomer.lifetimeSpend.toLocaleString()}</div>
                  <div><strong>Favorite Category:</strong> {selectedCustomer.favoriteCategory}</div>
                </div>

                {/* AI Retention Recommendations */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#92400E', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                    <Sparkles size={14} />
                    <span>AI Engagement Recommendation</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#78350F', margin: 0 }}>
                    {selectedCustomer.orderCount > 1 
                      ? "High loyalty customer! Offer early VIP access to upcoming festive lacquer bangles collection with free velvet jewelry box."
                      : "Send customized WhatsApp greeting welcoming them to PK Club with ₹200 off code 'WELCOME200'."}
                  </p>
                </div>

                <a 
                  href={`https://wa.me/${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)}!%20Greeting%20from%20Premium%20Khaja.%20As%20a%20valued%20member,%20we%20have%20an%20exclusive%20privilege%20curated%20for%20you.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold" 
                  style={{ textDecoration: 'none', textAlign: 'center', padding: '0.65rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <MessageSquare size={14} />
                  <span>Send Personalized WhatsApp</span>
                </a>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EXECUTIVE ANALYTICS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Gross Store GMV
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-obsidian)', margin: '0.3rem 0' }}>
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1E4635', fontWeight: 600 }}>
                  ↑ +18.4% this month
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Catalogue Products
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-obsidian)', margin: '0.3rem 0' }}>
                  {allCatalogueProducts.length} Pieces
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
                  {customAddedProducts.length} custom added
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  AOV (Avg Order Value)
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pk-gold-dark)', margin: '0.3rem 0' }}>
                  ₹{aov.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pk-text-secondary)' }}>
                  Driven by Bangles Sets
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Low Stock Warnings
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: lowStockCount > 0 ? '#7D1A25' : '#1E4635', margin: '0.3rem 0' }}>
                  {lowStockCount} Items
                </div>
                <div style={{ fontSize: '0.75rem', color: '#7D1A25', fontWeight: 600 }}>
                  Action needed in Inventory
                </div>
              </div>
            </div>

            {/* Orders Feed */}
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--pk-obsidian)', marginBottom: '1rem' }}>
                Recent Store Orders ({orders.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orders.map((ord, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--pk-surface-alt)', borderRadius: '4px', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                        {ord.orderId} • {ord.customerName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
                        {ord.orderDate} • {ord.paymentMethod}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--pk-obsidian)' }}>
                        ₹{ord.totalAmount.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.7rem', background: '#E6F4EA', color: '#137333', padding: '0.15rem 0.45rem', borderRadius: '3px', fontWeight: 700 }}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MISS WORLD 2025 CELEBRITY HUB                                      */}
        {/* ========================================================================= */}
        {activeTab === 'CATEGORIES_SHOWCASE' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--pk-obsidian)', marginBottom: '0.3rem' }}>
              Miss World 2025 India Pageant & Celebrity PR Hub
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', marginBottom: '1.5rem' }}>
              Manage pageant runway photos, red carpet accolades, and celebrity endorsement moments.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {celebrityShowcase.map(item => (
                <div key={item.id} style={{ border: '1px solid var(--pk-border)', borderRadius: '4px', overflow: 'hidden', background: 'var(--pk-surface-alt)' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.85rem' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--pk-ruby)', fontWeight: 700 }}>{item.tag}</span>
                    <h5 style={{ margin: '0.2rem 0', fontSize: '0.92rem' }}>{item.title}</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--pk-text-secondary)', fontStyle: 'italic' }}>"{item.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WHATSAPP LEADS QUEUE                                               */}
        {/* ========================================================================= */}
        {activeTab === 'LEADS' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--pk-obsidian)', marginBottom: '0.3rem' }}>
              WhatsApp Enquiries & Concierge Pipeline
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', marginBottom: '1.5rem' }}>
              Direct leads captured from "Ask on WhatsApp" and size queries on product pages.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leadsList.map(lead => (
                <div key={lead.id} style={{ border: '1px solid var(--pk-border)', padding: '1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div>
                    <span style={{ background: '#FEF7E0', color: '#B06000', padding: '0.15rem 0.4rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {lead.status}
                    </span>
                    <h5 style={{ margin: '0.3rem 0 0.1rem', fontSize: '0.95rem' }}>
                      {lead.customerName} ({lead.phone})
                    </h5>
                    <div style={{ fontSize: '0.78rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>Item: {lead.productName}</div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--pk-text-secondary)', margin: '0.2rem 0 0' }}>"{lead.message}"</p>
                  </div>

                  <a 
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.customerName)}!%20Greeting%20from%20Premium%20Khaja.%20Replying%20to%20your%20query%20for%20${encodeURIComponent(lead.productName)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{ textDecoration: 'none', padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    Reply on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

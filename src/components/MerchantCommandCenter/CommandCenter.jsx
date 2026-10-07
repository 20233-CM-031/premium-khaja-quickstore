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
  Link as LinkIcon,
  X,
  MessageCircle,
  Play,
  Video,
  Edit3,
  Phone,
  FileText
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
    updateCelebrityShowcaseItem,
    deleteCelebrityShowcaseItem,
    products,
    addNewProduct,
    updateProduct,
    deleteProduct,
    importFromSouqOneStudio,
    shortsList,
    addNewShort,
    updateShort,
    deleteShort,
    setShortsList,
    heroConfig,
    updateHeroConfig,
    storeOwnerName,
    storeOwnerPhone,
    storeOwnerWhatsApp,
    storeUpiId,
    storePaymentQr,
    uploadStorePaymentQr,
    resetStorePaymentQr,
    updateMerchantSettings,
    updateOrderStatus
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

  // Miss World & Achievements Hub State (Full Axis Editor)
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('bangles');
  const [newShowcaseTitle, setNewShowcaseTitle] = useState('');
  const [newShowcaseSubtitle, setNewShowcaseSubtitle] = useState('');
  const [newShowcaseCelebrity, setNewShowcaseCelebrity] = useState('');
  const [newShowcaseEvent, setNewShowcaseEvent] = useState('Miss World 2025 India');
  const [newShowcaseQuote, setNewShowcaseQuote] = useState('');
  const [newShowcaseImage, setNewShowcaseImage] = useState('');
  const [newShowcaseTag, setNewShowcaseTag] = useState('Miss World 2025 India');
  const [newShowcaseBadge, setNewShowcaseBadge] = useState('Official Pageant Partner');
  const [showcaseSuccess, setShowcaseSuccess] = useState('');
  const showcaseFileInputRef = useRef(null);

  // Miss World Achievement Editing State
  const [editingShowcase, setEditingShowcase] = useState(null);
  const [showcaseEditForm, setShowcaseEditForm] = useState({
    title: '',
    subtitle: '',
    celebrity: '',
    event: 'Miss World 2025 India',
    quote: '',
    image: '',
    tag: 'Miss World 2025 India',
    badge: 'Official Pageant Partner'
  });
  const showcaseEditFileInputRef = useRef(null);

  // Royal Shorts Video Reels Editing State & In-Admin Video Preview
  const [editingShort, setEditingShort] = useState(null);
  const [shortEditForm, setShortEditForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    posterImage: '',
    taggedProductId: ''
  });
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState(null);
  const editShortVideoRef = useRef(null);

  // Store Owner & UPI Gateway Settings State (Jaffar Mohd - premiumkhaja@okaxis)
  const [merchantSettings, setMerchantSettings] = useState({
    ownerName: storeOwnerName || 'Jaffar Mohd',
    upiId: storeUpiId || 'premiumkhaja@okaxis',
    phone: storeOwnerPhone || '9393056641'
  });
  const [merchantSaveSuccess, setMerchantSaveSuccess] = useState('');
  const [qrSimAmount, setQrSimAmount] = useState(2499);

  // Orders Management Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrderForGuidance, setSelectedOrderForGuidance] = useState(null);

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 128450;
  const totalOrders = orders.length + 42;
  const aov = Math.round(totalRevenue / totalOrders);
  const lowStockCount = allCatalogueProducts.filter(p => (inventory[p.id] ?? 10) <= 8).length;

  // Custom added products filter
  const defaultProductIds = new Set(ALL_PRODUCTS.map(p => p.id));
  const customAddedProducts = allCatalogueProducts.filter(p => !defaultProductIds.has(p.id) || p.isCustomAdded);

  // ================= FULL PRODUCT EDITING STATE =================
  const editFileInputRef = useRef(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    sku: '',
    category: 'bangles',
    subcategory: '',
    price: 2499,
    originalPrice: 3499,
    memberPrice: 2249,
    inventoryCount: 15,
    sizes: ['2.4', '2.6', '2.8'],
    finish: '22K Antique Micro Gold Plated',
    material: 'Brass with High-Grade Polki Kundan',
    image: '',
    description: '',
    careInstructions: ''
  });

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name,
      sku: prod.sku || '',
      category: prod.category || 'bangles',
      subcategory: prod.subcategory || '',
      price: prod.price || 1999,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.35),
      memberPrice: prod.memberPrice || Math.round(prod.price * 0.95),
      inventoryCount: inventory[prod.id] ?? prod.inventoryCount ?? 15,
      sizes: prod.sizes || ['2.4', '2.6', '2.8'],
      finish: prod.finish || '22K Antique Micro Gold Plated',
      material: prod.material || 'Brass with High-Grade Polki Kundan',
      image: prod.image || '',
      description: prod.description || '',
      careInstructions: prod.careInstructions || ''
    });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editForm);
    setEditingProduct(null);
    alert(`"${editForm.name}" updated successfully in live inventory!`);
  };

  // ================= SOUQONE STUDIO BRIDGE STATE =================
  const [studioPayloadText, setStudioPayloadText] = useState('');
  const [studioImportStatus, setStudioImportStatus] = useState('');
  const [singleStudioLook, setSingleStudioLook] = useState({
    name: '',
    category: 'bangles',
    subcategory: 'Studio Curation',
    price: 2999,
    image: '',
    inventoryCount: 15
  });

  const handleStudioJsonImport = () => {
    try {
      if (!studioPayloadText.trim()) {
        alert("Please paste SouqOne Studio JSON payload.");
        return;
      }
      const parsed = JSON.parse(studioPayloadText);
      const res = importFromSouqOneStudio(parsed);
      if (res.success) {
        setStudioImportStatus(`✅ Successfully imported ${res.count} showroom look(s) from SouqOne Studio into live inventory!`);
        setStudioPayloadText('');
      } else {
        alert(`Import error: ${res.error}`);
      }
    } catch (err) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  const handleSingleStudioLookAdd = (e) => {
    e.preventDefault();
    if (!singleStudioLook.name.trim()) return alert("Please enter look name");
    importFromSouqOneStudio([singleStudioLook]);
    setStudioImportStatus(`✅ Showroom look "${singleStudioLook.name}" transformed into live inventory!`);
    setSingleStudioLook({
      name: '',
      category: 'bangles',
      subcategory: 'Studio Curation',
      price: 2999,
      image: '',
      inventoryCount: 15
    });
  };

  // ================= HERO & MARKETING ENGINE STATE =================
  const [heroForm, setHeroForm] = useState({
    announcementBadge: heroConfig?.announcementBadge || 'Official Partner & Gifted Miss World Contestants ✦ Worn On World Stage',
    titleLine1: heroConfig?.titleLine1 || 'Royal Splendour.',
    titleLine2: heroConfig?.titleLine2 || 'Couture Heritage Craft.',
    description: heroConfig?.description || 'Discover Premium Khaja\'s high artificial jewellery atelier.',
    spotlightProductId: heroConfig?.spotlightProductId || 'bangle-01'
  });
  const [heroSaveSuccess, setHeroSaveSuccess] = useState('');

  const handleHeroConfigSave = (e) => {
    e.preventDefault();
    updateHeroConfig(heroForm);
    setHeroSaveSuccess('✨ Hero banner & marketing controls updated on live storefront!');
    setTimeout(() => setHeroSaveSuccess(''), 4000);
  };

  // ================= ROYAL SHORTS MANAGER STATE =================
  const shortVideoInputRef = useRef(null);
  const [newShortTitle, setNewShortTitle] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newShortUrl, setNewShortUrl] = useState('');
  const [newShortPoster, setNewShortPoster] = useState('');
  const [newShortProduct, setNewShortProduct] = useState(allCatalogueProducts[0]?.id || 'bangle-01');
  const [shortsSuccessMsg, setShortsSuccessMsg] = useState('');

  const handleCreateShort = (e) => {
    e.preventDefault();
    if (!newShortTitle.trim() || (!newShortUrl.trim() && !newShortPoster.trim())) {
      alert("Please provide title and video URL or upload a file.");
      return;
    }
    addNewShort({
      title: newShortTitle,
      description: newShortDesc,
      videoUrl: newShortUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-wearing-golden-jewelry-41315-large.mp4',
      posterImage: newShortPoster || '/images/bangles/1789662811af3b.png',
      taggedProductId: newShortProduct
    });
    setShortsSuccessMsg('🎬 Royal Short reel published to storefront!');
    setNewShortTitle('');
    setNewShortDesc('');
    setNewShortUrl('');
    setNewShortPoster('');
    setTimeout(() => setShortsSuccessMsg(''), 4000);
  };

  // ================= MISS WORLD & CELEBRITY ADVERTISING HANDLERS =================
  const handleAddShowcaseItem = (e) => {
    e.preventDefault();
    if (!newShowcaseTitle.trim() || !newShowcaseCelebrity.trim()) {
      alert("Please provide achievement title and celebrity name.");
      return;
    }
    addCelebrityShowcaseItem({
      title: newShowcaseTitle,
      subtitle: newShowcaseSubtitle || 'Miss World 2025 Pageant Curation',
      celebrity: newShowcaseCelebrity,
      event: newShowcaseEvent || 'Miss World 2025 India',
      quote: newShowcaseQuote || 'Honoured to adorn the royal legacy of Premium Khaja on the world stage.',
      image: newShowcaseImage || '/images/bangles/1789662811af3b.png',
      tag: newShowcaseTag || 'Miss World 2025 India',
      badge: newShowcaseBadge || 'Official Pageant Partner'
    });
    setShowcaseSuccess('👑 Miss World achievement / advertisement published to live storefront!');
    setNewShowcaseTitle('');
    setNewShowcaseSubtitle('');
    setNewShowcaseCelebrity('');
    setNewShowcaseQuote('');
    setNewShowcaseImage('');
    setTimeout(() => setShowcaseSuccess(''), 4000);
  };

  const handleShowcaseImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewShowcaseImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const openEditShowcaseModal = (item) => {
    setEditingShowcase(item);
    setShowcaseEditForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      celebrity: item.celebrity || '',
      event: item.event || 'Miss World 2025 India',
      quote: item.quote || '',
      image: item.image || '',
      tag: item.tag || 'Miss World 2025 India',
      badge: item.badge || 'Official Pageant Partner'
    });
  };

  const handleEditShowcaseSave = (e) => {
    e.preventDefault();
    if (!editingShowcase) return;
    updateCelebrityShowcaseItem(editingShowcase.id, showcaseEditForm);
    setEditingShowcase(null);
    alert(`Achievement "${showcaseEditForm.title}" updated successfully!`);
  };

  // ================= ROYAL SHORTS EDITING HANDLERS =================
  const openEditShortModal = (short) => {
    setEditingShort(short);
    setShortEditForm({
      title: short.title || '',
      description: short.description || '',
      videoUrl: short.videoUrl || '',
      posterImage: short.posterImage || '',
      taggedProductId: short.taggedProductId || (allCatalogueProducts[0]?.id || '')
    });
  };

  const handleEditShortSave = (e) => {
    e.preventDefault();
    if (!editingShort) return;
    updateShort(editingShort.id, shortEditForm);
    setEditingShort(null);
    alert(`Royal Short "${shortEditForm.title}" updated successfully!`);
  };

  // ================= STORE OWNER UPI GATEWAY SETTINGS HANDLER =================
  const handleSaveMerchantSettings = (e) => {
    e.preventDefault();
    updateMerchantSettings(merchantSettings);
    setMerchantSaveSuccess('✓ Jaffar Mohd merchant UPI settings updated successfully across store checkout!');
    setTimeout(() => setMerchantSaveSuccess(''), 4000);
  };

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
            { id: 'ORDERS', label: `Orders & Dispatch (${orders.length})`, icon: Package, highlight: true },
            { id: 'CATEGORIES_SHOWCASE', label: `Miss World & PR Ads (${celebrityShowcase.length})`, icon: Crown, highlight: true },
            { id: 'SHORTS_MANAGER', label: `Royal Shorts Reels (${shortsList.length})`, icon: Sparkles, highlight: true },
            { id: 'PAYMENT_QR', label: `UPI Gateway (${storeOwnerName || 'Jaffar Mohd'})`, icon: QrCode, highlight: false },
            { id: 'PRODUCT_STUDIO', label: 'Add Products & AI Studio', icon: Plus, highlight: false },
            { id: 'INVENTORY', label: `Inventory Hub (${lowStockCount} Low Alert)`, icon: Package, highlight: false },
            { id: 'HERO_MARKETING', label: 'Hero & Marketing Engine', icon: Megaphone, highlight: false },
            { id: 'SOUQONE_STUDIO', label: 'SouqOne Studio Bridge', icon: Layers, highlight: false },
            { id: 'CRM', label: `CRM & Customer AI (${customersList.length})`, icon: Users },
            { id: 'OVERVIEW', label: 'Executive Analytics', icon: TrendingUp },
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
        {/* TAB 0: CUSTOMER ORDERS, GUIDANCE & DISPATCH VERIFICATION                   */}
        {/* ========================================================================= */}
        {activeTab === 'ORDERS' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '1px solid var(--pk-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <div style={{ background: 'var(--pk-gold-gradient)', color: '#121110', padding: '0.35rem', borderRadius: '6px' }}>
                    <Package size={18} />
                  </div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                    Order Fulfillment &amp; Dispatch Engine
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Customer Orders, Guidance &amp; Payment Verification
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  Inspect incoming customer orders, review customer customization guidance and size preferences, verify UPI receipts, and dispatch deliveries.
                </p>
              </div>

              {/* Status Counters */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid #FDE68A' }}>
                  Pending Verification: {orders.filter(o => o.status?.includes('VERIFY')).length}
                </span>
                <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid #BAE6FD' }}>
                  Total Orders: {orders.length}
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                {['ALL', 'PAID - VERIFY & DISPATCH', 'PAYMENT CONFIRMED', 'PACKING', 'DISPATCHED', 'DELIVERED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: orderStatusFilter === st ? 'var(--pk-obsidian)' : 'var(--pk-surface-alt)',
                      color: orderStatusFilter === st ? '#FAF8F5' : 'var(--pk-text-secondary)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {st === 'ALL' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                <input 
                  type="text" 
                  placeholder="Search order ID, customer, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.8rem 0.45rem 2rem', fontSize: '0.8rem', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                />
              </div>
            </div>

            {/* Orders Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders
                .filter(o => {
                  if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
                  if (orderSearch.trim()) {
                    const q = orderSearch.toLowerCase();
                    return (
                      o.orderId?.toLowerCase().includes(q) ||
                      o.customerName?.toLowerCase().includes(q) ||
                      o.customerPhone?.includes(q) ||
                      o.shippingAddress?.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((ord, idx) => {
                  return (
                    <div 
                      key={ord.orderId || idx}
                      style={{ 
                        border: '1.5px solid var(--pk-border)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '1.25rem', 
                        background: '#FAF8F5',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Top Header Line */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--pk-obsidian)', fontFamily: 'monospace' }}>
                              #{ord.orderId}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
                              • {ord.orderDate}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--pk-obsidian)', marginTop: '0.2rem' }}>
                            {ord.customerName} • <span style={{ color: 'var(--pk-text-muted)' }}>{ord.customerPhone}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--pk-gold-dark)' }}>
                            ₹{ord.totalAmount?.toLocaleString()}
                          </div>
                          
                          {/* Status Dropdown */}
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              borderRadius: '4px',
                              border: '1px solid var(--pk-gold-dark)',
                              background: ord.status?.includes('VERIFY') ? '#FEF3C7' : ord.status === 'DELIVERED' ? '#E6F4EA' : '#FFFFFF',
                              color: ord.status?.includes('VERIFY') ? '#92400E' : ord.status === 'DELIVERED' ? '#137333' : 'var(--pk-obsidian)',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="PAID - VERIFY & DISPATCH">PAID - VERIFY & DISPATCH</option>
                            <option value="PAYMENT CONFIRMED">PAYMENT CONFIRMED</option>
                            <option value="PACKING">PACKING & QUALITY CHECK</option>
                            <option value="DISPATCHED">DISPATCHED (ONLINE COURIER)</option>
                            <option value="DELIVERED">DELIVERED TO CUSTOMER</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Order Guidance & Preferences Box (HIGHLIGHTED) */}
                      {(ord.orderGuidance || ord.sizePreference || ord.guidanceTags?.length > 0) && (
                        <div style={{ 
                          background: '#FFFDF9', 
                          border: '1.5px dashed var(--pk-gold-dark)', 
                          borderRadius: '6px', 
                          padding: '0.85rem 1rem', 
                          marginBottom: '0.85rem' 
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                            <Sparkles size={14} style={{ color: 'var(--pk-gold-dark)' }} />
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--pk-gold-dark)', letterSpacing: '0.06em' }}>
                              Customer Customization &amp; Order Guidance:
                            </span>
                          </div>

                          {ord.sizePreference && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--pk-obsidian)', marginBottom: '0.2rem' }}>
                              <strong>Size Requested:</strong> {ord.sizePreference}
                            </div>
                          )}

                          {ord.orderGuidance && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--pk-text-secondary)', fontStyle: 'italic', marginBottom: '0.35rem' }}>
                              "{ord.orderGuidance}"
                            </div>
                          )}

                          {ord.guidanceTags?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                              {ord.guidanceTags.map(tag => (
                                <span key={tag} style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#8C6D1F', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items & Payment Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                        
                        {/* Ordered Pieces */}
                        <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--pk-border)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Ordered Pieces ({ord.items?.length || 0}):
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {ord.items?.map((item, iIdx) => (
                              <div key={iIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {item.image && <img src={item.image} alt={item.name} style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '3px' }} />}
                                  <span><strong>{item.quantity}x</strong> {item.name} <span style={{ color: '#888' }}>({item.size})</span></span>
                                </div>
                                <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payment & Delivery Address Details */}
                        <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--pk-border)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div>
                            <span style={{ color: 'var(--pk-text-muted)' }}>Payment Mode:</span>{' '}
                            <strong>{ord.paymentMethod || 'UPI QR'}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--pk-text-muted)' }}>UTR / Reference:</span>{' '}
                            <code style={{ background: '#F1F5F9', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                              {ord.utrNumber || 'Paid via QR'}
                            </code>
                          </div>
                          <div>
                            <span style={{ color: 'var(--pk-text-muted)' }}>Shipping Destination:</span>{' '}
                            <span>{ord.shippingAddress}</span>
                          </div>
                        </div>

                      </div>

                      {/* Action Bar */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', flexWrap: 'wrap', borderTop: '1px solid var(--pk-border)', paddingTop: '0.75rem' }}>
                        <a
                          href={`https://wa.me/91${ord.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${ord.customerName}! This is Jaffar Mohd from Premium Khaja Atelier. We have received your order #${ord.orderId} and are preparing your pieces according to your size and preferences. Please share your exact Google Maps location pin so we can schedule direct courier delivery!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <MessageCircle size={14} />
                          <span>Chat on WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${ord.customerPhone?.replace(/\D/g, '')}`}
                          className="btn-outline"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Phone size={14} />
                          <span>Call Customer</span>
                        </a>
                      </div>

                    </div>
                  );
                })}
            </div>

          </div>
        )}

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
                              onClick={() => openEditModal(prod)}
                              className="btn-outline"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem', borderColor: 'var(--pk-gold-dark)', color: 'var(--pk-gold-dark)', fontWeight: 700 }}
                              title="Edit name, image, price, quantity, size & color"
                            >
                              Edit
                            </button>
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
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="btn-outline"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', borderColor: 'var(--pk-gold-dark)', color: 'var(--pk-gold-dark)', fontWeight: 700 }}
                              title="Edit name, image, price, quantity, size & color"
                            >
                              Edit
                            </button>
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
        {/* TAB: SOUQONE STUDIO BRIDGE (Transform Showroom Looks into Live Inventory)  */}
        {/* ========================================================================= */}
        {activeTab === 'SOUQONE_STUDIO' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ borderBottom: '1px solid var(--pk-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <div style={{ background: 'var(--pk-gold-gradient)', color: '#121110', padding: '0.35rem', borderRadius: '6px' }}>
                    <Layers size={18} />
                  </div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                    External System Bridge
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  SouqOne Studio Bridge — Showroom Lookbook to Live Inventory
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  Directly ingest ready-made showroom look images, photoshoot sets, and catalogue items from SouqOne Studio into live inventory.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="live-pulse"></span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pk-gold-dark)' }}>
                  Studio Pipeline Active
                </span>
              </div>
            </div>

            {studioImportStatus && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                {studioImportStatus}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
              
              {/* Method A: Paste SouqOne Studio JSON Payload */}
              <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Batch JSON Import from SouqOne Studio</span>
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)', marginBottom: '0.85rem' }}>
                  Paste a JSON array of ready-made showroom items exported from SouqOne Studio.
                </p>

                <textarea
                  rows="8"
                  value={studioPayloadText}
                  onChange={(e) => setStudioPayloadText(e.target.value)}
                  placeholder={`[
  {
    "name": "SouqOne Royal Rajwada Choker",
    "price": 3499,
    "category": "necklaces",
    "subcategory": "AD",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    "inventoryCount": 10
  }
]`}
                  className="form-textarea"
                  style={{ fontFamily: 'monospace', fontSize: '0.75rem', marginBottom: '0.85rem' }}
                />

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleStudioJsonImport}
                    className="btn-gold"
                    style={{ flex: 1, padding: '0.65rem', fontSize: '0.82rem' }}
                  >
                    <Layers size={14} />
                    <span>Sync Batch into Live Inventory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudioPayloadText(JSON.stringify([
                        {
                          name: "SouqOne Noor Bridal Polki Set",
                          price: 4999,
                          originalPrice: 6999,
                          memberPrice: 4749,
                          category: "bangles",
                          subcategory: "Stone Bangle",
                          image: "/images/bangles/Gemini_Generated_Image_hldb3jhldb3jhldb.png",
                          inventoryCount: 15
                        }
                      ], null, 2));
                    }}
                    className="btn-outline"
                    style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem' }}
                  >
                    Sample
                  </button>
                </div>
              </div>

              {/* Method B: Single Studio Look Direct Add */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Single Studio Look Uploader</span>
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)', marginBottom: '0.85rem' }}>
                  Quickly push an individual photoshoot look directly from SouqOne Studio.
                </p>

                <form onSubmit={handleSingleStudioLookAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Showroom Look Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SouqOne Miss World Runway Kada"
                      value={singleStudioLook.name}
                      onChange={(e) => setSingleStudioLook({ ...singleStudioLook, name: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Category</label>
                      <select
                        value={singleStudioLook.category}
                        onChange={(e) => setSingleStudioLook({ ...singleStudioLook, category: e.target.value })}
                        className="form-select"
                        style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                      >
                        <option value="bangles">Bangles</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="earrings">Earrings</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Selling Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={singleStudioLook.price}
                        onChange={(e) => setSingleStudioLook({ ...singleStudioLook, price: Number(e.target.value) })}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Showroom Image URL / Path</label>
                    <input
                      type="text"
                      placeholder="/images/bangles/1789662811af3b.png or https://..."
                      value={singleStudioLook.image}
                      onChange={(e) => setSingleStudioLook({ ...singleStudioLook, image: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '0.75rem', fontSize: '0.82rem', marginTop: '0.35rem' }}
                  >
                    <Plus size={14} />
                    <span>Transform Look to Live Inventory</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: HERO & MARKETING ENGINE (Control Hero Banner, Headlines & Badges)    */}
        {/* ========================================================================= */}
        {activeTab === 'HERO_MARKETING' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ borderBottom: '1px solid var(--pk-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <div style={{ background: 'var(--pk-gold-gradient)', color: '#121110', padding: '0.35rem', borderRadius: '6px' }}>
                    <Megaphone size={18} />
                  </div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                    Storefront Content Engine
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Hero Banner &amp; Marketing Section Controller
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  Update live marketing promotions, top announcements, headline copy, and featured spotlight products.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMode('storefront')}
                className="btn-outline"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Eye size={14} />
                <span>Preview Storefront</span>
              </button>
            </div>

            {heroSaveSuccess && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                {heroSaveSuccess}
              </div>
            )}

            <form onSubmit={handleHeroConfigSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '720px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>Announcement Ticker Badge (Top of Hero)</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>Appears with crown icon</span>
                </label>
                <input
                  type="text"
                  required
                  value={heroForm.announcementBadge}
                  onChange={(e) => setHeroForm({ ...heroForm, announcementBadge: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hero Title Line 1</label>
                  <input
                    type="text"
                    required
                    value={heroForm.titleLine1}
                    onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hero Title Line 2 (Gold Gradient Accent)</label>
                  <input
                    type="text"
                    required
                    value={heroForm.titleLine2}
                    onChange={(e) => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Hero Brand Story &amp; Description</label>
                <textarea
                  rows="3"
                  required
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Spotlight Featured Product</label>
                <select
                  value={heroForm.spotlightProductId}
                  onChange={(e) => setHeroForm({ ...heroForm, spotlightProductId: e.target.value })}
                  className="form-select"
                >
                  {allCatalogueProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price}) — {p.category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-gold"
                style={{ padding: '0.9rem', fontSize: '0.95rem', fontWeight: 700, width: '100%', marginTop: '0.5rem' }}
              >
                <Check size={16} />
                <span>Save &amp; Update Live Homepage Hero</span>
              </button>
            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ROYAL SHORTS REELS MANAGER (YouTube Shorts & Instagram Style)         */}
        {/* ========================================================================= */}
        {activeTab === 'SHORTS_MANAGER' && (
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ borderBottom: '1px solid var(--pk-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <div style={{ background: 'var(--pk-gold-gradient)', color: '#121110', padding: '0.35rem', borderRadius: '6px' }}>
                    <Sparkles size={18} />
                  </div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                    Video Commerce Studio
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Royal Shorts &amp; Video Reels Management
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  Upload vertical runway &amp; atelier videos (like YouTube Shorts &amp; Instagram Reels). Customers can watch and shop tagged pieces in 1-click.
                </p>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                {shortsList.length} Active Video Reels
              </span>
            </div>

            {shortsSuccessMsg && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                {shortsSuccessMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Upload New Short Form */}
              <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Upload New Royal Short Reel</span>
                </h4>

                <form onSubmit={handleCreateShort} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Reel Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Rajputi Kundan Kada 360°"
                      value={newShortTitle}
                      onChange={(e) => setNewShortTitle(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                    <textarea
                      rows="2"
                      placeholder="Describe the craft, occasion and finish..."
                      value={newShortDesc}
                      onChange={(e) => setNewShortDesc(e.target.value)}
                      className="form-textarea"
                      style={{ minHeight: '60px', padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Video File or URL *</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        placeholder="https://... or choose video file"
                        value={newShortUrl}
                        onChange={(e) => setNewShortUrl(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.8rem', flex: 1 }}
                      />
                      <input
                        type="file"
                        ref={shortVideoInputRef}
                        accept="video/*,.mp4,.webm"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewShortUrl(event.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => shortVideoInputRef.current?.click()}
                        className="btn-outline"
                        style={{ padding: '0.55rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      >
                        Choose File
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Thumbnail / Poster Image URL</label>
                    <input
                      type="text"
                      placeholder="/images/bangles/... or URL"
                      value={newShortPoster}
                      onChange={(e) => setNewShortPoster(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Tag Product to Shop in Reel</label>
                    <select
                      value={newShortProduct}
                      onChange={(e) => setNewShortProduct(e.target.value)}
                      className="form-select"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    >
                      {allCatalogueProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '0.75rem', fontSize: '0.85rem', marginTop: '0.35rem' }}
                  >
                    <Sparkles size={14} />
                    <span>Publish Short Reel to Storefront</span>
                  </button>
                </form>
              </div>

              {/* Current Shorts List */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 0.85rem' }}>
                  Current Active Shorts ({shortsList.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
                  {shortsList.map(short => {
                    const prod = allCatalogueProducts.find(p => p.id === short.taggedProductId);
                    return (
                      <div
                        key={short.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          background: 'var(--pk-surface-alt)',
                          border: '1px solid var(--pk-border)',
                          borderRadius: 'var(--radius-sm)',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={short.posterImage}
                            alt={short.title}
                            style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px', background: '#121110' }}
                          />
                          <div>
                            <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', color: 'var(--pk-obsidian)', fontWeight: 700 }}>
                              {short.title}
                            </h5>
                            <div style={{ fontSize: '0.72rem', color: 'var(--pk-text-muted)' }}>
                              Tagged: <strong>{prod ? prod.name : short.taggedProductId}</strong>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', marginTop: '0.15rem' }}>
                              {short.viewsCount || '15K'} views • {short.likesCount || 120} likes
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => setPreviewingVideoUrl(short.videoUrl)}
                            className="btn-gold"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Preview Video Reel"
                          >
                            <Play size={12} />
                            <span>Play</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditShortModal(short)}
                            className="btn-outline"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Edit Reel Details"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete reel "${short.title}"?`)) {
                                deleteShort(short.id);
                              }
                            }}
                            style={{ background: 'transparent', border: '1px solid #FECDD3', color: '#9F1239', cursor: 'pointer', padding: '0.4rem', borderRadius: '4px' }}
                            title="Delete reel"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

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
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--pk-border)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '1px solid var(--pk-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <div style={{ background: 'var(--pk-gold-gradient)', color: '#121110', padding: '0.35rem', borderRadius: '6px' }}>
                    <Crown size={18} />
                  </div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pk-gold-dark)', fontWeight: 800 }}>
                    Official Pageant Partner • Full Axis Admin Control
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Miss World 2025 India Pageant &amp; Celebrity PR Hub
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  Publish and manage pageant runway photos, red carpet accolades, celebrity quotes, and national advertisement campaigns in real-time.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <span style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#8C6D1F', fontSize: '0.78rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  {celebrityShowcase.length} Live PR Highlights
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMode('storefront')}
                  className="btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Eye size={14} />
                  <span>View on Storefront</span>
                </button>
              </div>
            </div>

            {showcaseSuccess && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>{showcaseSuccess}</span>
              </div>
            )}

            {/* Split Creator Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              
              {/* Creator Form */}
              <div style={{ background: 'var(--pk-surface-alt)', border: '1px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                  <span>Publish New Pageant / Celebrity Advertisement</span>
                </h4>

                <form onSubmit={handleAddShowcaseItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Campaign / Milestone Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Miss World 2025 India National Gala Walk"
                      value={newShowcaseTitle}
                      onChange={(e) => setNewShowcaseTitle(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Celebrity / Model Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Miss World India Finalists"
                        value={newShowcaseCelebrity}
                        onChange={(e) => setNewShowcaseCelebrity(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Pageant / Event</label>
                      <input
                        type="text"
                        placeholder="e.g. Miss World 2025 India"
                        value={newShowcaseEvent}
                        onChange={(e) => setNewShowcaseEvent(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Subtitle / Occasion</label>
                    <input
                      type="text"
                      placeholder="e.g. Adorned in Royal Rajwada Antique Kada Set"
                      value={newShowcaseSubtitle}
                      onChange={(e) => setNewShowcaseSubtitle(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Ribbon Tag</label>
                      <select
                        value={newShowcaseTag}
                        onChange={(e) => setNewShowcaseTag(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                      >
                        <option value="Miss World 2025 India">Miss World 2025 India</option>
                        <option value="Official Pageant Partner">Official Pageant Partner</option>
                        <option value="Red Carpet Gala">Red Carpet Gala</option>
                        <option value="Vogue & Press Editorial">Vogue &amp; Press Editorial</option>
                        <option value="Global Runway Award">Global Runway Award</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Prestige Badge</label>
                      <select
                        value={newShowcaseBadge}
                        onChange={(e) => setNewShowcaseBadge(e.target.value)}
                        className="form-select"
                        style={{ padding: '0.55rem', fontSize: '0.8rem' }}
                      >
                        <option value="Official Pageant Partner">Official Pageant Partner</option>
                        <option value="Celebrity Choice">Celebrity Choice</option>
                        <option value="Royal Heritage Atelier">Royal Heritage Atelier</option>
                        <option value="Pageant Crown Edition">Pageant Crown Edition</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Celebrity Endorsement Quote / Atelier Story</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Premium Khaja's jewellery reflects the magnificent royal heritage of India with timeless brilliance."
                      value={newShowcaseQuote}
                      onChange={(e) => setNewShowcaseQuote(e.target.value)}
                      className="form-textarea"
                      style={{ minHeight: '65px', padding: '0.55rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* Photo Uploader / URL */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Showcase Photo (File or URL)</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        placeholder="/images/bangles/... or https://..."
                        value={newShowcaseImage}
                        onChange={(e) => setNewShowcaseImage(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.8rem', flex: 1 }}
                      />
                      <input
                        type="file"
                        ref={showcaseFileInputRef}
                        accept="image/*,.png,.jpg,.jpeg,.webp"
                        style={{ display: 'none' }}
                        onChange={handleShowcaseImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => showcaseFileInputRef.current?.click()}
                        className="btn-outline"
                        style={{ padding: '0.55rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      >
                        Choose Photo
                      </button>
                    </div>
                    {newShowcaseImage && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img 
                          src={newShowcaseImage} 
                          alt="preview" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--pk-border)' }} 
                        />
                        <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>✓ Photo linked & ready</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '0.8rem', fontSize: '0.85rem', marginTop: '0.4rem', fontWeight: 700 }}
                  >
                    <Crown size={15} />
                    <span>Publish Advertisement to Live Storefront</span>
                  </button>
                </form>
              </div>

              {/* Current Showcase Items */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 1rem' }}>
                  Live Pageant Highlights &amp; Accolades ({celebrityShowcase.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
                  {celebrityShowcase.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        background: '#FFFFFF',
                        border: '1px solid var(--pk-border)',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '110px', minHeight: '120px', objectFit: 'cover', background: '#121110' }}
                      />
                      <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--pk-ruby)', fontWeight: 700, background: 'rgba(125,26,37,0.1)', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                              {item.tag}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                              {item.badge}
                            </span>
                          </div>
                          <h5 style={{ margin: '0.35rem 0 0.2rem', fontSize: '0.92rem', color: 'var(--pk-obsidian)', fontWeight: 700 }}>
                            {item.title}
                          </h5>
                          <div style={{ fontSize: '0.74rem', color: 'var(--pk-gold-dark)', fontWeight: 600 }}>
                            {item.celebrity} • {item.event}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--pk-text-secondary)', fontStyle: 'italic', margin: '0.3rem 0 0', lineHeight: 1.4 }}>
                            "{item.quote}"
                          </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.6rem', borderTop: '1px solid var(--pk-surface-alt)', paddingTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => openEditShowcaseModal(item)}
                            className="btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete pageant showcase "${item.title}"?`)) {
                                deleteCelebrityShowcaseItem(item.id);
                              }
                            }}
                            style={{ background: 'transparent', border: '1px solid #FECDD3', color: '#9F1239', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: STORE OWNER UPI GATEWAY & SCANNER CONTROL (Jaffar Mohd - premiumkhaja@okaxis) */}
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
                    Official Merchant UPI Gateway • Jaffar Mohd Ecosystem
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Store Owner UPI Gateway &amp; QR Scanner Control
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--pk-text-muted)', margin: '0.25rem 0 0' }}>
                  Verified Merchant: <strong>{storeOwnerName || 'Jaffar Mohd'}</strong> • UPI: <code>{storeUpiId || 'premiumkhaja@okaxis'}</code> • Direct WhatsApp Sync: <strong>+91 {storeOwnerPhone || '9393056641'}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ background: '#E6F4EA', color: '#137333', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} />
                  <span>Gateway Active &amp; Verified</span>
                </span>
              </div>
            </div>

            {merchantSaveSuccess && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>{merchantSaveSuccess}</span>
              </div>
            )}

            {/* Hidden file input for physical Standee photo uploader */}
            <input
              type="file"
              ref={qrFileInputRef}
              accept="image/*,.png,.jpg,.jpeg,.webp"
              style={{ display: 'none' }}
              onChange={handleQrFileUpload}
            />

            {/* 2-Column Gateway Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
              
              {/* Column 1: Official Standee Photo & Security */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Official Physical Standee Scanner Card */}
                <div style={{ background: 'var(--pk-surface-alt)', border: '1.5px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Camera size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                      <span>Official Physical Standee Scanner</span>
                    </h4>
                    <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      IN CHECKOUT
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ 
                      width: '160px', 
                      height: '210px', 
                      background: '#FFFFFF', 
                      border: '2px solid var(--pk-gold-dark)', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <img 
                        src={storePaymentQr || '/images/jaffar_mohd_upi_qr.jpg'} 
                        alt="Jaffar Mohd UPI QR Scanner" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: 'var(--pk-text-muted)' }}>Registered Payee:</span>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--pk-obsidian)' }}>
                          {storeOwnerName || 'Jaffar Mohd'}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--pk-text-muted)' }}>Official VPA:</span>
                        <div style={{ fontWeight: 700, color: 'var(--pk-gold-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <code>{storeUpiId || 'premiumkhaja@okaxis'}</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(storeUpiId || 'premiumkhaja@okaxis');
                              setCopiedQrUpi(true);
                              setTimeout(() => setCopiedQrUpi(false), 2000);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--pk-gold-dark)' }}
                            title="Copy UPI ID"
                          >
                            {copiedQrUpi ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--pk-text-muted)' }}>Bank Provider:</span>
                        <div style={{ fontWeight: 600 }}>Google Pay / Axis Bank UPI</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => qrFileInputRef.current?.click()}
                          className="btn-gold"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', width: '100%' }}
                        >
                          <Upload size={13} />
                          <span>Upload New Standee Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={resetStorePaymentQr}
                          className="btn-outline"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', width: '100%' }}
                        >
                          <RefreshCw size={13} />
                          <span>Reset to Jaffar Mohd Default</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank-Grade Security & Anti-Tamper Shield Card */}
                <div style={{ background: '#FFFDF9', border: '1.5px solid rgba(212, 175, 55, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--pk-gold-dark)' }} />
                    <h5 style={{ fontSize: '0.92rem', color: 'var(--pk-obsidian)', margin: 0, fontWeight: 700 }}>
                      Ecosystem Security &amp; Anti-Tamper Protection
                    </h5>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.76rem', color: 'var(--pk-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span><strong>Encrypted Session Tokens:</strong> Cryptographically generated auth tokens with automatic timeout.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span><strong>Brute-Force Rate Limiter:</strong> 5-attempt threshold with automatic 5-minute lockout security.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span><strong>Input XSS Neutralizer:</strong> Strict sanitization across customer forms &amp; guidance inputs.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span><strong>Direct Owner Sync:</strong> Payment receipts are directly dispatched to owner WhatsApp (+91 {storeOwnerPhone || '9393056641'}).</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 2: Dynamic Amount QR Simulator & Gateway Credentials */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Dynamic QR Simulator Card */}
                <div style={{ background: 'var(--pk-surface-alt)', border: '1.5px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                      <span>Dynamic Total-Amount QR Simulator</span>
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 700 }}>
                      Live Checkout Emulation
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--pk-text-muted)', margin: '0 0 1rem' }}>
                    When a customer proceeds to checkout, the system generates a dynamic QR with their exact cart total pre-filled so they can scan and pay seamlessly.
                  </p>

                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    {/* Live Dynamic QR Visual */}
                    <div style={{ 
                      width: '160px', 
                      height: '160px', 
                      background: '#FFFFFF', 
                      border: '2px solid var(--pk-obsidian)', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=${storeUpiId || 'premiumkhaja@okaxis'}&pn=${encodeURIComponent(storeOwnerName || 'Jaffar Mohd')}&am=${qrSimAmount}&cu=INR&tn=Order%20Payment`)}`} 
                        alt="Dynamic UPI QR" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Interactive Simulator Inputs */}
                    <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pk-obsidian)' }}>
                        Simulate Cart Total (₹):
                      </label>
                      <input
                        type="number"
                        value={qrSimAmount}
                        onChange={(e) => setQrSimAmount(Number(e.target.value) || 0)}
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.9rem', fontWeight: 800 }}
                      />

                      {/* Quick amount presets */}
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {[999, 2499, 4999, 8999].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setQrSimAmount(amt)}
                            style={{
                              background: qrSimAmount === amt ? 'var(--pk-obsidian)' : '#FFFFFF',
                              color: qrSimAmount === amt ? '#FAF8F5' : 'var(--pk-obsidian)',
                              border: '1px solid var(--pk-border)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ₹{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)', marginTop: '0.25rem' }}>
                        Encoded deep link: <br />
                        <code style={{ fontSize: '0.65rem', wordBreak: 'break-all', color: 'var(--pk-gold-dark)' }}>
                          upi://pay?pa={storeUpiId || 'premiumkhaja@okaxis'}&amp;pn=Jaffar%20Mohd&amp;am={qrSimAmount}&amp;cu=INR
                        </code>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Merchant Gateway Credentials Form */}
                <div style={{ background: '#FFFFFF', border: '1.5px solid var(--pk-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pk-obsidian)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Edit3 size={16} style={{ color: 'var(--pk-gold-dark)' }} />
                    <span>Update Merchant Gateway Credentials</span>
                  </h4>

                  <form onSubmit={handleSaveMerchantSettings} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Business Owner Full Name *</label>
                      <input
                        type="text"
                        required
                        value={merchantSettings.ownerName}
                        onChange={(e) => setMerchantSettings({ ...merchantSettings, ownerName: e.target.value })}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.82rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Merchant UPI VPA ID (Virtual Payment Address) *</label>
                      <input
                        type="text"
                        required
                        value={merchantSettings.upiId}
                        onChange={(e) => setMerchantSettings({ ...merchantSettings, upiId: e.target.value })}
                        className="form-input"
                        style={{ padding: '0.55rem', fontSize: '0.82rem' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--pk-text-muted)' }}>
                        Default: premiumkhaja@okaxis (Registered under Jaffar Mohd)
                      </span>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Owner WhatsApp Phone Number (10 Digits) *</label>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span style={{ padding: '0.55rem 0.65rem', background: '#F1F5F9', border: '1px solid var(--pk-border)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength="10"
                          value={merchantSettings.phone}
                          onChange={(e) => setMerchantSettings({ ...merchantSettings, phone: e.target.value.replace(/\D/g, '') })}
                          className="form-input"
                          style={{ padding: '0.55rem', fontSize: '0.82rem', flex: 1 }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        className="btn-gold"
                        style={{ padding: '0.75rem', fontSize: '0.85rem', flex: 1, fontWeight: 700 }}
                      >
                        <Check size={15} />
                        <span>Save &amp; Apply Gateway Settings</span>
                      </button>

                      <a
                        href={`https://wa.me/91${merchantSettings.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Test message from Premium Khaja Atelier Merchant Command Center. Verified Merchant: ${merchantSettings.ownerName}, UPI: ${merchantSettings.upiId}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        title="Test WhatsApp connection"
                      >
                        <MessageCircle size={15} />
                        <span>Test WhatsApp</span>
                      </a>
                    </div>
                  </form>
                </div>

              </div>

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

      {/* ========================================================================= */}
      {/* GLOBAL MODAL: FULL END-TO-END PRODUCT EDITOR FOR ALL CATALOGUE ITEMS      */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '680px', 
              maxHeight: '92vh', 
              overflowY: 'auto', 
              padding: '2rem 1.75rem', 
              background: '#FFFFFF',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              border: '1px solid var(--pk-gold-dark)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--pk-gold-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Live Inventory Management
                </span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--pk-obsidian)', margin: '0.2rem 0 0' }}>
                  Edit Product: {editingProduct.name}
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setEditingProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Product Name / Title *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={(e) => {
                      const p = Number(e.target.value) || 0;
                      setEditForm({
                        ...editForm,
                        price: p,
                        originalPrice: Math.round(p * 1.35),
                        memberPrice: Math.round(p * 0.95)
                      });
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">MRP (₹)</label>
                  <input
                    type="number"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">VIP Member Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.memberPrice}
                    onChange={(e) => setEditForm({ ...editForm, memberPrice: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={editForm.inventoryCount}
                    onChange={(e) => setEditForm({ ...editForm, inventoryCount: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="bangles">Bangles</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="earrings">Earrings</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subcategory / Style</label>
                  <input
                    type="text"
                    value={editForm.subcategory}
                    onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Stone Bangle, AD, Cz, Lac"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editForm.sizes) ? editForm.sizes.join(', ') : editForm.sizes}
                    onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="form-input"
                    placeholder="2.4, 2.6, 2.8"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Color / Finish</label>
                  <input
                    type="text"
                    value={editForm.finish}
                    onChange={(e) => setEditForm({ ...editForm, finish: e.target.value })}
                    className="form-input"
                    placeholder="22K Antique Micro Gold Plated"
                  />
                </div>
              </div>

              {/* Image selector */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Product Image (File or URL)</label>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  {editForm.image && (
                    <img
                      src={editForm.image}
                      alt="preview"
                      style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#FAF8F5', borderRadius: '4px', border: '1px solid var(--pk-border)' }}
                    />
                  )}
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    placeholder="Image URL or choose file from PC / mobile"
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*,.png,.jpg,.jpeg,.webp,.avif"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditForm(prev => ({ ...prev, image: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="btn-outline"
                    style={{ padding: '0.65rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1, padding: '0.85rem' }}>
                  <Check size={16} />
                  <span>Save &amp; Publish Changes to Showroom</span>
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn-outline" style={{ padding: '0.85rem 1.25rem' }}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MISS WORLD / CELEBRITY PR ITEM                                */}
      {/* ========================================================================= */}
      {editingShowcase && (
        <div className="modal-backdrop" onClick={() => setEditingShowcase(null)} style={{ zIndex: 1100 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '580px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.75rem',
              background: '#FFFFFF',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              border: '1.5px solid var(--pk-gold-dark)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Crown size={20} style={{ color: 'var(--pk-gold-dark)' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Edit Miss World / PR Accolade
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setEditingShowcase(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditShowcaseSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={showcaseEditForm.title}
                  onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Celebrity / Model *</label>
                  <input
                    type="text"
                    required
                    value={showcaseEditForm.celebrity}
                    onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, celebrity: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Pageant / Event</label>
                  <input
                    type="text"
                    value={showcaseEditForm.event}
                    onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, event: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Subtitle</label>
                <input
                  type="text"
                  value={showcaseEditForm.subtitle}
                  onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, subtitle: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Ribbon Tag</label>
                  <input
                    type="text"
                    value={showcaseEditForm.tag}
                    onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, tag: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Prestige Badge</label>
                  <input
                    type="text"
                    value={showcaseEditForm.badge}
                    onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, badge: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Endorsement Quote</label>
                <textarea
                  rows="2"
                  value={showcaseEditForm.quote}
                  onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, quote: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Photo Image URL / Asset</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={showcaseEditForm.image}
                    onChange={(e) => setShowcaseEditForm({ ...showcaseEditForm, image: e.target.value })}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    ref={showcaseEditFileInputRef}
                    accept="image/*,.png,.jpg,.jpeg,.webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setShowcaseEditForm(prev => ({ ...prev, image: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => showcaseEditFileInputRef.current?.click()}
                    className="btn-outline"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>
                  <Check size={15} />
                  <span>Update &amp; Save Changes</span>
                </button>
                <button type="button" onClick={() => setEditingShowcase(null)} className="btn-outline" style={{ padding: '0.75rem 1rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT ROYAL SHORT REEL                                              */}
      {/* ========================================================================= */}
      {editingShort && (
        <div className="modal-backdrop" onClick={() => setEditingShort(null)} style={{ zIndex: 1100 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.75rem',
              background: '#FFFFFF',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              border: '1.5px solid var(--pk-gold-dark)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--pk-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} style={{ color: 'var(--pk-gold-dark)' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--pk-obsidian)', margin: 0 }}>
                  Edit Royal Short Reel
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setEditingShort(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditShortSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Reel Title *</label>
                <input
                  type="text"
                  required
                  value={shortEditForm.title}
                  onChange={(e) => setShortEditForm({ ...shortEditForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                <textarea
                  rows="2"
                  value={shortEditForm.description}
                  onChange={(e) => setShortEditForm({ ...shortEditForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Video URL or Asset Path *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    value={shortEditForm.videoUrl}
                    onChange={(e) => setShortEditForm({ ...shortEditForm, videoUrl: e.target.value })}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    ref={editShortVideoRef}
                    accept="video/*,.mp4,.webm"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setShortEditForm(prev => ({ ...prev, videoUrl: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => editShortVideoRef.current?.click()}
                    className="btn-outline"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                  >
                    Upload Video
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Thumbnail / Poster Image</label>
                <input
                  type="text"
                  value={shortEditForm.posterImage}
                  onChange={(e) => setShortEditForm({ ...shortEditForm, posterImage: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Tagged Product to Shop in Reel</label>
                <select
                  value={shortEditForm.taggedProductId}
                  onChange={(e) => setShortEditForm({ ...shortEditForm, taggedProductId: e.target.value })}
                  className="form-select"
                >
                  {allCatalogueProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>
                  <Check size={15} />
                  <span>Update Reel</span>
                </button>
                <button type="button" onClick={() => setEditingShort(null)} className="btn-outline" style={{ padding: '0.75rem 1rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IN-ADMIN VIDEO REEL PLAYER PREVIEW                                 */}
      {/* ========================================================================= */}
      {previewingVideoUrl && (
        <div className="modal-backdrop" onClick={() => setPreviewingVideoUrl(null)} style={{ zIndex: 1200 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '420px',
              background: '#0D0C0B',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--pk-gold-dark)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E4C88A', fontSize: '0.85rem', fontWeight: 700 }}>
                <Play size={15} />
                <span>Video Reel Playback Preview</span>
              </div>
              <button
                className="btn-icon"
                onClick={() => setPreviewingVideoUrl(null)}
                style={{ color: '#FAF8F5', background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ width: '100%', height: '520px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
              <video
                src={previewingVideoUrl}
                controls
                autoPlay
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <button
              type="button"
              onClick={() => setPreviewingVideoUrl(null)}
              className="btn-gold"
              style={{ width: '100%', marginTop: '0.85rem', padding: '0.65rem', fontSize: '0.82rem' }}
            >
              Close Video Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

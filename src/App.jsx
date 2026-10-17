import React from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ShortsSection } from './components/ShortsSection';
import { BanglesSpotlight } from './components/BanglesSpotlight';
import { Footer } from './components/Footer';
import { HyderabadMonumentsBackground } from './components/HyderabadMonumentsBackground';
import { MobileBottomNav } from './components/MobileBottomNav';

// Drawers & Modals
import { JewelleryShortsModal } from './components/JewelleryShortsModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { QuickPassModal } from './components/QuickPassModal';
import { DigitalMemberCard } from './components/DigitalMemberCard';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AIStylistDrawer } from './components/AIStylistDrawer';
import { EnquiryModal } from './components/EnquiryModal';
import { QRCommerceModal } from './components/QRCommerceModal';

// Merchant Command Center
import { CommandCenter } from './components/MerchantCommandCenter/CommandCenter';

export const App = () => {
  const { activeMode, adminUser, setAuthModalOpen, setAuthMode } = useStore();

  // Strict Access Control: Admin Command Center is only accessible to authenticated administrators
  const isAuthorizedAdmin = activeMode === 'command-center' && Boolean(adminUser);

  React.useEffect(() => {
    if (activeMode === 'command-center' && !adminUser) {
      setAuthMode('admin');
      setAuthModalOpen(true);
    }
  }, [activeMode, adminUser, setAuthMode, setAuthModalOpen]);

  return (
    <div className="quickstore-root" style={{ position: 'relative', minHeight: '100vh', background: '#121110' }}>
      
      {/* Subtle Royal Hyderabad Heritage Monuments Ambient Silhouette */}
      <HyderabadMonumentsBackground />

      {isAuthorizedAdmin ? (
        <CommandCenter />
      ) : (
        <>
          <Header />
          <main style={{ position: 'relative', zIndex: 1 }}>
            <HeroSection />
            <ShortsSection />
            <BanglesSpotlight />
          </main>
          <Footer />
          <MobileBottomNav />
        </>
      )}

      {/* Global Interactive Modals, Video Reels & Slide-Over Drawers */}
      <JewelleryShortsModal />
      <CustomerAuthModal />
      <QuickPassModal />
      <DigitalMemberCard />
      <CartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <AIStylistDrawer />
      <EnquiryModal />
      <QRCommerceModal />

    </div>
  );
};


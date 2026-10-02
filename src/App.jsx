import React from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ShortsSection } from './components/ShortsSection';
import { CelebrityMissWorldSpotlight } from './components/CelebrityMissWorldSpotlight';
import { BanglesSpotlight } from './components/BanglesSpotlight';
import { LookbookSection } from './components/LookbookSection';
import { ComplementaryShowcase } from './components/ComplementaryShowcase';
import { Footer } from './components/Footer';
import { HyderabadMonumentsBackground } from './components/HyderabadMonumentsBackground';

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
  const { activeMode } = useStore();

  return (
    <div className="quickstore-root" style={{ position: 'relative', minHeight: '100vh', background: '#121110' }}>
      
      {/* Subtle Royal Hyderabad Heritage Monuments Ambient Silhouette */}
      <HyderabadMonumentsBackground />

      {activeMode === 'command-center' ? (
        <CommandCenter />
      ) : (
        <>
          <Header />
          <main style={{ position: 'relative', zIndex: 1 }}>
            <HeroBanner />
            <ShortsSection />
            <div id="celebrity-spotlight">
              <CelebrityMissWorldSpotlight />
            </div>
            <BanglesSpotlight />
            <LookbookSection />
            <ComplementaryShowcase />
          </main>
          <Footer />
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

import React from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CelebrityMissWorldSpotlight } from './components/CelebrityMissWorldSpotlight';
import { BanglesSpotlight } from './components/BanglesSpotlight';
import { LookbookSection } from './components/LookbookSection';
import { ComplementaryShowcase } from './components/ComplementaryShowcase';
import { Footer } from './components/Footer';

// Drawers & Modals
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
    <div className="quickstore-root">
      
      {activeMode === 'command-center' ? (
        <CommandCenter />
      ) : (
        <>
          <Header />
          <main>
            <HeroBanner />
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

      {/* Global Interactive Modals and Slide-Over Drawers */}
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

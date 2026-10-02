import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Play, Pause, Volume2, VolumeX, Heart, Share2, 
  ChevronUp, ChevronDown, ShoppingBag, MessageCircle, Sparkles, ExternalLink 
} from 'lucide-react';
import { STORE_OWNER_PHONE } from '../context/StoreContext';

export const JewelleryShortsModal = () => {
  const { 
    activeShortIndex, 
    setActiveShortIndex, 
    shortsList, 
    shortsModalOpen, 
    setShortsModalOpen, 
    products, 
    addToCart,
    openProductDetail
  } = useStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedShorts, setLikedShorts] = useState({});
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const videoRef = useRef(null);

  const currentShort = shortsList && shortsList[activeShortIndex] ? shortsList[activeShortIndex] : null;
  const taggedProduct = currentShort ? products.find(p => p.id === currentShort.taggedProductId) : null;

  // Sync play state when changing shorts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [activeShortIndex, shortsModalOpen]);

  // Keyboard navigation (Escape to close, Up/Down for next/prev short)
  useEffect(() => {
    if (!shortsModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShortsModalOpen(false);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortsModalOpen, activeShortIndex, shortsList]);

  if (!shortsModalOpen || !currentShort) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNext = () => {
    if (activeShortIndex < shortsList.length - 1) {
      setActiveShortIndex(activeShortIndex + 1);
    } else {
      setActiveShortIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (activeShortIndex > 0) {
      setActiveShortIndex(activeShortIndex - 1);
    } else {
      setActiveShortIndex(shortsList.length - 1);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    const isLiked = likedShorts[currentShort.id];
    setLikedShorts(prev => ({ ...prev, [currentShort.id]: !isLiked }));
    if (!isLiked) {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `Watch this royal jewellery reel from Premium Khaja: "${currentShort.title}"! ${window.location.origin}/#shorts-${currentShort.id}`;
    if (navigator.share) {
      navigator.share({ title: currentShort.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert("Shorts link copied to clipboard!");
    }
  };

  const isCurrentLiked = likedShorts[currentShort.id];
  const likesCount = (currentShort.likesCount || 100) + (isCurrentLiked ? 1 : 0);

  return (
    <div 
      className="modal-backdrop" 
      style={{ 
        zIndex: 1200, 
        padding: 0, 
        background: 'rgba(5, 5, 5, 0.92)', 
        backdropFilter: 'blur(12px)' 
      }}
      onClick={() => setShortsModalOpen(false)}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '92vh',
          maxHeight: '840px',
          background: '#0D0C0B',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(212, 175, 55, 0.35)',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              background: 'var(--pk-gold-gradient)', 
              color: '#121110', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              padding: '0.2rem 0.6rem', 
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.05em' 
            }}>
              PK SHORTS
            </span>
            <span style={{ color: '#FAF8F5', fontSize: '0.78rem', fontWeight: 600 }}>
              {activeShortIndex + 1} / {shortsList.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShortsModalOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
              title="Close Shorts"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Stage */}
        <div 
          style={{ position: 'relative', flex: 1, width: '100%', height: '100%', cursor: 'pointer', overflow: 'hidden' }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            poster={currentShort.posterImage}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loop
            playsInline
            muted={isMuted}
            autoPlay
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FAF8F5',
              pointerEvents: 'none'
            }}>
              <Play size={32} style={{ marginLeft: '4px' }} />
            </div>
          )}

          {/* Double tap heart animation */}
          {showHeartAnim && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.5)',
              color: '#E11D48',
              pointerEvents: 'none',
              animation: 'scaleUp 0.4s ease-out'
            }}>
              <Heart size={80} fill="#E11D48" />
            </div>
          )}

          {/* Right Action Rail (Likes, Share, Up, Down) */}
          <div style={{
            position: 'absolute',
            right: '12px',
            bottom: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 10
          }}>
            {/* Like Button */}
            <button
              onClick={handleLike}
              style={{
                background: isCurrentLiked ? '#E11D48' : 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
              }}
            >
              <Heart size={20} fill={isCurrentLiked ? '#fff' : 'none'} />
            </button>
            <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 700, marginTop: '-0.85rem' }}>
              {likesCount}
            </span>

            {/* Share Button */}
            <button
              onClick={handleShare}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
              }}
              title="Share Reel"
            >
              <Share2 size={20} />
            </button>

            {/* Prev Short */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
              title="Previous Short"
            >
              <ChevronUp size={20} />
            </button>

            {/* Next Short */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
              title="Next Short"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Bottom Gradient Overlay & Product Card */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1.25rem 1rem 1rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0) 100%)',
            zIndex: 10
          }}>
            {/* Title & Author */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#E4C88A', fontSize: '0.78rem', fontWeight: 700 }}>
                  {currentShort.author || '@PremiumKhaja'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
                  • {currentShort.viewsCount || '10K'} views
                </span>
              </div>
              <h3 style={{ 
                color: '#FAF8F5', 
                fontSize: '0.98rem', 
                fontWeight: 600, 
                lineHeight: 1.35, 
                margin: '0 0 0.4rem',
                fontFamily: 'var(--font-serif)'
              }}>
                {currentShort.title}
              </h3>
              <p style={{ color: '#C5BAAB', fontSize: '0.78rem', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {currentShort.description}
              </p>
            </div>

            {/* Tagged Jewellery Piece "Shop The Look" Card */}
            {taggedProduct && (
              <div style={{
                background: 'rgba(28, 25, 22, 0.95)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
              }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => openProductDetail(taggedProduct)}
                >
                  <img 
                    src={taggedProduct.image} 
                    alt={taggedProduct.name}
                    style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: 'var(--radius-sm)', 
                      objectFit: 'cover', 
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      flexShrink: 0 
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      color: '#FAF8F5', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {taggedProduct.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.15rem' }}>
                      <span style={{ color: '#E4C88A', fontWeight: 800, fontSize: '0.88rem' }}>
                        ₹{taggedProduct.price.toLocaleString()}
                      </span>
                      <span className="gold-badge" style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}>
                        VIP: ₹{taggedProduct.memberPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Buy / Add to Bag */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(taggedProduct, taggedProduct.sizes?.[0] || '2.6', 1);
                  }}
                  className="btn-gold"
                  style={{
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ShoppingBag size={14} />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

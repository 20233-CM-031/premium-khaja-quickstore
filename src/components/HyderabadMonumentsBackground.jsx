import React, { useState, useEffect } from 'react';

/**
 * HyderabadMonumentsBackground
 * Subtle, royal architectural silhouettes of Hyderabad's iconic heritage monuments:
 * - Charminar (The Four Minarets & Nizami Arches)
 * - Golconda Fort (Historic battlements & hilltop pavilions)
 * - Chowmahalla Palace (Nizami Durbar Hall & classical arches)
 * - Falaknuma Palace (The "Mirror of the Sky" neoclassical royal facade)
 *
 * Elegantly crossfades in the background with soft warm-gold illumination.
 * 100% non-intrusive: pointer-events: none, low opacity, zero interference with text or images.
 */
export const HyderabadMonumentsBackground = () => {
  const [activeMonument, setActiveMonument] = useState(0);

  // Rotate between Hyderabad's iconic monuments every 16 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMonument(prev => (prev + 1) % 4);
    }, 16000);
    return () => clearInterval(timer);
  }, []);

  const monuments = [
    {
      id: 'charminar',
      name: 'Charminar, Hyderabad — City of Pearls Heritage',
      svg: (
        <svg viewBox="0 0 1200 600" className="monument-svg" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="hydGoldGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g fill="url(#hydGoldGrad1)" stroke="rgba(212, 175, 55, 0.18)" strokeWidth="1.2">
            {/* Base platform */}
            <rect x="350" y="520" width="500" height="40" rx="3" />
            <rect x="330" y="550" width="540" height="20" rx="2" />
            
            {/* Main Central Arch */}
            <path d="M 460 520 L 460 380 Q 600 240 740 380 L 740 520 Z" />
            {/* Inner Grand Archway */}
            <path d="M 500 520 L 500 400 Q 600 280 700 400 L 700 520 Z" fill="none" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" />
            
            {/* Central upper gallery */}
            <rect x="420" y="240" width="360" height="90" rx="4" />
            {/* Arched windows along upper gallery */}
            <path d="M 450 300 Q 470 270 490 300 Z" />
            <path d="M 510 300 Q 530 270 550 300 Z" />
            <path d="M 570 300 Q 600 260 630 300 Z" />
            <path d="M 650 300 Q 670 270 690 300 Z" />
            <path d="M 710 300 Q 730 270 750 300 Z" />
            
            {/* Balustrade jali work */}
            <line x1="420" y1="240" x2="780" y2="240" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2" />
            <line x1="420" y1="210" x2="780" y2="210" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" />
            
            {/* Minaret 1 (Far Left) */}
            <rect x="360" y="160" width="50" height="360" rx="3" />
            <rect x="350" y="150" width="70" height="15" rx="2" />
            <rect x="365" y="90" width="40" height="60" rx="2" />
            <path d="M 365 90 Q 385 40 405 90 Z" />
            <line x1="385" y1="40" x2="385" y2="20" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="2" />
            
            {/* Minaret 2 (Inner Left) */}
            <rect x="430" y="180" width="30" height="60" rx="2" />
            <path d="M 430 180 Q 445 150 460 180 Z" />
            
            {/* Central Clock / Crest */}
            <circle cx="600" cy="180" r="22" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="1.5" fill="none" />
            <circle cx="600" cy="180" r="4" fill="rgba(212, 175, 55, 0.4)" />
            <line x1="600" y1="180" x2="600" y2="165" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" />
            <line x1="600" y1="180" x2="612" y2="180" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" />
            
            {/* Minaret 3 (Inner Right) */}
            <rect x="740" y="180" width="30" height="60" rx="2" />
            <path d="M 740 180 Q 755 150 770 180 Z" />
            
            {/* Minaret 4 (Far Right) */}
            <rect x="790" y="160" width="50" height="360" rx="3" />
            <rect x="780" y="150" width="70" height="15" rx="2" />
            <rect x="795" y="90" width="40" height="60" rx="2" />
            <path d="M 795 90 Q 815 40 835 90 Z" />
            <line x1="815" y1="40" x2="815" y2="20" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="2" />
          </g>
        </svg>
      )
    },
    {
      id: 'golconda',
      name: 'Golconda Fort, Hyderabad — Diamond Citadel Heritage',
      svg: (
        <svg viewBox="0 0 1200 600" className="monument-svg" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="hydGoldGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E4C88A" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#9A7836" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g fill="url(#hydGoldGrad2)" stroke="rgba(212, 175, 55, 0.16)" strokeWidth="1.2">
            {/* Hillside outline */}
            <path d="M 100 580 Q 300 480 500 420 Q 650 360 800 450 Q 950 510 1100 580 Z" />
            {/* Bastions & Fortress Walls */}
            <path d="M 280 520 L 320 440 L 400 440 L 420 520 Z" />
            <path d="M 450 480 L 480 390 L 580 390 L 610 480 Z" />
            {/* Upper Bala Hissar Pavilion */}
            <rect x="520" y="280" width="160" height="90" rx="3" />
            {/* Arched windows */}
            <path d="M 540 330 Q 560 300 580 330 Z" />
            <path d="M 620 330 Q 640 300 660 330 Z" />
            {/* Royal Dome on Top */}
            <path d="M 560 280 Q 600 210 640 280 Z" />
            <line x1="600" y1="210" x2="600" y2="185" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="2" />
            {/* Grand acoustic entry arch */}
            <path d="M 330 540 Q 360 480 390 540 Z" fill="none" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" />
            {/* Watchtower */}
            <rect x="760" y="380" width="50" height="110" rx="3" />
            <path d="M 755 380 Q 785 340 815 380 Z" />
          </g>
        </svg>
      )
    },
    {
      id: 'chowmahalla',
      name: 'Chowmahalla Palace, Hyderabad — Royal Nizami Seat',
      svg: (
        <svg viewBox="0 0 1200 600" className="monument-svg" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="hydGoldGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#AA771C" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g fill="url(#hydGoldGrad3)" stroke="rgba(212, 175, 55, 0.18)" strokeWidth="1.2">
            {/* Palace Podium */}
            <rect x="200" y="510" width="800" height="50" rx="2" />
            <rect x="240" y="380" width="720" height="130" rx="3" />
            
            {/* Nizami Colonnade Arches */}
            {[280, 350, 420, 490, 560, 630, 700, 770, 840].map((x, i) => (
              <path key={i} d={`M ${x} 510 L ${x} 430 Q ${x + 25} 390 ${x + 50} 430 L ${x + 50} 510 Z`} fill="none" stroke="rgba(212, 175, 55, 0.22)" strokeWidth="1.4" />
            ))}

            {/* Central Grand Durbar Hall Pavilion */}
            <rect x="480" y="270" width="240" height="110" rx="4" />
            <path d="M 520 270 Q 600 170 680 270 Z" />
            <circle cx="600" cy="165" r="5" fill="rgba(212, 175, 55, 0.35)" />
            
            {/* Side cupolas */}
            <rect x="250" y="320" width="90" height="60" rx="2" />
            <path d="M 260 320 Q 295 260 330 320 Z" />
            <rect x="860" y="320" width="90" height="60" rx="2" />
            <path d="M 870 320 Q 905 260 940 320 Z" />
          </g>
        </svg>
      )
    },
    {
      id: 'falaknuma',
      name: 'Falaknuma Palace, Hyderabad — Mirror of the Sky',
      svg: (
        <svg viewBox="0 0 1200 600" className="monument-svg" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="hydGoldGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F3E5AB" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <g fill="url(#hydGoldGrad4)" stroke="rgba(212, 175, 55, 0.17)" strokeWidth="1.2">
            {/* Elevated Hillock Base */}
            <path d="M 150 580 Q 400 520 600 510 Q 800 520 1050 580 Z" />
            {/* Neoclassical Italian Marble Facade */}
            <rect x="280" y="420" width="640" height="100" rx="3" />
            
            {/* Grand Pediment */}
            <polygon points="460,350 600,240 740,350" fill="url(#hydGoldGrad4)" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1.5" />
            
            {/* Classical Columns */}
            {[480, 520, 560, 600, 640, 680, 720].map((x, i) => (
              <line key={i} x1={x} y1="350" x2={x} y2="420" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2.5" />
            ))}

            {/* Left & Right Wings with Balconies */}
            <rect x="290" y="370" width="160" height="50" rx="2" />
            <rect x="750" y="370" width="160" height="50" rx="2" />
            <line x1="290" y1="370" x2="450" y2="370" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2" />
            <line x1="750" y1="370" x2="910" y2="370" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="2" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        transition: 'opacity 1.5s ease-in-out'
      }}
    >
      {monuments.map((m, idx) => {
        const isCurrent = idx === activeMonument;
        return (
          <div
            key={m.id}
            title={m.name}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '1440px',
              height: '520px',
              opacity: isCurrent ? 1 : 0,
              transition: 'opacity 2.2s cubic-bezier(0.16, 1, 0.3, 1), transform 2.2s ease',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              filter: 'drop-shadow(0 0 35px rgba(212, 175, 55, 0.08))'
            }}
          >
            {m.svg}
          </div>
        );
      })}

      {/* Discrete heritage watermark indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '16px',
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(212, 175, 55, 0.35)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          zIndex: 1
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C5A059', display: 'inline-block', opacity: 0.6 }} />
        <span>{monuments[activeMonument].name}</span>
      </div>
    </div>
  );
};

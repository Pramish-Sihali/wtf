'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

// ============================================
// SNOWFALL EFFECT - Realistic multi-layer snow
// ============================================
const Snowfall = () => {
    const snowflakes = useMemo(() => {
        return [...Array(80)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 8 + 6,
            delay: Math.random() * -15,
            drift: Math.random() * 40 - 20,
            opacity: Math.random() * 0.6 + 0.4,
            blur: i % 5 === 0 ? 1 : 0, // Some flakes are blurry (depth)
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${flake.left}%`,
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                        filter: flake.blur ? 'blur(1px)' : 'none',
                        animation: `snowfall ${flake.duration}s linear infinite, snowDrift ${flake.duration / 2}s ease-in-out infinite`,
                        animationDelay: `${flake.delay}s, ${flake.delay}s`,
                        ['--drift' as any]: `${flake.drift}px`,
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// SKY WITH ANIMATED STARS (zoom effect on scroll)
// ============================================
const StarrySky = ({ scrollProgress }: { scrollProgress: number }) => {
    const stars = useMemo(() => {
        return [...Array(120)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 50,
            size: Math.random() * 2 + 0.5,
            twinkleDelay: Math.random() * 3,
            twinkleDuration: Math.random() * 2 + 1,
        }));
    }, []);

    // Stars zoom out as you scroll
    const starScale = 1 + scrollProgress * 2;
    const starOpacity = Math.max(0, 1 - scrollProgress * 1.5);

    return (
        <div
            className="absolute inset-0 overflow-hidden"
            style={{
                transform: `scale(${starScale})`,
                opacity: starOpacity,
                transformOrigin: 'center 40%',
            }}
        >
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        animation: `twinkle ${star.twinkleDuration}s ease-in-out infinite`,
                        animationDelay: `${star.twinkleDelay}s`,
                        boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255,255,255,0.3)`,
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// MOON WITH REALISTIC GLOW
// ============================================
const Moon = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            {/* Moon surface gradient */}
            <radialGradient id="moonSurface" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fdfbf7" />
                <stop offset="50%" stopColor="#f0ebe0" />
                <stop offset="100%" stopColor="#d4cfc2" />
            </radialGradient>
            {/* Inner glow */}
            <radialGradient id="moonInnerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stopColor="#fff" stopOpacity="0" />
                <stop offset="100%" stopColor="#ffeedd" stopOpacity="0.3" />
            </radialGradient>
            {/* Outer glow */}
            <radialGradient id="moonOuterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffeedd" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#ffcc99" stopOpacity="0.15" />
                <stop offset="70%" stopColor="#ffaa66" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ff8844" stopOpacity="0" />
            </radialGradient>
            {/* Blur filter for glow */}
            <filter id="moonBlur" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>
            <filter id="moonBlurSoft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
        </defs>

        {/* Large outer glow */}
        <circle cx="1100" cy="180" r="200" fill="url(#moonOuterGlow)" filter="url(#moonBlur)" />

        {/* Medium glow ring */}
        <circle cx="1100" cy="180" r="120" fill="url(#moonOuterGlow)" filter="url(#moonBlurSoft)" />

        {/* Moon body */}
        <circle cx="1100" cy="180" r="65" fill="url(#moonSurface)" />

        {/* Moon craters (subtle) */}
        <circle cx="1085" cy="165" r="12" fill="#d8d3c8" opacity="0.3" />
        <circle cx="1115" cy="195" r="8" fill="#d8d3c8" opacity="0.25" />
        <circle cx="1075" cy="190" r="6" fill="#d8d3c8" opacity="0.2" />
        <circle cx="1120" cy="160" r="5" fill="#d8d3c8" opacity="0.15" />

        {/* Inner highlight */}
        <circle cx="1100" cy="180" r="65" fill="url(#moonInnerGlow)" />
    </svg>
);

// ============================================
// SKY GRADIENT - Deep night to horizon
// ============================================
const SkyGradient = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a0a12" />
                <stop offset="20%" stopColor="#0d0d1a" />
                <stop offset="40%" stopColor="#141428" />
                <stop offset="55%" stopColor="#1a1a35" />
                <stop offset="70%" stopColor="#252545" />
                <stop offset="82%" stopColor="#3a3a5a" />
                <stop offset="92%" stopColor="#4a4a6a" />
                <stop offset="100%" stopColor="#5a5a7a" />
            </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#nightSky)" />
    </svg>
);

// ============================================
// POINTY MOUNTAIN LAYERS
// ============================================

// Layer 1 - Far distant peaks (lightest, haziest)
const MountainsFar = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4a4a6a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#5a5a7a" stopOpacity="0.4" />
            </linearGradient>
        </defs>
        <path
            fill="url(#mtnFar)"
            d="M0,900 L0,600
         L80,620 L120,520 L160,600
         L240,580 L300,450 L360,560
         L420,540 L480,420 L540,520
         L600,500 L680,380 L760,480
         L820,460 L900,350 L980,450
         L1040,430 L1120,340 L1200,420
         L1260,400 L1340,320 L1400,400
         L1440,380 L1440,900 Z"
        />
    </svg>
);

// Layer 2 - Mid-far peaks
const MountainsMidFar = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnMidFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3a3a55" />
                <stop offset="100%" stopColor="#454560" />
            </linearGradient>
        </defs>
        <path
            fill="url(#mtnMidFar)"
            d="M0,900 L0,550
         L60,570 L100,480 L140,550
         L200,520 L260,400 L320,500
         L380,470 L450,360 L520,460
         L580,430 L660,320 L740,420
         L800,390 L880,280 L960,380
         L1020,350 L1100,260 L1180,360
         L1240,330 L1320,240 L1380,340
         L1440,310 L1440,900 Z"
        />
    </svg>
);

// Layer 3 - Mid mountains with snow caps
const MountainsMid = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2a2a42" />
                <stop offset="100%" stopColor="#353550" />
            </linearGradient>
            <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ccccdd" stopOpacity="0.3" />
            </linearGradient>
        </defs>
        {/* Mountain body */}
        <path
            fill="url(#mtnMid)"
            d="M0,900 L0,500
         L50,520 L80,440 L110,500
         L180,460 L240,340 L300,440
         L360,400 L440,280 L520,400
         L580,360 L680,220 L780,360
         L840,320 L940,200 L1040,320
         L1100,280 L1200,180 L1300,300
         L1360,260 L1440,180 L1440,900 Z"
        />
        {/* Snow caps */}
        <path
            fill="url(#snowCap)"
            d="M240,340 L220,380 L260,370 L300,440 L280,400 L260,410 L240,340 Z
         M440,280 L420,320 L460,310 L520,400 L490,360 L460,370 L440,280 Z
         M680,220 L650,270 L700,260 L780,360 L740,310 L700,320 L680,220 Z
         M940,200 L910,250 L960,240 L1040,320 L1000,280 L960,290 L940,200 Z
         M1200,180 L1170,230 L1220,220 L1300,300 L1260,260 L1220,270 L1200,180 Z"
        />
    </svg>
);

// Layer 4 - Hills with detailed pine forest
const ForestHills = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="forestHill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e1e35" />
                <stop offset="100%" stopColor="#252540" />
            </linearGradient>
        </defs>
        {/* Hill base */}
        <path
            fill="url(#forestHill)"
            d="M0,900 L0,520
         L100,540 L180,480 L260,530
         L340,500 L440,420 L540,500
         L620,470 L720,400 L820,470
         L900,440 L1000,380 L1100,450
         L1180,420 L1280,360 L1380,430
         L1440,400 L1440,900 Z"
        />
        {/* Pine trees on ridgeline */}
        <g fill="#151528">
            {/* Detailed pine tree generator */}
            {[40, 90, 130, 180, 220, 280, 330, 390, 450, 510, 560, 620, 680, 740, 800, 860, 920, 980, 1050, 1120, 1180, 1250, 1320, 1390].map((x, i) => {
                const baseY = 520 - Math.sin((x + 200) * 0.008) * 80;
                const h = 35 + (i % 4) * 12;
                const w = 12 + (i % 3) * 4;
                return (
                    <path
                        key={i}
                        d={`M${x},${baseY}
                L${x + w / 2},${baseY - h * 0.35}
                L${x + w * 0.35},${baseY - h * 0.35}
                L${x + w / 2},${baseY - h * 0.6}
                L${x + w * 0.38},${baseY - h * 0.6}
                L${x + w / 2},${baseY - h * 0.85}
                L${x + w * 0.42},${baseY - h * 0.85}
                L${x + w / 2},${baseY - h}
                L${x + w * 0.58},${baseY - h * 0.85}
                L${x + w / 2},${baseY - h * 0.85}
                L${x + w * 0.62},${baseY - h * 0.6}
                L${x + w / 2},${baseY - h * 0.6}
                L${x + w * 0.65},${baseY - h * 0.35}
                L${x + w / 2},${baseY - h * 0.35}
                L${x + w},${baseY} Z`}
                    />
                );
            })}
        </g>
    </svg>
);

// Layer 5 - Dense forest treeline
const ForestDense = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="denseForest" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#121225" />
                <stop offset="100%" stopColor="#181830" />
            </linearGradient>
        </defs>
        {/* Forest base */}
        <path
            fill="url(#denseForest)"
            d="M0,900 L0,580
         L80,600 L160,550 L240,590
         L320,560 L420,500 L520,560
         L600,530 L720,470 L840,540
         L920,510 L1040,460 L1160,520
         L1240,490 L1360,440 L1440,480
         L1440,900 Z"
        />
        {/* Dense pine trees */}
        <g fill="#0d0d1a">
            {[...Array(60)].map((_, i) => {
                const x = i * 25 + (i % 3) * 8;
                const baseY = 580 - Math.sin((x + 100) * 0.006) * 60;
                const h = 50 + (i % 5) * 15;
                const w = 14 + (i % 3) * 5;
                return (
                    <path
                        key={i}
                        d={`M${x},${baseY}
                L${x + w * 0.5},${baseY - h * 0.3}
                L${x + w * 0.3},${baseY - h * 0.3}
                L${x + w * 0.5},${baseY - h * 0.55}
                L${x + w * 0.35},${baseY - h * 0.55}
                L${x + w * 0.5},${baseY - h * 0.8}
                L${x + w * 0.4},${baseY - h * 0.8}
                L${x + w * 0.5},${baseY - h}
                L${x + w * 0.6},${baseY - h * 0.8}
                L${x + w * 0.5},${baseY - h * 0.8}
                L${x + w * 0.65},${baseY - h * 0.55}
                L${x + w * 0.5},${baseY - h * 0.55}
                L${x + w * 0.7},${baseY - h * 0.3}
                L${x + w * 0.5},${baseY - h * 0.3}
                L${x + w},${baseY} Z`}
                    />
                );
            })}
        </g>
    </svg>
);

// Layer 6 - Foreground with large detailed trees
const Foreground = () => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="fgGround" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a0a15" />
                <stop offset="100%" stopColor="#0d0d1a" />
            </linearGradient>
        </defs>

        {/* Ground */}
        <path
            fill="url(#fgGround)"
            d="M0,900 L0,700
         L100,720 L200,680 L300,710
         L400,690 L500,660 L600,700
         L700,680 L800,650 L900,690
         L1000,670 L1100,640 L1200,680
         L1300,660 L1400,630 L1440,650
         L1440,900 Z"
        />

        {/* Large detailed pine tree - LEFT */}
        <g fill="#050510">
            <path d="M-40,900 L-40,450
               L20,520 L-10,520 L50,580 L10,580 L80,650
               L40,650 L100,720 L60,720 L120,780
               L80,780 L140,840 L100,840 L160,900 Z" />
            {/* Left branches */}
            <path d="M-10,520 L-80,480 L-60,500 L-100,470 L-70,510 L-10,520 Z" />
            <path d="M10,580 L-60,540 L-40,560 L-80,530 L-50,570 L10,580 Z" />
            <path d="M40,650 L-30,610 L-10,630 L-50,600 L-20,640 L40,650 Z" />
        </g>

        {/* Large detailed pine tree - RIGHT */}
        <g fill="#050510">
            <path d="M1480,900 L1480,420
               L1420,500 L1450,500 L1390,570 L1430,570 L1360,640
               L1400,640 L1340,710 L1380,710 L1320,780
               L1360,780 L1300,850 L1340,850 L1280,900 Z" />
            {/* Right branches */}
            <path d="M1450,500 L1520,460 L1500,480 L1540,450 L1510,490 L1450,500 Z" />
            <path d="M1430,570 L1500,530 L1480,550 L1520,520 L1490,560 L1430,570 Z" />
            <path d="M1400,640 L1470,600 L1450,620 L1490,590 L1460,630 L1400,640 Z" />
        </g>

        {/* Small foreground details */}
        <g fill="#08080f">
            {[200, 350, 500, 650, 800, 950, 1100, 1250].map((x, i) => {
                const y = 700 - (i % 3) * 15;
                return (
                    <path
                        key={i}
                        d={`M${x},${y} L${x + 8},${y - 25} L${x + 16},${y}
                M${x + 20},${y + 5} L${x + 26},${y - 20} L${x + 32},${y + 5}
                M${x + 10},${y + 10} L${x + 15},${y - 15} L${x + 20},${y + 10}`}
                    />
                );
            })}
        </g>
    </svg>
);

// ============================================
// SCROLL INDICATOR
// ============================================
const ScrollIndicator = ({ opacity }: { opacity: number }) => (
    <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-opacity duration-500"
        style={{ opacity }}
    >
        <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">
            Scroll
        </span>
        <div className="relative w-[18px] h-[28px] border border-white/20 rounded-full">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-[6px] bg-white/50 rounded-full animate-scrollPulse" />
        </div>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function ParallaxPortfolio() {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(800);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrollY(container.scrollTop);
                    ticking = false;
                });
                ticking = true;
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x: x * 12, y: y * 6 });
    };

    const totalHeight = windowHeight * 4;
    const scrollProgress = scrollY / (totalHeight - windowHeight);
    const heroOpacity = Math.max(0, 1 - scrollY / (windowHeight * 0.6));
    const heroScale = 1 + scrollY * 0.00015;

    // Parallax configurations - different speeds create depth
    const layers = [
        { speed: 0.02, mouseMultiplier: 0.15 },  // Moon
        { speed: 0.08, mouseMultiplier: 0.2 },   // Far mountains
        { speed: 0.12, mouseMultiplier: 0.3 },   // Mid-far mountains
        { speed: 0.2, mouseMultiplier: 0.4 },    // Mid mountains
        { speed: 0.32, mouseMultiplier: 0.55 },  // Forest hills
        { speed: 0.48, mouseMultiplier: 0.7 },   // Dense forest
        { speed: 0.65, mouseMultiplier: 0.9 },   // Foreground
    ];

    const LayerComponents = [Moon, MountainsFar, MountainsMidFar, MountainsMid, ForestHills, ForestDense, Foreground];

    return (
        <div className="w-full h-screen bg-[#0a0a12] overflow-hidden">
            <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10px) translateX(0); }
          100% { transform: translateY(100vh) translateX(var(--drift, 0)); }
        }
        @keyframes snowDrift {
          0%, 100% { margin-left: 0; }
          50% { margin-left: 15px; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
          50% { transform: translateX(-50%) translateY(8px); opacity: 0.2; }
        }
        .animate-scrollPulse {
          animation: scrollPulse 1.8s ease-in-out infinite;
        }
        .smooth-scroll {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* Snowfall overlay */}
            <Snowfall />

            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden smooth-scroll hide-scrollbar"
                onMouseMove={handleMouseMove}
            >
                {/* Fixed parallax container */}
                <div
                    className="fixed inset-0 overflow-hidden pointer-events-none"
                    style={{
                        transform: `scale(${heroScale})`,
                        transformOrigin: 'center 60%'
                    }}
                >
                    {/* Sky gradient */}
                    <div className="absolute inset-0">
                        <SkyGradient />
                    </div>

                    {/* Stars with zoom effect */}
                    <StarrySky scrollProgress={scrollProgress} />

                    {/* Parallax mountain/forest layers */}
                    {LayerComponents.map((LayerComponent, index) => {
                        const { speed, mouseMultiplier } = layers[index];
                        const yOffset = scrollY * speed;
                        const mouseX = mousePos.x * mouseMultiplier;
                        const mouseY = mousePos.y * mouseMultiplier * 0.5;

                        return (
                            <div
                                key={index}
                                className="absolute inset-0 will-change-transform"
                                style={{
                                    transform: `translate3d(${mouseX}px, ${yOffset + mouseY}px, 0)`,
                                    transition: 'transform 0.12s ease-out',
                                }}
                            >
                                <LayerComponent />
                            </div>
                        );
                    })}

                    {/* Seamless fog transition overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `linear-gradient(to top, 
                rgba(10, 10, 18, ${Math.min(1, scrollProgress * 2)}) 0%, 
                rgba(10, 10, 18, ${Math.min(0.85, scrollProgress * 1.5)}) 25%,
                rgba(10, 10, 18, ${Math.min(0.5, scrollProgress * 0.8)}) 50%,
                transparent 75%
              )`
                        }}
                    />
                </div>

                {/* Scrollable content */}
                <div style={{ height: totalHeight, position: 'relative' }}>

                    {/* Hero text content */}
                    <div
                        className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none"
                        style={{
                            opacity: heroOpacity,
                            transform: `translateY(${scrollY * 0.35}px) scale(${1 - scrollProgress * 0.1})`
                        }}
                    >
                        <h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight text-white mb-6 tracking-tight pointer-events-auto"
                            style={{
                                fontFamily: 'Georgia, "Palatino Linotype", serif',
                                textShadow: '0 0 80px rgba(255,255,255,0.15), 0 4px 30px rgba(0,0,0,0.5)',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Pramish Sihali
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl text-white/50 font-light tracking-[0.2em] uppercase pointer-events-auto"
                            style={{
                                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            Full-Stack Developer • AI Enthusiast
                        </p>
                    </div>

                    {/* Scroll indicator */}
                    <ScrollIndicator opacity={heroOpacity * 0.8} />

                    {/* Content sections - simple text only */}
                    <div
                        className="relative z-40"
                        style={{ marginTop: windowHeight * 1.5 }}
                    >
                        {/* About */}
                        <section
                            className="min-h-screen flex items-center justify-center px-8"
                            style={{
                                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.25) * 4)),
                                transform: `translateY(${Math.max(0, (0.4 - scrollProgress) * 200)}px)`
                            }}
                        >
                            <div className="max-w-3xl text-center">
                                <h2
                                    className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white mb-8 tracking-tight"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    About Me
                                </h2>
                                <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light">
                                    I craft digital experiences at the intersection of elegant design and powerful technology.
                                    Specializing in React, Next.js, TypeScript, and AI integration, I transform complex ideas
                                    into intuitive, performant applications that users love.
                                </p>
                            </div>
                        </section>

                        {/* Work */}
                        <section
                            className="min-h-screen flex items-center justify-center px-8"
                            style={{
                                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.5) * 4)),
                                transform: `translateY(${Math.max(0, (0.65 - scrollProgress) * 200)}px)`
                            }}
                        >
                            <div className="max-w-3xl text-center">
                                <h2
                                    className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white mb-8 tracking-tight"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    Featured Work
                                </h2>
                                <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light">
                                    From AI-powered research tools to real-time collaboration platforms,
                                    each project represents a unique challenge solved with clean code and thoughtful design.
                                    ResearchLens • ChatBot Builder • Meeting Minutes • And more.
                                </p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section
                            className="min-h-[70vh] flex items-center justify-center px-8"
                            style={{
                                opacity: Math.min(1, Math.max(0, (scrollProgress - 0.75) * 4)),
                                transform: `translateY(${Math.max(0, (0.85 - scrollProgress) * 200)}px)`
                            }}
                        >
                            <div className="max-w-3xl text-center">
                                <h2
                                    className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white mb-8 tracking-tight"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    Let's Connect
                                </h2>
                                <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light mb-10">
                                    Ready to bring your ideas to life? I'd love to hear about your next project.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="px-8 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/90 text-sm font-light hover:bg-white/20 transition-all duration-300">
                                        Get in Touch
                                    </button>
                                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm font-light hover:bg-white/10 hover:text-white/80 transition-all duration-300">
                                        View Resume
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="py-16 text-center">
                            <p className="text-white/30 text-xs tracking-widest uppercase">
                                © 2025 Pramish Sihali
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

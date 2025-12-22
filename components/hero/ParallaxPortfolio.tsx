'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// THEME CONFIGURATION
// ============================================
type Season = 'winter' | 'spring' | 'summer' | 'autumn';

interface ThemeColors {
    skyGradient: { stops: [string, string][] };
    moon: { surface: string; inner: string; outer: string; crater: string };
    stars: { color: string; glow: string };
    mountains: {
        far: [string, string];
        midFar: [string, string];
        mid: [string, string];
        snowCap: [string, string];
    };
    forest: {
        hills: [string, string];
        dense: [string, string];
        foreground: [string, string];
        treeDark: string;
        treeLight: string;
    };
    details: {
        text: string;
        textSub: string;
        background: string;
    };
}

const SEASON_THEMES: Record<Season, ThemeColors> = {
    winter: {
        skyGradient: {
            stops: [
                ['#0a0a12', '0%'], ['#0d0d1a', '20%'], ['#141428', '40%'],
                ['#1a1a35', '55%'], ['#252545', '70%'], ['#3a3a5a', '82%'],
                ['#4a4a6a', '92%'], ['#5a5a7a', '100%']
            ]
        },
        moon: {
            surface: '#f0ebe0', inner: '#ffeedd', outer: '#ffeedd', crater: '#d8d3c8'
        },
        stars: { color: '#ffffff', glow: 'rgba(255,255,255,0.3)' },
        mountains: {
            far: ['#4a4a6a', '#5a5a7a'],
            midFar: ['#3a3a55', '#454560'],
            mid: ['#2a2a42', '#353550'],
            snowCap: ['#ffffff', '#ccccdd']
        },
        forest: {
            hills: ['#1e1e35', '#252540'],
            dense: ['#121225', '#181830'],
            foreground: ['#0a0a15', '#0d0d1a'],
            treeDark: '#050510',
            treeLight: '#0d0d1a'
        },
        details: { text: '#ffffff', textSub: 'rgba(255,255,255,0.5)', background: '#0a0a12' }
    },
    spring: {
        skyGradient: {
            stops: [
                ['#2c3e50', '0%'], ['#4a6fa5', '30%'], ['#88aecf', '60%'],
                ['#d6a4a4', '80%'], ['#ffc3a0', '100%']
            ]
        },
        moon: {
            surface: '#fff9e6', inner: '#fff5d0', outer: '#ffcccc', crater: '#e6dec0'
        },
        stars: { color: '#fff0f5', glow: 'rgba(255,240,245,0.4)' },
        mountains: {
            far: ['#6e7f80', '#8fa3a4'],
            midFar: ['#536872', '#6b828e'],
            mid: ['#3e4e5e', '#506070'],
            snowCap: ['#e6eeff', '#d0d8ea'] // Less intense snow
        },
        forest: {
            hills: ['#2d4a3e', '#3a5c4d'], // Greenish tint
            dense: ['#1e362d', '#284238'],
            foreground: ['#11211b', '#1a3028'],
            treeDark: '#0b1612',
            treeLight: '#152922'
        },
        details: { text: '#f0f4f8', textSub: 'rgba(240,244,248,0.7)', background: '#1a1f2c' }
    },
    summer: {
        skyGradient: {
            stops: [
                ['#0f2027', '0%'], ['#203a43', '30%'], ['#2c5364', '50%'],
                ['#4ca1af', '80%'], ['#c4e0e5', '100%']
            ]
        },
        moon: {
            surface: '#fffae0', inner: '#fff0b0', outer: '#ffeb3b', crater: '#e6d8a0'
        },
        stars: { color: '#ffffd0', glow: 'rgba(255,255,200,0.5)' },
        mountains: {
            far: ['#2c3e50', 'rgba(44,62,80,0.8)'],
            midFar: ['#273c2c', '#354f3a'], // Green/Blue hue
            mid: ['#1e3323', '#2a422f'],
            snowCap: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)'] // Melting snow
        },
        forest: {
            hills: ['#1a4321', '#24552d'], // Lush green
            dense: ['#0f2e16', '#173d1f'],
            foreground: ['#081c0d', '#0d2613'],
            treeDark: '#041107',
            treeLight: '#0d2b14'
        },
        details: { text: '#e0f2f1', textSub: 'rgba(224,242,241,0.8)', background: '#081c0d' }
    },
    autumn: {
        skyGradient: {
            stops: [
                ['#23074d', '0%'], ['#5d1a58', '30%'], ['#9e2b52', '60%'],
                ['#cc5333', '85%'], ['#e18e47', '100%']
            ]
        },
        moon: {
            surface: '#ffebd9', inner: '#ffccaa', outer: '#ffaa66', crater: '#d9bb9e'
        },
        stars: { color: '#ffddaa', glow: 'rgba(255,180,100,0.4)' },
        mountains: {
            far: ['#4a2525', '#603535'], // Reddish brown
            midFar: ['#3e1e1e', '#522828'],
            mid: ['#331515', '#451e1e'],
            snowCap: ['#ffd0b0', '#ffaa80'] // Sunset reflection
        },
        forest: {
            hills: ['#421c02', '#592909'], // Brown/Orange
            dense: ['#301202', '#421a05'],
            foreground: ['#1f0a02', '#2b1005'],
            treeDark: '#120501',
            treeLight: '#2e1104'
        },
        details: { text: '#ffe0cc', textSub: 'rgba(255,224,204,0.7)', background: '#1f0a02' }
    }
};

// ============================================
// PARTICLE SYSTEM (Generalized)
// ============================================
const AtmosphericParticles = ({ season }: { season: Season }) => {
    const particles = useMemo(() => {
        const count = season === 'summer' ? 40 : 80; // Fewer fireflies
        return [...Array(count)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * (season === 'summer' ? 3 : 4) + 2,
            duration: Math.random() * 8 + 6,
            delay: Math.random() * -15,
            drift: Math.random() * 40 - 20,
            opacity: Math.random() * 0.6 + 0.4,
            blur: i % 5 === 0 ? 1 : 0,
        }));
    }, [season]);

    const getAnimation = () => {
        if (season === 'summer') return 'floatUp'; // Fireflies
        return 'fallDown'; // Snow, Rain, Leaves
    };

    const getParticleStyle = (flake: any) => {
        if (season === 'winter') return { borderRadius: '50%', background: '#fff' };
        if (season === 'spring') return { borderRadius: '50% 0 50% 0', background: '#ffd1dc', transform: 'rotate(45deg)' }; // Petals
        if (season === 'summer') return { borderRadius: '50%', background: '#fbff00', boxShadow: '0 0 4px #fbff00' }; // Fireflies
        if (season === 'autumn') return { borderRadius: '0', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', background: '#d35400' }; // Leaves
        return {};
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map((flake) => (
                <div
                    key={`${season}-${flake.id}`}
                    className="absolute"
                    style={{
                        ...getParticleStyle(flake),
                        left: `${flake.left}%`,
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                        filter: flake.blur ? 'blur(1px)' : 'none',
                        animation: `${getAnimation()} ${flake.duration}s linear infinite, drift ${flake.duration / 2}s ease-in-out infinite`,
                        animationDelay: `${flake.delay}s, ${flake.delay}s`,
                        ['--drift' as any]: `${flake.drift}px`,
                        ['--drift-y' as any]: season === 'summer' ? '-10px' : '100vh',
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// SVG COMPONENTS (Dynamic Themes)
// ============================================

const Moon = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <radialGradient id="moonSurface" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor={theme.moon.surface} />
                <stop offset="100%" stopColor={theme.moon.crater} />
            </radialGradient>
            <radialGradient id="moonOuterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.moon.outer} stopOpacity="0.4" />
                <stop offset="100%" stopColor={theme.moon.outer} stopOpacity="0" />
            </radialGradient>
            <filter id="moonBlur" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>
        </defs>
        <circle cx="1100" cy="180" r="200" fill="url(#moonOuterGlow)" filter="url(#moonBlur)" />
        <circle cx="1100" cy="180" r="65" fill="url(#moonSurface)" />
    </svg>
);

const SkyGradient = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full transition-all duration-1000">
        <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                {theme.skyGradient.stops.map((stop, i) => (
                    <stop key={i} offset={stop[1]} stopColor={stop[0]} className="transition-all duration-1000" />
                ))}
            </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#skyGrad)" />
    </svg>
);

const MountainsFar = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.far[0]} stopOpacity="0.6" className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.far[1]} stopOpacity="0.4" className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        <path fill="url(#mtnFar)" d="M0,900 L0,600 L80,620 L120,520 L160,600 L240,580 L300,450 L360,560 L420,540 L480,420 L540,520 L600,500 L680,380 L760,480 L820,460 L900,350 L980,450 L1040,430 L1120,340 L1200,420 L1260,400 L1340,320 L1400,400 L1440,380 L1440,900 Z" />
    </svg>
);

const MountainsMidFar = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnMidFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.midFar[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.midFar[1]} className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        <path fill="url(#mtnMidFar)" d="M0,900 L0,550 L60,570 L100,480 L140,550 L200,520 L260,400 L320,500 L380,470 L450,360 L520,460 L580,430 L660,320 L740,420 L800,390 L880,280 L960,380 L1020,350 L1100,260 L1180,360 L1240,330 L1320,240 L1380,340 L1440,310 L1440,900 Z" />
    </svg>
);

const MountainsMid = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.mid[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.mid[1]} className="transition-all duration-1000" />
            </linearGradient>
            <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.snowCap[0]} stopOpacity="0.9" className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.snowCap[1]} stopOpacity="0.3" className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        <path fill="url(#mtnMid)" d="M0,900 L0,500 L50,520 L80,440 L110,500 L180,460 L240,340 L300,440 L360,400 L440,280 L520,400 L580,360 L680,220 L780,360 L840,320 L940,200 L1040,320 L1100,280 L1200,180 L1300,300 L1360,260 L1440,180 L1440,900 Z" />
        <path fill="url(#snowCap)" d="M240,340 L220,380 L260,370 L300,440 L280,400 L260,410 L240,340 Z M440,280 L420,320 L460,310 L520,400 L490,360 L460,370 L440,280 Z M680,220 L650,270 L700,260 L780,360 L740,310 L700,320 L680,220 Z M940,200 L910,250 L960,240 L1040,320 L1000,280 L960,290 L940,200 Z M1200,180 L1170,230 L1220,220 L1300,300 L1260,260 L1220,270 L1200,180 Z" />
    </svg>
);

const ForestHills = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="forestHill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.forest.hills[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.forest.hills[1]} className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        <path fill="url(#forestHill)" d="M0,900 L0,520 L100,540 L180,480 L260,530 L340,500 L440,420 L540,500 L620,470 L720,400 L820,470 L900,440 L1000,380 L1100,450 L1180,420 L1280,360 L1380,430 L1440,400 L1440,900 Z" />
    </svg>
);

const ForestDense = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="denseForest" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.forest.dense[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.forest.dense[1]} className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        <path fill="url(#denseForest)" d="M0,900 L0,580 L80,600 L160,550 L240,590 L320,560 L420,500 L520,560 L600,530 L720,470 L840,540 L920,510 L1040,460 L1160,520 L1240,490 L1360,440 L1440,480 L1440,900 Z" />
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            {[...Array(60)].map((_, i) => {
                const x = i * 25 + (i % 3) * 8;
                const baseY = 580 - Math.sin((x + 100) * 0.006) * 60;
                const h = 50 + (i % 5) * 15;
                const w = 14 + (i % 3) * 5;
                return (
                    <path
                        key={i}
                        d={`M${x},${baseY} L${x + w * 0.5},${baseY - h * 0.3} L${x + w * 0.3},${baseY - h * 0.3} L${x + w * 0.5},${baseY - h * 0.55} L${x + w * 0.35},${baseY - h * 0.55} L${x + w * 0.5},${baseY - h * 0.8} L${x + w * 0.4},${baseY - h * 0.8} L${x + w * 0.5},${baseY - h} L${x + w * 0.6},${baseY - h * 0.8} L${x + w * 0.5},${baseY - h * 0.8} L${x + w * 0.65},${baseY - h * 0.55} L${x + w * 0.5},${baseY - h * 0.55} L${x + w * 0.7},${baseY - h * 0.3} L${x + w * 0.5},${baseY - h * 0.3} L${x + w},${baseY} Z`}
                    />
                );
            })}
        </g>
    </svg>
);

const Foreground = ({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="fgGround" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.forest.foreground[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.forest.foreground[1]} className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        <path fill="url(#fgGround)" d="M0,900 L0,700 L100,720 L200,680 L300,710 L400,690 L500,660 L600,700 L700,680 L800,650 L900,690 L1000,670 L1100,640 L1200,680 L1300,660 L1400,630 L1440,650 L1440,900 Z" />
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            <path d="M-40,900 L-40,450 L20,520 L-10,520 L50,580 L10,580 L80,650 L40,650 L100,720 L60,720 L120,780 L80,780 L140,840 L100,840 L160,900 Z" />
            <path d="M-10,520 L-80,480 L-60,500 L-100,470 L-70,510 L-10,520 Z" />
            <path d="M10,580 L-60,540 L-40,560 L-80,530 L-50,570 L10,580 Z" />
            <path d="M40,650 L-30,610 L-10,630 L-50,600 L-20,640 L40,650 Z" />
        </g>
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            <path d="M1480,900 L1480,420 L1420,500 L1450,500 L1390,570 L1430,570 L1360,640 L1400,640 L1340,710 L1380,710 L1320,780 L1360,780 L1300,850 L1340,850 L1280,900 Z" />
            <path d="M1450,500 L1520,460 L1500,480 L1540,450 L1510,490 L1450,500 Z" />
            <path d="M1430,570 L1500,530 L1480,550 L1520,520 L1490,560 L1430,570 Z" />
            <path d="M1400,640 L1470,600 L1450,620 L1490,590 L1460,630 L1400,640 Z" />
        </g>
    </svg>
);

const SeasonControls = ({ current, onChange }: { current: Season, onChange: (s: Season) => void }) => {
    const seasons: Season[] = ['winter', 'spring', 'summer', 'autumn'];

    return (
        <div className="fixed bottom-8 right-8 z-50 flex gap-2 bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10">
            {seasons.map((s) => (
                <button
                    key={s}
                    onClick={() => onChange(s)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${current === s
                            ? 'bg-white text-black shadow-lg scale-105 font-bold'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                >
                    {s}
                </button>
            ))}
        </div>
    );
};

export default function ParallaxPortfolio() {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(800);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [season, setSeason] = useState<Season>('winter');
    const containerRef = useRef<HTMLDivElement>(null);

    const theme = SEASON_THEMES[season];

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

    const layers = [
        { speed: 0.02, mouseMultiplier: 0.15 },
        { speed: 0.08, mouseMultiplier: 0.2 },
        { speed: 0.12, mouseMultiplier: 0.3 },
        { speed: 0.2, mouseMultiplier: 0.4 },
        { speed: 0.32, mouseMultiplier: 0.55 },
        { speed: 0.48, mouseMultiplier: 0.7 },
        { speed: 0.65, mouseMultiplier: 0.9 },
    ];

    return (
        <div
            className="w-full h-screen overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: theme.details.background }}
        >
            <style>{`
        @keyframes fallDown {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); }
          100% { transform: translateY(100vh) translateX(var(--drift, 0)) rotate(360deg); }
        }
        @keyframes floatUp {
          0% { transform: translateY(110vh) translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(var(--drift, 0)); opacity: 0; }
        }
        @keyframes drift {
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

            <SeasonControls current={season} onChange={setSeason} />
            <AtmosphericParticles season={season} />

            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden smooth-scroll hide-scrollbar"
                onMouseMove={handleMouseMove}
            >
                <div
                    className="fixed inset-0 overflow-hidden pointer-events-none"
                    style={{
                        transform: `scale(${heroScale})`,
                        transformOrigin: 'center 60%'
                    }}
                >
                    <div className="absolute inset-0">
                        <SkyGradient theme={theme} />
                    </div>

                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                            transform: `scale(${1 + scrollProgress * 2})`,
                            opacity: Math.max(0, 1 - scrollProgress * 1.5),
                            transformOrigin: 'center 40%',
                        }}
                    >
                        {[...Array(120)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 50}%`,
                                    width: 2 + Math.random(),
                                    height: 2 + Math.random(),
                                    backgroundColor: theme.stars.color,
                                    boxShadow: `0 0 6px ${theme.stars.glow}`,
                                    animation: `twinkle ${2 + Math.random()}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 3}s`,
                                }}
                            />
                        ))}
                    </div>

                    {[
                        Moon, MountainsFar, MountainsMidFar, MountainsMid, ForestHills, ForestDense, Foreground
                    ].map((LayerComponent, index) => {
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
                                <LayerComponent theme={theme} />
                            </div>
                        );
                    })}
                </div>

                <div style={{ height: totalHeight, position: 'relative' }}>
                    <div
                        className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none transition-colors duration-1000"
                        style={{
                            opacity: heroOpacity,
                            transform: `translateY(${scrollY * 0.35}px) scale(${1 - scrollProgress * 0.1})`
                        }}
                    >
                        <h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight mb-6 tracking-tight pointer-events-auto transition-colors duration-1000"
                            style={{
                                color: theme.details.text,
                                fontFamily: 'Georgia, "Palatino Linotype", serif',
                                textShadow: '0 0 80px rgba(255,255,255,0.15), 0 4px 30px rgba(0,0,0,0.5)',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Pramish Sihali
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase pointer-events-auto transition-colors duration-1000"
                            style={{
                                color: theme.details.textSub,
                                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            Full-Stack Developer • AI Enthusiast
                        </p>
                    </div>

                    <div
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-opacity duration-500"
                        style={{ opacity: heroOpacity * 0.8 }}
                    >
                        <span className="text-[10px] tracking-[0.4em] uppercase font-light transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                            Scroll
                        </span>
                        <div className="relative w-[18px] h-[28px] border rounded-full transition-colors duration-1000" style={{ borderColor: theme.details.textSub }}>
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-[6px] rounded-full animate-scrollPulse transition-colors duration-1000" style={{ backgroundColor: theme.details.text }} />
                        </div>
                    </div>

                    <div className="relative z-40 transition-colors duration-1000" style={{ marginTop: windowHeight * 1.5 }}>
                        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="max-w-3xl text-center">
                                <h2 className="text-4xl font-light mb-8 transition-colors duration-1000" style={{ color: theme.details.text }}>About Me</h2>
                                <p className="text-lg leading-relaxed transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                                    I craft digital experiences at the intersection of elegant design and powerful technology.
                                </p>
                            </div>
                        </section>
                        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="max-w-3xl text-center">
                                <h2 className="text-4xl font-light mb-8 transition-colors duration-1000" style={{ color: theme.details.text }}>Featured Work</h2>
                                <p className="text-lg leading-relaxed transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                                    ResearchLens • ChatBot Builder • Meeting Minutes
                                </p>
                            </div>
                        </section>
                        <footer className="py-16 text-center">
                            <p className="text-xs tracking-widest uppercase transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                                © 2025 Pramish Sihali
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}

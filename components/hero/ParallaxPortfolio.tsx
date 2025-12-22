'use client';

import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';

// ============================================
// THEME CONFIGURATION
// ============================================
type Season = 'winter' | 'spring' | 'summer' | 'autumn';

interface ThemeColors {
    skyGradient: { stops: [string, string][] };
    moon: { surface: string; inner: string; outer: string; crater: string; halo: string };
    stars: { color: string; glow: string; intensity: number };
    mountains: {
        far: [string, string];
        midFar: [string, string];
        mid: [string, string];
        snowCap: [string, string];
        accent: string;
    };
    forest: {
        hills: [string, string];
        dense: [string, string];
        foreground: [string, string];
        treeDark: string;
        treeLight: string;
        accent: string;
    };
    atmosphere: {
        mist: [string, string];
        overlay: string;
        aurora: boolean;
        auroraColors?: string[];
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
                ['#050510', '0%'], ['#0a0a18', '15%'], ['#0f0f22', '30%'],
                ['#15152e', '45%'], ['#1e1e3d', '58%'], ['#2a2a4d', '70%'],
                ['#3a3a5d', '82%'], ['#4a4a70', '92%'], ['#5a5a80', '100%']
            ]
        },
        moon: {
            surface: '#f5f0e5', inner: '#fff8ed', outer: '#e8e4dd', crater: '#c8c4bc', halo: 'rgba(200,210,255,0.15)'
        },
        stars: { color: '#ffffff', glow: 'rgba(200,220,255,0.5)', intensity: 1 },
        mountains: {
            far: ['#4a4a6a', '#5a5a7a'],
            midFar: ['#3a3a55', '#454560'],
            mid: ['#2a2a42', '#353550'],
            snowCap: ['#ffffff', '#d8d8e8'],
            accent: '#6a6a8a'
        },
        forest: {
            hills: ['#1e1e35', '#252540'],
            dense: ['#121225', '#181830'],
            foreground: ['#0a0a15', '#0d0d1a'],
            treeDark: '#050510',
            treeLight: '#0d0d1a',
            accent: '#2a2a45'
        },
        atmosphere: {
            mist: ['rgba(180,190,220,0.08)', 'rgba(180,190,220,0)'],
            overlay: 'rgba(100,120,180,0.03)',
            aurora: true,
            auroraColors: ['rgba(100,200,150,0.12)', 'rgba(80,150,200,0.1)', 'rgba(150,100,200,0.08)']
        },
        details: { text: '#ffffff', textSub: 'rgba(255,255,255,0.55)', background: '#050510' }
    },
    spring: {
        skyGradient: {
            stops: [
                ['#1a2a3a', '0%'], ['#2a4055', '20%'], ['#4a6a8a', '40%'],
                ['#7a9ab5', '60%'], ['#b5c5d5', '75%'], ['#e0c5b5', '88%'], ['#ffcaa0', '100%']
            ]
        },
        moon: {
            surface: '#fff9e8', inner: '#fff5d8', outer: '#ffe8d0', crater: '#e6dcc8', halo: 'rgba(255,200,180,0.12)'
        },
        stars: { color: '#fff5f0', glow: 'rgba(255,230,220,0.4)', intensity: 0.6 },
        mountains: {
            far: ['#6a7a7e', '#8a9ea0'],
            midFar: ['#4a5a62', '#5a707a'],
            mid: ['#3a4a55', '#4a5a68'],
            snowCap: ['#e8f0ff', '#d0dce8'],
            accent: '#7a8a90'
        },
        forest: {
            hills: ['#2a4538', '#3a5848'],
            dense: ['#1a3028', '#253d32'],
            foreground: ['#101f18', '#182a20'],
            treeDark: '#0a1410',
            treeLight: '#142520',
            accent: '#3a5545'
        },
        atmosphere: {
            mist: ['rgba(255,220,200,0.06)', 'rgba(255,220,200,0)'],
            overlay: 'rgba(255,200,180,0.02)',
            aurora: false
        },
        details: { text: '#f5f8fa', textSub: 'rgba(245,248,250,0.7)', background: '#151a22' }
    },
    summer: {
        skyGradient: {
            stops: [
                ['#0a1820', '0%'], ['#152832', '20%'], ['#1a3545', '35%'],
                ['#2a5060', '50%'], ['#4a8090', '68%'], ['#70a5b0', '82%'], ['#a0d0d8', '100%']
            ]
        },
        moon: {
            surface: '#fff8d8', inner: '#ffefb0', outer: '#ffe088', crater: '#e0d098', halo: 'rgba(255,230,150,0.15)'
        },
        stars: { color: '#ffffd8', glow: 'rgba(255,255,180,0.4)', intensity: 0.4 },
        mountains: {
            far: ['#2a3848', '#3a485a'],
            midFar: ['#1a3020', '#2a4230'],
            mid: ['#152818', '#203820'],
            snowCap: ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)'],
            accent: '#3a5848'
        },
        forest: {
            hills: ['#183820', '#205028'],
            dense: ['#0e2812', '#153518'],
            foreground: ['#081810', '#0e2015'],
            treeDark: '#040a05',
            treeLight: '#0e2012',
            accent: '#1a4020'
        },
        atmosphere: {
            mist: ['rgba(150,200,180,0.05)', 'rgba(150,200,180,0)'],
            overlay: 'rgba(100,180,160,0.02)',
            aurora: false
        },
        details: { text: '#e8f5f0', textSub: 'rgba(232,245,240,0.75)', background: '#061010' }
    },
    autumn: {
        skyGradient: {
            stops: [
                ['#180820', '0%'], ['#301030', '18%'], ['#501838', '35%'],
                ['#802040', '50%'], ['#a84035', '65%'], ['#c86030', '80%'], ['#e89050', '100%']
            ]
        },
        moon: {
            surface: '#fff0e0', inner: '#ffd8b8', outer: '#ffb888', crater: '#d8b898', halo: 'rgba(255,180,120,0.15)'
        },
        stars: { color: '#ffd8a8', glow: 'rgba(255,160,80,0.4)', intensity: 0.7 },
        mountains: {
            far: ['#402020', '#583030'],
            midFar: ['#351818', '#482020'],
            mid: ['#2a1212', '#3a1818'],
            snowCap: ['#ffc898', '#ff9868'],
            accent: '#604030'
        },
        forest: {
            hills: ['#381805', '#4a2508'],
            dense: ['#280e02', '#381505'],
            foreground: ['#180802', '#220c02'],
            treeDark: '#0e0402',
            treeLight: '#281008',
            accent: '#4a2810'
        },
        atmosphere: {
            mist: ['rgba(180,100,50,0.06)', 'rgba(180,100,50,0)'],
            overlay: 'rgba(150,80,40,0.03)',
            aurora: false
        },
        details: { text: '#ffe8d8', textSub: 'rgba(255,232,216,0.7)', background: '#120605' }
    }
};

// ============================================
// SEEDED RANDOM FOR CONSISTENT GENERATION
// ============================================
const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};

// ============================================
// PARTICLE SYSTEM (Optimized)
// ============================================
const AtmosphericParticles = memo(function AtmosphericParticles({ season }: { season: Season }) {
    const particles = useMemo(() => {
        const count = season === 'summer' ? 35 : 60;
        return [...Array(count)].map((_, i) => ({
            id: i,
            left: seededRandom(i * 7.3) * 100,
            size: seededRandom(i * 3.7) * (season === 'summer' ? 2.5 : 3) + 1.5,
            duration: seededRandom(i * 5.1) * 10 + 8,
            delay: seededRandom(i * 2.9) * -20,
            drift: seededRandom(i * 4.3) * 30 - 15,
            opacity: seededRandom(i * 6.1) * 0.4 + 0.3,
            blur: i % 6 === 0,
            rotation: seededRandom(i * 8.7) * 360,
        }));
    }, [season]);

    const getParticleStyle = useCallback((p: typeof particles[0]) => {
        switch (season) {
            case 'winter':
                return {
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #fff, #e8e8f0)',
                    boxShadow: '0 0 2px rgba(255,255,255,0.5)'
                };
            case 'spring':
                return {
                    borderRadius: '50% 10% 50% 10%',
                    background: `linear-gradient(135deg, #ffd8e0 0%, #ffb8c8 100%)`,
                    transform: `rotate(${p.rotation}deg)`
                };
            case 'summer':
                return {
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffa0 0%, #c8ff00 100%)',
                    boxShadow: '0 0 6px 2px rgba(200,255,100,0.6)'
                };
            case 'autumn':
                const colors = ['#d85000', '#c04000', '#a03000', '#e06820'];
                return {
                    borderRadius: '2px 8px 2px 8px',
                    background: colors[p.id % colors.length],
                    transform: `rotate(${p.rotation}deg)`
                };
            default:
                return {};
        }
    }, [season]);

    const animation = season === 'summer' ? 'floatUp' : 'fallDown';

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden will-change-transform">
            {particles.map((p) => (
                <div
                    key={`${season}-${p.id}`}
                    className="absolute"
                    style={{
                        ...getParticleStyle(p),
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size * (season === 'autumn' ? 1.4 : 1),
                        opacity: p.opacity,
                        filter: p.blur ? 'blur(0.5px)' : 'none',
                        animation: `${animation} ${p.duration}s linear infinite, drift ${p.duration * 0.6}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s, ${p.delay}s`,
                        ['--drift' as any]: `${p.drift}px`,
                    }}
                />
            ))}
        </div>
    );
});

// ============================================
// SVG COMPONENTS (Refined & Memoized)
// ============================================

const Moon = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <radialGradient id="moonSurface" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor={theme.moon.inner} className="transition-all duration-1000" />
                <stop offset="40%" stopColor={theme.moon.surface} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.moon.crater} className="transition-all duration-1000" />
            </radialGradient>
            <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.moon.halo} className="transition-all duration-1000" />
                <stop offset="60%" stopColor={theme.moon.halo} stopOpacity="0.3" className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.moon.halo} stopOpacity="0" className="transition-all duration-1000" />
            </radialGradient>
            <radialGradient id="moonInnerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stopColor={theme.moon.outer} stopOpacity="0" className="transition-all duration-1000" />
                <stop offset="95%" stopColor={theme.moon.outer} stopOpacity="0.15" className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.moon.outer} stopOpacity="0" className="transition-all duration-1000" />
            </radialGradient>
            <filter id="moonBlur" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
            </filter>
            <filter id="craterShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
        </defs>
        <circle cx="1120" cy="160" r="180" fill="url(#moonHalo)" filter="url(#moonBlur)" />
        <circle cx="1120" cy="160" r="58" fill="url(#moonSurface)" />
        <g opacity="0.15" filter="url(#craterShadow)">
            <ellipse cx="1105" cy="145" rx="8" ry="7" fill={theme.moon.crater} className="transition-all duration-1000" />
            <ellipse cx="1135" cy="155" rx="5" ry="4.5" fill={theme.moon.crater} className="transition-all duration-1000" />
            <ellipse cx="1115" cy="175" rx="6" ry="5" fill={theme.moon.crater} className="transition-all duration-1000" />
            <ellipse cx="1128" cy="140" rx="4" ry="3.5" fill={theme.moon.crater} className="transition-all duration-1000" />
            <ellipse cx="1100" cy="165" rx="3" ry="2.5" fill={theme.moon.crater} className="transition-all duration-1000" />
        </g>
        <circle cx="1120" cy="160" r="58" fill="url(#moonInnerGlow)" />
    </svg>
));
Moon.displayName = 'Moon';

const SkyGradient = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                {theme.skyGradient.stops.map((stop, i) => (
                    <stop key={i} offset={stop[1]} stopColor={stop[0]} className="transition-all duration-1000" />
                ))}
            </linearGradient>
            {/* Subtle noise texture overlay */}
            <filter id="skyNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise" />
                <feColorMatrix type="saturate" values="0" />
                <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
            </filter>
        </defs>
        <rect width="1440" height="900" fill="url(#skyGrad)" />
        <rect width="1440" height="900" fill={theme.atmosphere.overlay} className="transition-all duration-1000" />
    </svg>
));

// Aurora effect for winter
const Aurora = memo(({ theme }: { theme: ThemeColors }) => {
    if (!theme.atmosphere.aurora || !theme.atmosphere.auroraColors) return null;
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
            <defs>
                <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={theme.atmosphere.auroraColors[0]} />
                    <stop offset="50%" stopColor={theme.atmosphere.auroraColors[1]} />
                    <stop offset="100%" stopColor={theme.atmosphere.auroraColors[2]} />
                </linearGradient>
                <filter id="auroraBlur">
                    <feGaussianBlur stdDeviation="20" />
                </filter>
            </defs>
            <g filter="url(#auroraBlur)" opacity="0.6">
                <ellipse cx="400" cy="180" rx="350" ry="80" fill="url(#aurora1)" style={{ animation: 'auroraPulse 8s ease-in-out infinite' }} />
                <ellipse cx="900" cy="140" rx="280" ry="60" fill="url(#aurora1)" style={{ animation: 'auroraPulse 10s ease-in-out infinite 2s' }} />
                <ellipse cx="1200" cy="200" rx="200" ry="50" fill="url(#aurora1)" style={{ animation: 'auroraPulse 7s ease-in-out infinite 4s' }} />
            </g>
        </svg>
    );
});

// Mist layer that varies by season
const MistLayer = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.atmosphere.mist[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.atmosphere.mist[1]} className="transition-all duration-1000" />
            </linearGradient>
            <filter id="mistBlur">
                <feGaussianBlur stdDeviation="30" />
            </filter>
        </defs>
        <ellipse cx="200" cy="650" rx="400" ry="120" fill="url(#mistGrad)" filter="url(#mistBlur)" />
        <ellipse cx="800" cy="700" rx="500" ry="100" fill="url(#mistGrad)" filter="url(#mistBlur)" />
        <ellipse cx="1300" cy="620" rx="350" ry="90" fill="url(#mistGrad)" filter="url(#mistBlur)" />
    </svg>
));

const MountainsFar = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.far[0]} stopOpacity="0.65" className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.far[1]} stopOpacity="0.45" className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        {/* Refined mountain silhouette with natural ridges */}
        <path fill="url(#mtnFar)" d="M0,900 L0,620 Q40,610 60,630 Q80,600 100,540 Q115,560 130,520 Q150,550 170,580 Q190,560 210,590 Q240,550 270,480 Q290,510 310,470 Q340,500 360,540 Q390,510 420,480 Q450,500 470,440 Q490,470 510,420 Q540,460 560,400 Q590,440 620,380 Q660,420 700,350 Q740,390 770,420 Q800,380 830,440 Q860,400 890,340 Q930,380 960,420 Q990,380 1020,320 Q1060,370 1100,300 Q1140,350 1180,280 Q1220,330 1260,360 Q1290,320 1320,280 Q1360,320 1400,350 Q1420,330 1440,360 L1440,900 Z" />
    </svg>
));

const MountainsMidFar = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnMidFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.midFar[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.midFar[1]} className="transition-all duration-1000" />
            </linearGradient>
            <linearGradient id="mtnMidFarShadow" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
            </linearGradient>
        </defs>
        {/* Main range with varied peaks */}
        <path fill="url(#mtnMidFar)" d="M0,900 L0,560 Q30,550 50,580 Q70,540 90,500 Q110,530 130,480 Q160,510 180,450 Q210,490 240,420 Q280,470 310,400 Q350,450 380,380 Q420,430 460,350 Q510,410 550,320 Q600,380 640,290 Q690,360 730,400 Q770,360 810,300 Q860,360 900,280 Q950,340 990,260 Q1040,320 1080,240 Q1130,300 1170,220 Q1220,280 1260,200 Q1310,260 1350,280 Q1390,250 1440,220 L1440,900 Z" />
        {/* Shadow side detail */}
        <path fill="url(#mtnMidFarShadow)" d="M460,350 Q490,380 510,410 L510,320 Q485,340 460,350 Z M900,280 Q930,310 950,340 L950,260 Q925,270 900,280 Z M1170,220 Q1200,250 1220,280 L1220,200 Q1195,210 1170,220 Z" opacity="0.4" />
    </svg>
));

const MountainsMid = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="mtnMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.mid[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.mid[1]} className="transition-all duration-1000" />
            </linearGradient>
            <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.mountains.snowCap[0]} stopOpacity="0.95" className="transition-all duration-1000" />
                <stop offset="50%" stopColor={theme.mountains.snowCap[1]} stopOpacity="0.5" className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.mountains.snowCap[1]} stopOpacity="0.1" className="transition-all duration-1000" />
            </linearGradient>
            <linearGradient id="mtnShadow" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
            </linearGradient>
        </defs>
        {/* Detailed main range */}
        <path fill="url(#mtnMid)" d="M0,900 L0,520 Q25,510 45,540 Q60,500 80,460 Q100,490 120,440 Q150,480 175,400 Q210,450 240,360 Q280,420 310,340 Q360,400 400,300 Q450,370 490,280 Q550,350 590,260 Q650,330 700,220 Q760,300 810,350 Q850,310 890,260 Q940,320 980,240 Q1030,300 1070,200 Q1120,270 1160,180 Q1210,250 1250,300 Q1290,260 1330,220 Q1380,270 1440,200 L1440,900 Z" />
        {/* Ridge details */}
        <path fill={theme.mountains.accent} d="M700,220 Q720,240 740,280 Q760,260 780,300 L810,350 Q790,320 770,340 Q750,310 730,340 Q710,290 700,220 Z" opacity="0.3" className="transition-all duration-1000" />
        {/* Refined snow caps with natural flow */}
        <path fill="url(#snowCap)" d="M240,360 Q230,380 225,400 Q240,395 250,405 Q260,390 275,410 L310,340 Q295,360 280,370 Q265,355 250,365 Q240,355 240,360 Z" />
        <path fill="url(#snowCap)" d="M490,280 Q480,300 475,330 Q490,325 500,340 Q510,320 525,345 L590,260 Q575,285 560,295 Q545,275 530,290 Q515,270 490,280 Z" />
        <path fill="url(#snowCap)" d="M700,220 Q685,250 680,280 Q695,275 710,295 Q720,270 740,300 L810,350 Q795,320 775,340 Q760,310 745,330 Q725,290 710,310 Q695,260 700,220 Z" />
        <path fill="url(#snowCap)" d="M980,240 Q965,270 960,300 Q975,295 990,315 Q1000,290 1020,320 L1070,200 Q1055,235 1040,250 Q1025,225 1010,245 Q995,220 980,240 Z" />
        <path fill="url(#snowCap)" d="M1160,180 Q1145,210 1140,245 Q1155,240 1170,265 Q1185,235 1205,270 L1250,300 Q1235,270 1215,290 Q1200,255 1185,280 Q1170,240 1160,180 Z" />
        {/* Shadow sides */}
        <path fill="url(#mtnShadow)" d="M700,220 L680,280 L700,350 L810,350 L780,300 L750,280 L700,220 Z" opacity="0.25" />
    </svg>
));

// Generate organic tree shapes
const generateTree = (x: number, baseY: number, height: number, width: number, seed: number) => {
    const r = (n: number) => seededRandom(seed + n);
    const w = width;
    const h = height;

    // Create a more natural conifer shape with random variations
    const layers = 4 + Math.floor(r(1) * 2);
    let path = `M${x + w * 0.5},${baseY - h}`; // Top point

    for (let i = 0; i < layers; i++) {
        const progress = (i + 1) / layers;
        const layerWidth = w * (0.3 + progress * 0.7) * (0.9 + r(i * 2) * 0.2);
        const yPos = baseY - h * (1 - progress * 0.85);
        const inset = layerWidth * (0.15 + r(i * 3) * 0.1);

        path += ` L${x + w * 0.5 + layerWidth * 0.5},${yPos}`;
        path += ` L${x + w * 0.5 + inset},${yPos + h * 0.05}`;
    }

    path += ` L${x + w * 0.5},${baseY}`;

    for (let i = layers - 1; i >= 0; i--) {
        const progress = (i + 1) / layers;
        const layerWidth = w * (0.3 + progress * 0.7) * (0.9 + r(i * 2) * 0.2);
        const yPos = baseY - h * (1 - progress * 0.85);
        const inset = layerWidth * (0.15 + r(i * 3) * 0.1);

        path += ` L${x + w * 0.5 - inset},${yPos + h * 0.05}`;
        path += ` L${x + w * 0.5 - layerWidth * 0.5},${yPos}`;
    }

    path += ' Z';
    return path;
};

const ForestHills = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="forestHill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.forest.hills[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.forest.hills[1]} className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        {/* Rolling hills with smooth curves */}
        <path fill="url(#forestHill)" d="M0,900 L0,540 Q50,530 100,550 Q150,520 200,500 Q260,530 320,480 Q380,510 440,450 Q520,500 600,440 Q680,480 760,420 Q840,460 920,400 Q1000,450 1080,380 Q1160,430 1240,370 Q1320,420 1400,380 Q1420,400 1440,420 L1440,900 Z" />
    </svg>
));

const ForestDense = memo(({ theme }: { theme: ThemeColors }) => {
    const trees = useMemo(() => {
        return [...Array(45)].map((_, i) => {
            const x = i * 32 + seededRandom(i * 4.7) * 15 - 5;
            const baseY = 600 - Math.sin((x + 80) * 0.005) * 80;
            const h = 45 + seededRandom(i * 2.3) * 40;
            const w = 12 + seededRandom(i * 3.1) * 8;
            return { x, baseY, h, w, seed: i * 7.9 };
        });
    }, []);

    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
            <defs>
                <linearGradient id="denseForest" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.forest.dense[0]} className="transition-all duration-1000" />
                    <stop offset="100%" stopColor={theme.forest.dense[1]} className="transition-all duration-1000" />
                </linearGradient>
            </defs>
            {/* Undulating forest floor */}
            <path fill="url(#denseForest)" d="M0,900 L0,600 Q60,590 120,610 Q180,580 240,560 Q320,590 400,540 Q480,580 560,520 Q660,570 760,500 Q860,550 960,480 Q1060,530 1160,470 Q1260,520 1360,460 Q1400,490 1440,500 L1440,900 Z" />
            {/* Dense treeline with organic shapes */}
            <g fill={theme.forest.treeDark} className="transition-all duration-1000">
                {trees.map((t, i) => (
                    <path key={i} d={generateTree(t.x, t.baseY, t.h, t.w, t.seed)} opacity={0.85 + seededRandom(i * 1.3) * 0.15} />
                ))}
            </g>
            {/* Accent trees for depth */}
            <g fill={theme.forest.accent} className="transition-all duration-1000" opacity="0.3">
                {trees.filter((_, i) => i % 4 === 0).map((t, i) => (
                    <path key={i} d={generateTree(t.x + 3, t.baseY, t.h * 0.85, t.w * 0.8, t.seed + 100)} />
                ))}
            </g>
        </svg>
    );
});

const Foreground = memo(({ theme }: { theme: ThemeColors }) => (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
            <linearGradient id="fgGround" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.forest.foreground[0]} className="transition-all duration-1000" />
                <stop offset="100%" stopColor={theme.forest.foreground[1]} className="transition-all duration-1000" />
            </linearGradient>
        </defs>
        {/* Smooth foreground terrain */}
        <path fill="url(#fgGround)" d="M0,900 L0,720 Q80,710 160,730 Q240,700 320,680 Q420,710 520,670 Q620,700 720,660 Q820,690 920,650 Q1020,680 1120,640 Q1220,670 1320,630 Q1380,660 1440,650 L1440,900 Z" />

        {/* Left large tree with detailed branches */}
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            {/* Trunk and main foliage */}
            <path d="M-30,900 L-30,480 Q-5,520 30,490 Q10,490 45,530 Q20,520 60,560 Q35,550 75,600 Q50,585 90,640 Q65,620 105,680 Q80,660 120,730 Q95,710 135,780 Q110,760 150,830 Q125,810 165,880 L165,900 Z" />
            {/* Branch details */}
            <path d="M30,490 Q-20,460 -45,440 Q-25,450 -50,430 Q-20,460 30,490 Z" opacity="0.9" />
            <path d="M45,530 Q-10,500 -40,480 Q-15,495 -45,475 Q-5,505 45,530 Z" opacity="0.9" />
            <path d="M60,560 Q5,535 -30,515 Q0,530 -35,510 Q10,545 60,560 Z" opacity="0.85" />
        </g>

        {/* Right large tree */}
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            <path d="M1470,900 L1470,450 Q1445,490 1410,460 Q1430,465 1395,505 Q1420,495 1380,545 Q1405,530 1365,585 Q1390,570 1350,625 Q1375,610 1335,670 Q1360,655 1320,715 Q1345,700 1305,770 Q1330,755 1290,830 Q1315,815 1275,900 L1275,900 Z" />
            <path d="M1410,460 Q1465,430 1490,405 Q1470,420 1495,395 Q1460,435 1410,460 Z" opacity="0.9" />
            <path d="M1395,505 Q1455,470 1480,445 Q1455,465 1485,435 Q1450,480 1395,505 Z" opacity="0.9" />
        </g>

        {/* Small foreground bushes */}
        <g fill={theme.forest.treeDark} className="transition-all duration-1000" opacity="0.7">
            <ellipse cx="250" cy="750" rx="40" ry="25" />
            <ellipse cx="600" cy="730" rx="35" ry="20" />
            <ellipse cx="1000" cy="720" rx="45" ry="22" />
        </g>
    </svg>
));

const SeasonControls = memo(({ current, onChange }: { current: Season, onChange: (s: Season) => void }) => {
    const seasons: Season[] = ['winter', 'spring', 'summer', 'autumn'];
    const icons: Record<Season, string> = {
        winter: '❄',
        spring: '❀',
        summer: '☀',
        autumn: '🍂'
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex gap-1.5 bg-black/25 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            {seasons.map((s) => (
                <button
                    key={s}
                    onClick={() => onChange(s)}
                    className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${current === s
                            ? 'bg-white/90 text-black shadow-lg scale-105 font-medium'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                        }`}
                    title={s}
                >
                    <span className="text-sm">{icons[s]}</span>
                    <span className="hidden sm:inline">{s}</span>
                </button>
            ))}
        </div>
    );
});

// Stars component with seeded randomness for consistency
const Stars = memo(({ theme, scrollProgress }: { theme: ThemeColors, scrollProgress: number }) => {
    const stars = useMemo(() => {
        return [...Array(100)].map((_, i) => ({
            id: i,
            left: seededRandom(i * 3.7) * 100,
            top: seededRandom(i * 5.3) * 50,
            size: 1.5 + seededRandom(i * 2.1) * 1.5,
            duration: 2.5 + seededRandom(i * 4.9) * 2,
            delay: seededRandom(i * 6.1) * 4,
            brightness: 0.4 + seededRandom(i * 1.7) * 0.6,
        }));
    }, []);

    return (
        <div
            className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
            style={{
                transform: `scale(${1 + scrollProgress * 1.5})`,
                opacity: Math.max(0, (1 - scrollProgress * 1.2) * theme.stars.intensity),
                transformOrigin: 'center 40%',
            }}
        >
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: star.size,
                        height: star.size,
                        backgroundColor: theme.stars.color,
                        boxShadow: `0 0 ${4 + star.size}px ${theme.stars.glow}`,
                        opacity: star.brightness,
                        animation: `twinkle ${star.duration}s ease-in-out infinite`,
                        animationDelay: `${star.delay}s`,
                    }}
                />
            ))}
        </div>
    );
});

export default function ParallaxPortfolio() {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(800);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [season, setSeason] = useState<Season>('winter');
    const containerRef = useRef<HTMLDivElement>(null);
    const tickingRef = useRef(false);

    const theme = SEASON_THEMES[season];

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (!tickingRef.current) {
                requestAnimationFrame(() => {
                    setScrollY(container.scrollTop);
                    tickingRef.current = false;
                });
                tickingRef.current = true;
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x: x * 10, y: y * 5 });
    }, []);

    const totalHeight = windowHeight * 4;
    const scrollProgress = scrollY / (totalHeight - windowHeight);
    const heroOpacity = Math.max(0, 1 - scrollY / (windowHeight * 0.6));
    const heroScale = 1 + scrollY * 0.00012;

    const layers = useMemo(() => [
        { speed: 0.02, mouseMultiplier: 0.12 },
        { speed: 0.06, mouseMultiplier: 0.18 },
        { speed: 0.1, mouseMultiplier: 0.25 },
        { speed: 0.16, mouseMultiplier: 0.35 },
        { speed: 0.28, mouseMultiplier: 0.5 },
        { speed: 0.42, mouseMultiplier: 0.65 },
        { speed: 0.58, mouseMultiplier: 0.85 },
    ], []);

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
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(var(--drift, 0)); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { margin-left: 0; }
          50% { margin-left: 12px; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes auroraPulse {
          0%, 100% { opacity: 0.3; transform: scaleX(1) translateY(0); }
          25% { opacity: 0.5; transform: scaleX(1.1) translateY(-5px); }
          50% { opacity: 0.4; transform: scaleX(0.95) translateY(5px); }
          75% { opacity: 0.6; transform: scaleX(1.05) translateY(-3px); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 0.25; }
        }
        .animate-scrollPulse {
          animation: scrollPulse 2s ease-in-out infinite;
        }
        .smooth-scroll {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .gpu-layer {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
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
                    {/* Sky gradient base */}
                    <div className="absolute inset-0 gpu-layer">
                        <SkyGradient theme={theme} />
                    </div>

                    {/* Stars with seeded positions */}
                    <Stars theme={theme} scrollProgress={scrollProgress} />

                    {/* Aurora effect (winter only) */}
                    <div className="absolute inset-0 gpu-layer" style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}>
                        <Aurora theme={theme} />
                    </div>

                    {/* Parallax layers */}
                    {[
                        Moon, MountainsFar, MountainsMidFar, MountainsMid, ForestHills, ForestDense, Foreground
                    ].map((LayerComponent, index) => {
                        const { speed, mouseMultiplier } = layers[index];
                        const yOffset = scrollY * speed;
                        const mouseX = mousePos.x * mouseMultiplier;
                        const mouseY = mousePos.y * mouseMultiplier * 0.4;

                        return (
                            <div
                                key={index}
                                className="absolute inset-0 will-change-transform gpu-layer"
                                style={{
                                    transform: `translate3d(${mouseX}px, ${yOffset + mouseY}px, 0)`,
                                    transition: 'transform 0.1s ease-out',
                                }}
                            >
                                <LayerComponent theme={theme} />
                            </div>
                        );
                    })}

                    {/* Atmospheric mist layer */}
                    <div
                        className="absolute inset-0 gpu-layer pointer-events-none"
                        style={{
                            transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
                            opacity: 0.7
                        }}
                    >
                        <MistLayer theme={theme} />
                    </div>
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

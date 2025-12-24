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
                ['#1a1a2e', '0%'], ['#2d2d5a', '12%'], ['#4a3a6a', '25%'],
                ['#6b4a7a', '38%'], ['#8b5a8a', '48%'], ['#c77b95', '60%'],
                ['#e8a0aa', '72%'], ['#f5c4c8', '84%'], ['#ffdde1', '100%']
            ]
        },
        moon: {
            surface: '#fff0f5', inner: '#ffe8ef', outer: '#ffd0dd', crater: '#e8c0cc', halo: 'rgba(255,180,200,0.15)'
        },
        stars: { color: '#fff0f5', glow: 'rgba(255,200,220,0.5)', intensity: 0.5 },
        mountains: {
            far: ['#5a5a70', '#7a7a90'],
            midFar: ['#4a4a60', '#6a6a80'],
            mid: ['#3a3a50', '#5a5a70'],
            snowCap: ['#ffffff', '#f0f0f8'],
            accent: '#8a8a9a'
        },
        forest: {
            hills: ['#3a7050', '#4a9060'],
            dense: ['#2a5540', '#3a7550'],
            foreground: ['#1a4030', '#2a5540'],
            treeDark: '#153525',
            treeLight: '#2a5540',
            accent: '#5aaa70'
        },
        atmosphere: {
            mist: ['rgba(255,192,203,0.15)', 'rgba(255,192,203,0)'],
            overlay: 'rgba(255,182,193,0.08)',
            aurora: false
        },
        details: { text: '#fff5f7', textSub: 'rgba(255,245,247,0.75)', background: '#1a1a28' }
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
                const pinkShades = ['#ff85a2', '#ff6b8a', '#ff9eb5', '#ffb6c1'];
                return {
                    borderRadius: '50% 0% 50% 0%',
                    background: `linear-gradient(135deg, ${pinkShades[p.id % pinkShades.length]} 0%, #ffccd5 100%)`,
                    boxShadow: '0 0 4px rgba(255,105,135,0.4)',
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

// Calculate moon phase (0-1) based on lunar cycle (~29.5 days)
const getMoonPhase = () => {
    const knownNewMoon = new Date('2024-01-11').getTime(); // Known new moon date
    const lunarCycle = 29.53058867; // Days in lunar cycle
    const now = Date.now();
    const daysSinceNew = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    return (daysSinceNew % lunarCycle) / lunarCycle;
};

const Moon = memo(({ theme }: { theme: ThemeColors }) => {
    const phase = useMemo(() => getMoonPhase(), []);

    // Phase determines shadow position: 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter
    const isWaxing = phase < 0.5;
    const illumination = phase < 0.5 ? phase * 2 : (1 - phase) * 2; // 0 to 1 to 0

    // Calculate the shadow ellipse for the phase
    const shadowOffset = isWaxing
        ? (1 - illumination) * 120 - 60  // Waxing: shadow moves left to right
        : -(1 - illumination) * 120 + 60; // Waning: shadow moves right to left

    const cx = 1100;
    const cy = 280;
    const r = 62;

    return (
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
                <radialGradient id="craterGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={theme.moon.crater} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={theme.moon.crater} stopOpacity="0.6" />
                </radialGradient>
                <filter id="moonBlur" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
                </filter>
                <filter id="craterShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
                </filter>
                <filter id="craterInner" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
                </filter>
                <clipPath id="moonClip">
                    <circle cx={cx} cy={cy} r={r} />
                </clipPath>
            </defs>

            {/* Moon halo/glow */}
            <circle cx={cx} cy={cy} r="180" fill="url(#moonHalo)" filter="url(#moonBlur)" opacity={0.5 + illumination * 0.5} />

            {/* Moon base */}
            <circle cx={cx} cy={cy} r={r} fill="url(#moonSurface)" />

            {/* Detailed craters with depth */}
            <g clipPath="url(#moonClip)">
                {/* Large craters */}
                <g filter="url(#craterShadow)">
                    <ellipse cx={cx - 18} cy={cy - 12} rx="12" ry="10" fill="url(#craterGrad)" opacity="0.25" />
                    <ellipse cx={cx - 16} cy={cy - 14} rx="8" ry="7" fill={theme.moon.surface} opacity="0.15" />
                </g>
                <g filter="url(#craterShadow)">
                    <ellipse cx={cx + 12} cy={cy - 5} rx="9" ry="8" fill="url(#craterGrad)" opacity="0.2" />
                    <ellipse cx={cx + 14} cy={cy - 7} rx="5" ry="4.5" fill={theme.moon.surface} opacity="0.12" />
                </g>
                <g filter="url(#craterShadow)">
                    <ellipse cx={cx - 8} cy={cy + 18} rx="10" ry="9" fill="url(#craterGrad)" opacity="0.22" />
                    <ellipse cx={cx - 6} cy={cy + 16} rx="6" ry="5" fill={theme.moon.surface} opacity="0.1" />
                </g>

                {/* Medium craters */}
                <g filter="url(#craterInner)">
                    <ellipse cx={cx + 22} cy={cy + 12} rx="6" ry="5.5" fill="url(#craterGrad)" opacity="0.18" />
                    <ellipse cx={cx - 25} cy={cy + 5} rx="5" ry="4" fill="url(#craterGrad)" opacity="0.15" />
                    <ellipse cx={cx + 5} cy={cy - 22} rx="4" ry="3.5" fill="url(#craterGrad)" opacity="0.16" />
                </g>

                {/* Small craters for texture */}
                <g opacity="0.12">
                    <circle cx={cx - 30} cy={cy - 8} r="2.5" fill={theme.moon.crater} />
                    <circle cx={cx + 28} cy={cy - 18} r="2" fill={theme.moon.crater} />
                    <circle cx={cx - 12} cy={cy + 28} r="2.2" fill={theme.moon.crater} />
                    <circle cx={cx + 18} cy={cy + 25} r="1.8" fill={theme.moon.crater} />
                    <circle cx={cx - 35} cy={cy + 20} r="1.5" fill={theme.moon.crater} />
                    <circle cx={cx + 35} cy={cy + 5} r="2" fill={theme.moon.crater} />
                </g>

                {/* Moon phase shadow */}
                {illumination < 0.98 && (
                    <ellipse
                        cx={cx + shadowOffset}
                        cy={cy}
                        rx={r * (1.2 - illumination * 0.4)}
                        ry={r + 5}
                        fill="rgba(0,0,0,0.85)"
                    />
                )}
            </g>

            {/* Inner edge glow */}
            <circle cx={cx} cy={cy} r={r} fill="url(#moonInnerGlow)" />
        </svg>
    );
});
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
            const baseY = 680 - Math.sin((x + 80) * 0.005) * 40;
            const h = 25 + seededRandom(i * 2.3) * 20;
            const w = 10 + seededRandom(i * 3.1) * 6;
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
            <path fill="url(#denseForest)" d="M0,900 L0,650 Q60,640 120,660 Q180,630 240,610 Q320,640 400,590 Q480,630 560,570 Q660,620 760,550 Q860,600 960,530 Q1060,580 1160,520 Q1260,570 1360,510 Q1400,540 1440,550 L1440,900 Z" />
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
        <path fill="url(#fgGround)" d="M0,900 L0,750 Q80,740 160,760 Q240,730 320,710 Q420,740 520,700 Q620,730 720,690 Q820,720 920,680 Q1020,710 1120,670 Q1220,700 1320,660 Q1380,690 1440,680 L1440,900 Z" />

        {/* Left tree - fuller, extends to edge */}
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            {/* Main tree silhouette */}
            <path d="M-80,900 L-80,550 Q-50,580 -20,560 Q-40,570 0,600 Q-25,590 20,630 Q-10,620 40,660 Q5,650 55,695 Q25,685 70,730 Q40,720 85,765 Q55,755 100,800 Q70,790 115,840 Q85,830 130,875 Q100,865 145,900 Z" />
            {/* Secondary branches for depth */}
            <path d="M-20,560 Q-70,530 -90,510 Q-65,525 -95,505 Q-55,545 -20,560 Z" opacity="0.85" />
            <path d="M0,600 Q-55,570 -80,550 Q-60,565 -85,545 Q-45,585 0,600 Z" opacity="0.8" />
        </g>

        {/* Right tree - fuller, extends to edge */}
        <g fill={theme.forest.treeDark} className="transition-all duration-1000">
            {/* Main tree silhouette */}
            <path d="M1520,900 L1520,530 Q1490,560 1460,545 Q1480,555 1440,590 Q1465,580 1420,625 Q1445,615 1400,660 Q1425,650 1380,700 Q1405,690 1355,740 Q1385,730 1330,785 Q1365,775 1310,830 Q1345,820 1295,875 Q1330,865 1280,900 Z" />
            {/* Secondary branches for depth */}
            <path d="M1460,545 Q1510,515 1535,495 Q1515,510 1540,490 Q1500,530 1460,545 Z" opacity="0.85" />
            <path d="M1440,590 Q1495,555 1520,535 Q1500,550 1525,530 Q1485,575 1440,590 Z" opacity="0.8" />
        </g>

        {/* Small foreground bushes */}
        <g fill={theme.forest.treeDark} className="transition-all duration-1000" opacity="0.6">
            <ellipse cx="180" cy="820" rx="45" ry="25" />
            <ellipse cx="550" cy="790" rx="38" ry="22" />
            <ellipse cx="900" cy="780" rx="42" ry="24" />
            <ellipse cx="1250" cy="800" rx="40" ry="22" />
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

// Stars component with seeded randomness - static version for CSS-driven transforms
const StarsStatic = memo(({ theme }: { theme: ThemeColors }) => {
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
        <>
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
        </>
    );
});

export default function ParallaxPortfolio() {
    const [windowHeight, setWindowHeight] = useState(800);
    const [season, setSeason] = useState<Season>('winter');
    const containerRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const theme = SEASON_THEMES[season];

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const root = rootRef.current;
        if (!container || !root) return;

        const handleScroll = () => {
            const scrollY = container.scrollTop;
            const h = window.innerHeight;
            // Cap background movement at 1.5 screen heights (when About section is active)
            const bgScroll = Math.min(scrollY, h * 1.5);

            root.style.setProperty('--scroll-y', `${scrollY}`);
            root.style.setProperty('--bg-scroll', `${bgScroll}`);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const root = rootRef.current;
        if (!root) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        root.style.setProperty('--mouse-x', `${x}`);
        root.style.setProperty('--mouse-y', `${y}`);
    }, []);

    const totalHeight = windowHeight * 7;
    const layerComponents = useMemo(() => [Moon, MountainsFar, MountainsMidFar, MountainsMid, ForestHills, ForestDense, Foreground], []);

    return (
        <div
            ref={rootRef}
            className="w-full h-screen overflow-hidden transition-colors duration-1000 parallax-root"
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
        .parallax-root {
          --scroll-y: 0;
          --bg-scroll: 0;
          --mouse-x: 0;
          --mouse-y: 0;
        }
        /* Mountains rise from behind foreground as you scroll */
        /* Layer 0 = Moon, no offset - always visible */
        /* Layers 1-5 = SURPRISE EFFECT: Start deep/hidden, rise fast to visible, then STOP */
        /* Multipliers calculated to bring layers from ~500px down to 0px within 1200px of scroll */
        .parallax-layer-0 { transform: translate3d(calc(var(--mouse-x) * 0.05px), calc(var(--bg-scroll) * -0.02px + var(--mouse-y) * 0.02px), 0); }
        .parallax-layer-1 { transform: translate3d(calc(var(--mouse-x) * 0.08px), calc(500px - var(--bg-scroll) * 0.42px + var(--mouse-y) * 0.03px), 0); }
        .parallax-layer-2 { transform: translate3d(calc(var(--mouse-x) * 0.12px), calc(450px - var(--bg-scroll) * 0.38px + var(--mouse-y) * 0.04px), 0); }
        .parallax-layer-3 { transform: translate3d(calc(var(--mouse-x) * 0.16px), calc(400px - var(--bg-scroll) * 0.33px + var(--mouse-y) * 0.05px), 0); }
        .parallax-layer-4 { transform: translate3d(calc(var(--mouse-x) * 0.22px), calc(350px - var(--bg-scroll) * 0.29px + var(--mouse-y) * 0.07px), 0); }
        .parallax-layer-5 { transform: translate3d(calc(var(--mouse-x) * 0.28px), calc(300px - var(--bg-scroll) * 0.25px + var(--mouse-y) * 0.09px), 0); }
        .parallax-layer-6 { transform: translate3d(calc(var(--mouse-x) * 0.35px), calc(var(--mouse-y) * 0.11px), 0); }
        .parallax-mist { transform: translate3d(0, calc(400px - var(--bg-scroll) * 0.33px), 0); }
        .parallax-hero {
          opacity: clamp(0, calc(1 - var(--scroll-y) / (${windowHeight} * 0.8)), 1);
          transform: translateY(calc(var(--scroll-y) * 0.3px));
        }
        .parallax-hero-scale {
          transform: translateZ(0);
          transform-origin: center 60%;
        }
        .parallax-stars {
          transform: translateY(calc(var(--scroll-y) * -0.05px));
          opacity: clamp(0, calc((1 - var(--scroll-y) / (${windowHeight} * 1.5)) * ${theme.stars.intensity}), 1);
        }
        .parallax-aurora {
          opacity: clamp(0, calc(1 - var(--scroll-y) / (${windowHeight} * 1.2)), 1);
        }
        .scroll-blocked {
          overflow: hidden !important;
          touch-action: none !important;
        }
        .parallax-scroll-indicator {
          opacity: clamp(0, calc((1 - var(--scroll-y) / (${windowHeight} * 0.6)) * 0.8), 0.8);
        }
        /* Section 1 (About): fades in after title fades, then fades out */
        /* STRICT SEQUENTIAL TIMING: Gap of 0.4h between sections */
        
        /* Section 1 (About): Starts at 1.0h, Ends at 2.0h */
        .parallax-section-1 {
          --fade-in: clamp(0, calc((var(--scroll-y) - ${windowHeight * 1.0}) / ${windowHeight * 0.3}), 1);
          --fade-out: clamp(0, calc(1 - (var(--scroll-y) - ${windowHeight * 1.7}) / ${windowHeight * 0.3}), 1);
          opacity: min(var(--fade-in), var(--fade-out));
          transform: translateY(calc((var(--scroll-y) - ${windowHeight * 1.2}) * 0.4px));
        }

        /* Section 2 (Featured): Starts at 2.4h, Ends at 3.4h */
        .parallax-section-2 {
          --fade-in-2: clamp(0, calc((var(--scroll-y) - ${windowHeight * 2.4}) / ${windowHeight * 0.3}), 1);
          --fade-out-2: clamp(0, calc(1 - (var(--scroll-y) - ${windowHeight * 3.1}) / ${windowHeight * 0.3}), 1);
          opacity: min(var(--fade-in-2), var(--fade-out-2));
          transform: translateY(calc((var(--scroll-y) - ${windowHeight * 2.6}) * 0.4px));
        }

        /* Section 3 (Contact): Starts at 3.8h, Ends at 4.8h */
        .parallax-section-3 {
          --fade-in-3: clamp(0, calc((var(--scroll-y) - ${windowHeight * 3.8}) / ${windowHeight * 0.3}), 1);
          --fade-out-3: clamp(0, calc(1 - (var(--scroll-y) - ${windowHeight * 4.5}) / ${windowHeight * 0.3}), 1);
          opacity: min(var(--fade-in-3), var(--fade-out-3));
          transform: translateY(calc((var(--scroll-y) - ${windowHeight * 4.0}) * 0.4px));
        }

        /* Section 4 (Footer): Starts at 5.2h */
        .parallax-section-4 {
          --fade-in-4: clamp(0, calc((var(--scroll-y) - ${windowHeight * 5.2}) / ${windowHeight * 0.3}), 1);
          opacity: var(--fade-in-4);
          transform: translateY(calc((var(--scroll-y) - ${windowHeight * 5.4}) * 0.4px));
        }
      `}</style>

            <SeasonControls current={season} onChange={setSeason} />
            <AtmosphericParticles season={season} />

            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden smooth-scroll hide-scrollbar"
                onMouseMove={handleMouseMove}
            >
                <div className="fixed inset-0 overflow-x-hidden overflow-y-visible pointer-events-none parallax-hero-scale">
                    {/* Sky gradient base */}
                    <div className="absolute inset-0 gpu-layer">
                        <SkyGradient theme={theme} />
                    </div>

                    {/* Stars with CSS-driven transforms */}
                    <div className="absolute inset-0 overflow-hidden transition-opacity duration-1000 parallax-stars">
                        <StarsStatic theme={theme} />
                    </div>

                    {/* Aurora effect (winter only) */}
                    <div className="absolute inset-0 gpu-layer parallax-aurora">
                        <Aurora theme={theme} />
                    </div>

                    {/* Parallax layers - CSS driven */}
                    {layerComponents.map((LayerComponent, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 will-change-transform gpu-layer parallax-layer-${index}`}
                        >
                            <LayerComponent theme={theme} />
                        </div>
                    ))}

                    {/* Atmospheric mist layer */}
                    <div className="absolute inset-0 gpu-layer pointer-events-none parallax-mist" style={{ opacity: 0.7 }}>
                        <MistLayer theme={theme} />
                    </div>
                </div>

                <div style={{ height: totalHeight, position: 'relative' }}>
                    <div className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none transition-colors duration-1000 parallax-hero">
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
                            Full-Stack Developer
                        </p>
                    </div>

                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-opacity duration-500 parallax-scroll-indicator">
                        <span className="text-[10px] tracking-[0.4em] uppercase font-light transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                            Scroll
                        </span>
                        <div className="relative w-[18px] h-[28px] border rounded-full transition-colors duration-1000" style={{ borderColor: theme.details.textSub }}>
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-[6px] rounded-full animate-scrollPulse transition-colors duration-1000" style={{ backgroundColor: theme.details.text }} />
                        </div>
                    </div>

                    {/* About Me section */}
                    <div
                        className="fixed inset-0 flex items-start justify-center pt-[25vh] z-30 pointer-events-none parallax-section-1"
                    >
                        <div className="max-w-3xl text-center px-6">
                            <h2 className="text-4xl font-light mb-8 transition-colors duration-1000" style={{ color: theme.details.text }}>About Me</h2>
                            <p className="text-lg leading-relaxed mb-6 transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                                I craft digital experiences at the intersection of elegant design and powerful technology. My journey began with a curiosity for how things work and evolved into a passion for building systems that solve real-world problems.
                            </p>
                            <p className="text-lg leading-relaxed transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                                Whether it's architecting complex backend infrastructure or polishing the finest details of a user interface, I bring dedication and precision to every line of code.
                            </p>
                        </div>
                    </div>

                    {/* Featured Work section */}
                    <div
                        className="fixed inset-0 flex items-start justify-center pt-[25vh] z-30 pointer-events-none parallax-section-2"
                    >
                        <div className="max-w-3xl text-center px-6">
                            <h2 className="text-4xl font-light mb-8 transition-colors duration-1000" style={{ color: theme.details.text }}>Featured Work</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>ResearchLens</h3>
                                    <p className="text-base" style={{ color: theme.details.textSub }}>An AI-powered research assistant that synthesizes complex academic papers into actionable insights.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>ChatBot Builder</h3>
                                    <p className="text-base" style={{ color: theme.details.textSub }}>A no-code visual interface for constructing intelligent conversational agents.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>Meeting Minutes</h3>
                                    <p className="text-base" style={{ color: theme.details.textSub }}>Automated transcription and summarization service for corporate meetings.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div
                        className="fixed inset-0 flex items-start justify-center pt-[25vh] z-30 pointer-events-none parallax-section-3"
                    >
                        <div className="max-w-3xl text-center px-6">
                            <h2 className="text-4xl font-light mb-8 transition-colors duration-1000" style={{ color: theme.details.text }}>Get in Touch</h2>
                            <p className="text-lg leading-relaxed mb-8 transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                                Interested in collaborating or have a project in mind? Let's build something extraordinary together.
                                <br /><br />
                                I'm currently available for freelance projects and open to discussing new opportunities.
                            </p>
                            <div className="flex gap-8 justify-center">
                                <span className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300 cursor-pointer pointer-events-auto" style={{ color: theme.details.text }}>Email</span>
                                <span className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300 cursor-pointer pointer-events-auto" style={{ color: theme.details.text }}>LinkedIn</span>
                                <span className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300 cursor-pointer pointer-events-auto" style={{ color: theme.details.text }}>GitHub</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="fixed inset-0 flex items-end justify-center pb-8 z-30 pointer-events-none parallax-section-4"
                    >
                        <p className="text-xs tracking-widest uppercase transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                            © 2025 Pramish Sihali
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

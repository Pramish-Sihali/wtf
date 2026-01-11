'use client';

import { memo, useMemo } from 'react';
import { seededRandom } from '@/lib/seededRandom';
import type { ThemeColors } from '../config/seasonThemes';
import { getMoonPhase } from '../utils/moonPhase';
import { generateTree } from '../utils/generateTree';

interface LayerProps {
    theme: ThemeColors;
}

export const Moon = memo(function Moon({ theme }: LayerProps) {
    const phase = useMemo(() => getMoonPhase(), []);

    const isWaxing = phase < 0.5;
    const illumination = phase < 0.5 ? phase * 2 : (1 - phase) * 2;

    const shadowOffset = isWaxing
        ? (1 - illumination) * 120 - 60
        : -(1 - illumination) * 120 + 60;

    const cx = 1100;
    const cy = 280;
    const r = 62;

    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
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

            <circle cx={cx} cy={cy} r="180" fill="url(#moonHalo)" filter="url(#moonBlur)" opacity={0.5 + illumination * 0.5} />
            <circle cx={cx} cy={cy} r={r} fill="url(#moonSurface)" />

            <g clipPath="url(#moonClip)">
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

                <g filter="url(#craterInner)">
                    <ellipse cx={cx + 22} cy={cy + 12} rx="6" ry="5.5" fill="url(#craterGrad)" opacity="0.18" />
                    <ellipse cx={cx - 25} cy={cy + 5} rx="5" ry="4" fill="url(#craterGrad)" opacity="0.15" />
                    <ellipse cx={cx + 5} cy={cy - 22} rx="4" ry="3.5" fill="url(#craterGrad)" opacity="0.16" />
                </g>

                <g opacity="0.12">
                    <circle cx={cx - 30} cy={cy - 8} r="2.5" fill={theme.moon.crater} />
                    <circle cx={cx + 28} cy={cy - 18} r="2" fill={theme.moon.crater} />
                    <circle cx={cx - 12} cy={cy + 28} r="2.2" fill={theme.moon.crater} />
                    <circle cx={cx + 18} cy={cy + 25} r="1.8" fill={theme.moon.crater} />
                    <circle cx={cx - 35} cy={cy + 20} r="1.5" fill={theme.moon.crater} />
                    <circle cx={cx + 35} cy={cy + 5} r="2" fill={theme.moon.crater} />
                </g>

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

            <circle cx={cx} cy={cy} r={r} fill="url(#moonInnerGlow)" />
        </svg>
    );
});

export const SkyGradient = memo(function SkyGradient({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    {theme.skyGradient.stops.map((stop, i) => (
                        <stop key={i} offset={stop[1]} stopColor={stop[0]} className="transition-all duration-1000" />
                    ))}
                </linearGradient>
                <filter id="skyNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise" />
                    <feColorMatrix type="saturate" values="0" />
                    <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
                </filter>
            </defs>
            <rect width="1440" height="900" fill="url(#skyGrad)" />
            <rect width="1440" height="900" fill={theme.atmosphere.overlay} className="transition-all duration-1000" />
        </svg>
    );
});

export const Aurora = memo(function Aurora({ theme }: LayerProps) {
    if (!theme.atmosphere.aurora || !theme.atmosphere.auroraColors) return null;
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
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

export const MistLayer = memo(function MistLayer({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
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
    );
});

export const MountainsFar = memo(function MountainsFar({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="mtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.mountains.far[0]} stopOpacity="0.65" className="transition-all duration-1000" />
                    <stop offset="100%" stopColor={theme.mountains.far[1]} stopOpacity="0.45" className="transition-all duration-1000" />
                </linearGradient>
            </defs>
            <path fill="url(#mtnFar)" d="M0,900 L0,620 Q40,610 60,630 Q80,600 100,540 Q115,560 130,520 Q150,550 170,580 Q190,560 210,590 Q240,550 270,480 Q290,510 310,470 Q340,500 360,540 Q390,510 420,480 Q450,500 470,440 Q490,470 510,420 Q540,460 560,400 Q590,440 620,380 Q660,420 700,350 Q740,390 770,420 Q800,380 830,440 Q860,400 890,340 Q930,380 960,420 Q990,380 1020,320 Q1060,370 1100,300 Q1140,350 1180,280 Q1220,330 1260,360 Q1290,320 1320,280 Q1360,320 1400,350 Q1420,330 1440,360 L1440,900 Z" />
        </svg>
    );
});

export const MountainsMidFar = memo(function MountainsMidFar({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
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
            <path fill="url(#mtnMidFar)" d="M0,900 L0,560 Q30,550 50,580 Q70,540 90,500 Q110,530 130,480 Q160,510 180,450 Q210,490 240,420 Q280,470 310,400 Q350,450 380,380 Q420,430 460,350 Q510,410 550,320 Q600,380 640,290 Q690,360 730,400 Q770,360 810,300 Q860,360 900,280 Q950,340 990,260 Q1040,320 1080,240 Q1130,300 1170,220 Q1220,280 1260,200 Q1310,260 1350,280 Q1390,250 1440,220 L1440,900 Z" />
            <path fill="url(#mtnMidFarShadow)" d="M460,350 Q490,380 510,410 L510,320 Q485,340 460,350 Z M900,280 Q930,310 950,340 L950,260 Q925,270 900,280 Z M1170,220 Q1200,250 1220,280 L1220,200 Q1195,210 1170,220 Z" opacity="0.4" />
        </svg>
    );
});

export const MountainsMid = memo(function MountainsMid({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
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
            <path fill="url(#mtnMid)" d="M0,900 L0,520 Q25,510 45,540 Q60,500 80,460 Q100,490 120,440 Q150,480 175,400 Q210,450 240,360 Q280,420 310,340 Q360,400 400,300 Q450,370 490,280 Q550,350 590,260 Q650,330 700,220 Q760,300 810,350 Q850,310 890,260 Q940,320 980,240 Q1030,300 1070,200 Q1120,270 1160,180 Q1210,250 1250,300 Q1290,260 1330,220 Q1380,270 1440,200 L1440,900 Z" />
            <path fill={theme.mountains.accent} d="M700,220 Q720,240 740,280 Q760,260 780,300 L810,350 Q790,320 770,340 Q750,310 730,340 Q710,290 700,220 Z" opacity="0.3" className="transition-all duration-1000" />
            <path fill="url(#snowCap)" d="M240,360 Q230,380 225,400 Q240,395 250,405 Q260,390 275,410 L310,340 Q295,360 280,370 Q265,355 250,365 Q240,355 240,360 Z" />
            <path fill="url(#snowCap)" d="M490,280 Q480,300 475,330 Q490,325 500,340 Q510,320 525,345 L590,260 Q575,285 560,295 Q545,275 530,290 Q515,270 490,280 Z" />
            <path fill="url(#snowCap)" d="M700,220 Q685,250 680,280 Q695,275 710,295 Q720,270 740,300 L810,350 Q795,320 775,340 Q760,310 745,330 Q725,290 710,310 Q695,260 700,220 Z" />
            <path fill="url(#snowCap)" d="M980,240 Q965,270 960,300 Q975,295 990,315 Q1000,290 1020,320 L1070,200 Q1055,235 1040,250 Q1025,225 1010,245 Q995,220 980,240 Z" />
            <path fill="url(#snowCap)" d="M1160,180 Q1145,210 1140,245 Q1155,240 1170,265 Q1185,235 1205,270 L1250,300 Q1235,270 1215,290 Q1200,255 1185,280 Q1170,240 1160,180 Z" />
            <path fill="url(#mtnShadow)" d="M700,220 L680,280 L700,350 L810,350 L780,300 L750,280 L700,220 Z" opacity="0.25" />
        </svg>
    );
});

export const ForestHills = memo(function ForestHills({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="forestHill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.forest.hills[0]} className="transition-all duration-1000" />
                    <stop offset="100%" stopColor={theme.forest.hills[1]} className="transition-all duration-1000" />
                </linearGradient>
            </defs>
            <path fill="url(#forestHill)" d="M0,900 L0,540 Q50,530 100,550 Q150,520 200,500 Q260,530 320,480 Q380,510 440,450 Q520,500 600,440 Q680,480 760,420 Q840,460 920,400 Q1000,450 1080,380 Q1160,430 1240,370 Q1320,420 1400,380 Q1420,400 1440,420 L1440,900 Z" />
        </svg>
    );
});

export const ForestDense = memo(function ForestDense({ theme }: LayerProps) {
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
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="denseForest" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.forest.dense[0]} className="transition-all duration-1000" />
                    <stop offset="100%" stopColor={theme.forest.dense[1]} className="transition-all duration-1000" />
                </linearGradient>
            </defs>
            <path fill="url(#denseForest)" d="M0,900 L0,650 Q60,640 120,660 Q180,630 240,610 Q320,640 400,590 Q480,630 560,570 Q660,620 760,550 Q860,600 960,530 Q1060,580 1160,520 Q1260,570 1360,510 Q1400,540 1440,550 L1440,900 Z" />
            <g fill={theme.forest.treeDark} className="transition-all duration-1000">
                {trees.map((t, i) => (
                    <path key={i} d={generateTree(t.x, t.baseY, t.h, t.w, t.seed)} opacity={0.85 + seededRandom(i * 1.3) * 0.15} />
                ))}
            </g>
            <g fill={theme.forest.accent} className="transition-all duration-1000" opacity="0.3">
                {trees.filter((_, i) => i % 4 === 0).map((t, i) => (
                    <path key={i} d={generateTree(t.x + 3, t.baseY, t.h * 0.85, t.w * 0.8, t.seed + 100)} />
                ))}
            </g>
        </svg>
    );
});

export const Foreground = memo(function Foreground({ theme }: LayerProps) {
    return (
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full" aria-hidden="true">
            <defs>
                <linearGradient id="fgGround" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.forest.foreground[0]} className="transition-all duration-1000" />
                    <stop offset="100%" stopColor={theme.forest.foreground[1]} className="transition-all duration-1000" />
                </linearGradient>
            </defs>
            <path fill="url(#fgGround)" d="M0,900 L0,750 Q80,740 160,760 Q240,730 320,710 Q420,740 520,700 Q620,730 720,690 Q820,720 920,680 Q1020,710 1120,670 Q1220,700 1320,660 Q1380,690 1440,680 L1440,900 Z" />

            <g fill={theme.forest.treeDark} className="transition-all duration-1000">
                <path d="M-80,900 L-80,550 Q-50,580 -20,560 Q-40,570 0,600 Q-25,590 20,630 Q-10,620 40,660 Q5,650 55,695 Q25,685 70,730 Q40,720 85,765 Q55,755 100,800 Q70,790 115,840 Q85,830 130,875 Q100,865 145,900 Z" />
                <path d="M-20,560 Q-70,530 -90,510 Q-65,525 -95,505 Q-55,545 -20,560 Z" opacity="0.85" />
                <path d="M0,600 Q-55,570 -80,550 Q-60,565 -85,545 Q-45,585 0,600 Z" opacity="0.8" />
            </g>

            <g fill={theme.forest.treeDark} className="transition-all duration-1000">
                <path d="M1520,900 L1520,530 Q1490,560 1460,545 Q1480,555 1440,590 Q1465,580 1420,625 Q1445,615 1400,660 Q1425,650 1380,700 Q1405,690 1355,740 Q1385,730 1330,785 Q1365,775 1310,830 Q1345,820 1295,875 Q1330,865 1280,900 Z" />
                <path d="M1460,545 Q1510,515 1535,495 Q1515,510 1540,490 Q1500,530 1460,545 Z" opacity="0.85" />
                <path d="M1440,590 Q1495,555 1520,535 Q1500,550 1525,530 Q1485,575 1440,590 Z" opacity="0.8" />
            </g>

            <g fill={theme.forest.treeDark} className="transition-all duration-1000" opacity="0.6">
                <ellipse cx="180" cy="820" rx="45" ry="25" />
                <ellipse cx="550" cy="790" rx="38" ry="22" />
                <ellipse cx="900" cy="780" rx="42" ry="24" />
                <ellipse cx="1250" cy="800" rx="40" ry="22" />
            </g>
        </svg>
    );
});

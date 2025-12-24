// ============================================
// SEASON THEME CONFIGURATION
// Extracted for better maintainability and type safety
// ============================================

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface ThemeColors {
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

export const SEASON_THEMES: Record<Season, ThemeColors> = {
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

export const SEASON_ICONS: Record<Season, string> = {
    winter: '❄',
    spring: '❀',
    summer: '☀',
    autumn: '🍂'
};

export const SEASONS: Season[] = ['winter', 'spring', 'summer', 'autumn'];

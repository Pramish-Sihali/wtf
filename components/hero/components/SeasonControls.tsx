'use client';

import { memo } from 'react';
import { Season, SEASONS, SEASON_ICONS } from '../config/seasonThemes';

interface SeasonControlsProps {
    current: Season;
    onChange: (s: Season) => void;
}

const SeasonControls = memo(function SeasonControls({ current, onChange }: SeasonControlsProps) {
    return (
        <div
            className="fixed bottom-8 right-8 z-50 flex gap-1.5 bg-black/25 backdrop-blur-md p-1.5 rounded-full border border-white/10"
            role="radiogroup"
            aria-label="Select season theme"
        >
            {SEASONS.map((s) => (
                <button
                    key={s}
                    onClick={() => onChange(s)}
                    role="radio"
                    aria-checked={current === s}
                    aria-label={`${s} theme`}
                    className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${current === s
                        ? 'bg-white/90 text-black shadow-lg scale-105 font-medium'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                        }`}
                    title={s}
                >
                    <span className="text-sm" aria-hidden="true">{SEASON_ICONS[s]}</span>
                    <span className="hidden sm:inline">{s}</span>
                </button>
            ))}
        </div>
    );
});

export default SeasonControls;

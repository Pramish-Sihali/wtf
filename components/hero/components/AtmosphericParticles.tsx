'use client';

import { memo, useMemo, useCallback } from 'react';
import { seededRandom } from '@/lib/seededRandom';
import type { Season } from '../config/seasonThemes';
import type { ParallaxCSSProperties } from '../types';

interface AtmosphericParticlesProps {
    season: Season;
}

interface Particle {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    drift: number;
    opacity: number;
    blur: boolean;
    rotation: number;
}

const AtmosphericParticles = memo(function AtmosphericParticles({ season }: AtmosphericParticlesProps) {
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

    const getParticleStyle = useCallback((p: Particle): React.CSSProperties => {
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
        <div
            className="fixed inset-0 pointer-events-none z-[100] overflow-hidden will-change-transform"
            aria-hidden="true"
        >
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
                        '--drift': `${p.drift}px`,
                    } as ParallaxCSSProperties}
                />
            ))}
        </div>
    );
});

export default AtmosphericParticles;

'use client';

import { memo, useMemo } from 'react';
import { seededRandom } from '@/lib/seededRandom';
import type { ThemeColors } from '../config/seasonThemes';

interface StarsStaticProps {
    theme: ThemeColors;
}

const StarsStatic = memo(function StarsStatic({ theme }: StarsStaticProps) {
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
                    aria-hidden="true"
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

export default StarsStatic;

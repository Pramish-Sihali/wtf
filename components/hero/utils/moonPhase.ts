/**
 * Calculate moon phase (0-1) based on lunar cycle (~29.5 days)
 */
export const getMoonPhase = (): number => {
    const knownNewMoon = new Date('2024-01-11').getTime();
    const lunarCycle = 29.53058867;
    const now = Date.now();
    const daysSinceNew = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    return (daysSinceNew % lunarCycle) / lunarCycle;
};

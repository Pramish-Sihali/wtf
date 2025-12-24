// ============================================
// SEEDED RANDOM FOR CONSISTENT GENERATION
// Produces deterministic random values for reproducible layouts
// ============================================

/**
 * Generates a pseudo-random number between 0 and 1 based on a seed value.
 * Uses a simple sine-based hash function for deterministic results.
 *
 * @param seed - The seed value for random number generation
 * @returns A number between 0 and 1
 */
export const seededRandom = (seed: number): number => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};

/**
 * Creates a seeded random number generator function.
 * Useful for generating multiple random values with related seeds.
 *
 * @param baseSeed - The base seed value
 * @returns A function that takes an offset and returns a random number
 */
export const createSeededRandom = (baseSeed: number) => {
    return (offset: number): number => seededRandom(baseSeed + offset);
};

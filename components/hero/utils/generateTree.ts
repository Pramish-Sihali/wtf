import { seededRandom } from '@/lib/seededRandom';

/**
 * Generate organic tree shape as SVG path
 */
export const generateTree = (x: number, baseY: number, height: number, width: number, seed: number): string => {
    const r = (n: number) => seededRandom(seed + n);
    const w = width;
    const h = height;

    const layers = 4 + Math.floor(r(1) * 2);
    let path = `M${x + w * 0.5},${baseY - h}`;

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

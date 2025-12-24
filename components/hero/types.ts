import type { CSSProperties } from 'react';

/**
 * Extended CSS properties interface that includes custom CSS variables
 * used in the parallax portfolio component.
 */
export interface ParallaxCSSProperties extends CSSProperties {
    '--drift'?: string;
    '--scroll-y'?: string;
    '--window-height'?: string;
    '--stars-intensity'?: string | number;
    '--l0-scroll'?: string;
    '--l1-scroll'?: string;
    '--l2-scroll'?: string;
    '--l3-scroll'?: string;
    '--l4-scroll'?: string;
    '--l5-scroll'?: string;
    '--mouse-x'?: string;
    '--mouse-y'?: string;
}

/**
 * Navigation section configuration
 */
export interface NavSection {
    id: string;
    label: string;
    offset: number;
}

/**
 * Particle configuration for atmospheric effects
 */
export interface Particle {
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

/**
 * Star configuration for static star field
 */
export interface Star {
    id: number;
    left: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    brightness: number;
}

/**
 * Tree configuration for procedural forest generation
 */
export interface Tree {
    x: number;
    baseY: number;
    h: number;
    w: number;
    seed: number;
}

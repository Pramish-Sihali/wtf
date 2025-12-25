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
    '--section-offset'?: string;
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

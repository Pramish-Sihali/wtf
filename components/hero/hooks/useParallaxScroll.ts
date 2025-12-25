'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

interface ParallaxScrollState {
    activeSection: string;
    showScrollTop: boolean;
}

interface UseParallaxScrollOptions {
    containerRef: RefObject<HTMLDivElement | null>;
    rootRef: RefObject<HTMLDivElement | null>;
    navSections?: readonly { readonly id: string; readonly offset: number }[];
}

// Default nav sections - extracted to prevent recreation on every render
const DEFAULT_NAV_SECTIONS = [
    { id: 'home', offset: 0.8 },
    { id: 'about', offset: 2.0 },
    { id: 'work', offset: 3.4 },
    { id: 'contact', offset: Infinity },
] as const;

/**
 * Custom hook for managing parallax scroll behavior with RAF throttling.
 * Eliminates scroll jank by batching DOM writes and using requestAnimationFrame.
 */
export function useParallaxScroll({
    containerRef,
    rootRef,
    navSections = DEFAULT_NAV_SECTIONS,
}: UseParallaxScrollOptions): ParallaxScrollState {
    // Consolidated state to prevent double renders
    const [scrollState, setScrollState] = useState<ParallaxScrollState>({
        activeSection: 'home',
        showScrollTop: false,
    });

    // RAF and throttling refs
    const rafIdRef = useRef<number | null>(null);
    const isScrollingRef = useRef<boolean>(false);

    const updateParallaxLayers = useCallback(() => {
        const container = containerRef.current;
        const root = rootRef.current;
        if (!container || !root) return;

        const scrollY = container.scrollTop;
        const h = window.innerHeight;

        // STAGGERED LAYER LOGIC: Each layer has its own capped travel window
        const l0 = Math.min(scrollY, h * 3.5);
        const l1 = Math.min(scrollY, h * 1.5);
        const l4 = Math.min(Math.max(scrollY - h * 1.5, 0), h * 1.5);
        const l5 = Math.min(Math.max(scrollY - h * 2.5, 0), h * 1.5);

        // Batch all CSS custom property updates - setProperty is faster than individual calls
        root.style.setProperty('--scroll-y', `${scrollY}`);
        root.style.setProperty('--window-height', `${h}px`);
        root.style.setProperty('--l0-scroll', `${l0}`);
        root.style.setProperty('--l1-scroll', `${l1}`);
        root.style.setProperty('--l2-scroll', `${l1}`);
        root.style.setProperty('--l3-scroll', `${l1}`);
        root.style.setProperty('--l4-scroll', `${l4}`);
        root.style.setProperty('--l5-scroll', `${l5}`);

        // Active Section Tracking
        let newSection = 'home';
        for (const section of navSections) {
            if (scrollY < h * section.offset) {
                newSection = section.id;
                break;
            }
        }

        const shouldShowScrollTop = scrollY > h * 0.5;

        // Only update state if either value changed (single setState to prevent double render)
        if (newSection !== scrollState.activeSection || shouldShowScrollTop !== scrollState.showScrollTop) {
            setScrollState({
                activeSection: newSection,
                showScrollTop: shouldShowScrollTop,
            });
        }

        isScrollingRef.current = false;
    }, [containerRef, rootRef, navSections, scrollState.activeSection, scrollState.showScrollTop]);

    const handleScroll = useCallback(() => {
        // Throttle scroll events using RAF
        if (!isScrollingRef.current) {
            isScrollingRef.current = true;

            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }

            rafIdRef.current = requestAnimationFrame(updateParallaxLayers);
        }
    }, [updateParallaxLayers]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Initialize values on mount
        updateParallaxLayers();

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [containerRef, handleScroll, updateParallaxLayers]);

    return scrollState;
}

/**
 * Custom hook for handling mouse parallax effect with RAF throttling.
 */
export function useMouseParallax(rootRef: RefObject<HTMLDivElement | null>) {
    const rafIdRef = useRef<number | null>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            const root = rootRef.current;
            if (!root) return;

            // Throttle via RAF - skip if frame already scheduled
            if (rafIdRef.current) return;

            rafIdRef.current = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;

                root.style.setProperty('--mouse-x', `${x}`);
                root.style.setProperty('--mouse-y', `${y}`);

                rafIdRef.current = null;
            });
        },
        [rootRef]
    );

    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    return handleMouseMove;
}

/**
 * Custom hook for window height with debounced resize handling.
 * Debounces to 150ms to reduce unnecessary re-renders during resize.
 */
export function useWindowHeight(): number {
    const [windowHeight, setWindowHeight] = useState(800);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        setWindowHeight(window.innerHeight);

        const handleResize = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setWindowHeight(window.innerHeight);
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return windowHeight;
}

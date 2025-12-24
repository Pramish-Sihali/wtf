'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

interface ParallaxScrollState {
    activeSection: string;
    showScrollTop: boolean;
}

interface UseParallaxScrollOptions {
    containerRef: RefObject<HTMLDivElement | null>;
    rootRef: RefObject<HTMLDivElement | null>;
    navSections?: Array<{ id: string; offset: number }>;
}

/**
 * Custom hook for managing parallax scroll behavior with RAF throttling.
 * Eliminates scroll jank by batching DOM writes and using requestAnimationFrame.
 */
export function useParallaxScroll({
    containerRef,
    rootRef,
    navSections = [
        { id: 'home', offset: 0.8 },
        { id: 'about', offset: 2.0 },
        { id: 'work', offset: 3.4 },
        { id: 'contact', offset: Infinity },
    ],
}: UseParallaxScrollOptions): ParallaxScrollState {
    const [activeSection, setActiveSection] = useState('home');
    const [showScrollTop, setShowScrollTop] = useState(false);

    // RAF and throttling refs
    const rafIdRef = useRef<number | null>(null);
    const lastScrollYRef = useRef<number>(0);
    const isScrollingRef = useRef<boolean>(false);

    const updateParallaxLayers = useCallback(() => {
        const container = containerRef.current;
        const root = rootRef.current;
        if (!container || !root) return;

        const scrollY = container.scrollTop;
        const h = window.innerHeight;

        // Batch all CSS custom property updates
        const updates: Record<string, string> = {
            '--scroll-y': `${scrollY}`,
            '--window-height': `${h}px`,
        };

        // STAGGERED LAYER LOGIC: Each layer has its own capped travel window
        const l0 = Math.min(scrollY, h * 3.5);
        const l1 = Math.min(scrollY, h * 1.5);
        const l2 = l1;
        const l3 = l1;
        const l4 = Math.min(Math.max(scrollY - h * 1.5, 0), h * 1.5);
        const l5 = Math.min(Math.max(scrollY - h * 2.5, 0), h * 1.5);

        updates['--l0-scroll'] = `${l0}`;
        updates['--l1-scroll'] = `${l1}`;
        updates['--l2-scroll'] = `${l2}`;
        updates['--l3-scroll'] = `${l3}`;
        updates['--l4-scroll'] = `${l4}`;
        updates['--l5-scroll'] = `${l5}`;

        // Apply all updates in a single batch
        Object.entries(updates).forEach(([prop, value]) => {
            root.style.setProperty(prop, value);
        });

        // Active Section Tracking (outside RAF for immediate response)
        let newSection = 'home';
        for (const section of navSections) {
            if (scrollY < h * section.offset) {
                newSection = section.id;
                break;
            }
        }

        // Only update state if changed (prevents unnecessary re-renders)
        if (newSection !== activeSection) {
            setActiveSection(newSection);
        }

        const shouldShowScrollTop = scrollY > h * 0.5;
        if (shouldShowScrollTop !== showScrollTop) {
            setShowScrollTop(shouldShowScrollTop);
        }

        lastScrollYRef.current = scrollY;
        isScrollingRef.current = false;
    }, [containerRef, rootRef, navSections, activeSection, showScrollTop]);

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

    return { activeSection, showScrollTop };
}

/**
 * Custom hook for handling mouse parallax effect with throttling.
 */
export function useMouseParallax(rootRef: RefObject<HTMLDivElement | null>) {
    const rafIdRef = useRef<number | null>(null);
    const lastMouseRef = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            const root = rootRef.current;
            if (!root) return;

            // Throttle mouse updates via RAF
            if (rafIdRef.current) return;

            rafIdRef.current = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;

                // Only update if values changed significantly
                if (
                    Math.abs(x - lastMouseRef.current.x) > 0.1 ||
                    Math.abs(y - lastMouseRef.current.y) > 0.1
                ) {
                    root.style.setProperty('--mouse-x', `${x}`);
                    root.style.setProperty('--mouse-y', `${y}`);
                    lastMouseRef.current = { x, y };
                }

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
 */
export function useWindowHeight(): number {
    const [windowHeight, setWindowHeight] = useState(800);

    useEffect(() => {
        setWindowHeight(window.innerHeight);

        let resizeTimeout: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setWindowHeight(window.innerHeight);
            }, 100); // Debounce resize events
        };

        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return windowHeight;
}

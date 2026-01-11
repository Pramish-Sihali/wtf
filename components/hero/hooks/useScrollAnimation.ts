'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(options: UseScrollAnimationOptions = {}) {
    const {
        threshold = 0.3,
        triggerOnce = true
    } = options;

    const elementRef = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Find the scroll container (parent with overflow-y-auto)
        const findScrollContainer = (el: HTMLElement): HTMLElement | null => {
            let parent = el.parentElement;
            while (parent) {
                const style = window.getComputedStyle(parent);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                    return parent;
                }
                parent = parent.parentElement;
            }
            return null;
        };

        const scrollContainer = findScrollContainer(element);

        const checkVisibility = () => {
            if (!element || isVisible) return;

            const rect = element.getBoundingClientRect();
            const containerRect = scrollContainer
                ? scrollContainer.getBoundingClientRect()
                : { top: 0, bottom: window.innerHeight };

            // Check if element is within the visible area
            const elementTop = rect.top;
            const containerBottom = containerRect.bottom;
            const triggerPoint = containerBottom * (1 - threshold);

            if (elementTop < triggerPoint && elementTop > containerRect.top - rect.height) {
                setIsVisible(true);
                if (triggerOnce && scrollContainer) {
                    scrollContainer.removeEventListener('scroll', checkVisibility);
                }
            }
        };

        // Initial check
        checkVisibility();

        // Listen to scroll events
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkVisibility, { passive: true });
        }
        window.addEventListener('scroll', checkVisibility, { passive: true });

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkVisibility);
            }
            window.removeEventListener('scroll', checkVisibility);
        };
    }, [threshold, triggerOnce, isVisible]);

    return { elementRef, isVisible };
}

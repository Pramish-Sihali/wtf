'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import { Season, ThemeColors, SEASON_THEMES } from './config/seasonThemes';
import { useParallaxScroll, useMouseParallax, useWindowHeight } from './hooks/useParallaxScroll';
import type { NavSection } from './types';
import { AboutSection, WorkSection, ContactSection, FooterSection } from './sections/ContentSections';

import AtmosphericParticles from './components/AtmosphericParticles';
import SeasonControls from './components/SeasonControls';
import StarsStatic from './components/StarsStatic';
import {
    Moon,
    SkyGradient,
    Aurora,
    MistLayer,
    MountainsFar,
    MountainsMidFar,
    MountainsMid,
    ForestHills,
    ForestDense,
    Foreground
} from './components/SVGLayers';

const LAYER_COMPONENTS = [Moon, MountainsFar, MountainsMidFar, MountainsMid, ForestHills, ForestDense, Foreground] as const;

const NAV_SECTIONS: NavSection[] = [
    { id: 'home', label: 'Home', offset: 0 },
    { id: 'about', label: 'About', offset: 1.0 },
    { id: 'work', label: 'Work', offset: 2.0 },
    { id: 'contact', label: 'Contact', offset: 3.0 },
];

export default function ParallaxPortfolio() {
    const [season, setSeason] = useState<Season>('winter');
    const containerRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const theme = SEASON_THEMES[season];
    const windowHeight = useWindowHeight();

    const { activeSection, showScrollTop } = useParallaxScroll({
        containerRef,
        rootRef,
        navSections: [
            { id: 'home', offset: 0.8 },
            { id: 'about', offset: 1.8 },
            { id: 'work', offset: 2.8 },
            { id: 'contact', offset: Infinity },
        ],
    });

    const handleMouseMove = useMouseParallax(rootRef);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        root.style.setProperty('--window-height', `${windowHeight}px`);
        root.style.setProperty('--stars-intensity', `${theme.stars.intensity}`);
    }, [windowHeight, theme.stars.intensity]);

    const scrollToSection = useCallback((multiplier: number) => {
        if (!containerRef.current) return;
        containerRef.current.scrollTo({
            top: windowHeight * multiplier,
            behavior: 'smooth'
        });
    }, [windowHeight]);

    const totalHeight = windowHeight * 5;

    return (
        <div
            ref={rootRef}
            className="w-full h-screen overflow-hidden transition-colors duration-1000 parallax-root"
            style={{ backgroundColor: theme.details.background }}
        >
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black/90 focus:text-white focus:rounded"
            >
                Skip to main content
            </a>

            <SeasonControls current={season} onChange={setSeason} />
            <AtmosphericParticles season={season} />

            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden smooth-scroll hide-scrollbar"
                onMouseMove={handleMouseMove}
            >
                <div className="fixed inset-0 overflow-x-hidden overflow-y-visible pointer-events-none parallax-hero-scale">
                    <div className="absolute inset-0">
                        <SkyGradient theme={theme} />
                    </div>

                    <div className="absolute inset-0 overflow-hidden transition-opacity duration-1000 parallax-stars pointer-events-none">
                        <StarsStatic theme={theme} />
                    </div>

                    <div className="absolute inset-0 parallax-aurora pointer-events-none">
                        <Aurora theme={theme} />
                    </div>

                    {LAYER_COMPONENTS.map((LayerComponent, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 will-change-transform parallax-layer-${index} pointer-events-none`}
                        >
                            <LayerComponent theme={theme} />
                        </div>
                    ))}

                    <div className="absolute inset-0 pointer-events-none parallax-mist" style={{ opacity: 0.7 }}>
                        <MistLayer theme={theme} />
                    </div>
                </div>

                <div id="main-content" style={{ height: totalHeight, position: 'relative' }}>
                    <HeroSection theme={theme} />
                    <ScrollIndicator theme={theme} />
                    <AboutSection theme={theme} windowHeight={windowHeight} />
                    <WorkSection theme={theme} windowHeight={windowHeight} />
                    <ContactSection theme={theme} windowHeight={windowHeight} />
                    <FooterSection theme={theme} windowHeight={windowHeight} />
                </div>

                <SideNavigation
                    sections={NAV_SECTIONS}
                    activeSection={activeSection}
                    onNavigate={scrollToSection}
                    theme={theme}
                />

                <ScrollToTopButton
                    visible={showScrollTop}
                    onClick={() => scrollToSection(0)}
                    theme={theme}
                />
            </div>
        </div>
    );
}

function HeroSection({ theme }: { theme: ThemeColors }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none transition-colors duration-1000 parallax-hero">
            <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight mb-6 tracking-tight pointer-events-auto transition-colors duration-1000"
                style={{
                    color: theme.details.text,
                    fontFamily: 'Georgia, "Palatino Linotype", serif',
                    textShadow: '0 0 80px rgba(255,255,255,0.15), 0 4px 30px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.03em',
                }}
            >
                Pramish Sihali
            </h1>
            <p
                className="text-base sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase pointer-events-auto transition-colors duration-1000"
                style={{
                    color: theme.details.textSub,
                    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
            >
                Full-Stack Developer
            </p>
        </div>
    );
}

function ScrollIndicator({ theme }: { theme: ThemeColors }) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-opacity duration-500 parallax-scroll-indicator" aria-hidden="true">
            <span className="text-[10px] tracking-[0.4em] uppercase font-light transition-colors duration-1000" style={{ color: theme.details.textSub }}>
                Scroll
            </span>
            <div className="relative w-[18px] h-[28px] border rounded-full transition-colors duration-1000" style={{ borderColor: theme.details.textSub }}>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[3px] h-[6px] rounded-full animate-scrollPulse transition-colors duration-1000" style={{ backgroundColor: theme.details.text }} />
            </div>
        </div>
    );
}

interface SideNavigationProps {
    sections: NavSection[];
    activeSection: string;
    onNavigate: (offset: number) => void;
    theme: ThemeColors;
}

function SideNavigation({ sections, activeSection, onNavigate, theme }: SideNavigationProps) {
    return (
        <nav
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4"
            role="navigation"
            aria-label="Page sections"
        >
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => onNavigate(section.offset)}
                    className="group relative flex items-center justify-end py-1"
                    aria-label={`Navigate to ${section.label} section`}
                    aria-current={activeSection === section.id ? 'true' : undefined}
                >
                    <span
                        className={`absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-[10px] tracking-[0.3em] uppercase mr-2 pointer-events-none whitespace-nowrap ${activeSection === section.id ? 'opacity-100 translate-x-0' : 'translate-x-2'}`}
                        style={{ color: theme.details.text }}
                    >
                        {section.label}
                    </span>
                    <div
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeSection === section.id ? 'w-3 scale-100 opacity-100' : 'opacity-30 group-hover:opacity-60 scale-75 group-hover:scale-100'}`}
                        style={{ backgroundColor: theme.details.text }}
                        aria-hidden="true"
                    />
                </button>
            ))}
        </nav>
    );
}

interface ScrollToTopButtonProps {
    visible: boolean;
    onClick: () => void;
    theme: ThemeColors;
}

function ScrollToTopButton({ visible, onClick, theme }: ScrollToTopButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`fixed right-6 bottom-8 z-50 p-3 rounded-full transition-all duration-700 hover:scale-110 flex items-center justify-center ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.details.text
            }}
            aria-label="Scroll to top"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}

'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { ThemeColors } from '../config/seasonThemes';

interface SectionProps {
    theme: ThemeColors;
    windowHeight: number;
}

// Custom hook for intersection observer animation
function useInViewAnimation() {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

// About Me Section
export const AboutSection = memo(function AboutSection({ theme, windowHeight }: SectionProps) {
    const { ref, isVisible } = useInViewAnimation();

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            className={`absolute left-0 right-0 flex items-start justify-center pt-[15vh] z-30 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ top: windowHeight * 1 }}
            aria-labelledby="about-heading"
        >
            <div className="max-w-3xl text-center px-8 py-10 rounded-3xl backdrop-blur-sm bg-black/10 border border-white/10 mx-6 shadow-2xl">
                <h2
                    id="about-heading"
                    className="text-4xl font-light mb-8 transition-colors duration-1000"
                    style={{ color: theme.details.text }}
                >
                    About Me
                </h2>
                <p
                    className="text-lg leading-relaxed mb-6 transition-colors duration-1000"
                    style={{ color: theme.details.textSub }}
                >
                    I craft digital experiences at the intersection of elegant design and powerful technology.
                    My journey began with a curiosity for how things work and evolved into a passion for
                    building systems that solve real-world problems.
                </p>
                <p
                    className="text-lg leading-relaxed transition-colors duration-1000"
                    style={{ color: theme.details.textSub }}
                >
                    Whether it's architecting complex backend infrastructure or polishing the finest details
                    of a user interface, I bring dedication and precision to every line of code.
                </p>
            </div>
        </section>
    );
});

// Featured Work Section
export const WorkSection = memo(function WorkSection({ theme, windowHeight }: SectionProps) {
    const { ref, isVisible } = useInViewAnimation();

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            className={`absolute left-0 right-0 flex items-start justify-center pt-[15vh] z-30 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ top: windowHeight * 2 }}
            aria-labelledby="work-heading"
        >
            <div className="max-w-3xl text-center px-8 py-10 rounded-3xl backdrop-blur-sm bg-black/10 border border-white/10 mx-6 shadow-2xl">
                <h2
                    id="work-heading"
                    className="text-4xl font-light mb-8 transition-colors duration-1000"
                    style={{ color: theme.details.text }}
                >
                    Featured Work
                </h2>
                <div className="space-y-6">
                    <article>
                        <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>
                            ResearchLens
                        </h3>
                        <p className="text-base" style={{ color: theme.details.textSub }}>
                            An AI-powered research assistant that synthesizes complex academic papers into actionable insights.
                        </p>
                    </article>
                    <article>
                        <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>
                            ChatBot Builder
                        </h3>
                        <p className="text-base" style={{ color: theme.details.textSub }}>
                            A no-code visual interface for constructing intelligent conversational agents.
                        </p>
                    </article>
                    <article>
                        <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>
                            Meeting Minutes
                        </h3>
                        <p className="text-base" style={{ color: theme.details.textSub }}>
                            Automated transcription and summarization service for corporate meetings.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
});

// Contact Section
export const ContactSection = memo(function ContactSection({ theme, windowHeight }: SectionProps) {
    const { ref, isVisible } = useInViewAnimation();

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            className={`absolute left-0 right-0 flex items-start justify-center pt-[15vh] z-30 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ top: windowHeight * 3 }}
            aria-labelledby="contact-heading"
        >
            <div className="max-w-3xl text-center px-8 py-10 rounded-3xl backdrop-blur-sm bg-black/10 border border-white/10 mx-6 shadow-2xl">
                <h2
                    id="contact-heading"
                    className="text-4xl font-light mb-8 transition-colors duration-1000"
                    style={{ color: theme.details.text }}
                >
                    Get in Touch
                </h2>
                <p
                    className="text-lg leading-relaxed mb-8 transition-colors duration-1000"
                    style={{ color: theme.details.textSub }}
                >
                    Interested in collaborating or have a project in mind? Let's build something extraordinary together.
                    <br /><br />
                    I'm currently available for freelance projects and open to discussing new opportunities.
                </p>
                <div className="flex gap-8 justify-center" role="list" aria-label="Contact links">
                    <a
                        href="mailto:contact@example.com"
                        className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300 cursor-pointer"
                        style={{ color: theme.details.text }}
                        role="listitem"
                    >
                        Email
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300 cursor-pointer"
                        style={{ color: theme.details.text }}
                        role="listitem"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/Pramish-Sihali"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300 cursor-pointer"
                        style={{ color: theme.details.text }}
                        role="listitem"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </section>
    );
});

// Footer Section
export const FooterSection = memo(function FooterSection({ theme, windowHeight }: SectionProps) {
    const { ref, isVisible } = useInViewAnimation();

    return (
        <footer
            ref={ref as React.RefObject<HTMLElement>}
            className={`absolute left-0 right-0 flex items-end justify-center pb-8 z-30 h-screen transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ top: windowHeight * 4 }}
        >
            <p
                className="text-xs tracking-widest uppercase transition-colors duration-1000"
                style={{ color: theme.details.textSub }}
            >
                © 2025 Pramish Sihali
            </p>
        </footer>
    );
});

'use client';

import { memo } from 'react';
import type { ThemeColors } from '../config/seasonThemes';

interface SectionProps {
    theme: ThemeColors;
    windowHeight: number;
}

interface ContentSectionConfig {
    id: string;
    heading: string;
    headingId: string;
    topMultiplier: number;
    content: React.ReactNode;
    element?: 'section' | 'footer';
}

// Reusable Section Component - Single source of truth
const Section = memo(function Section({
    config,
    theme,
    windowHeight
}: {
    config: ContentSectionConfig;
    theme: ThemeColors;
    windowHeight: number;
}) {
    const Element = config.element || 'section';
    const isFooter = config.element === 'footer';

    return (
        <Element
            className={`absolute left-0 right-0 flex z-30 animate-fade-in-up ${
                isFooter ? 'items-end justify-center pb-8 h-screen' : 'items-start justify-center pt-[15vh]'
            }`}
            style={{
                top: windowHeight * config.topMultiplier,
                // Use CSS custom properties set by parent for theme colors
                animationDelay: `${config.topMultiplier * 0.2}s`
            }}
            aria-labelledby={config.headingId}
        >
            {config.content}
        </Element>
    );
});

// About Me Section
export const AboutSection = memo(function AboutSection({ theme, windowHeight }: SectionProps) {
    const config: ContentSectionConfig = {
        id: 'about',
        heading: 'About Me',
        headingId: 'about-heading',
        topMultiplier: 1,
        content: (
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
                    Whether it&apos;s architecting complex backend infrastructure or polishing the finest details
                    of a user interface, I bring dedication and precision to every line of code.
                </p>
            </div>
        )
    };

    return <Section config={config} theme={theme} windowHeight={windowHeight} />;
});

// Featured Work Section
export const WorkSection = memo(function WorkSection({ theme, windowHeight }: SectionProps) {
    const projects = [
        {
            title: 'ResearchLens',
            description: 'An AI-powered research assistant that synthesizes complex academic papers into actionable insights.'
        },
        {
            title: 'ChatBot Builder',
            description: 'A no-code visual interface for constructing intelligent conversational agents.'
        },
        {
            title: 'Meeting Minutes',
            description: 'Automated transcription and summarization service for corporate meetings.'
        }
    ];

    const config: ContentSectionConfig = {
        id: 'work',
        heading: 'Featured Work',
        headingId: 'work-heading',
        topMultiplier: 2,
        content: (
            <div className="max-w-3xl text-center px-8 py-10 rounded-3xl backdrop-blur-sm bg-black/10 border border-white/10 mx-6 shadow-2xl">
                <h2
                    id="work-heading"
                    className="text-4xl font-light mb-8 transition-colors duration-1000"
                    style={{ color: theme.details.text }}
                >
                    Featured Work
                </h2>
                <div className="space-y-6">
                    {projects.map((project, index) => (
                        <article key={index}>
                            <h3 className="text-xl font-medium mb-2" style={{ color: theme.details.text }}>
                                {project.title}
                            </h3>
                            <p className="text-base" style={{ color: theme.details.textSub }}>
                                {project.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        )
    };

    return <Section config={config} theme={theme} windowHeight={windowHeight} />;
});

// Contact Section
export const ContactSection = memo(function ContactSection({ theme, windowHeight }: SectionProps) {
    const links = [
        { href: 'mailto:contact@example.com', label: 'Email' },
        { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
        { href: 'https://github.com/Pramish-Sihali', label: 'GitHub', external: true }
    ];

    const config: ContentSectionConfig = {
        id: 'contact',
        heading: 'Get in Touch',
        headingId: 'contact-heading',
        topMultiplier: 3,
        content: (
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
                    Interested in collaborating or have a project in mind? Let&apos;s build something extraordinary together.
                    <br /><br />
                    I&apos;m currently available for freelance projects and open to discussing new opportunities.
                </p>
                <nav className="flex gap-8 justify-center" aria-label="Contact links">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            {...(link.external && {
                                target: '_blank',
                                rel: 'noopener noreferrer'
                            })}
                            className="text-sm tracking-widest uppercase border-b border-transparent hover:border-current transition-all duration-300"
                            style={{ color: theme.details.text }}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        )
    };

    return <Section config={config} theme={theme} windowHeight={windowHeight} />;
});

// Footer Section
export const FooterSection = memo(function FooterSection({ theme, windowHeight }: SectionProps) {
    const config: ContentSectionConfig = {
        id: 'footer',
        heading: 'Footer',
        headingId: 'footer-content',
        topMultiplier: 4,
        element: 'footer',
        content: (
            <p
                className="text-xs tracking-widest uppercase transition-colors duration-1000"
                style={{ color: theme.details.textSub }}
            >
                © 2025 Pramish Sihali
            </p>
        )
    };

    return <Section config={config} theme={theme} windowHeight={windowHeight} />;
});

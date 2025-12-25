'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

/**
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Portfolio Error Boundary caught an error:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#0a0a15] to-[#1a1a2e]"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="text-center max-w-md">
                        <h1 className="text-4xl font-light text-white mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-white/60">
                            An unexpected error occurred. Please refresh the page to continue.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

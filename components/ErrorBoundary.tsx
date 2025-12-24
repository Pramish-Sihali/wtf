'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary component for graceful error handling.
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error to monitoring service in production
        console.error('Portfolio Error Boundary caught an error:', error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: undefined });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    className="min-h-screen flex flex-col items-center justify-center p-8"
                    style={{ background: 'linear-gradient(to bottom, #0a0a15, #1a1a2e)' }}
                >
                    <div className="text-center max-w-md">
                        <h1 className="text-4xl font-light text-white mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-white/60 mb-8">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors duration-300 backdrop-blur-sm border border-white/10"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

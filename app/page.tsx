import ParallaxPortfolio from '@/components/hero/ParallaxPortfolio';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
    return (
        <main>
            <ErrorBoundary>
                <ParallaxPortfolio />
            </ErrorBoundary>
        </main>
    );
}
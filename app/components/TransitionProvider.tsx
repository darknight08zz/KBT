'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import TransitionDoors from './TransitionDoors';

interface TransitionContextType {
    navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 'idle' = no animation
    // 'closing' = doors closing (before nav)
    // 'opening' = doors opening (after nav)
    const [phase, setPhase] = useState<'idle' | 'closing' | 'opening'>('idle');
    const [nextUrl, setNextUrl] = useState<string | null>(null);

    // Effect to detect route changes and trigger opening phase
    // If we just navigated, we should be in 'closing' phase, which completes, then we switch to 'opening'
    // But route change happens instantly in Next.js usually.
    // Logic: 
    // 1. navigate(url) -> setPhase('closing')
    // 2. TransitionDoors (close) finishes -> calls onComplete -> router.push(url) -> setPhase('opening')
    // 3. TransitionDoors (open) finishes -> setPhase('idle')

    const navigate = (href: string) => {
        if (href === pathname) return; // Ignore same route
        setNextUrl(href);
        setPhase('closing');
    };

    const handleCloseComplete = () => {
        if (nextUrl) {
            router.push(nextUrl);
            // After push, assume new page loads. We immediately switch to opening.
            // In Next.js app router, the layout persists.
            setPhase('opening');
            setNextUrl(null);
        }
    };

    const handleOpenComplete = () => {
        setPhase('idle');
    };

    return (
        <TransitionContext.Provider value={{ navigate }}>
            {phase === 'closing' && <TransitionDoors mode="close" onComplete={handleCloseComplete} />}
            {phase === 'opening' && <TransitionDoors mode="open" onComplete={handleOpenComplete} />}
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error('useTransition must be used within a TransitionProvider');
    }
    return context;
}

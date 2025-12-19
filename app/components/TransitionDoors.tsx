'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TransitionDoorsProps {
    mode: 'close' | 'open';
    onComplete?: () => void;
}

export default function TransitionDoors({ mode, onComplete }: TransitionDoorsProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (mode === 'open') {
            // For 'open' mode, we start visible and animate out
            // We can trigger onComplete after animation
        }
    }, [mode]);

    const handleAnimationComplete = () => {
        if (onComplete) onComplete();
        if (mode === 'open') setIsVisible(false);
    };

    if (!isVisible) return null;

    // Common styles for the door panels to match app theme
    const panelStyle = "absolute top-0 bottom-0 w-1/2 bg-[#0f0c29] z-[100] bg-[url('/background.jpeg')] bg-cover bg-no-repeat bg-fixed";
    // We can't use 'fixed' bg attachment easily with transform, so we use 'bg-cover' and ensuring it aligns.
    // Actually, 'bg-fixed' with transform might be glitchy. Let's use standard cover.

    if (mode === 'close') {
        return (
            <div className="fixed inset-0 z-[100] pointer-events-none flex">
                {/* Left Panel */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-1/2 h-full bg-[#0f0c29] relative overflow-hidden border-r border-white/10 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[url('/background.jpeg')] bg-cover bg-right opacity-80 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                </motion.div>

                {/* Right Panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onAnimationComplete={handleAnimationComplete}
                    className="w-1/2 h-full bg-[#0f0c29] relative overflow-hidden border-l border-white/10 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[url('/background.jpeg')] bg-cover bg-left opacity-80 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent"></div>
                </motion.div>
            </div>
        );
    }

    if (mode === 'open') {
        return (
            <motion.div
                initial={{ y: '0%' }}
                animate={{ y: '-100%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} // Custom ease for "heaviness"
                onAnimationComplete={handleAnimationComplete}
                className="fixed inset-0 z-[100] flex bg-[#0f0c29] pointer-events-none"
            >
                {/* Recreate the "joined" state visually so it looks seamless */}
                <div className="w-1/2 h-full relative border-r border-white/10">
                    <div className="absolute inset-0 bg-[url('/background.jpeg')] bg-cover bg-right opacity-80 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                </div>
                <div className="w-1/2 h-full relative border-l border-white/10">
                    <div className="absolute inset-0 bg-[url('/background.jpeg')] bg-cover bg-left opacity-80 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent"></div>
                </div>
            </motion.div>
        );
    }

    return null;
}

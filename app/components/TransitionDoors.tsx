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

    // Common styles for the door panels
    const panelClass = "w-1/2 h-full relative overflow-hidden bg-[#0f0c29]";

    if (mode === 'close') {
        return (
            <div className="fixed inset-0 z-[100] pointer-events-none flex">
                {/* Left Panel */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`${panelClass} border-r border-white/10 shadow-2xl`}
                >
                    <img
                        src="/left.jpeg"
                        alt=""
                        className="w-full h-full object-cover object-right"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent mix-blend-multiply"></div>
                </motion.div>

                {/* Right Panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onAnimationComplete={handleAnimationComplete}
                    className={`${panelClass} border-l border-white/10 shadow-2xl`}
                >
                    <img
                        src="/right.jpeg"
                        alt=""
                        className="w-full h-full object-cover object-left"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent mix-blend-multiply"></div>
                </motion.div>
            </div>
        );
    }

    if (mode === 'open') {
        return (
            <motion.div
                initial={{ y: '0%' }}
                animate={{ y: '-100%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                onAnimationComplete={handleAnimationComplete}
                className="fixed inset-0 z-[100] flex bg-[#0f0c29] pointer-events-none"
            >
                {/* Recreate the "joined" state visually so it looks seamless */}
                <div className={`${panelClass} border-r border-white/10`}>
                    <img
                        src="/left.jpeg"
                        alt=""
                        className="w-full h-full object-cover object-right"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent mix-blend-multiply"></div>
                </div>
                <div className={`${panelClass} border-l border-white/10`}>
                    <img
                        src="/right.jpeg"
                        alt=""
                        className="w-full h-full object-cover object-left"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent mix-blend-multiply"></div>
                </div>
            </motion.div>
        );
    }

    return null;
}

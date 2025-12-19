'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
    timeLeft: number;
    setTimeLeft: (time: number) => void;
    onTimeUp: () => void;
    isRunning?: boolean;
}

export default function Timer({ timeLeft, setTimeLeft, onTimeUp, isRunning = true }: TimerProps) {
    // Removed local isActive state as it duplicates upper logic or we can keep it for 0 check
    // Actually we can rely on timeLeft > 0 check.

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(Math.max(0, timeLeft - 1));
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            // If time hits 0 while running, trigger time up
            onTimeUp();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft, onTimeUp, setTimeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel px-4 py-2 text-xl font-mono font-bold text-primary-glow animate-pulse">
            {formatTime(timeLeft)}
        </div>
    );
}

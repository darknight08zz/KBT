'use client';

import { useEffect, useRef } from 'react';

interface TimerProps {
    timeLeft: number;
    setTimeLeft: (time: number) => void;
    onTimeUp: () => void;
    isRunning?: boolean;
}

export default function Timer({ timeLeft, setTimeLeft, onTimeUp, isRunning = true }: TimerProps) {
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (timeLeft > 0) {
            hasTriggered.current = false;
        }

        let interval: NodeJS.Timeout | null = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(Math.max(0, timeLeft - 1));
            }, 1000);
        } else if (timeLeft <= 0 && isRunning && !hasTriggered.current) {
            hasTriggered.current = true;
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

    const isLowTime = timeLeft <= 120 && timeLeft > 0;
    const isZero = timeLeft === 0;

    return (
        <div className={`glass-panel px-4 py-2 text-xl font-mono font-bold transition-colors ${
            isZero
                ? 'text-red-600 border-red-600/50'
                : isLowTime
                ? 'text-red-500 border-red-500/40 animate-pulse'
                : 'text-primary-glow animate-pulse'
        }`}>
            {formatTime(timeLeft)}
        </div>
    );
}

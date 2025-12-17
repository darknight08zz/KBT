'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
    durationSeconds?: number;
    onTimeUp: () => void;
    onTimeUpdate: (timeLeft: number) => void;
}

export default function Timer({ durationSeconds = 1200, onTimeUp, onTimeUpdate }: TimerProps) {
    // 1200 seconds = 20 minutes
    const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        // Attempt to restore from sessionStorage to persist across refresh if needed
        const savedTime = sessionStorage.getItem('kbt-timer');
        if (savedTime) {
            const parsed = parseInt(savedTime, 10);
            if (!isNaN(parsed) && parsed > 0) {
                setTimeLeft(parsed);
            }
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newVal = prev - 1;
                    sessionStorage.setItem('kbt-timer', newVal.toString());
                    if (onTimeUpdate) onTimeUpdate(newVal);
                    return newVal;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (onTimeUp) onTimeUp();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, onTimeUp, onTimeUpdate]);

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

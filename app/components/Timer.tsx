'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
    timeLeft: number;
    setTimeLeft: (time: number) => void;
    onTimeUp: () => void;
}

export default function Timer({ timeLeft, setTimeLeft, onTimeUp }: TimerProps) {
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(Math.max(0, timeLeft - 1));
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onTimeUp();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, onTimeUp, setTimeLeft]);

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

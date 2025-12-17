'use client';

import { useEffect, ReactNode } from 'react';

interface AntiCheatProviderProps {
    children: ReactNode;
    onCheat?: () => void;
}

export default function AntiCheatProvider({ children, onCheat }: AntiCheatProviderProps) {
    useEffect(() => {
        let warningCount = 0;
        const MAX_WARNINGS = 0; // Immediate disqualification as per request

        const triggerCheat = (reason: string) => {
            // alert(`CHEAT DETECTED: ${reason}. You are being disqualified.`);
            if (onCheat) {
                onCheat();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            // triggerCheat("Right Click"); // Optional: maybe just block it without DQ? User said "any method cheat detected... thrown to leaderboard"
        };

        const handleCopyDetect = (e: ClipboardEvent) => {
            e.preventDefault();
            triggerCheat("Copy/Paste Attempt");
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerCheat("Tab Switching");
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'c')
            ) {
                e.preventDefault();
                triggerCheat("Restricted Key Combination");
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyDetect);
        document.addEventListener('cut', handleCopyDetect);
        document.addEventListener('paste', handleCopyDetect);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyDetect);
            document.removeEventListener('cut', handleCopyDetect);
            document.removeEventListener('paste', handleCopyDetect);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCheat]);

    return <>{children}</>;
}

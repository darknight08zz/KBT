'use client';

import { useEffect, ReactNode } from 'react';

interface AntiCheatProviderProps {
    children: ReactNode;
}

export default function AntiCheatProvider({ children }: AntiCheatProviderProps) {
    useEffect(() => {
        // ... (existing logic) relies on window events which are typed in default DOM lib

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        const handleCopyDetect = (e: ClipboardEvent) => {
            e.preventDefault();
            alert("Copy/Paste is disabled!");
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("WARNING: Tab switching is monitored. Pls stay on this tab.");
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
    }, []);

    return <>{children}</>;
}

'use client';

import AntiCheatProvider from '@/app/components/AntiCheatProvider';

export default function QuizLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntiCheatProvider>
            {children}
        </AntiCheatProvider>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [role, setRole] = useState<string>('player');

    useEffect(() => {
        // Check session
        const storedUser = sessionStorage.getItem('kbt-username');
        const storedRole = sessionStorage.getItem('kbt-role');

        if (!storedUser) {
            router.push('/login');
        } else {
            setUsername(storedUser);
            setRole(storedRole || 'player');
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black/95 text-white p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-10 animate-pulse"></div>

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-12 glass-panel p-6 rounded-2xl">
                    <div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Welcome Back</div>
                        <h1 className="text-3xl font-bold">
                            {username} <span className="text-primary text-lg align-top ml-2 px-2 py-0.5 border border-primary/50 rounded-full bg-primary/10">{role}</span>
                        </h1>
                    </div>
                    <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-white transition-colors">
                        LOGOUT
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Main Action Card */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between min-h-[300px] border-primary/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-4">{role === 'admin' ? 'Event Control' : 'Ready to Compete?'}</h2>
                            <p className="text-gray-400 max-w-sm">
                                {role === 'admin'
                                    ? 'Manage the quiz parameters, view live stats, and monitor active users.'
                                    : 'The arena awaits. Precision and speed are your only allies here.'}
                            </p>
                        </div>

                        <div className="relative z-10 pt-8">
                            {role === 'admin' ? (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="btn-primary"
                                >
                                    Manage Quiz ⚙️
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/quiz')}
                                    className="btn-primary text-xl px-8 shadow-lg shadow-primary/20"
                                >
                                    Start Quiz 🚀
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats / Info Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => router.push('/quiz')}
                            className="bg-gradient-to-br from-primary to-primary-glow p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform group shadow-lg shadow-primary/20"
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">⚔️</span>
                            <span className="text-2xl font-bold font-sans">Enter Arena</span>
                            <span className="text-white/70 text-sm">Start the Quiz Challenge</span>
                        </button>

                        <button
                            onClick={() => router.push('/result')} // Shortcut to leaderboard
                            className="bg-secondary/50 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors group"
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🏆</span>
                            <span className="text-2xl font-bold font-sans">Leaderboard</span>
                            <span className="text-gray-400 text-sm">View Global Rankings</span>
                        </button>


                    </div>

                </div>
            </div>
        </div>
    );
}

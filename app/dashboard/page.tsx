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
                                    onClick={() => alert('Admin features coming soon!')}
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
                    <div className="grid grid-rows-2 gap-6">
                        <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                                🏆
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Current Ranking</div>
                                <div className="text-2xl font-bold text-white">--</div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                                ⏱️
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Previous Time</div>
                                <div className="text-2xl font-bold text-white">--</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

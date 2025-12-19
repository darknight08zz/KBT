'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface LeaderboardEntry {
    username: string;
    score: number;
    time_taken: number;
}

export default function LeaderboardPage() {
    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const response = await fetch('/api/leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const data = await response.json();
                setLeaderboardData(data);
            } catch (err) {
                setError('Failed to load leaderboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, []);

    const getAvatar = (rank: number) => {
        if (rank === 0) return '👑';
        if (rank === 1) return '🥈';
        if (rank === 2) return '🥉';
        return '👤';
    };

    if (loading) {
        return (
            <div className="min-h-screen app-background selection:bg-primary/30 font-sans">
                <Navbar />
                <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex justify-center items-center min-h-[60vh]">
                    <div className="text-white text-xl animate-pulse">Loading Leaderboard...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen app-background selection:bg-primary/30 font-sans">
                <Navbar />
                <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex justify-center items-center min-h-[60vh]">
                    <div className="text-red-400 text-xl">{error}</div>
                </main>
                <Footer />
            </div>
        );
    }

    // Ensure we have at least 3 items for the podium to render correctly without crashing
    const topThree = [
        leaderboardData[0] || { username: 'TBD', score: 0 },
        leaderboardData[1] || { username: 'TBD', score: 0 },
        leaderboardData[2] || { username: 'TBD', score: 0 },
    ];

    return (
        <div className="min-h-screen app-background selection:bg-primary/30 font-sans">
            <Navbar />

            <main className="pt-20 md:pt-24 pb-16 px-6 max-w-7xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <span className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        ←
                    </span>
                    <span className="font-medium">Back</span>
                </button>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-xl text-white">
                        Global <span className="text-primary-glow">Leaderboard</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg drop-shadow-md">
                        The top minds in tech. Compete to see your name among the legends.
                    </p>
                </div>

                {leaderboardData.length === 0 ? (
                    <div className="text-center text-gray-400 text-xl py-20">No players on the leaderboard yet. Be the first!</div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 mb-16">
                            {/* 2nd Place */}
                            <div className="order-2 md:order-1 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-400 flex items-center justify-center text-3xl shadow-lg mb-4">
                                    {getAvatar(1)}
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-t-2xl w-48 text-center h-48 flex flex-col justify-end">
                                    <div className="text-2xl font-bold text-gray-300">2nd</div>
                                    <div className="font-bold text-white truncate">{topThree[1].username}</div>
                                    <div className="text-primary-glow font-mono">{topThree[1].score} XP</div>
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="order-1 md:order-2 flex flex-col items-center z-10">
                                <div className="relative">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                                    <div className="w-24 h-24 rounded-full bg-yellow-600/30 border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-yellow-500/50 shadow-lg mb-4">
                                        {getAvatar(0)}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-b from-primary/20 to-black/60 backdrop-blur-md border border-yellow-500/30 p-8 rounded-t-2xl w-56 text-center h-60 flex flex-col justify-end shadow-2xl shadow-primary/10">
                                    <div className="text-3xl font-bold text-yellow-400">1st</div>
                                    <div className="font-bold text-white text-xl truncate">{topThree[0].username}</div>
                                    <div className="text-yellow-200 font-mono text-lg">{topThree[0].score} XP</div>
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="order-3 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-amber-900/40 border-2 border-amber-700 flex items-center justify-center text-3xl shadow-lg mb-4">
                                    {getAvatar(2)}
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-t-2xl w-48 text-center h-40 flex flex-col justify-end">
                                    <div className="text-2xl font-bold text-amber-600">3rd</div>
                                    <div className="font-bold text-white truncate">{topThree[2].username}</div>
                                    <div className="text-primary-glow font-mono">{topThree[2].score} XP</div>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Table */}
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-20">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5">
                                            <th className="p-3 md:p-6 font-bold text-gray-300 tracking-wider uppercase text-sm">Rank</th>
                                            <th className="p-3 md:p-6 font-bold text-gray-300 tracking-wider uppercase text-sm">Player</th>
                                            <th className="p-3 md:p-6 font-bold text-gray-300 tracking-wider uppercase text-sm">Time (s)</th>
                                            <th className="p-3 md:p-6 font-bold text-gray-300 tracking-wider uppercase text-sm text-right">Score (XP)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {leaderboardData.map((player, index) => (
                                            <tr key={index} className="group hover:bg-white/5 transition-colors">
                                                <td className="p-3 md:p-6 font-mono text-gray-400 group-hover:text-white">#{index + 1}</td>
                                                <td className="p-3 md:p-6 font-medium text-white flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">{getAvatar(index)}</span>
                                                    <span>{player.username || 'Unknown'}</span>
                                                </td>
                                                <td className="p-3 md:p-6 text-gray-400">{player.time_taken}s</td>
                                                <td className="p-3 md:p-6 text-right font-mono text-primary-glow font-bold">{player.score.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </main>

            <Footer />
        </div>
    );
}

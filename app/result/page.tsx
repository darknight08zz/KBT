'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useTransition } from '@/app/components/TransitionProvider';
import { LeaderboardEntry } from '@/app/types';

function ResultContent() {
    const searchParams = useSearchParams();
    const { navigate } = useTransition();

    // State for user results
    const [score, setScore] = useState(parseInt(searchParams.get('score') || '0'));
    const [timeTaken, setTimeTaken] = useState(parseInt(searchParams.get('time') || '0'));
    const total = 10;

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const username = sessionStorage.getItem('kbt-username');

        // 1. Fetch User Result (Source of Truth)
        if (username) {
            fetch(`/api/user/status?username=${encodeURIComponent(username)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.hasAttempted) {
                        setScore(data.score);
                        setTimeTaken(data.time_taken);
                    }
                })
                .catch(err => console.error("Failed to fetch user result:", err));
        }

        // 2. Fetch Leaderboard
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then((data: LeaderboardEntry[]) => {
                setLeaderboard(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const status = searchParams.get('status');

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
            <div className="glass-panel p-10 text-center animate-fade-in-up">
                {status === 'disqualified' ? (
                    <>
                        <h1 className="text-5xl font-bold mb-4 text-red-500">🚫 Disqualified</h1>
                        <p className="text-red-300 mb-8 font-bold">Anti-Cheat System Triggered.</p>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Multiple suspicious activities were detected during your session.
                            Your score has been discarded and you cannot retake the quiz.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-5xl font-bold mb-4 gradient-text">Quiz Completed!</h1>
                        <p className="text-gray-400 mb-8">Performance Report</p>

                        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-4xl font-bold text-primary mb-1">{score} / {total}</div>
                                <div className="text-xs uppercase tracking-widest text-gray-500">Total Score</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-4xl font-bold text-accent mb-1">{formatTime(timeTaken)}</div>
                                <div className="text-xs uppercase tracking-widest text-gray-500">Time Taken</div>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-10 flex gap-4 justify-center">
                    <button onClick={() => navigate('/dashboard')} className="btn-primary px-8">
                        Back to Dashboard
                    </button>
                    {status !== 'disqualified' && (
                        <button onClick={() => navigate('/dashboard')} className="px-8 py-3 rounded-full font-bold text-white hover:bg-white/10 transition-colors">
                            Return to Arena
                        </button>
                    )}
                </div>
            </div>

            <div className="glass-panel p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-3xl">🏆</span> Live Leaderboard
                </h2>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading rankings...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
                                    <th className="pb-4 pl-4">Rank</th>
                                    <th className="pb-4">Player</th>
                                    <th className="pb-4">Score</th>
                                    <th className="pb-4 pr-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboard.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 font-mono text-gray-400">#{idx + 1}</td>
                                        <td className="py-4 font-bold text-white">
                                            {entry.username}
                                            {idx === 0 && <span className="ml-2 text-yellow-400">👑</span>}
                                        </td>
                                        <td className="py-4 text-primary font-bold">{entry.score}</td>
                                        <td className="py-4 pr-4 text-right font-mono text-gray-300">{formatTime(entry.time_taken)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <div className="min-h-screen p-8 pt-20">
            <Suspense fallback={<div>Loading result...</div>}>
                <ResultContent />
            </Suspense>
        </div>
    );
}

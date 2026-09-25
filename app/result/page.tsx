'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useTransition } from '@/app/components/TransitionProvider';
import { LeaderboardEntry } from '@/app/types';

function ResultContent() {
    const searchParams = useSearchParams();
    const { navigate } = useTransition();

    const totalQuestions = parseInt(searchParams.get('total') || '0');
    const [score, setScore] = useState(parseInt(searchParams.get('score') || '0'));
    const [timeTaken, setTimeTaken] = useState(parseInt(searchParams.get('time') || '0'));
    const [correctCount, setCorrectCount] = useState(parseInt(searchParams.get('correct') || '0'));

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentUsername, setCurrentUsername] = useState<string>('');

    useEffect(() => {
        const username = sessionStorage.getItem('kbt-username') || '';
        setCurrentUsername(username);

        // 1. Fetch User Result (Source of Truth from DB)
        if (username) {
            fetch(`/api/user/status?username=${encodeURIComponent(username)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.hasAttempted) {
                        setScore(data.score ?? score);
                        setTimeTaken(data.time_taken ?? timeTaken);
                        const savedCorrect = sessionStorage.getItem('kbt-correct');
                        if (savedCorrect !== null) {
                            setCorrectCount(parseInt(savedCorrect));
                        }
                    }
                })
                .catch(err => console.error('Failed to fetch user result:', err));
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
        return `${m}m ${s.toString().padStart(2, '0')}s`;
    };

    const getAccuracy = () =>
        totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const getUserRank = () => {
        const idx = leaderboard.findIndex(e => e.username === currentUsername);
        return idx >= 0 ? idx + 1 : null;
    };

    const getRankLabel = (rank: number) => {
        if (rank === 1) return { emoji: '🥇', color: 'text-yellow-400' };
        if (rank === 2) return { emoji: '🥈', color: 'text-gray-300' };
        if (rank === 3) return { emoji: '🥉', color: 'text-amber-600' };
        return { emoji: `#${rank}`, color: 'text-gray-400' };
    };

    const status = searchParams.get('status');
    const userRank = getUserRank();

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">

            {/* ── Result Card ── */}
            <div className="glass-panel p-10 text-center animate-fade-in-up">
                {status === 'disqualified' ? (
                    <>
                        <h1 className="text-5xl font-bold mb-4 text-red-500">🚫 Disqualified</h1>
                        <p className="text-red-300 mb-4 font-bold">Anti-Cheat System Triggered.</p>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Multiple suspicious activities were detected during your session.
                            Your score has been discarded and you cannot retake the quiz.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-5xl mb-4">
                            {getAccuracy() >= 80 ? '🏆' : getAccuracy() >= 50 ? '⭐' : '📝'}
                        </div>
                        <h1 className="text-4xl font-bold mb-2 gradient-text">Quiz Completed!</h1>
                        <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest">Performance Report</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                                <div className="text-3xl font-bold text-primary mb-1">{score}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500">Points</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                                <div className="text-3xl font-bold text-green-400 mb-1">{correctCount}/{totalQuestions}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500">Correct</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                                <div className="text-3xl font-bold text-blue-400 mb-1">{getAccuracy()}%</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500">Accuracy</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                                <div className="text-3xl font-bold text-accent mb-1">{formatTime(timeTaken)}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500">Time Taken</div>
                            </div>
                        </div>

                        {/* Rank Banner */}
                        {userRank && (
                            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold mt-2 border ${
                                userRank === 1
                                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                                    : userRank <= 3
                                    ? 'bg-white/5 border-white/10 text-gray-200'
                                    : 'bg-white/5 border-white/10 text-gray-400'
                            }`}>
                                <span>{getRankLabel(userRank).emoji}</span>
                                <span>You ranked <strong className={getRankLabel(userRank).color}>#{userRank}</strong> on the leaderboard</span>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-10 flex gap-4 justify-center">
                    <button onClick={() => navigate('/dashboard')} className="btn-primary px-8">
                        Back to Dashboard
                    </button>
                    <button onClick={() => navigate('/leaderboard')} className="px-8 py-3 rounded-full font-bold text-white hover:bg-white/10 transition-colors border border-white/10">
                        Full Leaderboard
                    </button>
                </div>
            </div>

            {/* ── Live Leaderboard Preview ── */}
            <div className="glass-panel p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-3xl">🏆</span> Live Leaderboard
                </h2>
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Ranked by Highest Score · Fastest Time (tie-breaker)</p>

                {loading ? (
                    <div className="text-center py-10 text-gray-500 animate-pulse">Loading rankings...</div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No entries yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
                                    <th className="pb-4 pl-4 w-16">Rank</th>
                                    <th className="pb-4">Player</th>
                                    <th className="pb-4 text-center">Score (pts)</th>
                                    <th className="pb-4 pr-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboard.map((entry, idx) => {
                                    const isMe = entry.username === currentUsername;
                                    const rank = idx + 1;
                                    const { emoji, color } = getRankLabel(rank);
                                    return (
                                        <tr
                                            key={idx}
                                            className={`transition-colors ${isMe ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-white/5'}`}
                                        >
                                            <td className={`py-4 pl-4 font-mono font-bold text-lg ${color}`}>{emoji}</td>
                                            <td className="py-4 font-bold text-white">
                                                {entry.username}
                                                {isMe && <span className="ml-2 text-xs bg-primary/30 text-primary px-2 py-0.5 rounded-full">You</span>}
                                            </td>
                                            <td className="py-4 text-center font-mono text-primary font-bold text-lg">{entry.score}</td>
                                            <td className="py-4 pr-4 text-right font-mono text-gray-400">{formatTime(entry.time_taken)}</td>
                                        </tr>
                                    );
                                })}
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
        <div className="min-h-screen app-background p-8 pt-20">
            <Suspense fallback={<div className="text-white text-center animate-pulse pt-40">Loading result...</div>}>
                <ResultContent />
            </Suspense>
        </div>
    );
}

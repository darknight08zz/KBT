'use client';


import { useEffect, useState } from 'react';
import { useTransition } from '@/app/components/TransitionProvider';

export default function DashboardPage() {
    const { navigate } = useTransition();
    const [username, setUsername] = useState<string>('');
    const [role, setRole] = useState<string>('player');
    const [isYearModalOpen, setIsYearModalOpen] = useState(false);

    const [hasAttempted, setHasAttempted] = useState<boolean>(false);
    const [isArenaOpen, setIsArenaOpen] = useState<boolean>(false);

    useEffect(() => {
        // Check session
        const storedUser = sessionStorage.getItem('kbt-username');
        const storedRole = sessionStorage.getItem('kbt-role');

        if (!storedUser) {
            navigate('/login');
        } else {
            setUsername(storedUser);
            setRole(storedRole || 'player');

            // Check if user has already attempted
            if (storedRole !== 'admin') {
                fetch(`/api/user/status?username=${encodeURIComponent(storedUser)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.hasAttempted) {
                            setHasAttempted(true);
                        }
                    })
                    .catch(err => console.error("Failed to check status", err));
            }
        }

        // Check Arena Status
        fetch('/api/event/status')
            .then(res => res.json())
            .then(data => {
                setIsArenaOpen(data.is_active);
            })
            .catch(err => console.error("Failed to check arena status", err));

    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const handleStartQuiz = (year: string) => {
        if (!isArenaOpen && role !== 'admin') {
            alert("The Arena is currently closed.");
            return;
        }
        navigate(`/quiz?year=${year}`);
    };

    return (
        <div className="min-h-screen app-background text-white p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-10 animate-pulse"></div>

            {/* Year Selection Modal */}
            {isYearModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl transform scale-100 transition-all">
                        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Year</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {['1st', '2nd', '3rd'].map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleStartQuiz(year)}
                                    className="p-4 rounded-xl bg-white/5 hover:bg-primary hover:text-white border border-white/10 transition-all font-bold text-lg flex justify-between items-center group"
                                >
                                    <span>{year} Year</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsYearModalOpen(false)}
                            className="mt-6 w-full py-3 text-gray-500 hover:text-white transition-colors text-sm font-bold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

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
                    {/* Rules Card */}
                    <div className="glass-panel p-6 rounded-2xl flex flex-col md:col-span-2 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📜</span> Arena Rules & Scoring
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="font-bold text-green-400">Correct Answer</div>
                                <div className="text-2xl font-mono">+1 pt</div>
                            </div>
                            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                <div className="font-bold text-red-400">Easy Penalty</div>
                                <div className="text-2xl font-mono">-1 pt</div>
                            </div>
                            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                <div className="font-bold text-yellow-400">Medium Penalty</div>
                                <div className="text-2xl font-mono">-0.5 pt</div>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <div className="font-bold text-blue-300">Hard Penalty</div>
                                <div className="text-2xl font-mono">0 pt</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Card */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between min-h-[300px] border-primary/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-4">
                                {role === 'admin' ? 'Event Control' : hasAttempted ? 'Quiz Completed' : 'Ready to Compete?'}
                            </h2>
                            <p className="text-gray-400 max-w-sm">
                                {role === 'admin'
                                    ? 'Manage the quiz parameters, view live stats, and monitor active users.'
                                    : hasAttempted
                                        ? 'You have already submitted your score. Check the leaderboard to see your rank.'
                                        : 'The arena awaits. Precision and speed are your only allies here.'}
                            </p>
                        </div>

                        <div className="relative z-10 pt-8">
                            {role === 'admin' ? (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="btn-primary"
                                >
                                    Manage Quiz ⚙️
                                </button>
                            ) : hasAttempted ? (
                                <button
                                    onClick={() => navigate('/result')}
                                    className="px-8 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
                                >
                                    View Results 📊
                                </button>
                            ) : (
                                <button
                                    onClick={() => isArenaOpen ? setIsYearModalOpen(true) : null}
                                    disabled={!isArenaOpen}
                                    className={`btn-primary text-xl px-8 shadow-lg shadow-primary/20 ${!isArenaOpen ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                >
                                    {isArenaOpen ? 'Start Quiz 🚀' : 'Arena Locked 🔒'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats / Info Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button
                            onClick={() => isArenaOpen ? setIsYearModalOpen(true) : null}
                            disabled={!isArenaOpen}
                            className={`bg-gradient-to-br from-primary to-primary-glow p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform group shadow-lg shadow-primary/20 ${!isArenaOpen ? 'opacity-50 cursor-not-allowed grayscale from-gray-700 to-gray-800' : ''}`}
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">⚔️</span>
                            <span className="text-2xl font-bold font-sans">Enter Arena</span>
                            <span className="text-white/70 text-sm">{isArenaOpen ? 'Start the Quiz Challenge' : 'Waiting for Admin to Open'}</span>
                        </button>

                        <button
                            onClick={() => navigate('/result')} // Shortcut to leaderboard
                            className="bg-secondary/50 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors group"
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🏆</span>
                            <span className="text-2xl font-bold font-sans">Leaderboard</span>
                            <span className="text-gray-400 text-sm">View Global Rankings</span>
                        </button>

                        <button
                            onClick={() => navigate('/rules')}
                            className="bg-white/5 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors group"
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">📜</span>
                            <span className="text-2xl font-bold font-sans">Rules</span>
                            <span className="text-gray-400 text-sm">Read Competition Format</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

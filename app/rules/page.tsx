'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function RulesPage() {
    return (
        <div className="min-h-screen app-background text-white font-sans selection:bg-primary/30">

            <Navbar />

            <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="relative text-center mb-16">
                    <button
                        onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/dashboard'}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <span>←</span> Back
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
                        Rules of the Arena
                    </h1>
                    <p className="text-gray-400 text-lg">Master the format to conquer the leaderboard.</p>
                </div>

                {/* Content Grid */}
                <div className="space-y-12">

                    {/* Quiz Format Section */}
                    <section className="glass-panel p-8 rounded-2xl animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl">📜</span>
                            <h2 className="text-2xl font-bold text-white">Quiz Format</h2>
                        </div>

                        <div className="space-y-6 text-gray-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <h3 className="text-primary font-bold text-lg mb-2">Total Questions</h3>
                                    <p className="text-3xl font-mono font-bold text-white">20</p>
                                </div>
                                <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <h3 className="text-primary font-bold text-lg mb-2">Completion Mode</h3>
                                    <p className="font-medium">Must complete all 20 questions once started.</p>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg text-white mb-4">Difficulty Breakdown</h3>
                                <ul className="space-y-3">
                                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-green-400 font-bold">Easy</span>
                                            <span className="text-xs text-green-400/70">15 Seconds / Q</span>
                                        </div>
                                        <span className="text-gray-400">10 Questions</span>
                                        <div className="text-right">
                                            <span className="text-green-400 block">+1 Correct</span>
                                            <span className="text-red-400 block text-xs">-1 Incorrect</span>
                                        </div>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-yellow-400 font-bold">Medium</span>
                                            <span className="text-xs text-yellow-400/70">60 Seconds / Q</span>
                                        </div>
                                        <span className="text-gray-400">5 Questions</span>
                                        <div className="text-right">
                                            <span className="text-green-400 block">+1 Correct</span>
                                            <span className="text-red-400 block text-xs">-0.5 Incorrect</span>
                                        </div>
                                    </li>
                                    <li className="flex justify-between items-center pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-red-400 font-bold">Hard</span>
                                            <span className="text-xs text-red-400/70">3 Minutes / Q</span>
                                        </div>
                                        <span className="text-gray-400">5 Questions</span>
                                        <div className="text-right">
                                            <span className="text-green-400 block">+1 Correct</span>
                                            <span className="text-gray-500 block text-xs">0 Incorrect</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <p className="text-xl text-white font-bold text-center mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                Different question sets for 1st, 2nd, and 3rd year participants.
                            </p>
                        </div>
                    </section>

                    {/* Rules Section */}
                    <section className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl">⚖️</span>
                            <h2 className="text-2xl font-bold text-white">Competition Rules</h2>
                        </div>

                        <ul className="space-y-4 text-gray-300">
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">1</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Time Tracking</h3>
                                    <p>Your time will be recorded instantly from the moment you start the quiz. Every second counts.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">2</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Scoring</h3>
                                    <p>Marks will be awarded strictly based on the difficulty scoring system detailed above. Negative marking applies for Easy and Medium questions.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-primary/20">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">3</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Winner Selection</h3>
                                    <p className="text-white">The participant with the <strong>highest score</strong> in the <strong>least time</strong> will be declared the winner.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}

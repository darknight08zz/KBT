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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <h3 className="text-primary font-bold text-lg mb-2">Total Questions</h3>
                                    <p className="text-3xl font-mono font-bold text-white">20</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <h3 className="text-primary font-bold text-lg mb-2">Total Time</h3>
                                    <p className="text-3xl font-mono font-bold text-white">20 Mins</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                    <h3 className="text-primary font-bold text-lg mb-2">Attempt Limit</h3>
                                    <p className="text-3xl font-mono font-bold text-white">1 Attempt</p>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg text-white mb-4">Difficulty Breakdown</h3>
                                <ul className="space-y-3">
                                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-green-400 font-bold text-lg">Easy</span>
                                        </div>
                                        <span className="text-gray-400">10 Questions</span>
                                        <div className="text-right">
                                            <span className="text-green-400 font-bold text-lg block">+5 pts Correct</span>
                                        </div>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-yellow-400 font-bold text-lg">Medium</span>
                                        </div>
                                        <span className="text-gray-400">5 Questions</span>
                                        <div className="text-right">
                                            <span className="text-yellow-400 font-bold text-lg block">+10 pts Correct</span>
                                        </div>
                                    </li>
                                    <li className="flex justify-between items-center pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-red-400 font-bold text-lg">Hard</span>
                                        </div>
                                        <span className="text-gray-400">5 Questions</span>
                                        <div className="text-right">
                                            <span className="text-red-400 font-bold text-lg block">+15 pts Correct</span>
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
                                    <h3 className="font-bold text-white text-lg">Total Time Limit (20 Minutes)</h3>
                                    <p>You have a total of <strong>20 minutes</strong> to attempt the entire quiz. The countdown starts the moment you enter the arena.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">2</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">One-Time Attempt Only</h3>
                                    <p>Only <strong>1 attempt</strong> is permitted per participant. Once your quiz is submitted or time expires, your score is final and cannot be retaken.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">3</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Submit Anytime</h3>
                                    <p>You can submit the quiz at <strong>any time in between questions</strong> using the submit button without having to reach the end.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">4</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Scoring</h3>
                                    <p>Marks are awarded based on question difficulty: Easy = +5 pts, Medium = +10 pts, Hard = +15 pts. No marks are deducted for incorrect or skipped questions.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-primary/20">
                                <span className="bg-primary/20 text-primary font-bold px-3 py-1 rounded text-sm mt-1">5</span>
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

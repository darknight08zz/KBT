'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/app/types';
import QuestionPanel from '@/app/components/QuestionPanel';
import Timer from '@/app/components/Timer';

import Modal from '@/app/components/Modal';

export default function QuizPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total
    const [startTime] = useState(Date.now());
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('kbt-username');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUsername(storedUser);

        // Fetch Questions
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/admin/questions');
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data);
                    setSelectedAnswers(new Array(data.length).fill(null));
                }
            } catch (err) {
                console.error("Failed to load questions", err);
            }
        };
        fetchQuestions();
    }, [router]);

    const handleAnswer = (option: string) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = option;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleTimeUp = () => {
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Calculate Score
        let score = 0;
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.answer) {
                score += 4;
            } else if (selectedAnswers[index] !== null) {
                score -= 1;
            }
        });

        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        try {
            const res = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    score,
                    time_taken: timeTaken
                })
            });

            if (res.ok) {
                router.push('/result');
            } else {
                alert('Failed to submit score. Please try again.');
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting score');
            setIsSubmitting(false);
        }
    };

    if (questions.length === 0) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold">Loading Arena...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            <Modal
                isOpen={isExitModalOpen}
                title="Quit Quiz?"
                message="Your progress will be lost and you will be returned to the dashboard. Are you sure?"
                type="danger"
                confirmText="Yes, Quit"
                cancelText="Stay"
                onConfirm={() => router.push('/dashboard')}
                onCancel={() => setIsExitModalOpen(false)}
            />

            {/* Header */}
            <header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md fixed top-0 w-full z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsExitModalOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-xs uppercase font-bold text-gray-400 hover:text-white"
                    >
                        ← Exit
                    </button>
                    <img src="/file.svg" alt="Logo" className="w-8 h-8 invert" />
                    <div>
                        <h1 className="font-bold text-lg tracking-wide">KBT Arena</h1>
                        <p className="text-xs text-secondary">Player: <span className="text-white">{username}</span></p>
                    </div>
                </div>
                <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={handleTimeUp} />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Question Panel */}
                    <div className="lg:col-span-2">
                        <QuestionPanel
                            question={questions[currentQuestionIndex]}
                            currentQuestionIndex={currentQuestionIndex + 1}
                            totalQuestions={questions.length}
                            selectedAnswer={selectedAnswers[currentQuestionIndex]}
                            onAnswer={handleAnswer}
                        />

                        {/* Navigation */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${currentQuestionIndex === 0
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                Previous
                            </button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all transform hover:scale-105"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 rounded-xl font-bold bg-primary hover:bg-primary-glow text-white shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
                                >
                                    Next Question
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Question Map Sidebar */}
                    <div className="hidden lg:block">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Question Map</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((_, idx) => {
                                    const isCurrent = idx === currentQuestionIndex;
                                    const isAnswered = selectedAnswers[idx] !== null;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${isCurrent ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-black' :
                                                isAnswered ? 'bg-secondary text-black' :
                                                    'bg-white/5 text-gray-500 hover:bg-white/10'
                                                }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <div className="w-3 h-3 rounded-full bg-primary"></div> Current
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <div className="w-3 h-3 rounded-full bg-secondary"></div> Answered
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <div className="w-3 h-3 rounded-full bg-white/10"></div> Unanswered
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

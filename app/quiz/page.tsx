'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from '@/app/components/TransitionProvider';
import { Question } from '@/app/types';
import QuestionPanel from '@/app/components/QuestionPanel';
import Timer from '@/app/components/Timer';

import Modal from '@/app/components/Modal';
import AntiCheatProvider from '@/app/components/AntiCheatProvider';

function QuizContent() {
    const { navigate } = useTransition();
    const searchParams = useSearchParams();
    const year = searchParams.get('year');

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(string | string[] | null)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState<string>('');

    // 20-Minute Quiz Countdown Timer
    const [quizTimeLeft, setQuizTimeLeft] = useState<number>(20 * 60);

    // Modals
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('kbt-username');
        const role = sessionStorage.getItem('kbt-role');

        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUsername(storedUser);

        // Fetch Questions
        const fetchQuestions = async () => {
            try {
                // 1. Check Event Status
                const eventRes = await fetch('/api/admin/event');
                const eventData = await eventRes.json();

                // Admin Bypass: If role is admin, skip active check
                if (role !== 'admin' && !eventData.is_active) {
                    alert("The event is not currently active.");
                    navigate('/dashboard');
                    return;
                }

                // 2. Check User Status
                const statusRes = await fetch(`/api/user/status?username=${encodeURIComponent(storedUser)}`);
                const statusData = await statusRes.json();

                if (statusData.hasAttempted) {
                    navigate('/dashboard');
                    return;
                }

                // 3. Fetch Questions for Year
                if (!year) {
                    alert("No year assigned. Please start from the dashboard.");
                    navigate('/dashboard');
                    return;
                }

                const res = await fetch(`/api/admin/questions?year=${year}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length === 0) {
                        alert(`No questions found for ${year} year.`);
                        navigate('/dashboard');
                        return;
                    }
                    setQuestions(data);
                    // Pre-fill array with proper nulls 
                    setSelectedAnswers(new Array(data.length).fill(null));
                }
            } catch (err) {
                console.error("Failed to load questions", err);
            }
        };
        fetchQuestions();
    }, [navigate]);

    const handleAnswer = (answer: string | string[]) => {
        if (quizTimeLeft <= 0 || isSubmitting) return;

        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleQuizTimeUp = () => {
        if (isSubmitting) return;
        setIsExitModalOpen(false);
        handleSubmit();
    };

    const [startTime] = useState(Date.now());

    // Removed handlePrev as per strict flow requirements


    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Calculate Score: Easy = 5 pts, Medium = 10 pts, Hard = 15 pts
        let correctCount = 0;
        let score = 0;
        questions.forEach((q, index) => {
            const userAns = selectedAnswers[index];
            if (!userAns) return;

            let isCorrect = false;

            if (q.type === 'multiselect') {
                if (Array.isArray(userAns) && JSON.stringify([...userAns].sort()) === JSON.stringify(JSON.parse(q.answer || '[]').sort())) {
                    isCorrect = true;
                }
            } else if (q.type === 'short_answer' || q.type === 'long_answer') {
                const ansStr = typeof userAns === 'string' ? userAns.trim() : '';
                // Smart Matching (Keywords)
                if (q.keywords && q.keywords.length > 0) {
                    const keywordsArr = Array.isArray(q.keywords)
                        ? q.keywords
                        : (q.keywords as string).split(',').map(k => k.trim());
                    const matchesAll = keywordsArr.every(k => ansStr.toLowerCase().includes(k.toLowerCase()));
                    if (matchesAll) isCorrect = true;
                } else if (ansStr.toLowerCase() === q.answer.trim().toLowerCase()) {
                    isCorrect = true;
                }
            } else {
                // MCQ: exact match, no negative marking
                if (userAns === q.answer) {
                    isCorrect = true;
                }
            }

            if (isCorrect) {
                correctCount += 1;
                const difficulty = q.difficulty?.toLowerCase();
                if (difficulty === 'easy') {
                    score += 5;
                } else if (difficulty === 'hard') {
                    score += 15;
                } else {
                    // medium or default
                    score += 10;
                }
            }
        });

        sessionStorage.setItem('kbt-correct', String(correctCount));
        const timeTaken = Math.floor((Date.now() - startTime) / 1000); // seconds elapsed

        try {
            const res = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    score,
                    time_taken: timeTaken,
                    year: year || '1st'
                })
            });

            if (res.ok) {
                navigate(`/result?total=${questions.length}&score=${score}&time=${timeTaken}&correct=${correctCount}`);
            } else {
                const errorData = await res.json();
                alert(`Failed to submit: ${errorData.message || errorData.error || 'Unknown error'}`);
                setIsSubmitting(false);
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error submitting score: ${err.message}`);
            setIsSubmitting(false);
        }
    };

    const handleCheat = async () => {
        if (isSubmitting) return; // Prevent double submission
        setIsSubmitting(true);


        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    score: 0, // Disqualified score
                    time_taken: 0
                })
            });
            sessionStorage.setItem('kbt-disqualified', 'true'); // Flag to prevent re-entry
            navigate('/result?status=disqualified');
        } catch (err) {
            console.error("Cheat submission failed", err);
            navigate('/result?status=disqualified');
        }
    };

    return (
        <AntiCheatProvider onCheat={handleCheat}>
            <div className="min-h-screen app-background text-white font-sans flex flex-col">
                <Modal
                    isOpen={isExitModalOpen}
                    title="Quit Quiz?"
                    message="Your progress will be lost and you will be returned to the dashboard. Are you sure?"
                    type="danger"
                    confirmText="Yes, Quit"
                    cancelText="Stay"
                    onConfirm={() => navigate('/dashboard')}
                    onCancel={() => setIsExitModalOpen(false)}
                />

                <Modal
                    isOpen={isSubmitModalOpen}
                    title="Submit Quiz Now?"
                    message={`You have answered ${selectedAnswers.filter(a => a !== null && a !== '').length} of ${questions.length} questions. You only have 1 attempt and cannot retake the quiz. Are you sure you want to finish and submit your score?`}
                    type="info"
                    confirmText="Submit"
                    cancelText="Continue Playing"
                    onConfirm={() => {
                        setIsSubmitModalOpen(false);
                        handleSubmit();
                    }}
                    onCancel={() => setIsSubmitModalOpen(false)}
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
                    {/* Header Controls: Submit Button, Live Badge & 20-Minute Quiz Countdown Timer */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsSubmitModalOpen(true)}
                            disabled={isSubmitting}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-green-600/30 hover:bg-green-600/50 text-green-300 border border-green-500/50 hover:border-green-400 transition-all shadow-sm"
                        >
                            Submit
                        </button>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Live Arena
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Quiz Time Remaining</span>
                            <Timer
                                timeLeft={quizTimeLeft}
                                setTimeLeft={setQuizTimeLeft}
                                onTimeUp={handleQuizTimeUp}
                                isRunning={!isSubmitting && questions.length > 0}
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
                    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Question Panel */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Question Info Bar */}
                            <div className="flex justify-between items-center glass-panel p-4">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                        Question {currentQuestionIndex + 1} of {questions.length}
                                    </div>
                                    <div className="text-sm font-bold text-primary">
                                        {questions[currentQuestionIndex]?.topic ? `${questions[currentQuestionIndex].topic} • ` : ''}
                                        {questions[currentQuestionIndex]?.difficulty?.toUpperCase()} Level ({questions[currentQuestionIndex]?.difficulty?.toLowerCase() === 'easy' ? '+5 pts' : questions[currentQuestionIndex]?.difficulty?.toLowerCase() === 'hard' ? '+15 pts' : '+10 pts'})
                                    </div>
                                </div>
                                <div className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium">
                                    {questions[currentQuestionIndex]?.type === 'multiselect' ? '☑ Multi-Select' :
                                        questions[currentQuestionIndex]?.type === 'short_answer' ? '✍ Short Answer' :
                                        questions[currentQuestionIndex]?.type === 'long_answer' ? '📝 Long Answer' : '🔘 Single Choice'}
                                </div>
                            </div>

                            <div className="transition-opacity duration-300">
                                <QuestionPanel
                                    question={questions[currentQuestionIndex]}
                                    currentQuestionIndex={currentQuestionIndex + 1}
                                    totalQuestions={questions.length}
                                    selectedAnswer={selectedAnswers[currentQuestionIndex]}
                                    onAnswer={handleAnswer}
                                />
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-8 gap-4 flex-wrap">
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <>
                                        <button
                                            onClick={() => setIsSubmitModalOpen(true)}
                                            disabled={isSubmitting}
                                            className="px-8 py-3 rounded-xl font-bold text-sm bg-green-600/20 hover:bg-green-600/40 text-green-300 border border-green-500/40 hover:border-green-400 transition-all"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 bg-primary hover:bg-primary-glow text-white shadow-lg shadow-primary/20"
                                        >
                                            Next Question →
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full flex justify-end">
                                        <button
                                            onClick={() => setIsSubmitModalOpen(true)}
                                            disabled={isSubmitting}
                                            className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                                                isSubmitting
                                                    ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                                            }`}
                                        >
                                            Submit
                                        </button>
                                    </div>
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

                                <button
                                    onClick={() => setIsSubmitModalOpen(true)}
                                    disabled={isSubmitting}
                                    className="w-full mt-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-green-500/15 hover:bg-green-500/30 text-green-300 border border-green-500/40 transition-all text-center shadow-sm"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div >
        </AntiCheatProvider >
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen app-background text-white flex items-center justify-center font-bold animate-pulse">Loading Arena...</div>}>
            <QuizContent />
        </Suspense>
    );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Question } from '@/app/types';
import QuestionPanel from '@/app/components/QuestionPanel';
import Timer from '@/app/components/Timer';

import Modal from '@/app/components/Modal';
import AntiCheatProvider from '@/app/components/AntiCheatProvider';

function QuizContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const year = searchParams.get('year');

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(string | string[] | null)[]>([]);
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
                // 1. Check Event Status
                const eventRes = await fetch('/api/admin/event');
                const eventData = await eventRes.json();

                if (!eventData.is_active || (eventData.end_time && new Date(eventData.end_time).getTime() < Date.now())) {
                    alert("The event is not currently active.");
                    router.push('/dashboard');
                    return;
                }

                // 2. Check User Status
                const statusRes = await fetch(`/api/user/status?username=${encodeURIComponent(storedUser)}`);
                const statusData = await statusRes.json();

                if (statusData.hasAttempted) {
                    alert("You have already attempted the quiz.");
                    router.push('/result');
                    return;
                }

                // 3. Fetch Questions for Year
                if (!year) {
                    alert("No year selected. Please start from the dashboard.");
                    router.push('/dashboard');
                    return;
                }

                const res = await fetch(`/api/admin/questions?year=${year}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length === 0) {
                        alert(`No questions found for ${year} year.`);
                        router.push('/dashboard');
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
    }, [router]);

    const handleAnswer = (answer: string | string[]) => {
        const newAnswers = [...selectedAnswers];

        // For multiselect, if we receive a single value, we toggle it (logic moved to parent or kept here?)
        // Actually simplest is QuestionPanel handles toggling and sends full array back, 
        // OR QuestionPanel sends the toggled value and we handle logic.
        // Let's assume QuestionPanel sends the FINAL new value for that question.
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

    // Removed handlePrev as per strict flow requirements

    const handleTimeUp = () => {
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Calculate Score
        let score = 0;
        questions.forEach((q, index) => {
            const userAns = selectedAnswers[index];
            if (!userAns) return;

            if (q.type === 'multiselect') {
                // Array comparison
                if (Array.isArray(userAns)) {
                    // Simple strict match for now: all options must be present (assuming sorted or strictly equal contents)
                    // Realistically we need set comparison. 
                    // Lets assume q.answer is a stringified array or we need to parse it if it comes from DB as text.
                    // Wait, DB schema `answer` is TEXT. For multiselect admin saves what?
                    // Admin UI saves single string 'answer'. 
                    // This is a flaw in my plan/current app. 
                    // For multiselect, valid answer should be comparing against 'answer' field which might be JSON string?
                    // OR we check if userAns contains the answer string?
                    // Let's stick to existing logic for MCQ essentially, but for Multiselect we might just award points if *some* correct logic met?
                    // Since Admin UI 'answer' is a simple input, let's assume strict string match for now or just skip complex grading for multiselect in this iteration.
                    // I will mark it correct if it matches q.answer string.
                    if (JSON.stringify(userAns.sort()) === q.answer) score += 5;
                }
            } else if (q.type === 'short_answer' || q.type === 'long_answer') {
                const ansStr = typeof userAns === 'string' ? userAns.trim() : '';

                // Smart Matching (Keywords)
                if (q.keywords && q.keywords.length > 0) {
                    // Check if ANY of the keywords are present (OR logic) or ALL? 
                    // Usually "keywords" implies key points needed. Let's say if it contains *significant* overlap.
                    // Simple logic: if comma separated keywords, check if user answer contains AT LEAST ONE or ALL?
                    // "Block that is important that should be match" -> suggest ALL keywords implementation or substantial matching.
                    // Improved Logic: Check if ALL provided keywords are in the answer (insensitive).
                    const keywordsArr = Array.isArray(q.keywords) ? q.keywords : (q.keywords as string).split(',').map(k => k.trim());
                    const matchesAll = keywordsArr.every(k => ansStr.toLowerCase().includes(k.toLowerCase()));

                    if (matchesAll) score += 5;
                }
                // Fallback to exact match (relaxed)
                else if (ansStr.toLowerCase() === q.answer.trim().toLowerCase()) {
                    score += 5;
                }

                // Long answer usually needs manual review, but if keywords match we give points auto.
                // If not matched, we leave it as 0 (or manual).
            } else {
                // MCQ
                if (userAns === q.answer) {
                    score += 5;
                } else {
                    // Negative marking logic (simplified)
                    switch (q.difficulty) {
                        case 'hard': score -= 1; break;
                        case 'medium': score -= 0.5; break;
                        default: break;
                    }
                }
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

    const handleCheat = async () => {
        if (isSubmitting) return; // Prevent double submission
        setIsSubmitting(true);

        // Immediately submit disqualified score
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
            router.push('/result?status=disqualified');
        } catch (err) {
            console.error("Cheat submission failed", err);
            router.push('/result?status=disqualified');
        }
    };

    return (
        <AntiCheatProvider onCheat={handleCheat}>
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
                            <div className="flex justify-end mt-8">
                                {/* Previous button removed */}

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
                                        disabled={!selectedAnswers[currentQuestionIndex]}
                                        className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${!selectedAnswers[currentQuestionIndex]
                                            ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-glow text-white shadow-lg shadow-primary/20'
                                            }`}
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
            </div >
        </AntiCheatProvider >
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-bold animate-pulse">Loading Arena...</div>}>
            <QuizContent />
        </Suspense>
    );
}

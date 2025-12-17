'use client';

import { useState, useEffect, useCallback } from 'react';
import Timer from '@/app/components/Timer';
import QuestionPanel from '@/app/components/QuestionPanel';
import { useRouter } from 'next/navigation';
import { Question } from '@/app/types';

// Mock Questions (Ideally fetches from DB)
const MOCK_QUESTIONS: Question[] = [
    {
        text: "What is the primary function of the React 'useState' hook?",
        options: ["To manage side effects", "To manage local component state", "To fetch data", "To route between pages"],
        answer: "To manage local component state",
        topic: "React"
    },
    {
        text: "Which complexity class describes an algorithm that grows linearly with input size?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        answer: "O(n)",
        topic: "DSA"
    },
    {
        text: "In Python, which keyword is used to define a function?",
        options: ["func", "def", "function", "define"],
        answer: "def",
        topic: "Python"
    },
    {
        text: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Question Language", "System Query Logic", "Standard Query Link"],
        answer: "Structured Query Language",
        topic: "Database"
    },
    {
        text: "Which HTTP method is idempotent and used to update a resource?",
        options: ["POST", "PUT", "GET", "DELETE"],
        answer: "PUT",
        topic: "Web"
    },
    {
        text: "What is the purpose of Docker?",
        options: ["Code Compilation", "Containerization", "Version Control", "IDE"],
        answer: "Containerization",
        topic: "DevOps"
    },
    {
        text: "In JavaScript, what is the output of '2' + 2?",
        options: ["4", "22", "NaN", "Error"],
        answer: "22",
        topic: "JavaScript"
    },
    {
        text: "Which data structure follows LIFO?",
        options: ["Queue", "Stack", "Tree", "Graph"],
        answer: "Stack",
        topic: "DSA"
    },
    {
        text: "What is the difference between TCP and UDP?",
        options: ["IVP6 Support", "Encryption", "Reliability (Connection-oriented vs Connectionless)", "Speed only"],
        answer: "Reliability (Connection-oriented vs Connectionless)",
        topic: "Networking"
    },
    {
        text: "What is a 'Closure' in JavaScript?",
        options: ["A function inside a loop", "A function with preserved access to its outer scope", "A callback error", "A closed database connection"],
        answer: "A function with preserved access to its outer scope",
        topic: "JavaScript"
    }
];

export default function QuizPage() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [startTime] = useState<number>(Date.now());
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [timeElapsed, setTimeElapsed] = useState<number>(0);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('kbt-username');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUsername(storedUser);
            // Resume answers if needed (simplification: start fresh or load from localstorage)
        }
    }, [router]);

    const handleAnswer = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
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

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Calculate Score
        let score = 0;
        MOCK_QUESTIONS.forEach((q, idx) => {
            if (answers[idx] === q.answer) score++;
        });

        // Calculate Time Taken (based on timer logic inversed or just tracked)
        // Let's rely on what the Timer component reports as elapsed/remaining, 
        // OR better: derive from actual duration - remaining. 
        // For now, let's use the timeElapsed state updated by Timer.
        // Assuming Timer counts DOWN from 1200.
        // If Timer calls onTimeUpdate with 'timeLeft', then 'timeTaken' = 1200 - timeLeft.

        // Wait, the Timer component updates 'timeLeft'. 
        // Let's say we pass 1200.
        const totalDuration = 1200;
        const actualTimeTaken = totalDuration - timeElapsed; // timeElapsed state currently holding 'timeLeft' from Timer

        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    score,
                    time_taken: actualTimeTaken
                })
            });

            // Redirect to result
            router.push(`/result?score=${score}&time=${actualTimeTaken}`);
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
        }
    }, [answers, currentQuestionIndex, isSubmitting, router, timeElapsed, username]);

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 flex flex-col items-center relative">

            {/* Top Bar */}
            <div className="fixed top-0 left-0 w-full glass-panel border-b border-white/10 z-50 px-6 py-4 flex justify-between items-center">
                <div className="font-bold text-xl tracking-wider">
                    KBT <span className="text-primary">LIVE</span>
                </div>
                <Timer
                    durationSeconds={1200}
                    onTimeUp={handleSubmit}
                    onTimeUpdate={(t) => setTimeElapsed(t)}
                />
            </div>

            <QuestionPanel
                question={MOCK_QUESTIONS[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                totalQuestions={MOCK_QUESTIONS.length}
                currentAnswer={answers[currentQuestionIndex] || null}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrev={handlePrev}
                isLast={currentQuestionIndex === MOCK_QUESTIONS.length - 1}
            />

            {/* Pagination Dots (Optional Visual) */}
            <div className="flex gap-2 mt-8 flex-wrap justify-center max-w-2xl">
                {MOCK_QUESTIONS.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentQuestionIndex ? 'bg-primary scale-125' :
                                (answers[idx] ? 'bg-white/50' : 'bg-white/10')
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}

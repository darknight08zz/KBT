'use client';

import { Question } from '@/app/types';

interface QuestionPanelProps {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    selectedAnswer: string | null;
    onAnswer: (option: string) => void;
}

export default function QuestionPanel({ question, currentQuestionIndex, totalQuestions, selectedAnswer, onAnswer }: QuestionPanelProps) {
    if (!question) return null;

    return (
        <div className="glass-panel p-8 w-full max-w-3xl mx-auto flex flex-col gap-6 animate-pulse">
            <div className="flex justify-between items-center text-sm uppercase tracking-widest text-gray-400 font-bold">
                <span>Question {currentQuestionIndex + 1} / {totalQuestions}</span>
                <span>Topic: {question.topic || 'General'}</span>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white">
                {question.text}
            </h2>

            <div className="space-y-3 mb-8">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswer(option)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedAnswer === option
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${selectedAnswer === option ? 'border-white bg-white text-primary font-bold' : 'border-gray-500 text-gray-500'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            {option}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

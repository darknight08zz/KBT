'use client';

import { Question } from '@/app/types';

interface QuestionPanelProps {
    question: Question;
    onAnswer: (option: string) => void;
    currentAnswer: string | null;
    questionIndex: number;
    totalQuestions: number;
    onNext: () => void;
    onPrev: () => void;
    isLast: boolean;
}

export default function QuestionPanel({
    question,
    onAnswer,
    currentAnswer,
    questionIndex,
    totalQuestions,
    onNext,
    onPrev,
    isLast
}: QuestionPanelProps) {
    if (!question) return null;

    return (
        <div className="glass-panel p-8 w-full max-w-3xl mx-auto flex flex-col gap-6 animate-pulse">
            <div className="flex justify-between items-center text-sm uppercase tracking-widest text-gray-400 font-bold">
                <span>Question {questionIndex + 1} / {totalQuestions}</span>
                <span>Topic: {question.topic || 'General'}</span>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white">
                {question.text}
            </h2>

            <div className="grid gap-4 mt-4">
                {question.options.map((option, idx) => {
                    const isSelected = currentAnswer === option;
                    return (
                        <button
                            key={idx}
                            onClick={() => onAnswer(option)}
                            className={`
                text-left p-4 rounded-xl border transition-all duration-200 group
                ${isSelected
                                    ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                    : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                                }
              `}
                        >
                            <span className={`
                inline-block w-8 h-8 rounded-full border text-center leading-7 mr-4 font-bold
                ${isSelected ? 'bg-primary border-primary text-white' : 'border-white/20 text-gray-400 group-hover:border-primary group-hover:text-primary'}
              `}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-lg">{option}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between mt-8 border-t border-white/10 pt-6">
                <button
                    onClick={onPrev}
                    disabled={questionIndex === 0}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${questionIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-white/10'
                        }`}
                >
                    Previous
                </button>

                <button
                    onClick={onNext}
                    className="btn-primary"
                >
                    {isLast ? 'Submit Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}

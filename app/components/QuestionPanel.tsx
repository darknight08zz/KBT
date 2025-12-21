'use client';

import { Question } from '@/app/types';

interface QuestionPanelProps {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    selectedAnswer: string | string[] | null;
    onAnswer: (option: string | string[]) => void;
}

export default function QuestionPanel({ question, currentQuestionIndex, totalQuestions, selectedAnswer, onAnswer }: QuestionPanelProps) {
    if (!question) return null;

    const handleMultiSelect = (option: string) => {
        const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
        const exists = current.includes(option);
        let newSelection;
        if (exists) {
            newSelection = current.filter(item => item !== option);
        } else {
            newSelection = [...current, option];
        }
        onAnswer(newSelection);
    };

    return (
        <div className="glass-panel p-8 w-full max-w-3xl mx-auto flex flex-col gap-6 animate-pulse">
            <div className="flex justify-between items-center text-sm uppercase tracking-widest text-gray-400 font-bold">
                <span>Question {currentQuestionIndex + 1} / {totalQuestions}</span>
                <span>Topic: {question.topic || 'General'}</span>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white whitespace-pre-wrap">
                {question.text}
            </h2>

            {question.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
                    <img src={question.image_url} alt="Question Attachment" className="w-full h-auto max-h-64 object-contain bg-black/50" />
                </div>
            )}

            <div className="space-y-3 mb-8">
                {(!question.type || question.type === 'mcq') && question.options.map((option, idx) => (
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
                            <div className="whitespace-pre-wrap text-left">{option}</div>
                        </div>
                    </button>
                ))}

                {question.type === 'multiselect' && question.options.map((option, idx) => {
                    const isSelected = Array.isArray(selectedAnswer) && selectedAnswer.includes(option);
                    return (
                        <button
                            key={idx}
                            onClick={() => handleMultiSelect(option)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected
                                ? 'bg-secondary border-primary text-white'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded border flex items-center justify-center text-xs ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-500'
                                    }`}>
                                    {isSelected && '✓'}
                                </div>
                                <div className="whitespace-pre-wrap text-left">{option}</div>
                            </div>
                        </button>
                    );
                })}

                {question.type === 'short_answer' && (
                    <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Type your answer here..."
                        value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                        onChange={(e) => onAnswer(e.target.value)}
                    />
                )}

                {question.type === 'long_answer' && (
                    <textarea
                        className="w-full h-32 bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        placeholder="Type your detailed answer here..."
                        value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                        onChange={(e) => onAnswer(e.target.value)}
                    />
                )}
            </div>
        </div>
    );
}

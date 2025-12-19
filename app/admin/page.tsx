'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Question } from '@/app/types';

interface QuestionWithId extends Question {
    id: number;
}

import Modal from '@/app/components/Modal';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'controls'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [questions, setQuestions] = useState<QuestionWithId[]>([]);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // New Question State
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        answer: '',
        topic: '',
        difficulty: 'medium',
        type: 'mcq'
    });

    // Event State
    const [eventStatus, setEventStatus] = useState<{ is_active: boolean; end_time: string | null }>({ is_active: false, end_time: null });
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        // Basic Role Check
        const role = sessionStorage.getItem('kbt-role');
        if (role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        const usersRes = await fetch('/api/admin/users');
        const qRes = await fetch('/api/admin/questions');
        if (usersRes.ok) setUsers(await usersRes.json());
        if (qRes.ok) setQuestions(await qRes.json());
        fetchEventStatus();
    };

    const fetchEventStatus = async () => {
        const res = await fetch('/api/admin/event');
        if (res.ok) {
            const data = await res.json();
            setEventStatus(data);
        }
    };




    useEffect(() => {
        const timer = setInterval(() => {
            if (eventStatus.is_active && eventStatus.end_time) {
                const end = new Date(eventStatus.end_time).getTime();
                const now = new Date().getTime();
                const dist = end - now;

                if (dist < 0) {
                    setEventStatus({ ...eventStatus, is_active: false });
                    setTimeLeft('EXPIRED');
                } else {
                    const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((dist % (1000 * 60)) / 1000);
                    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                }
            } else {
                setTimeLeft('');
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [eventStatus]);

    const handleEventAction = async (action: 'enable' | 'disable' | 'start' | 'stop') => {
        const res = await fetch('/api/admin/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        if (res.ok) {
            const data = await res.json();
            setEventStatus(data);
        }
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/admin/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuestion)
        });
        setNewQuestion({
            text: '',
            options: ['', '', '', ''],
            answer: '',
            topic: '',
            difficulty: 'medium',
            type: 'mcq'
        });
        fetchData();
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm("Delete this question?")) return;
        await fetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const confirmResetLeaderboard = async () => {
        await fetch('/api/admin/reset', { method: 'POST' });
        setIsResetModalOpen(false);
        // Optional: show a toast or success modal
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6">
            <Modal
                isOpen={isResetModalOpen}
                title="Reset Leaderboard?"
                message="This will delete ALL scores permanently. This action cannot be undone."
                type="danger"
                confirmText="Yes, Reset Everything"
                onConfirm={confirmResetLeaderboard}
                onCancel={() => setIsResetModalOpen(false)}
            />

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Event Control Center</h1>
                        <p className="text-gray-400">Manage Users, Questions & Live Event Status</p>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-sm">
                        Exit to Dashboard
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {['users', 'questions', 'controls'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 rounded-xl font-bold capitalize transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="glass-panel p-6 animate-fade-in-up">

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Registered Users ({users.length})</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Username</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Joined</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/5">
                                                <td className="p-3 text-gray-500">#{u.id}</td>
                                                <td className="p-3 flex items-center gap-2">
                                                    <span className="font-bold">{u.username}</span>
                                                    {u.is_blocked && <span className="text-xs bg-red-500 text-white px-1 rounded">BLOCKED</span>}
                                                </td>
                                                <td className="p-3 text-blue-400">{u.email || '-'}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-gray-500">{new Date(u.created_at || '').toLocaleDateString()}</td>
                                                <td className="p-3 flex gap-2">
                                                    {u.role !== 'admin' && (
                                                        <>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm(`Are you sure you want to ${u.is_blocked ? 'unblock' : 'block'} ${u.username}?`)) return;
                                                                    await fetch('/api/admin/users', {
                                                                        method: 'PATCH',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ id: u.id, is_blocked: !u.is_blocked })
                                                                    });
                                                                    fetchData();
                                                                }}
                                                                className={`px-3 py-1 rounded text-xs font-bold ${u.is_blocked ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'}`}
                                                            >
                                                                {u.is_blocked ? 'Unblock' : 'Block'}
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm(`Permanently delete ${u.username}?`)) return;
                                                                    await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
                                                                    fetchData();
                                                                }}
                                                                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* QUESTIONS TAB */}
                    {activeTab === 'questions' && (
                        <div className="space-y-8">

                            {/* Add Form */}
                            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="font-bold text-lg mb-4 text-accent">Add New Question</h3>
                                <form onSubmit={handleAddQuestion} className="space-y-4">
                                    <input
                                        placeholder="Question Text"
                                        className="w-full bg-black/50 border border-white/10 p-3 rounded-lg"
                                        value={newQuestion.text}
                                        onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                        required
                                    />
                                    {/* Image URL & Keywords */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <input
                                                placeholder="Image URL (or upload below)"
                                                className="w-full bg-black/50 border border-white/10 p-3 rounded-lg"
                                                value={(newQuestion as any).image_url || ''}
                                                onChange={e => setNewQuestion({ ...newQuestion, image_url: e.target.value } as any)}
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="file-upload"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        // Limit to 2MB to prevent huge DB rows
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            alert("File too large. Please select an image under 2MB.");
                                                            return;
                                                        }

                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const base64 = reader.result as string;
                                                            setNewQuestion({ ...newQuestion, image_url: base64 } as any);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }}
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded cursor-pointer text-xs font-bold transition-colors"
                                                >
                                                    Upload File (Max 2MB)
                                                </label>
                                                {(newQuestion as any).image_url && (
                                                    <span className="text-xs text-green-400 self-center">
                                                        {(newQuestion as any).image_url.startsWith('data:') ? 'Image Loaded' : 'URL Set'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            placeholder="Keywords (Comma separated, for smart match)"
                                            className="bg-black/50 border border-white/10 p-3 rounded-lg h-full"
                                            value={(newQuestion as any).keywords || ''}
                                            onChange={e => setNewQuestion({ ...newQuestion, keywords: e.target.value } as any)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {(newQuestion.type === 'mcq' || newQuestion.type === 'multiselect') && newQuestion.options.map((opt, i) => (
                                            <input
                                                key={i}
                                                placeholder={`Option ${i + 1}`}
                                                className="bg-black/50 border border-white/10 p-3 rounded-lg"
                                                value={opt}
                                                onChange={e => {
                                                    const newOpts = [...newQuestion.options];
                                                    newOpts[i] = e.target.value;
                                                    setNewQuestion({ ...newQuestion, options: newOpts });
                                                }}
                                                required
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <input
                                            placeholder="Correct Answer"
                                            className="flex-1 bg-black/50 border border-white/10 p-3 rounded-lg"
                                            value={newQuestion.answer}
                                            onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Topic (e.g. React)"
                                            className="w-40 bg-black/50 border border-white/10 p-3 rounded-lg"
                                            value={newQuestion.topic}
                                            onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                                        />
                                        <select
                                            className="w-40 bg-black/50 border border-white/10 p-3 rounded-lg capitalize"
                                            value={newQuestion.difficulty}
                                            onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        <select
                                            className="w-40 bg-black/50 border border-white/10 p-3 rounded-lg capitalize"
                                            value={newQuestion.type}
                                            onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                                        >
                                            <option value="mcq">MCQ (Single)</option>
                                            <option value="multiselect">Multi-Select</option>
                                            <option value="short_answer">Short Answer</option>
                                            <option value="long_answer">Long Answer</option>
                                        </select>
                                        <select
                                            className="w-40 bg-black/50 border border-white/10 p-3 rounded-lg capitalize"
                                            value={(newQuestion as any).year_category || '1st'}
                                            onChange={e => setNewQuestion({ ...newQuestion, year_category: e.target.value } as any)}
                                        >
                                            <option value="1st">1st Year</option>
                                            <option value="2nd">2nd Year</option>
                                            <option value="3rd">3rd Year</option>
                                        </select>
                                    </div>
                                    <button className="w-full btn-primary">Add Question</button>
                                </form>
                            </div>

                            {/* List */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">Question Bank ({questions.length})</h3>
                                <div className="space-y-4">
                                    {questions.map((q, idx) => (
                                        <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded">{q.topic || 'General'}</span>
                                                    <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-300 rounded uppercase">{q.type || 'MCQ'}</span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${q.difficulty === 'hard' ? 'bg-red-500/20 text-red-300' :
                                                        q.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                                            'bg-yellow-500/20 text-yellow-300'
                                                        }`}>
                                                        {q.difficulty || 'medium'}
                                                    </span>
                                                    <span className="text-xs font-bold px-2 py-1 bg-purple-500/20 text-purple-300 rounded uppercase">{(q as any).year_category || '1st'}</span>
                                                    <h4 className="font-bold"><span className="text-primary mr-2">Question #{idx + 1}:</span> {q.text}</h4>
                                                    {q.image_url && <span className="text-xs text-blue-400 border border-blue-400 px-1 rounded">IMG</span>}
                                                </div>
                                                <div className="flex gap-2 text-sm text-gray-400 flex-wrap">
                                                    {q.options.map((opt, idx) => (
                                                        <span key={`${q.id}-opt-${idx}`} className={opt === q.answer ? 'text-green-400 font-bold' : ''}>{opt}</span>
                                                    ))}
                                                    {q.keywords && <span className="text-purple-400 ml-2">Keywords: {Array.isArray(q.keywords) ? q.keywords.join(', ') : q.keywords}</span>}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded">
                                                🗑
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* CONTROLS TAB */}
                    {activeTab === 'controls' && (
                        <div className="space-y-8">
                            {/* EVENT TIMER CONTROL */}
                            {/* EVENT TIMER CONTROL */}
                            <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
                                <h3 className="text-purple-400 font-bold text-lg mb-4">Event Timer Control (6 Hours)</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 mb-2">Timer Status:</p>
                                        {eventStatus.is_active && eventStatus.end_time ? (
                                            <p className="text-2xl font-mono font-bold text-purple-400">{timeLeft}</p>
                                        ) : (
                                            <p className="text-gray-500 font-mono">No Active Timer</p>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleEventAction('start')}
                                            disabled={eventStatus.is_active && !!eventStatus.end_time}
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Start 6-Hour Timer
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* MANUAL CONTROL */}
                            <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
                                <h3 className="text-blue-400 font-bold text-lg mb-4">Manual Access Control</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 mb-2">Current Status:
                                            <span className={`ml-2 font-bold ${eventStatus.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                                {eventStatus.is_active ? 'OPEN (Users can enter)' : 'LOCKED (Users cannot enter)'}
                                            </span>
                                        </p>
                                        {eventStatus.is_active && !eventStatus.end_time && (
                                            <p className="text-xs text-blue-300 mt-1">● Manually Enabled (Indefinite)</p>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleEventAction('enable')}
                                            disabled={eventStatus.is_active}
                                            className={`px-6 py-3 rounded-lg font-bold transition-all ${eventStatus.is_active
                                                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-500 text-white'
                                                }`}
                                        >
                                            Enable Arena
                                        </button>
                                        <button
                                            onClick={() => handleEventAction('disable')}
                                            disabled={!eventStatus.is_active}
                                            className={`px-6 py-3 rounded-lg font-bold transition-all ${!eventStatus.is_active
                                                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-500 text-white'
                                                }`}
                                        >
                                            Disable Arena
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
                                <h3 className="text-red-400 font-bold text-lg mb-2">Danger Zone</h3>
                                <p className="text-gray-400 mb-6">Resetting the leaderboard will remove ALL records for every participant. This action cannot be undone.</p>
                                <button onClick={() => setIsResetModalOpen(true)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                                    Reset Leaderboard
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

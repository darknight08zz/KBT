'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AuthResponse {
    success?: boolean;
    error?: string;
    username?: string;
    role?: 'admin' | 'player';
    message?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [role, setRole] = useState<'admin' | 'player'>('player');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secretKey, setSecretKey] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isLogin ? 'login' : 'register',
                    username,
                    email: isLogin ? undefined : email,
                    password,
                    role: isLogin ? undefined : role,
                    secretKey: (!isLogin && role === 'admin') ? secretKey : undefined
                })
            });

            const data: AuthResponse = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (isLogin) {
                // Login Success
                if (data.username) sessionStorage.setItem('kbt-username', data.username);
                if (data.role) sessionStorage.setItem('kbt-role', data.role);
                router.push('/dashboard');
            } else {
                // Register Success
                setMessage('Registration successful! Please login.');
                setIsLogin(true); // Switch to login
                setPassword('');
                setSecretKey('');
                setEmail('');
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black relative overflow-hidden">

            <button
                onClick={() => router.push('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-50 font-bold text-sm uppercase tracking-widest"
            >
                ← Back to Home
            </button>

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>

            <div className="glass-panel p-8 md:p-12 max-w-md w-full animate-fade-in-up relative z-10">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'Enter your credentials to access the dashboard' : 'Join the competition today'}
                    </p>
                </div>

                {/* Auth Tabs */}
                <div className="flex p-1 bg-white/5 rounded-lg mb-8 relative">
                    <div className={`absolute top-1 bottom-1 w-[48%] bg-secondary rounded-md transition-all duration-300 ${isLogin ? 'left-1' : 'left-[51%]'}`}></div>
                    <button
                        onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
                        className={`flex-1 py-2 z-10 text-sm font-bold transition-colors ${isLogin ? 'text-white' : 'text-gray-400'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
                        className={`flex-1 py-2 z-10 text-sm font-bold transition-colors ${!isLogin ? 'text-white' : 'text-gray-400'}`}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 mb-6 text-center">{error}</div>}
                {message && <div className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20 mb-6 text-center">{message}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Role Selection (Only for Sign Up) */}
                    {!isLogin && (
                        <div className="flex gap-4 mb-2">
                            <label className={`flex-1 cursor-pointer border rounded-xl p-3 text-center transition-all ${role === 'player' ? 'border-primary bg-primary/10 text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                                <input type="radio" name="role" value="player" checked={role === 'player'} onChange={() => setRole('player')} className="hidden" />
                                <div className="font-bold">Player</div>
                                <div className="text-[10px] uppercase tracking-wider opacity-70">Participant</div>
                            </label>
                            <label className={`flex-1 cursor-pointer border rounded-xl p-3 text-center transition-all ${role === 'admin' ? 'border-primary bg-primary/10 text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                                <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="hidden" />
                                <div className="font-bold">Admin</div>
                                <div className="text-[10px] uppercase tracking-wider opacity-70">Organizer</div>
                            </label>
                        </div>
                    )}

                    {/* Admin Secret Key Input */}
                    {!isLogin && role === 'admin' && (
                        <div className="space-y-1 animate-fade-in-up">
                            <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Admin Secret Key</label>
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="w-full bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                placeholder="Enter secret key..."
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            placeholder="e.g. CodeMaster99"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="space-y-1 animate-fade-in-up">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">University Email ID</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                placeholder="name@university.edu"
                                required
                            />
                            <p className="text-[10px] text-gray-500 ml-1">Please provide your official university email ID.</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary mt-4 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Access Dashboard' : 'Create Account')}
                    </button>
                </form>

            </div>
        </div>
    );
}

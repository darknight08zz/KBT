'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed z-50 top-4 left-4 right-4 rounded-2xl border border-white/10 bg-black md:top-0 md:left-0 md:w-full md:rounded-none md:border-b md:border-t-0 md:border-x-0 md:bg-black/50 md:backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-14 md:h-20 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="KBT Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform" />
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                        KBT
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/leaderboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Leaderboard</Link>
                    <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
                    <a href="#rules" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Rules</a>
                    <a href="#prizes" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Prizes</a>
                </div>

                {/* Auth Buttons (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm font-bold text-white hover:text-primary transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white p-2"
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>

            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/leaderboard"
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
                        >
                            Leaderboard
                        </Link>
                        <a href="#about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5">About</a>
                        <a href="#rules" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5">Rules</a>
                        <a href="#prizes" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5">Prizes</a>
                    </div>

                    <div className="flex flex-col gap-3 mt-2">
                        <button
                            onClick={() => { setIsOpen(false); router.push('/login'); }}
                            className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setIsOpen(false); router.push('/login'); }}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

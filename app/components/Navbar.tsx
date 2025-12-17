'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        K
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                        KBT
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
                    <a href="#rules" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Rules</a>
                    <a href="#prizes" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Prizes</a>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
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

            </div>
        </nav>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen selection:bg-primary/30 font-sans">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-16">

        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center px-6 min-h-[80vh] text-center max-w-5xl mx-auto">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-xl">
            Kaun Banega <span className="text-primary-glow">Techpati</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed drop-shadow-md font-medium">
            Compete, learn, and grow your ranking with our interactive quiz platform.
            Real-time leaderboards, anti-cheat proctoring, and expert-level questions at your fingertips.
          </p>

          {/* Pre-Qualifying Label */}
          <h3 className="text-xl md:text-2xl font-bold text-accent mb-4 tracking-wide uppercase drop-shadow-sm">
            Pre-Qualifying Round
          </h3>

          {/* Event Details */}
          <div className="bg-black/40 backdrop-blur-sm border border-primary/30 p-6 rounded-xl mb-10 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">Event Details</h2>
            <div className="space-y-2 text-left inline-block">
              <p className="text-lg"><span className="font-semibold text-primary-glow">📅 Date:</span> 22nd December 2025, Monday</p>
              <p className="text-lg"><span className="font-semibold text-primary-glow">⏰ Time:</span> 10:00 AM - 10:00 PM</p>
              <p className="text-lg"><span className="font-semibold text-primary-glow">🌐 Platform:</span> Online</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a
              href="https://forms.gle/DA4UETxpZjZPEm2WA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-black font-bold py-4 px-8 rounded-lg hover:bg-primary/90 transition-colors text-lg"
            >
              Register Now →
            </a>
            <button
              onClick={() => router.push('/leaderboard')}
              className="bg-transparent border border-white/20 text-white font-bold py-4 px-8 rounded-lg hover:bg-white/5 transition-colors text-lg"
            >
              View Leaderboard
            </button>
          </div>
        </section>



      </main>

      <Footer />
    </div>
  );
}

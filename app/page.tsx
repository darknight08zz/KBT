'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-sans">
      <Navbar />

      <main className="pt-24 pb-16">

        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center px-6 min-h-[80vh] text-center max-w-5xl mx-auto">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Kaun Banega <span className="text-primary-glow">Techpati</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Compete, learn, and grow your ranking with our interactive quiz platform.
            Real-time leaderboards, anti-cheat proctoring, and expert-level questions at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Start Quiz Now →
            </button>
            <button className="bg-transparent border border-white/20 text-white font-bold py-4 px-8 rounded-lg hover:bg-white/5 transition-colors text-lg">
              View Leaderboard
            </button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-secondary/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Live Speed Runs</h3>
              <p className="text-gray-400 leading-relaxed">
                Solve technical challenges against the clock. Every millisecond counts towards your final global ranking.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-secondary/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-2xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Track your performance with detailed stats. Verify your skills with automated proctoring systems.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-secondary/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Fair</h3>
              <p className="text-gray-400 leading-relaxed">
                Our advanced anti-cheat system ensures a fair playing field for all developers. Pure skill wins.
              </p>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

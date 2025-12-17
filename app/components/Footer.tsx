export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">

                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">K</div>
                        <span className="font-bold text-white text-lg">Kaun Banega Techpati</span>
                    </div>
                    <p className="text-gray-500 max-w-sm leading-relaxed">
                        The ultimate platform for developers to showcase their skills, compete in real-time, and win glory.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-bold text-white mb-6">Platform</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Leaderboard</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Rules & Regulations</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="font-bold text-white mb-6">Legal</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Code of Conduct</a></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>&copy; 2025 Kaun Banega Techpati. All rights reserved.</p>
            </div>
        </footer>
    );
}

import { Head, Link } from '@inertiajs/react';

/**
 * Welcome/Landing Page Component
 *
 * This is the public-facing landing page for the RPG Consent application.
 * It explains the service, highlights key features, and provides clear CTAs
 * for registration and login.
 */
export default function Welcome() {
    return (
        <>
            <Head title="Welcome to RPG Consent" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
                {/* Navigation Bar */}
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-indigo-600">RPG Consent</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            Create Safer, More Inclusive
                            <span className="block text-indigo-600">RPG Experiences</span>
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
                            RPG Consent helps players communicate their comfort levels with various game topics,
                            and empowers Game Masters to create safer, more enjoyable gaming experiences for everyone.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            <Link
                                href="/register"
                                className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-lg text-lg font-medium transition shadow-lg hover:shadow-xl"
                            >
                                Get Started Free
                            </Link>
                            <a
                                href="#how-it-works"
                                className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-medium transition shadow-md border-2 border-indigo-600"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900">Key Features</h3>
                            <p className="mt-4 text-lg text-gray-600">
                                Everything you need for transparent, respectful gaming
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1: Digital Consent Forms */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Digital Consent Forms</h4>
                                <p className="text-gray-700">
                                    Players fill out forms with <span className="font-semibold text-green-600">Green</span> (enthusiastic),
                                    <span className="font-semibold text-yellow-600"> Yellow</span> (discuss first), and
                                    <span className="font-semibold text-red-600"> Red</span> (hard boundary) ratings for various topics.
                                </p>
                            </div>

                            {/* Feature 2: Game Management */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Game Management</h4>
                                <p className="text-gray-700">
                                    Game Masters can create campaigns, invite players with unique game codes, and manage their gaming groups effortlessly.
                                </p>
                            </div>

                            {/* Feature 3: Aggregated Data */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Anonymous Aggregated Data</h4>
                                <p className="text-gray-700">
                                    GMs see combined, anonymous consent data to plan sessions that respect everyone's boundaries without knowing individual responses.
                                </p>
                            </div>

                            {/* Feature 4: Privacy First */}
                            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Privacy-Focused</h4>
                                <p className="text-gray-700">
                                    Forms are private by default. Players explicitly choose which games to share their consent with. Your boundaries, your control.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div id="how-it-works" className="bg-slate-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900">How It Works</h3>
                            <p className="mt-4 text-lg text-gray-600">
                                Simple, transparent, and effective
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1: Players */}
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4 mx-auto">
                                    1
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">Players Fill Out Forms</h4>
                                <p className="text-gray-700 text-center">
                                    Create an account and fill out your consent form, indicating your comfort level with various RPG topics
                                    like violence, romance, horror, and more. Update it anytime.
                                </p>
                            </div>

                            {/* Step 2: Share */}
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4 mx-auto">
                                    2
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">Join Games & Share</h4>
                                <p className="text-gray-700 text-center">
                                    Join games using unique game codes provided by your GM. Choose to share your consent form with specific games.
                                    You're always in control.
                                </p>
                            </div>

                            {/* Step 3: GMs */}
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4 mx-auto">
                                    3
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3 text-center">GMs Plan Sessions</h4>
                                <p className="text-gray-700 text-center">
                                    View aggregated, anonymous consent data once all players have shared. See what topics are safe, need discussion,
                                    or should be avoided entirely.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Guide Section */}
                <div className="bg-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900">Understanding the Color System</h3>
                            <p className="mt-4 text-lg text-gray-600">
                                A simple, intuitive way to communicate boundaries
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Green */}
                            <div className="flex items-start space-x-4 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-500 rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Green - Enthusiastic Consent</h4>
                                    <p className="text-gray-700">
                                        "Bring it on! I'm comfortable with this topic and excited to explore it in the game."
                                    </p>
                                </div>
                            </div>

                            {/* Yellow */}
                            <div className="flex items-start space-x-4 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-500 rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Yellow - Proceed with Caution</h4>
                                    <p className="text-gray-700">
                                        "I'm okay if it's handled carefully or kept off-screen. Let's discuss this topic before including it in the game."
                                    </p>
                                </div>
                            </div>

                            {/* Red */}
                            <div className="flex items-start space-x-4 p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Red - Hard Boundary</h4>
                                    <p className="text-gray-700">
                                        "This is a hard line for me. Please do not include this topic in the game at all."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-indigo-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Ready to Create Safer Gaming Experiences?
                        </h3>
                        <p className="text-xl text-indigo-100 mb-8">
                            Join RPG Consent today and start building more inclusive, respectful gaming sessions.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/register"
                                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition shadow-lg hover:shadow-xl"
                            >
                                Sign Up Free
                            </Link>
                            <Link
                                href="/login"
                                className="bg-indigo-700 text-white hover:bg-indigo-800 px-8 py-3 rounded-lg text-lg font-medium transition border-2 border-white"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm">
                                &copy; {new Date().getFullYear()} RPG Consent. Creating safer, more inclusive gaming experiences.
                            </p>
                            <p className="text-xs mt-2 text-gray-400">
                                Built with care for the RPG community.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

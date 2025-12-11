import { Link, usePage } from '@inertiajs/react';

/**
 * AppLayout Component
 *
 * Main layout wrapper for authenticated pages.
 * Includes navigation, flash messages, and page content.
 */
export default function AppLayout({ children }) {
    const { auth, flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold text-gray-900">
                                    RPG Consent
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/consent-forms"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    My Consent Forms
                                </Link>
                                <Link
                                    href="/games"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Games
                                </Link>
                                <Link
                                    href="/games-join"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Join Game
                                </Link>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href="/profile"
                                        className="text-sm text-gray-700 hover:text-indigo-600 font-medium transition"
                                    >
                                        @{auth.user.username}
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Flash Messages */}
            {flash.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                        {flash.error}
                    </div>
                </div>
            )}
            {flash.info && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                        {flash.info}
                    </div>
                </div>
            )}

            {/* Page Content */}
            <main className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}


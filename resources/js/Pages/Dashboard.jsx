import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

/**
 * Dashboard Page
 * 
 * Main dashboard showing quick links to consent forms and games.
 */
export default function Dashboard() {
    return (
        <AppLayout>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <h1 className="text-3xl font-bold mb-6">Welcome to RPG Consent</h1>
                    
                    <p className="text-gray-600 mb-8">
                        Create and manage your RPG consent forms, and share them with your game groups
                        to ensure everyone has a safe and enjoyable gaming experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Consent Forms Card */}
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                            <h2 className="text-xl font-semibold mb-3">Consent Forms</h2>
                            <p className="text-gray-600 mb-4">
                                Create and manage your personal consent forms to share with your gaming groups.
                            </p>
                            <div className="space-y-2">
                                <Link
                                    href="/consent-forms/create"
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center"
                                >
                                    Create New Form
                                </Link>
                                <Link
                                    href="/consent-forms"
                                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded text-center"
                                >
                                    View My Forms
                                </Link>
                            </div>
                        </div>

                        {/* Games Card */}
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                            <h2 className="text-xl font-semibold mb-3">Games</h2>
                            <p className="text-gray-600 mb-4">
                                Create games as a DM or join existing games as a player.
                            </p>
                            <div className="space-y-2">
                                <Link
                                    href="/games/create"
                                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-center"
                                >
                                    Create New Game
                                </Link>
                                <Link
                                    href="/games"
                                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded text-center"
                                >
                                    View My Games
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Information Section */}
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900">How It Works</h3>
                        <ol className="list-decimal list-inside space-y-2 text-blue-800">
                            <li>Create a consent form indicating your comfort levels with various topics</li>
                            <li>Join a game using the game code provided by your DM</li>
                            <li>Share your consent form with the game</li>
                            <li>DMs can view aggregated consent data once all players have shared</li>
                        </ol>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


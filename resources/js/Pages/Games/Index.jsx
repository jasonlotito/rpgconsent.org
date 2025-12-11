import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * Games Index Page
 * 
 * Lists all games where the user is a DM or player.
 */
export default function Index({ gamesAsDm, gamesAsPlayer }) {
    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Games as DM */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">My Games (as DM)</h2>
                            <Link
                                href="/games/create"
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Create New Game
                            </Link>
                        </div>

                        {gamesAsDm.length === 0 ? (
                            <p className="text-gray-500">You haven't created any games yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {gamesAsDm.map((game) => (
                                    <div
                                        key={game.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                        Code: {game.game_code}
                                                    </span>
                                                    <span className="ml-4">{game.game_players_count} players</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/games/${game.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Games as Player */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Games I'm Playing In</h2>

                        {gamesAsPlayer.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You haven't joined any games yet.</p>
                                <p className="text-sm text-gray-600">Ask your DM for a game code to join.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {gamesAsPlayer.map((game) => (
                                    <div
                                        key={game.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    {game.pivot.consent_form_id ? (
                                                        <span className="text-green-600">✓ Consent form shared</span>
                                                    ) : (
                                                        <span className="text-yellow-600">⚠ Consent form not shared</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/games/${game.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


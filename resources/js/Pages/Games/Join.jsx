import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useEffect } from 'react';

/**
 * Join Game Page Component
 * 
 * Allows players to join a game using a game code.
 * Can be accessed via shareable link with pre-filled code or manually entered.
 */
export default function Join({ gameCode: prefilledCode = '', errors: serverErrors = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        game_code: prefilledCode || '',
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/games/join');
    };

    return (
        <AppLayout>
            <Head title="Join Game" />

            <div className="max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Join a Game</h1>
                    <p className="mt-2 text-gray-600">
                        Enter the game code provided by your Dungeon Master to join their game.
                    </p>
                </div>

                {/* Join Game Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
                    {/* Game Code Field */}
                    <div>
                        <label htmlFor="game_code" className="block text-sm font-medium text-gray-700 mb-2">
                            Game Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="game_code"
                            name="game_code"
                            type="text"
                            required
                            value={data.game_code}
                            onChange={(e) => setData('game_code', e.target.value.toUpperCase())}
                            placeholder="e.g., FKVUN7-LK9PT3"
                            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg font-mono text-center"
                        />
                        {errors.game_code && (
                            <p className="mt-2 text-sm text-red-600">{errors.game_code}</p>
                        )}
                        {serverErrors.game_code && (
                            <p className="mt-2 text-sm text-red-600">{serverErrors.game_code}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-500 text-center">
                            The game code is usually in the format: XXXXXX-XXXXXX
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>You'll be added to the game as a player</li>
                                        <li>You can create and share your consent form with the game</li>
                                        <li>Your DM will see aggregated anonymous data once all players share</li>
                                        <li>Your individual responses remain private</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-center space-x-4 pt-4">
                        <a
                            href="/games"
                            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Joining...' : 'Join Game'}
                        </button>
                    </div>
                </form>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have a game code? Ask your Dungeon Master to share it with you.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}


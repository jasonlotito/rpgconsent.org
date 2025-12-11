import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * Create Game Page Component
 *
 * Allows DMs to create a new game/campaign and get a unique game code
 * that players can use to join.
 */
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        minimum_players: 3,
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/games');
    };

    return (
        <AppLayout>
            <Head title="Create New Game" />

            <div className="max-w-3xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Game</h1>
                    <p className="mt-2 text-gray-600">
                        Create a new game or campaign. You'll receive a unique game code that players can use to join and share their consent forms.
                    </p>
                </div>

                {/* Create Game Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                    {/* Game Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Game Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., Curse of Strahd Campaign"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Give your game a memorable name that players will recognize.
                        </p>
                    </div>

                    {/* Game Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe your game, setting, themes, or any other relevant information..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Optional: Provide details about the game to help players understand what to expect.
                        </p>
                    </div>

                    {/* Minimum Players Field */}
                    <div>
                        <label htmlFor="minimum_players" className="block text-sm font-medium text-gray-700">
                            Minimum Players for Aggregated Data <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="minimum_players"
                            name="minimum_players"
                            type="number"
                            min="1"
                            max="100"
                            required
                            value={data.minimum_players}
                            onChange={(e) => setData('minimum_players', parseInt(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.minimum_players && (
                            <p className="mt-1 text-sm text-red-600">{errors.minimum_players}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Minimum number of players who must share consent forms before aggregated data is visible. This protects player privacy by ensuring individual responses cannot be identified. Recommended: 3 or more players.
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
                                        <li>You'll receive a unique game code</li>
                                        <li>Share the code with your players</li>
                                        <li>Players can join and share their consent forms</li>
                                        <li>Once all players have shared, you'll see aggregated consent data</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                        <a
                            href="/games"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Game'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}


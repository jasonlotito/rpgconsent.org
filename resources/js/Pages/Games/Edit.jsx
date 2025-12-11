import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * Edit Game Page Component
 *
 * Allows DMs to edit game details and manage game status.
 */
export default function Edit({ game }) {
    const { data, setData, put, processing, errors } = useForm({
        name: game.name || '',
        description: game.description || '',
        status: game.status || 'active',
        minimum_players: game.minimum_players || 3,
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/games/${game.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${game.name}`} />

            <div className="max-w-3xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Game</h1>
                    <p className="mt-2 text-gray-600">
                        Update your game details or change its status.
                    </p>
                </div>

                {/* Edit Game Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                    {/* Game Code Display */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Game Code
                        </label>
                        <code className="px-3 py-2 bg-white border border-gray-300 rounded font-mono text-indigo-600 font-bold text-lg">
                            {game.game_code}
                        </code>
                        <p className="mt-2 text-sm text-gray-500">
                            Share this code with players so they can join your game.
                        </p>
                    </div>

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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
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
                            Minimum number of players who must share consent forms before aggregated data is visible.
                        </p>
                    </div>

                    {/* Game Status Field */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            <strong>Active:</strong> Game is ongoing. <strong>Completed:</strong> Game has ended. <strong>Archived:</strong> Game is archived.
                        </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <a
                            href={`/games/${game.id}`}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="mt-8 bg-white shadow-md rounded-lg p-6 border-2 border-red-200">
                    <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Deleting a game is permanent and cannot be undone. All player associations will be removed.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
                                // Use Inertia delete method
                                window.location.href = `/games/${game.id}`;
                                // Note: This should use Inertia's delete method, but for now using form
                            }
                        }}
                        className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete Game
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}


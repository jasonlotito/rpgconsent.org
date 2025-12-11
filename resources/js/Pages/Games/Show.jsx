import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState } from 'react';

/**
 * Show Game Page Component
 *
 * Displays game details, player list, and aggregated consent data (if all players have shared).
 */
export default function Show({
    game,
    players = [],
    aggregatedData = {},
    allPlayersShared = false,
    isDm = false,
    isPlayer = false,
    userConsentForms = [],
    currentSharedFormId = null
}) {
    const [showShareForm, setShowShareForm] = useState(false);
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState('category'); // 'category' or 'consent-level'
    const { data, setData, post, processing } = useForm({
        consent_form_id: currentSharedFormId || '',
    });

    // Generate the shareable join link
    const joinLink = `${window.location.origin}/games-join?code=${game.game_code}`;

    // Handle copying join link to clipboard
    const copyJoinLink = () => {
        navigator.clipboard.writeText(joinLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    // Helper function to get color class based on consent level
    const getConsentColor = (level) => {
        switch (level) {
            case 'safe':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'discuss':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'forbidden':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Helper function to get consent label
    const getConsentLabel = (level) => {
        switch (level) {
            case 'safe':
                return 'Safe (All Green)';
            case 'discuss':
                return 'Discuss (Has Yellow)';
            case 'forbidden':
                return 'Forbidden (Has Red)';
            default:
                return 'Unknown';
        }
    };

    // Transform aggregated data for consent level view
    // Groups topics by their consent level instead of category
    const getConsentLevelGroupedData = () => {
        const grouped = {
            forbidden: [],
            discuss: [],
            safe: []
        };

        Object.entries(aggregatedData).forEach(([category, topics]) => {
            Object.entries(topics).forEach(([topic, data]) => {
                const status = typeof data === 'string' ? data : data.status;
                const isCustom = typeof data === 'object' && data.is_custom;

                grouped[status]?.push({
                    topic,
                    category,
                    status,
                    isCustom,
                    data
                });
            });
        });

        return grouped;
    };

    // Handle sharing consent form
    const handleShareConsentForm = (e) => {
        e.preventDefault();
        post(`/games/${game.id}/share-consent`, {
            onSuccess: () => {
                setShowShareForm(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={game.name} />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Game Header */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
                            {game.description && (
                                <p className="mt-2 text-gray-600">{game.description}</p>
                            )}
                            <div className="mt-4 flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="font-medium">Game Code:</span>
                                    <code className="ml-2 px-3 py-1 bg-gray-100 rounded font-mono text-indigo-600 font-bold">
                                        {game.game_code}
                                    </code>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="font-medium">Status:</span>
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                        {game.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {isDm && (
                                <a
                                    href={`/games/${game.id}/edit`}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Edit Game
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shareable Join Link Section (for DMs) */}
                {isDm && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Invite Players</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Share this link with players so they can join your game:
                        </p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                readOnly
                                value={joinLink}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono text-gray-700"
                            />
                            <button
                                onClick={copyJoinLink}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium whitespace-nowrap"
                            >
                                {copied ? '✓ Copied!' : 'Copy Link'}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Players can also join manually using the game code: <code className="px-2 py-1 bg-gray-100 rounded font-mono text-indigo-600 font-bold">{game.game_code}</code>
                        </p>
                    </div>
                )}

                {/* Share Consent Form Section (for players) */}
                {isPlayer && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Consent Form</h2>

                        {currentSharedFormId ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                You have shared your consent form with this game
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                The DM will see aggregated anonymous data once all players have shared.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowShareForm(!showShareForm)}
                                        className="text-sm text-green-700 hover:text-green-900 font-medium"
                                    >
                                        Change Form
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-yellow-800">
                                            You haven't shared a consent form yet
                                        </p>
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Share your consent form so the DM can see aggregated boundaries for the group.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowShareForm(!showShareForm)}
                                    className="mt-3 w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium"
                                >
                                    Share Consent Form
                                </button>
                            </div>
                        )}

                        {/* Share Form UI */}
                        {showShareForm && (
                            <div className="mt-4 border-t pt-4">
                                {userConsentForms.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-gray-600 mb-4">You don't have any consent forms yet.</p>
                                        <a
                                            href="/consent-forms/create"
                                            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                                        >
                                            Create Consent Form
                                        </a>
                                    </div>
                                ) : (
                                    <form onSubmit={handleShareConsentForm}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select a consent form to share:
                                        </label>
                                        <select
                                            value={data.consent_form_id}
                                            onChange={(e) => setData('consent_form_id', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">-- Select a form --</option>
                                            {userConsentForms.map((form) => (
                                                <option key={form.id} value={form.id}>
                                                    {form.game_theme || 'Untitled Form'} ({form.responses_count} responses) - Created {new Date(form.created_at).toLocaleDateString()}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="mt-3 flex space-x-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
                                            >
                                                {processing ? 'Sharing...' : 'Share Form'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowShareForm(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Players Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Players ({players.length})</h2>
                    {players.length === 0 ? (
                        <p className="text-gray-500">No players have joined yet. Share the game code with your players!</p>
                    ) : (
                        <div className="space-y-2">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium text-sm">
                                                    {player.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{player.name}</p>
                                            <p className="text-xs text-gray-500">{player.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {player.has_shared ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                ✓ Shared
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Aggregated Consent Data Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Aggregated Consent Data</h2>

                    {!allPlayersShared ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Waiting for players to share</h3>
                                    <p className="mt-1 text-sm text-yellow-700">
                                        Aggregated consent data will be available once all players have shared their consent forms AND at least {game.minimum_players} player{game.minimum_players !== 1 ? 's have' : ' has'} shared (for privacy protection).
                                    </p>
                                    <p className="mt-2 text-xs text-yellow-600">
                                        Current status: {players.filter(p => p.has_shared).length} of {players.length} players have shared
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : aggregatedData && Object.keys(aggregatedData).length > 0 ? (
                        <div className="space-y-6">
                            {/* Legend */}
                            <div className="bg-gray-50 rounded-md p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Legend:</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span><strong>Safe:</strong> All players green</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                        <span><strong>Discuss:</strong> At least one yellow</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                                        <span><strong>Forbidden:</strong> At least one red</span>
                                    </div>
                                </div>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex justify-center">
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('category')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                                            viewMode === 'category'
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        View by Category
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('consent-level')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                                            viewMode === 'consent-level'
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        View by Consent Level
                                    </button>
                                </div>
                            </div>

                            {/* Category View */}
                            {viewMode === 'category' && (
                                <div className="space-y-6">
                                    {Object.entries(aggregatedData).map(([category, topics]) => (
                                        <div key={category}>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.entries(topics).map(([topic, data]) => {
                                                    // Handle both string and object formats
                                                    const status = typeof data === 'string' ? data : data.status;
                                                    const isCustom = typeof data === 'object' && data.is_custom;
                                                    return (
                                                        <div
                                                            key={topic}
                                                            className={`p-3 border rounded-md ${getConsentColor(status)} ${
                                                                isCustom ? 'border-blue-400 border-2' : ''
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <span className="font-medium">{topic}</span>
                                                                    {isCustom && (
                                                                        <span className="ml-2 text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-100 rounded">
                                                                            Custom
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-semibold">{getConsentLabel(status)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Consent Level View */}
                            {viewMode === 'consent-level' && (
                                <div className="space-y-6">
                                    {(() => {
                                        const levelGroupedData = getConsentLevelGroupedData();
                                        return (
                                            <>
                                                {/* Forbidden Section */}
                                                {levelGroupedData.forbidden.length > 0 && (
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                                                            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                                                            Forbidden ({levelGroupedData.forbidden.length})
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {levelGroupedData.forbidden.map((item) => (
                                                                <div
                                                                    key={`${item.category}-${item.topic}`}
                                                                    className={`p-3 border rounded-md ${getConsentColor('forbidden')} ${
                                                                        item.isCustom ? 'border-blue-400 border-2' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center flex-wrap">
                                                                            <span className="font-medium">{item.topic}</span>
                                                                            <span className="ml-2 text-xs text-gray-600 italic">({item.category})</span>
                                                                            {item.isCustom && (
                                                                                <span className="ml-2 text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-100 rounded">
                                                                                    Custom
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Discuss Section */}
                                                {levelGroupedData.discuss.length > 0 && (
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                                                            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                                                            Discuss ({levelGroupedData.discuss.length})
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {levelGroupedData.discuss.map((item) => (
                                                                <div
                                                                    key={`${item.category}-${item.topic}`}
                                                                    className={`p-3 border rounded-md ${getConsentColor('discuss')} ${
                                                                        item.isCustom ? 'border-blue-400 border-2' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center flex-wrap">
                                                                            <span className="font-medium">{item.topic}</span>
                                                                            <span className="ml-2 text-xs text-gray-600 italic">({item.category})</span>
                                                                            {item.isCustom && (
                                                                                <span className="ml-2 text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-100 rounded">
                                                                                    Custom
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Safe Section */}
                                                {levelGroupedData.safe.length > 0 && (
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                                                            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                                            Safe ({levelGroupedData.safe.length})
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {levelGroupedData.safe.map((item) => (
                                                                <div
                                                                    key={`${item.category}-${item.topic}`}
                                                                    className={`p-3 border rounded-md ${getConsentColor('safe')} ${
                                                                        item.isCustom ? 'border-blue-400 border-2' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center flex-wrap">
                                                                            <span className="font-medium">{item.topic}</span>
                                                                            <span className="ml-2 text-xs text-gray-600 italic">({item.category})</span>
                                                                            {item.isCustom && (
                                                                                <span className="ml-2 text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-100 rounded">
                                                                                    Custom
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">No consent data available yet.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}


import { Head, Link } from '@inertiajs/react';

/**
 * Public Consent Form View Component
 *
 * Displays a full public consent form with all topics and comfort levels.
 * Accessible to anyone (not just authenticated users).
 */
export default function ShowConsentForm({ profileUser, form, responsesByCategory }) {
    // Helper function to get color class based on comfort level
    const getComfortColor = (level) => {
        switch (level) {
            case 'green':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'red':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Helper function to get comfort label
    const getComfortLabel = (level) => {
        switch (level) {
            case 'green':
                return 'Green - Enthusiastic consent; bring it on!';
            case 'yellow':
                return 'Yellow - Okay if veiled or offstage; discuss first';
            case 'red':
                return 'Red - Hard line; do not include';
            default:
                return 'Unknown';
        }
    };

    return (
        <>
            <Head title={`${form.name} - ${profileUser.username}'s Consent Form`} />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
                {/* Header */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {profileUser.google_avatar && (
                                    <img
                                        src={profileUser.google_avatar}
                                        alt={profileUser.username}
                                        className="h-12 w-12 rounded-full"
                                    />
                                )}
                                <div>
                                    <Link
                                        href={`/u/${profileUser.username}`}
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        ← Back to @{profileUser.username}'s profile
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-900 mt-1">
                                        {form.name}
                                    </h1>
                                </div>
                            </div>
                            <Link
                                href="/"
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Go to RPG Consent
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    {/* Form Details */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="space-y-4">
                            {form.movie_rating && (
                                <div>
                                    <span className="font-medium text-gray-700">Preferred Movie Rating:</span>
                                    <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {form.movie_rating === 'Other' && form.movie_rating_other
                                            ? form.movie_rating_other
                                            : form.movie_rating}
                                    </span>
                                </div>
                            )}
                            {form.follow_up_response && (
                                <div>
                                    <span className="font-medium text-gray-700">Additional Comments:</span>
                                    <p className="mt-2 text-gray-900 bg-gray-50 p-4 rounded-md">
                                        {form.follow_up_response}
                                    </p>
                                </div>
                            )}
                            <div className="text-sm text-gray-500">
                                Created {new Date(form.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Comfort Level Legend</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                                <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
                                <span className="font-medium">Green:</span>
                                <span className="ml-2 text-gray-600">Enthusiastic consent; bring it on!</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-2"></span>
                                <span className="font-medium">Yellow:</span>
                                <span className="ml-2 text-gray-600">Okay if veiled or offstage; discuss first</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
                                <span className="font-medium">Red:</span>
                                <span className="ml-2 text-gray-600">Hard line; do not include</span>
                            </div>
                        </div>
                    </div>

                    {/* Consent Responses by Category */}
                    {responsesByCategory && Object.keys(responsesByCategory).length > 0 ? (
                        Object.entries(responsesByCategory).map(([category, categoryResponses]) => (
                            <div key={category} className="bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
                                <div className="space-y-3">
                                    {categoryResponses.map((response) => (
                                        <div
                                            key={response.id}
                                            className={`p-4 border rounded-md ${getComfortColor(response.comfort_level)}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{response.topic_name}</span>
                                                    {response.is_custom && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            Custom
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold uppercase">{response.comfort_level}</span>
                                            </div>
                                            <p className="mt-1 text-xs">{getComfortLabel(response.comfort_level)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <p className="text-gray-500 text-center">No consent responses found for this form.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
                    <p>
                        Powered by <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-medium">RPG Consent</Link>
                    </p>
                </div>
            </div>
        </>
    );
}



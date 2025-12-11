import { Head, Link } from '@inertiajs/react';

/**
 * Public Profile Page Component
 * 
 * Displays a user's public consent forms.
 */
export default function Show({ profileUser, publicForms }) {
    return (
        <>
            <Head title={`${profileUser.username}'s Profile`} />

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
                                        className="h-16 w-16 rounded-full"
                                    />
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        @{profileUser.username}
                                    </h1>
                                    <p className="text-sm text-gray-500">Public Profile</p>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Public Consent Forms</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            These are {profileUser.username}'s publicly shared consent preferences.
                        </p>
                    </div>

                    {publicForms.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <svg 
                                className="mx-auto h-12 w-12 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No public forms</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {profileUser.username} hasn't made any consent forms public yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {publicForms.map((form) => (
                                <div key={form.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {form.name}
                                        </h3>
                                        
                                        {form.movie_rating && (
                                            <div className="mb-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {form.movie_rating === 'Other' && form.movie_rating_other 
                                                        ? form.movie_rating_other 
                                                        : form.movie_rating}
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-sm text-gray-600 mb-4">
                                            <p className="font-medium">{form.responses_count} topics covered</p>
                                        </div>

                                        {/* Categories Preview */}
                                        <div className="space-y-2">
                                            {Object.entries(form.responses_by_category).slice(0, 3).map(([category, responses]) => (
                                                <div key={category} className="text-xs">
                                                    <span className="font-medium text-gray-700">{category}:</span>
                                                    <span className="text-gray-500 ml-1">{responses.length} topics</span>
                                                </div>
                                            ))}
                                            {Object.keys(form.responses_by_category).length > 3 && (
                                                <p className="text-xs text-gray-500">
                                                    +{Object.keys(form.responses_by_category).length - 3} more categories
                                                </p>
                                            )}
                                        </div>

                                        {form.follow_up_response && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 italic">
                                                    "{form.follow_up_response.substring(0, 100)}
                                                    {form.follow_up_response.length > 100 ? '...' : ''}"
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4 text-xs text-gray-400">
                                            Created {new Date(form.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
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


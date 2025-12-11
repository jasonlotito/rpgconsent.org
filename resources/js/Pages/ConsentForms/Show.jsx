import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * Show Consent Form Page Component
 *
 * Displays a completed consent form with all responses.
 */
export default function Show({ form, responsesByCategory }) {
    const consentForm = form;

    // Convert responsesByCategory object to array format for easier rendering
    const responses = responsesByCategory
        ? Object.values(responsesByCategory).flat()
        : [];
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

    // responsesByCategory is already grouped from the controller

    return (
        <AppLayout>
            <Head title="View Consent Form" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Form Header */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{consentForm.name || 'Consent Form'}</h1>
                            <div className="mt-4 space-y-2 text-sm">
                                {consentForm.movie_rating && (
                                    <div>
                                        <span className="font-medium text-gray-700">Preferred Movie Rating:</span>
                                        <span className="ml-2 text-gray-900">
                                            {consentForm.movie_rating === 'Other'
                                                ? consentForm.movie_rating_other
                                                : consentForm.movie_rating}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {consentForm.follow_up_response && (
                                <div className="mt-4">
                                    <span className="font-medium text-gray-700">Additional Comments:</span>
                                    <p className="mt-1 text-gray-900">{consentForm.follow_up_response}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <a
                                href={`/consent-forms/${consentForm.id}/edit`}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Edit
                            </a>
                        </div>
                    </div>
                </div>

                {/* Share Status */}
                <div className={`rounded-lg p-4 ${consentForm.is_shared ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {consentForm.is_shared ? (
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm font-medium ${consentForm.is_shared ? 'text-green-800' : 'text-gray-800'}`}>
                                {consentForm.is_shared ? 'This form has been shared with games' : 'This form is private'}
                            </p>
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
                                            <span className="font-medium">{response.topic_name}</span>
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

                {/* Back Button */}
                <div className="flex justify-center">
                    <a
                        href="/consent-forms"
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Back to My Forms
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}


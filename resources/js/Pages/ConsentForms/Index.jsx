import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * ConsentForms Index Page
 *
 * Lists all consent forms created by the user.
 */
export default function Index({ forms }) {
    return (
        <AppLayout>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">My Consent Forms</h1>
                        <Link
                            href="/consent-forms/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                        >
                            Create New Form
                        </Link>
                    </div>

                    {forms.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">You haven't created any consent forms yet.</p>
                            <Link
                                href="/consent-forms/create"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Create Your First Form
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {forms.map((form) => (
                                <div
                                    key={form.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {form.name || 'Untitled Form'}
                                            </h3>
                                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                {form.movie_rating && (
                                                    <p>Preferred Rating: {form.movie_rating}</p>
                                                )}
                                                <p className="text-gray-500">
                                                    {form.responses_count} responses • Created {new Date(form.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Link
                                                href={`/consent-forms/${form.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/consent-forms/${form.id}/edit`}
                                                className="text-gray-600 hover:text-gray-800 font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}


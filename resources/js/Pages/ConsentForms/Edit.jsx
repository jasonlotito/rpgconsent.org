import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * ConsentForms Edit Page
 *
 * Form for editing an existing consent form with all topics.
 */
export default function Edit({ form, topics, movieRatings }) {
    const consentForm = form;
    const existingResponses = form.responses || [];

    // Initialize responses: merge existing responses with predefined topics
    const initializeResponses = () => {
        const initialResponses = [];

        // Add all predefined topics with their saved values or default to green
        Object.entries(topics).forEach(([category, topicList]) => {
            topicList.forEach((topic) => {
                const existingResponse = existingResponses.find(
                    (r) => r.topic_category === category && r.topic_name === topic && !r.is_custom
                );
                initialResponses.push({
                    topic_category: category,
                    topic_name: topic,
                    comfort_level: existingResponse?.comfort_level || 'green',
                    is_custom: false,
                });
            });
        });

        // Add all custom entries from existing responses
        const customResponses = existingResponses.filter((r) => r.is_custom);
        customResponses.forEach((customResponse) => {
            initialResponses.push({
                topic_category: customResponse.topic_category,
                topic_name: customResponse.topic_name,
                comfort_level: customResponse.comfort_level,
                is_custom: true,
            });
        });

        return initialResponses;
    };

    const { data, setData, put, processing, errors } = useForm({
        name: consentForm.name || '',
        is_public: consentForm.is_public || false,
        movie_rating: consentForm.movie_rating || '',
        movie_rating_other: consentForm.movie_rating_other || '',
        follow_up_response: consentForm.follow_up_response || '',
        responses: initializeResponses(),
    });

    // State for managing custom entries being added
    const [customEntryInputs, setCustomEntryInputs] = useState({});

    // Handle response change for a specific topic
    const handleResponseChange = (category, topic, level) => {
        setData('responses', data.responses.map((response) => {
            if (response.topic_category === category && response.topic_name === topic) {
                return { ...response, comfort_level: level };
            }
            return response;
        }));
    };

    // Get the current comfort level for a topic
    const getComfortLevel = (category, topic) => {
        const response = data.responses.find(
            (r) => r.topic_category === category && r.topic_name === topic
        );
        return response?.comfort_level || 'green';
    };

    // Show custom entry input for a category
    const showCustomEntryInput = (category) => {
        setCustomEntryInputs({ ...customEntryInputs, [category]: '' });
    };

    // Add a custom entry to a category
    const addCustomEntry = (category) => {
        const customTopicName = customEntryInputs[category]?.trim();
        if (!customTopicName) return;

        // Check if this custom entry already exists
        const exists = data.responses.some(
            (r) => r.topic_category === category && r.topic_name === customTopicName
        );

        if (exists) {
            alert('This entry already exists in this category.');
            return;
        }

        // Add the custom entry
        setData('responses', [
            ...data.responses,
            {
                topic_category: category,
                topic_name: customTopicName,
                comfort_level: 'green',
                is_custom: true,
            },
        ]);

        // Clear the input
        const newInputs = { ...customEntryInputs };
        delete newInputs[category];
        setCustomEntryInputs(newInputs);
    };

    // Remove a custom entry
    const removeCustomEntry = (category, topic) => {
        setData(
            'responses',
            data.responses.filter(
                (r) => !(r.topic_category === category && r.topic_name === topic && r.is_custom)
            )
        );
    };

    // Get custom entries for a category
    const getCustomEntries = (category) => {
        return data.responses.filter((r) => r.topic_category === category && r.is_custom);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/consent-forms/${consentForm.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Consent Form" />

            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Consent Form</h1>
                    <p className="mt-2 text-gray-600">
                        Update your consent preferences for this form.
                    </p>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

                        {/* Form Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Form Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., My D&D Preferences, Horror Campaign Limits"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            <p className="mt-1 text-sm text-gray-500">
                                Give your consent form a descriptive name to help you identify it later.
                            </p>
                        </div>

                        {/* Public Toggle */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="is_public"
                                    type="checkbox"
                                    checked={data.is_public}
                                    onChange={(e) => setData('is_public', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="is_public" className="font-medium text-gray-700">
                                    Make this form public
                                </label>
                                <p className="text-gray-500">
                                    Public forms will be visible on your public profile at /u/yourusername
                                </p>
                            </div>
                        </div>

                        {/* Movie Rating */}
                        <div>
                            <label htmlFor="movie_rating" className="block text-sm font-medium text-gray-700">
                                Preferred Movie Rating
                            </label>
                            <select
                                id="movie_rating"
                                value={data.movie_rating}
                                onChange={(e) => setData('movie_rating', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select a rating</option>
                                {movieRatings && movieRatings.map((rating) => (
                                    <option key={rating} value={rating}>{rating}</option>
                                ))}
                            </select>
                            {errors.movie_rating && <p className="mt-1 text-sm text-red-600">{errors.movie_rating}</p>}
                        </div>

                        {/* Movie Rating Other */}
                        {data.movie_rating === 'Other' && (
                            <div>
                                <label htmlFor="movie_rating_other" className="block text-sm font-medium text-gray-700">
                                    Specify Other Rating
                                </label>
                                <input
                                    id="movie_rating_other"
                                    type="text"
                                    value={data.movie_rating_other}
                                    onChange={(e) => setData('movie_rating_other', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.movie_rating_other && <p className="mt-1 text-sm text-red-600">{errors.movie_rating_other}</p>}
                            </div>
                        )}

                        {/* Follow-up Response */}
                        <div>
                            <label htmlFor="follow_up_response" className="block text-sm font-medium text-gray-700">
                                Additional Comments (Optional)
                            </label>
                            <textarea
                                id="follow_up_response"
                                rows="3"
                                value={data.follow_up_response}
                                onChange={(e) => setData('follow_up_response', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Consent Topics by Category */}
                    {topics && Object.entries(topics).map(([category, topicList]) => (
                        <div key={category} className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
                            <div className="space-y-3">
                                {/* Predefined topics */}
                                {topicList.map((topic) => {
                                    const currentLevel = getComfortLevel(category, topic);
                                    return (
                                        <div key={topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <span className="font-medium text-gray-900">{topic}</span>
                                            <div className="flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponseChange(category, topic, 'green')}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        currentLevel === 'green'
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                >
                                                    Green
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponseChange(category, topic, 'yellow')}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        currentLevel === 'yellow'
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                                >
                                                    Yellow
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponseChange(category, topic, 'red')}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        currentLevel === 'red'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    Red
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Custom entries */}
                                {getCustomEntries(category).map((customEntry) => {
                                    const currentLevel = getComfortLevel(category, customEntry.topic_name);
                                    return (
                                        <div
                                            key={customEntry.topic_name}
                                            className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200"
                                        >
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-900">{customEntry.topic_name}</span>
                                                <span className="ml-2 text-xs text-blue-600 font-medium px-2 py-1 bg-blue-100 rounded">
                                                    Custom
                                                </span>
                                            </div>
                                            <div className="flex space-x-2 items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponseChange(category, customEntry.topic_name, 'green')}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        currentLevel === 'green'
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                >
                                                    Green
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponseChange(category, customEntry.topic_name, 'yellow')}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        currentLevel === 'yellow'
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                                >
                                                    Yellow
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponseChange(category, customEntry.topic_name, 'red')}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                        currentLevel === 'red'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    Red
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomEntry(category, customEntry.topic_name)}
                                                    className="ml-2 text-red-600 hover:text-red-800 p-2"
                                                    title="Remove custom entry"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add custom entry input or button */}
                                {customEntryInputs[category] !== undefined ? (
                                    <div className="flex items-center space-x-2 mt-3">
                                        <input
                                            type="text"
                                            value={customEntryInputs[category]}
                                            onChange={(e) =>
                                                setCustomEntryInputs({
                                                    ...customEntryInputs,
                                                    [category]: e.target.value,
                                                })
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addCustomEntry(category);
                                                }
                                            }}
                                            placeholder="Enter custom topic name..."
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addCustomEntry(category)}
                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newInputs = { ...customEntryInputs };
                                                delete newInputs[category];
                                                setCustomEntryInputs(newInputs);
                                            }}
                                            className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => showCustomEntryInput(category)}
                                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Add custom entry to {category}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Form Actions */}
                    <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-6">
                        <a
                            href={`/consent-forms/${consentForm.id}`}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}


import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * ConsentForms Create Page
 *
 * Form for creating a new consent form with all topics.
 */
export default function Create({ topics, movieRatings }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        movie_rating: '',
        movie_rating_other: '',
        follow_up_response: '',
        responses: [],
    });

    // State for managing custom entries being added
    const [customEntryInputs, setCustomEntryInputs] = useState({});

    // Initialize responses for all topics
    useState(() => {
        const initialResponses = [];
        Object.entries(topics).forEach(([category, topicList]) => {
            topicList.forEach((topic) => {
                initialResponses.push({
                    topic_category: category,
                    topic_name: topic,
                    comfort_level: 'green', // Default to green
                    is_custom: false,
                });
            });
        });
        setData('responses', initialResponses);
    });

    const handleResponseChange = (category, topic, level) => {
        setData('responses', data.responses.map((response) => {
            if (response.topic_category === category && response.topic_name === topic) {
                return { ...response, comfort_level: level };
            }
            return response;
        }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/consent-forms');
    };

    return (
        <AppLayout>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Consent Form</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Form Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., My D&D Preferences, Horror Campaign Limits"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                <p className="mt-1 text-sm text-gray-500">
                                    Give your consent form a descriptive name to help you identify it later.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preferred Movie Rating</label>
                                <select
                                    value={data.movie_rating}
                                    onChange={(e) => setData('movie_rating', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select a rating</option>
                                    {movieRatings.map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating}
                                        </option>
                                    ))}
                                </select>
                                {errors.movie_rating && <p className="mt-1 text-sm text-red-600">{errors.movie_rating}</p>}
                            </div>

                            {data.movie_rating === 'Other' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Specify Other Rating</label>
                                    <input
                                        type="text"
                                        value={data.movie_rating_other}
                                        onChange={(e) => setData('movie_rating_other', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.movie_rating_other && <p className="mt-1 text-sm text-red-600">{errors.movie_rating_other}</p>}
                                </div>
                            )}
                        </div>

                        {/* Consent Topics */}
                        <div className="space-y-6">
                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Consent Topics</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    For each topic, select your comfort level:
                                </p>
                                <div className="space-y-2 text-sm mb-6">
                                    <div className="flex items-center">
                                        <span className="w-24 h-6 bg-green-500 rounded mr-3"></span>
                                        <span>Green: Enthusiastic consent; bring it on!</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-24 h-6 bg-yellow-400 rounded mr-3"></span>
                                        <span>Yellow: Okay if veiled or offstage; requires discussion</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-24 h-6 bg-red-500 rounded mr-3"></span>
                                        <span>Red: Hard line; do not include</span>
                                    </div>
                                </div>
                            </div>

                            {/* Topic Categories */}
                            {Object.entries(topics).map(([category, topicList]) => (
                                <div key={category} className="border-t border-gray-200 pt-6">
                                    <h3 className="text-md font-semibold text-gray-900 mb-4">{category}</h3>
                                    <div className="space-y-3">
                                        {/* Predefined topics */}
                                        {topicList.map((topic) => (
                                            <div key={topic} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">{topic}</span>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResponseChange(category, topic, 'green')}
                                                        className={`w-12 h-8 rounded ${
                                                            getComfortLevel(category, topic) === 'green'
                                                                ? 'bg-green-500 ring-2 ring-green-600'
                                                                : 'bg-green-200 hover:bg-green-300'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResponseChange(category, topic, 'yellow')}
                                                        className={`w-12 h-8 rounded ${
                                                            getComfortLevel(category, topic) === 'yellow'
                                                                ? 'bg-yellow-400 ring-2 ring-yellow-600'
                                                                : 'bg-yellow-200 hover:bg-yellow-300'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResponseChange(category, topic, 'red')}
                                                        className={`w-12 h-8 rounded ${
                                                            getComfortLevel(category, topic) === 'red'
                                                                ? 'bg-red-500 ring-2 ring-red-600'
                                                                : 'bg-red-200 hover:bg-red-300'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Custom entries */}
                                        {getCustomEntries(category).map((customEntry) => (
                                            <div
                                                key={customEntry.topic_name}
                                                className="flex items-center justify-between bg-blue-50 p-2 rounded"
                                            >
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-700">{customEntry.topic_name}</span>
                                                    <span className="ml-2 text-xs text-blue-600 font-medium">Custom</span>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleResponseChange(category, customEntry.topic_name, 'green')
                                                        }
                                                        className={`w-12 h-8 rounded ${
                                                            getComfortLevel(category, customEntry.topic_name) === 'green'
                                                                ? 'bg-green-500 ring-2 ring-green-600'
                                                                : 'bg-green-200 hover:bg-green-300'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleResponseChange(category, customEntry.topic_name, 'yellow')
                                                        }
                                                        className={`w-12 h-8 rounded ${
                                                            getComfortLevel(category, customEntry.topic_name) === 'yellow'
                                                                ? 'bg-yellow-400 ring-2 ring-yellow-600'
                                                                : 'bg-yellow-200 hover:bg-yellow-300'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleResponseChange(category, customEntry.topic_name, 'red')
                                                        }
                                                        className={`w-12 h-8 rounded ${
                                                            getComfortLevel(category, customEntry.topic_name) === 'red'
                                                                ? 'bg-red-500 ring-2 ring-red-600'
                                                                : 'bg-red-200 hover:bg-red-300'
                                                        }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCustomEntry(category, customEntry.topic_name)}
                                                        className="ml-2 text-red-600 hover:text-red-800"
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
                                        ))}

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
                                                    className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                        </div>

                        {/* Follow-up Question */}
                        <div className="border-t border-gray-200 pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Is there anything else you'd like us to know?
                            </label>
                            <textarea
                                value={data.follow_up_response}
                                onChange={(e) => setData('follow_up_response', e.target.value)}
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Any additional topics, concerns, or preferences..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <a
                                href="/consent-forms"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Consent Form'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

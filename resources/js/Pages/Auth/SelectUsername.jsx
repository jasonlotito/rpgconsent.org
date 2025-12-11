import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

/**
 * Select Username Page Component
 * 
 * Shown to new Google OAuth users to choose their username.
 */
export default function SelectUsername({ googleUser, suggestedUsername }) {
    const { data, setData, post, processing, errors } = useForm({
        username: suggestedUsername || '',
    });

    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    // Check username availability with debounce
    useEffect(() => {
        if (data.username.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(() => {
            setCheckingUsername(true);
            axios.post('/api/check-username', { username: data.username })
                .then(response => {
                    setUsernameAvailable(response.data.available);
                })
                .catch(() => {
                    setUsernameAvailable(null);
                })
                .finally(() => {
                    setCheckingUsername(false);
                });
        }, 500);

        return () => clearTimeout(timer);
    }, [data.username]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/auth/google/complete');
    };

    return (
        <>
            <Head title="Choose Username" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-600 text-center">RPG Consent</h1>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Choose your username
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            You're almost done! Pick a unique username for your account.
                        </p>
                    </div>

                    {/* Google User Info */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            {googleUser.avatar && (
                                <img 
                                    src={googleUser.avatar} 
                                    alt={googleUser.name}
                                    className="h-12 w-12 rounded-full"
                                />
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900">{googleUser.name}</p>
                                <p className="text-sm text-gray-500">{googleUser.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Username Selection Form */}
                    <form className="bg-white p-8 rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    autoFocus
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value.toLowerCase())}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="johndoe"
                                />
                                {checkingUsername && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                                {!checkingUsername && usernameAvailable === true && data.username.length >= 3 && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                )}
                                {!checkingUsername && usernameAvailable === false && (
                                    <div className="absolute right-3 top-3">
                                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                3-30 characters, lowercase letters, numbers, hyphens, and underscores only
                            </p>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                            {!checkingUsername && usernameAvailable === false && (
                                <p className="mt-1 text-sm text-red-600">This username is already taken</p>
                            )}
                            {!checkingUsername && usernameAvailable === true && data.username.length >= 3 && (
                                <p className="mt-1 text-sm text-green-600">Username is available!</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing || !usernameAvailable}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating account...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}


import { Head, Link, useForm } from '@inertiajs/react';

/**
 * Forgot Password Page Component
 * 
 * Allows users to request a password reset link via email.
 */
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div>
                        <Link href="/" className="flex justify-center">
                            <h1 className="text-3xl font-bold text-indigo-600">RPG Consent</h1>
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Reset your password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    {/* Forgot Password Form */}
                    <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
                        <div>
                            {/* Email Field */}
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Sending...' : 'Send password reset link'}
                            </button>
                        </div>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}


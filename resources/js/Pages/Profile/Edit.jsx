import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

/**
 * Profile Edit Page
 *
 * Allows users to manage their profile information, password, and linked accounts.
 */
export default function Edit({ user }) {
    const [activeSection, setActiveSection] = useState('profile');
    const { flash } = usePage().props;

    // Form for updating profile information
    const profileForm = useForm({
        username: user.username || '',
        email: user.email || '',
    });

    // Form for updating password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Handle profile update
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        profileForm.put('/profile', {
            preserveScroll: true,
            onSuccess: () => {
                // Success message is handled by flash
            },
        });
    };

    // Handle password update
    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        passwordForm.put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    // Handle Google account linking
    const handleLinkGoogle = () => {
        window.location.href = '/profile/link-google';
    };

    // Handle Google account unlinking
    const handleUnlinkGoogle = () => {
        if (confirm('Are you sure you want to unlink your Google account?')) {
            useForm().delete('/profile/unlink-google', {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Profile Settings" />

            <div className="max-w-4xl mx-auto">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
                        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                        <p className="text-indigo-100 mt-2">Manage your account information and preferences</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveSection('profile')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                                    activeSection === 'profile'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveSection('password')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                                    activeSection === 'password'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Password
                            </button>
                            <button
                                onClick={() => setActiveSection('accounts')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                                    activeSection === 'accounts'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Linked Accounts
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Profile Information Section */}
                        {activeSection === 'profile' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Update your account's profile information and email address.
                                </p>

                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {/* Username Field */}
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            value={profileForm.data.username}
                                            onChange={(e) => profileForm.setData('username', e.target.value.toLowerCase())}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            3-30 characters, lowercase letters, numbers, hyphens, and underscores only
                                        </p>
                                        {profileForm.errors.username && (
                                            <p className="mt-1 text-sm text-red-600">{profileForm.errors.username}</p>
                                        )}
                                        <p className="mt-2 text-xs text-gray-500">
                                            Your public profile: <a href={`/u/${user.username}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">{window.location.origin}/u/{user.username}</a>
                                        </p>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {profileForm.errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{profileForm.errors.email}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Password Section */}
                        {activeSection === 'password' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>

                                {!user.has_password && (
                                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-sm text-yellow-800">
                                            You signed up with Google and haven't set a password yet. Setting a password will allow you to log in with email and password.
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                    {/* Current Password (only if user has a password) */}
                                    {user.has_password && (
                                        <div>
                                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                                Current Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="current_password"
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {passwordForm.errors.current_password && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {passwordForm.errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            Password must be at least 8 characters long.
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                            Confirm New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {passwordForm.processing ? 'Updating...' : user.has_password ? 'Update Password' : 'Set Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Linked Accounts Section */}
                        {activeSection === 'accounts' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Linked Accounts</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Manage your connected authentication methods.
                                </p>

                                {/* Google Account */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <svg className="h-10 w-10" viewBox="0 0 48 48">
                                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                    <path fill="none" d="M0 0h48v48H0z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">Google</h3>
                                                {user.google_id ? (
                                                    <p className="text-sm text-green-600 flex items-center mt-1">
                                                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                        </svg>
                                                        Connected
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-500 mt-1">Not connected</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {user.google_id ? (
                                                <button
                                                    onClick={handleUnlinkGoogle}
                                                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    Unlink
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleLinkGoogle}
                                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Connect Google
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Authentication Methods Info */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">Your Authentication Methods:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        {user.has_password && (
                                            <li className="flex items-center">
                                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                </svg>
                                                Email & Password
                                            </li>
                                        )}
                                        {user.google_id && (
                                            <li className="flex items-center">
                                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                </svg>
                                                Google OAuth
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}



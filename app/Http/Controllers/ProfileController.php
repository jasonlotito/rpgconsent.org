<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

/**
 * ProfileController
 *
 * Handles user profile management including:
 * - Viewing and updating profile information
 * - Changing password
 * - Linking/unlinking Google account
 */
class ProfileController extends Controller
{
    /**
     * Display the user's profile page.
     */
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'google_id' => $user->google_id,
                'google_avatar' => $user->google_avatar,
                'has_password' => !empty($user->password),
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'username' => User::usernameRules($user->id),
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        // Convert username to lowercase
        $validated['username'] = strtolower($validated['username']);

        $user->update($validated);

        return redirect()->route('profile.edit')
            ->with('success', 'Profile updated successfully!');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        // Build validation rules based on whether user has a password
        $rules = [
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ];

        // Only require current password if user already has one
        if (!empty($user->password)) {
            $rules['current_password'] = ['required', 'string'];
        }

        // Validate the request
        $validated = $request->validate($rules);

        // Verify current password if user has one
        if (!empty($user->password)) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'The current password is incorrect.']);
            }
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        $message = empty($user->password) ? 'Password set successfully!' : 'Password updated successfully!';

        return redirect()->route('profile.edit')
            ->with('success', $message);
    }

    /**
     * Redirect to Google OAuth for linking account.
     */
    public function linkGoogle()
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    /**
     * Handle the Google OAuth callback for linking account.
     */
    public function linkGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = Auth::user();

            // Check if this Google account is already linked to another user
            $existingUser = User::where('google_id', $googleUser->getId())
                ->where('id', '!=', $user->id)
                ->first();

            if ($existingUser) {
                return redirect()->route('profile.edit')
                    ->with('error', 'This Google account is already linked to another user.');
            }

            // Link the Google account
            $user->update([
                'google_id' => $googleUser->getId(),
                'google_avatar' => $googleUser->getAvatar(),
            ]);

            return redirect()->route('profile.edit')
                ->with('success', 'Google account linked successfully!');
        } catch (\Exception $e) {
            return redirect()->route('profile.edit')
                ->with('error', 'Failed to link Google account. Please try again.');
        }
    }

    /**
     * Unlink the user's Google account.
     */
    public function unlinkGoogle()
    {
        $user = Auth::user();

        // Ensure user has a password before unlinking Google
        if (empty($user->password)) {
            return redirect()->route('profile.edit')
                ->with('error', 'You must set a password before unlinking your Google account.');
        }

        // Unlink Google account
        $user->update([
            'google_id' => null,
            'google_avatar' => null,
        ]);

        return redirect()->route('profile.edit')
            ->with('success', 'Google account unlinked successfully!');
    }
}


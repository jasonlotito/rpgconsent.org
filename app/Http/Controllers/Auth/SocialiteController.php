<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

/**
 * SocialiteController
 *
 * Handles OAuth authentication via Laravel Socialite.
 * Currently supports Google OAuth for user login and registration.
 */
class SocialiteController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google OAuth.
     * Creates a new user if they don't exist, or logs in existing user.
     * For new users, redirects to username selection page.
     *
     * @return RedirectResponse|\Inertia\Response
     */
    public function handleGoogleCallback()
    {
        try {
            // Get user info from Google
            $googleUser = Socialite::driver('google')->user();

            // Find existing user by Google ID or email
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                // Update existing user with Google info if not already set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'google_avatar' => $googleUser->getAvatar(),
                    ]);
                }

                // Log the user in
                Auth::login($user, true);

                // Redirect to dashboard or intended page
                return redirect()->intended('/dashboard');
            } else {
                // New user - store Google data in session and redirect to username selection
                Session::put('google_user', [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'google_avatar' => $googleUser->getAvatar(),
                ]);

                // Generate a suggested username from the name
                $suggestedUsername = $this->generateSuggestedUsername($googleUser->getName());

                return Inertia::render('Auth/SelectUsername', [
                    'googleUser' => [
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'avatar' => $googleUser->getAvatar(),
                    ],
                    'suggestedUsername' => $suggestedUsername,
                ]);
            }

        } catch (\Exception $e) {
            // Log the error and redirect to login with error message
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            return redirect('/login')->with('error', 'Unable to login with Google. Please try again.');
        }
    }

    /**
     * Complete Google registration with username.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function completeGoogleRegistration(Request $request): RedirectResponse
    {
        // Validate username
        $validator = Validator::make($request->all(), [
            'username' => User::usernameRules(),
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Get Google user data from session
        $googleUserData = Session::get('google_user');

        if (!$googleUserData) {
            return redirect('/login')->with('error', 'Session expired. Please try again.');
        }

        // Create the user
        $user = User::create([
            'username' => strtolower($request->username),
            'email' => $googleUserData['email'],
            'google_id' => $googleUserData['google_id'],
            'google_avatar' => $googleUserData['google_avatar'],
            'password' => Hash::make(Str::random(32)), // Random password for Google users
            'email_verified_at' => now(), // Google users are pre-verified
        ]);

        // Clear session data
        Session::forget('google_user');

        // Log the user in
        Auth::login($user, true);

        // Redirect to dashboard
        return redirect('/dashboard')->with('success', 'Welcome to RPG Consent!');
    }

    /**
     * Generate a suggested username from a name.
     *
     * @param string $name
     * @return string
     */
    private function generateSuggestedUsername(string $name): string
    {
        // Convert to lowercase and remove special characters
        $username = strtolower(preg_replace('/[^a-z0-9_-]/', '', Str::slug($name, '')));

        // Ensure minimum length
        if (strlen($username) < 3) {
            $username = 'user' . $username;
        }

        // Ensure maximum length
        if (strlen($username) > 30) {
            $username = substr($username, 0, 30);
        }

        // Make unique if needed
        $baseUsername = $username;
        $counter = 1;
        while (User::where('username', $username)->exists()) {
            $suffix = (string) $counter;
            $maxBaseLength = 30 - strlen($suffix);
            $username = substr($baseUsername, 0, $maxBaseLength) . $suffix;
            $counter++;
        }

        return $username;
    }
}

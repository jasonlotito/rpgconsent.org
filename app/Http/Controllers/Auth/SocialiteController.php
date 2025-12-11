<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
     *
     * @return RedirectResponse
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            // Get user info from Google
            $googleUser = Socialite::driver('google')->user();

            // Find or create user
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
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'google_avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(32)), // Random password for Google users
                    'email_verified_at' => now(), // Google users are pre-verified
                ]);
            }

            // Log the user in
            Auth::login($user, true);

            // Redirect to dashboard or intended page
            return redirect()->intended('/dashboard');

        } catch (\Exception $e) {
            // Log the error and redirect to login with error message
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            return redirect('/login')->with('error', 'Unable to login with Google. Please try again.');
        }
    }
}

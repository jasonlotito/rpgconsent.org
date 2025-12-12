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

        // Load social links ordered by the 'order' field
        $socialLinks = $user->socialLinks()->orderBy('order')->get();

        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'google_id' => $user->google_id,
                'google_avatar' => $user->google_avatar,
                'has_password' => !empty($user->password),
            ],
            'socialLinks' => $socialLinks,
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

    /**
     * Store a new social media link.
     */
    public function storeSocialLink(Request $request)
    {
        $user = Auth::user();

        // Check if user already has 5 links
        if ($user->socialLinks()->count() >= 5) {
            return back()->withErrors(['social_links' => 'You can only have up to 5 social media links.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'url' => 'required|url|max:255',
        ]);

        // Get the next order number
        $maxOrder = $user->socialLinks()->max('order') ?? -1;

        $user->socialLinks()->create([
            'name' => $validated['name'],
            'url' => $validated['url'],
            'order' => $maxOrder + 1,
        ]);

        return redirect()->route('profile.edit')
            ->with('success', 'Social media link added successfully!');
    }

    /**
     * Update an existing social media link.
     */
    public function updateSocialLink(Request $request, $id)
    {
        $socialLink = \App\Models\UserSocialLink::findOrFail($id);

        // Authorize the action
        $this->authorize('update', $socialLink);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'url' => 'required|url|max:255',
        ]);

        $socialLink->update($validated);

        return redirect()->route('profile.edit')
            ->with('success', 'Social media link updated successfully!');
    }

    /**
     * Delete a social media link.
     */
    public function deleteSocialLink($id)
    {
        $socialLink = \App\Models\UserSocialLink::findOrFail($id);

        // Authorize the action
        $this->authorize('delete', $socialLink);

        $socialLink->delete();

        // Reorder remaining links
        $user = Auth::user();
        $links = $user->socialLinks()->orderBy('order')->get();
        foreach ($links as $index => $link) {
            $link->update(['order' => $index]);
        }

        return redirect()->route('profile.edit')
            ->with('success', 'Social media link deleted successfully!');
    }

    /**
     * Reorder social media links.
     */
    public function reorderSocialLinks(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'links' => 'required|array',
            'links.*.id' => 'required|exists:user_social_links,id',
            'links.*.order' => 'required|integer|min:0',
        ]);

        // Update the order for each link
        foreach ($validated['links'] as $linkData) {
            $link = \App\Models\UserSocialLink::find($linkData['id']);

            // Ensure user owns this link
            if ($link && $link->user_id === $user->id) {
                $link->update(['order' => $linkData['order']]);
            }
        }

        return redirect()->route('profile.edit')
            ->with('success', 'Social media links reordered successfully!');
    }
}


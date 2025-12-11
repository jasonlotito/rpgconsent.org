<?php

namespace App\Http\Controllers;

use App\Models\ConsentForm;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

/**
 * PublicProfileController
 *
 * Handles public user profile pages showing public consent forms.
 */
class PublicProfileController extends Controller
{
    /**
     * Display a user's public profile.
     *
     * @param string $username
     * @return Response
     */
    public function show(string $username): Response
    {
        // Find user by username (case-insensitive)
        $user = User::where('username', strtolower($username))->firstOrFail();

        // Get only public consent forms with their responses
        $publicForms = $user->consentForms()
            ->where('is_public', true)
            ->with('responses')
            ->latest()
            ->get();

        // Transform forms to include response counts and categories
        $formsData = $publicForms->map(function ($form) {
            return [
                'id' => $form->id,
                'name' => $form->name,
                'movie_rating' => $form->movie_rating,
                'movie_rating_other' => $form->movie_rating_other,
                'follow_up_response' => $form->follow_up_response,
                'created_at' => $form->created_at,
                'responses_count' => $form->responses->count(),
                'responses_by_category' => $form->responses->groupBy('topic_category')->map(function ($responses) {
                    return $responses->map(function ($response) {
                        return [
                            'topic_name' => $response->topic_name,
                            'comfort_level' => $response->comfort_level,
                            'is_custom' => $response->is_custom,
                        ];
                    });
                }),
            ];
        });

        return Inertia::render('PublicProfile/Show', [
            'profileUser' => [
                'username' => $user->username,
                'google_avatar' => $user->google_avatar,
            ],
            'publicForms' => $formsData,
        ]);
    }

    /**
     * Display a specific public consent form.
     *
     * @param string $username
     * @param int $formId
     * @return Response
     */
    public function showConsentForm(string $username, int $formId): Response
    {
        // Find user by username (case-insensitive)
        $user = User::where('username', strtolower($username))->firstOrFail();

        // Find the consent form and ensure it's public and belongs to this user
        $consentForm = ConsentForm::where('id', $formId)
            ->where('user_id', $user->id)
            ->where('is_public', true)
            ->with('responses')
            ->firstOrFail();

        // Group responses by category
        $responsesByCategory = $consentForm->responses->groupBy('topic_category');

        return Inertia::render('PublicProfile/ShowConsentForm', [
            'profileUser' => [
                'username' => $user->username,
                'google_avatar' => $user->google_avatar,
            ],
            'form' => $consentForm,
            'responsesByCategory' => $responsesByCategory,
        ]);
    }
}


<?php

namespace App\Http\Controllers;

use App\Models\ConsentForm;
use App\Models\ConsentResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ConsentFormController
 *
 * Handles CRUD operations for player consent forms.
 * Players can create, view, edit, and share their consent forms.
 */
class ConsentFormController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the user's consent forms.
     */
    public function index(): Response
    {
        $forms = auth()->user()->consentForms()
            ->withCount('responses')
            ->latest()
            ->get();

        return Inertia::render('ConsentForms/Index', [
            'forms' => $forms,
        ]);
    }

    /**
     * Show the form for creating a new consent form.
     */
    public function create(): Response
    {
        // Get all consent topics from config
        $topics = config('consent_topics');
        $movieRatings = $topics['movie_ratings'];

        // Remove movie_ratings from topics array
        unset($topics['movie_ratings']);

        return Inertia::render('ConsentForms/Create', [
            'topics' => $topics,
            'movieRatings' => $movieRatings,
        ]);
    }

    /**
     * Store a newly created consent form in storage.
     */
    public function store(Request $request)
    {
        // Get valid movie ratings from config
        $movieRatings = config('consent_topics.movie_ratings');
        $movieRatingsRule = 'nullable|in:' . implode(',', $movieRatings);

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_public' => 'boolean',
            'movie_rating' => $movieRatingsRule,
            'movie_rating_other' => 'nullable|string|max:255',
            'follow_up_response' => 'nullable|string',
            'responses' => 'required|array',
            'responses.*.topic_category' => 'required|string',
            'responses.*.topic_name' => 'required|string',
            'responses.*.comfort_level' => 'required|in:green,yellow,red',
            'responses.*.is_custom' => 'boolean',
        ]);

        // Create the consent form
        $form = auth()->user()->consentForms()->create([
            'name' => $validated['name'],
            'is_public' => $validated['is_public'] ?? false,
            'movie_rating' => $validated['movie_rating'] ?? null,
            'movie_rating_other' => $validated['movie_rating_other'] ?? null,
            'follow_up_response' => $validated['follow_up_response'] ?? null,
        ]);

        // Create all consent responses
        foreach ($validated['responses'] as $response) {
            $form->responses()->create($response);
        }

        return redirect()->route('consent-forms.show', $form)
            ->with('success', 'Consent form created successfully!');
    }

    /**
     * Display the specified consent form.
     */
    public function show(ConsentForm $consentForm): Response
    {
        // Ensure user owns this form
        $this->authorize('view', $consentForm);

        // Load responses grouped by category
        $consentForm->load('responses');
        $responsesByCategory = $consentForm->responses->groupBy('topic_category');

        return Inertia::render('ConsentForms/Show', [
            'form' => $consentForm,
            'responsesByCategory' => $responsesByCategory,
        ]);
    }

    /**
     * Show the form for editing the specified consent form.
     */
    public function edit(ConsentForm $consentForm): Response
    {
        // Ensure user owns this form
        $this->authorize('update', $consentForm);

        // Get all consent topics from config
        $topics = config('consent_topics');
        $movieRatings = $topics['movie_ratings'];
        unset($topics['movie_ratings']);

        // Load existing responses
        $consentForm->load('responses');

        return Inertia::render('ConsentForms/Edit', [
            'form' => $consentForm,
            'topics' => $topics,
            'movieRatings' => $movieRatings,
        ]);
    }

    /**
     * Update the specified consent form in storage.
     */
    public function update(Request $request, ConsentForm $consentForm)
    {
        // Ensure user owns this form
        $this->authorize('update', $consentForm);

        // Get valid movie ratings from config
        $movieRatings = config('consent_topics.movie_ratings');
        $movieRatingsRule = 'nullable|in:' . implode(',', $movieRatings);

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_public' => 'boolean',
            'movie_rating' => $movieRatingsRule,
            'movie_rating_other' => 'nullable|string|max:255',
            'follow_up_response' => 'nullable|string',
            'responses' => 'required|array',
            'responses.*.topic_category' => 'required|string',
            'responses.*.topic_name' => 'required|string',
            'responses.*.comfort_level' => 'required|in:green,yellow,red',
            'responses.*.is_custom' => 'boolean',
        ]);

        // Update the consent form
        $consentForm->update([
            'name' => $validated['name'],
            'is_public' => $validated['is_public'] ?? false,
            'movie_rating' => $validated['movie_rating'] ?? null,
            'movie_rating_other' => $validated['movie_rating_other'] ?? null,
            'follow_up_response' => $validated['follow_up_response'] ?? null,
        ]);

        // Delete existing responses and create new ones
        $consentForm->responses()->delete();
        foreach ($validated['responses'] as $response) {
            $consentForm->responses()->create($response);
        }

        return redirect()->route('consent-forms.show', $consentForm)
            ->with('success', 'Consent form updated successfully!');
    }

    /**
     * Remove the specified consent form from storage.
     */
    public function destroy(ConsentForm $consentForm)
    {
        // Ensure user owns this form
        $this->authorize('delete', $consentForm);

        $consentForm->delete();

        return redirect()->route('consent-forms.index')
            ->with('success', 'Consent form deleted successfully!');
    }
}

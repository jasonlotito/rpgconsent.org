<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ConsentFormController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicProfileController;
use App\Http\Controllers\UsernameValidationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group.
|
*/

// Landing page - redirect to dashboard if authenticated, otherwise show welcome page
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return inertia('Welcome');
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Google OAuth Routes
|--------------------------------------------------------------------------
|
| Routes for handling Google OAuth authentication via Laravel Socialite.
|
*/
Route::get('/auth/google', [SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback'])->name('auth.google.callback');
Route::post('/auth/google/complete', [SocialiteController::class, 'completeGoogleRegistration'])->name('auth.google.complete');

/*
|--------------------------------------------------------------------------
| API Routes (for AJAX calls)
|--------------------------------------------------------------------------
*/
Route::post('/api/check-username', [UsernameValidationController::class, 'checkAvailability'])->name('api.check-username');

/*
|--------------------------------------------------------------------------
| Public Profile Routes
|--------------------------------------------------------------------------
*/
Route::get('/u/{username}', [PublicProfileController::class, 'show'])->name('public-profile.show');
Route::get('/u/{username}/consent-forms/{formId}', [PublicProfileController::class, 'showConsentForm'])->name('public-profile.consent-form.show');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
|
| Routes that require authentication.
|
*/
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::get('/profile/link-google', [ProfileController::class, 'linkGoogle'])->name('profile.link-google');
    Route::get('/profile/link-google/callback', [ProfileController::class, 'linkGoogleCallback'])->name('profile.link-google.callback');
    Route::delete('/profile/unlink-google', [ProfileController::class, 'unlinkGoogle'])->name('profile.unlink-google');

    // Social Media Links
    Route::post('/profile/social-links', [ProfileController::class, 'storeSocialLink'])->name('profile.social-links.store');
    Route::put('/profile/social-links/{id}', [ProfileController::class, 'updateSocialLink'])->name('profile.social-links.update');
    Route::delete('/profile/social-links/{id}', [ProfileController::class, 'deleteSocialLink'])->name('profile.social-links.delete');
    Route::post('/profile/social-links/reorder', [ProfileController::class, 'reorderSocialLinks'])->name('profile.social-links.reorder');

    // Consent Forms
    Route::resource('consent-forms', ConsentFormController::class);

    // Games
    Route::resource('games', GameController::class);
    Route::get('/games-join', [GameController::class, 'showJoinForm'])->name('games.join-form');
    Route::post('/games/join', [GameController::class, 'join'])->name('games.join');
    Route::post('/games/{game}/share-consent', [GameController::class, 'shareConsentForm'])->name('games.share-consent');
});

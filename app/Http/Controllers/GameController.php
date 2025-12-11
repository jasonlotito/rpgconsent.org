<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\ConsentForm;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * GameController
 *
 * Handles game/campaign management for DMs.
 * DMs can create games, invite players, and view aggregated consent data.
 */
class GameController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of games (both as DM and as player).
     */
    public function index(): Response
    {
        $user = auth()->user();

        // Games where user is the DM
        $gamesAsDm = $user->gamesAsDm()
            ->withCount('gamePlayers')
            ->latest()
            ->get();

        // Games where user is a player
        $gamesAsPlayer = $user->gamesAsPlayer()
            ->withPivot('consent_form_id', 'joined_at', 'status')
            ->latest()
            ->get();

        return Inertia::render('Games/Index', [
            'gamesAsDm' => $gamesAsDm,
            'gamesAsPlayer' => $gamesAsPlayer,
        ]);
    }

    /**
     * Show the form for creating a new game.
     */
    public function create(): Response
    {
        return Inertia::render('Games/Create');
    }

    /**
     * Store a newly created game in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'minimum_players' => 'required|integer|min:1|max:100',
        ]);

        // Create the game
        $game = auth()->user()->gamesAsDm()->create($validated);

        return redirect()->route('games.show', $game)
            ->with('success', 'Game created successfully! Share the game code with your players.');
    }

    /**
     * Display the specified game.
     */
    public function show(Game $game): Response
    {
        // Ensure user is the DM or a player
        $this->authorize('view', $game);

        // Load game players with their consent forms
        $game->load(['gamePlayers.user', 'gamePlayers.consentForm']);

        // Get list of players with their share status
        $players = $game->gamePlayers->map(function ($gamePlayer) {
            return [
                'id' => $gamePlayer->user->id,
                'name' => $gamePlayer->user->name,
                'email' => $gamePlayer->user->email,
                'has_shared' => $gamePlayer->consent_form_id !== null,
                'status' => $gamePlayer->status,
            ];
        });

        // Check if all players have shared
        $allPlayersShared = $game->allPlayersShared();

        // Get aggregated consent data if all players have shared
        $aggregatedData = null;
        if ($allPlayersShared) {
            $aggregatedData = $game->getAggregatedConsentData();
        }

        // Get current user's consent forms (if they're a player)
        $userConsentForms = [];
        $currentSharedFormId = null;
        $isPlayer = $game->gamePlayers()->where('user_id', auth()->id())->exists();

        if ($isPlayer) {
            $userConsentForms = auth()->user()->consentForms()
                ->withCount('responses')
                ->latest()
                ->get();

            $gamePlayer = $game->gamePlayers()->where('user_id', auth()->id())->first();
            $currentSharedFormId = $gamePlayer?->consent_form_id;
        }

        return Inertia::render('Games/Show', [
            'game' => $game,
            'players' => $players,
            'aggregatedData' => $aggregatedData,
            'allPlayersShared' => $allPlayersShared,
            'isDm' => auth()->id() === $game->dm_user_id,
            'isPlayer' => $isPlayer,
            'userConsentForms' => $userConsentForms,
            'currentSharedFormId' => $currentSharedFormId,
        ]);
    }

    /**
     * Show the form for editing the specified game.
     */
    public function edit(Game $game): Response
    {
        // Ensure user is the DM
        $this->authorize('update', $game);

        return Inertia::render('Games/Edit', [
            'game' => $game,
        ]);
    }

    /**
     * Update the specified game in storage.
     */
    public function update(Request $request, Game $game)
    {
        // Ensure user is the DM
        $this->authorize('update', $game);

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,completed,archived',
            'minimum_players' => 'required|integer|min:1|max:100',
        ]);

        // Update the game
        $game->update($validated);

        return redirect()->route('games.show', $game)
            ->with('success', 'Game updated successfully!');
    }

    /**
     * Remove the specified game from storage.
     */
    public function destroy(Game $game)
    {
        // Ensure user is the DM
        $this->authorize('delete', $game);

        $game->delete();

        return redirect()->route('games.index')
            ->with('success', 'Game deleted successfully!');
    }

    /**
     * Show the join game form.
     */
    public function showJoinForm(Request $request): Response
    {
        // Get game code from query parameter if provided
        $gameCode = $request->query('code', '');

        return Inertia::render('Games/Join', [
            'gameCode' => $gameCode,
        ]);
    }

    /**
     * Join a game using a game code.
     */
    public function join(Request $request)
    {
        $validated = $request->validate([
            'game_code' => 'required|string',
        ]);

        // Find the game by code
        $game = Game::where('game_code', $validated['game_code'])->first();

        if (!$game) {
            return back()->withErrors([
                'game_code' => 'Invalid game code. Please check the code and try again.',
            ])->withInput();
        }

        // Check if user is the DM of this game
        if ($game->dm_user_id === auth()->id()) {
            return back()->withErrors([
                'game_code' => 'You cannot join your own game as a player. You are the DM!',
            ])->withInput();
        }

        // Check if user is already in the game
        $existingPlayer = GamePlayer::where('game_id', $game->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingPlayer) {
            return redirect()->route('games.show', $game)
                ->with('info', 'You are already a member of this game.');
        }

        // Add user to the game
        GamePlayer::create([
            'game_id' => $game->id,
            'user_id' => auth()->id(),
            'status' => 'joined',
            'joined_at' => now(),
        ]);

        return redirect()->route('games.show', $game)
            ->with('success', 'Successfully joined the game!');
    }

    /**
     * Share a consent form with a game.
     */
    public function shareConsentForm(Request $request, Game $game)
    {
        $validated = $request->validate([
            'consent_form_id' => 'required|exists:consent_forms,id',
        ]);

        // Verify the consent form belongs to the user
        $consentForm = ConsentForm::findOrFail($validated['consent_form_id']);
        if ($consentForm->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        // Find the game player record
        $gamePlayer = GamePlayer::where('game_id', $game->id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Update the consent form
        $gamePlayer->update([
            'consent_form_id' => $validated['consent_form_id'],
        ]);

        return redirect()->route('games.show', $game)
            ->with('success', 'Consent form shared with the game!');
    }
}

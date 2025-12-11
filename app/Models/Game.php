<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

/**
 * Game Model
 *
 * Represents a game/campaign created by a DM (Dungeon Master).
 * Players can join games using a unique game code.
 */
class Game extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'dm_user_id',
        'name',
        'description',
        'game_code',
        'status',
        'minimum_players',
    ];

    /**
     * Boot the model and set up event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically generate a unique game code when creating a new game
        static::creating(function ($game) {
            if (empty($game->game_code)) {
                $game->game_code = self::generateUniqueGameCode();
            }
        });
    }

    /**
     * Generate a unique game code.
     * Format: WORD-WORD (e.g., "DRAGON-QUEST")
     *
     * @return string
     */
    protected static function generateUniqueGameCode(): string
    {
        do {
            // Generate a random code with two words
            $code = strtoupper(Str::random(6) . '-' . Str::random(6));
        } while (self::where('game_code', $code)->exists());

        return $code;
    }

    /**
     * Get the DM (Dungeon Master) user for this game.
     */
    public function dm(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dm_user_id');
    }

    /**
     * Get all game players (pivot records).
     */
    public function gamePlayers(): HasMany
    {
        return $this->hasMany(GamePlayer::class);
    }

    /**
     * Get all players in this game.
     */
    public function players(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'game_players')
            ->withPivot('consent_form_id', 'joined_at', 'status')
            ->withTimestamps();
    }

    /**
     * Check if all players have shared their consent forms and meet minimum threshold.
     *
     * @return bool
     */
    public function allPlayersShared(): bool
    {
        $totalPlayers = $this->gamePlayers()->where('status', 'joined')->count();
        $playersWithForms = $this->gamePlayers()
            ->where('status', 'joined')
            ->whereNotNull('consent_form_id')
            ->count();

        // Check if all players have shared AND we meet the minimum threshold
        return $totalPlayers > 0
            && $totalPlayers === $playersWithForms
            && $playersWithForms >= $this->minimum_players;
    }

    /**
     * Check if the minimum player threshold is met.
     *
     * @return bool
     */
    public function meetsMinimumPlayers(): bool
    {
        $playersWithForms = $this->gamePlayers()
            ->where('status', 'joined')
            ->whereNotNull('consent_form_id')
            ->count();

        return $playersWithForms >= $this->minimum_players;
    }

    /**
     * Get aggregated consent data for all players in the game.
     * Returns anonymous aggregated data showing common boundaries.
     *
     * Includes both predefined topics and custom entries.
     * Custom entries are matched by exact name (case-sensitive).
     * If only one player has a custom entry, it still appears in aggregated data.
     *
     * @return array
     */
    public function getAggregatedConsentData(): array
    {
        // Only return data if all players have shared
        if (!$this->allPlayersShared()) {
            return [];
        }

        $consentFormIds = $this->gamePlayers()
            ->where('status', 'joined')
            ->whereNotNull('consent_form_id')
            ->pluck('consent_form_id');

        $responses = ConsentResponse::whereIn('consent_form_id', $consentFormIds)->get();

        $aggregated = [];

        foreach ($responses->groupBy('topic_category') as $category => $categoryResponses) {
            $aggregated[$category] = [];

            foreach ($categoryResponses->groupBy('topic_name') as $topic => $topicResponses) {
                $redCount = $topicResponses->where('comfort_level', 'red')->count();
                $yellowCount = $topicResponses->where('comfort_level', 'yellow')->count();
                $greenCount = $topicResponses->where('comfort_level', 'green')->count();
                $totalCount = $topicResponses->count();

                // Check if this is a custom entry (at least one response is custom)
                $isCustom = $topicResponses->where('is_custom', true)->count() > 0;

                // Determine the aggregate status
                // Any red = forbidden, any yellow (no red) = discuss, all green = safe
                $status = 'safe'; // Default: all green
                if ($redCount > 0) {
                    $status = 'forbidden'; // Any red = hard boundary
                } elseif ($yellowCount > 0) {
                    $status = 'discuss'; // Any yellow = needs discussion
                }

                $aggregated[$category][$topic] = [
                    'status' => $status,
                    'red_count' => $redCount,
                    'yellow_count' => $yellowCount,
                    'green_count' => $greenCount,
                    'total_responses' => $totalCount,
                    'is_custom' => $isCustom,
                ];
            }
        }

        return $aggregated;
    }
}

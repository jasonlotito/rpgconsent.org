<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * GamePlayer Model
 *
 * Pivot model representing the relationship between a game and a player.
 * Tracks which players are in which games and their shared consent forms.
 */
class GamePlayer extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'game_id',
        'user_id',
        'consent_form_id',
        'joined_at',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'joined_at' => 'datetime',
    ];

    /**
     * Get the game this player belongs to.
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * Get the user (player) for this game player record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the consent form shared by this player for this game.
     */
    public function consentForm(): BelongsTo
    {
        return $this->belongsTo(ConsentForm::class);
    }

    /**
     * Check if the player has shared their consent form.
     *
     * @return bool
     */
    public function hasSharedConsentForm(): bool
    {
        return !is_null($this->consent_form_id);
    }
}

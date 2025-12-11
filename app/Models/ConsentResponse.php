<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ConsentResponse Model
 *
 * Represents a single topic response within a consent form.
 * Each response indicates a player's comfort level (green/yellow/red) with a specific topic.
 */
class ConsentResponse extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'consent_form_id',
        'topic_category',
        'topic_name',
        'comfort_level',
        'is_custom',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_custom' => 'boolean',
    ];

    /**
     * Comfort level constants for easy reference.
     */
    public const COMFORT_GREEN = 'green';  // Enthusiastic consent; bring it on!
    public const COMFORT_YELLOW = 'yellow'; // Okay if veiled or offstage; might be okay onstage but requires discussion ahead of time; uncertain
    public const COMFORT_RED = 'red';      // Hard line; do not include

    /**
     * Get the consent form that owns this response.
     */
    public function consentForm(): BelongsTo
    {
        return $this->belongsTo(ConsentForm::class);
    }

    /**
     * Check if this response is a hard boundary (red).
     *
     * @return bool
     */
    public function isHardBoundary(): bool
    {
        return $this->comfort_level === self::COMFORT_RED;
    }

    /**
     * Check if this response requires discussion (yellow).
     *
     * @return bool
     */
    public function requiresDiscussion(): bool
    {
        return $this->comfort_level === self::COMFORT_YELLOW;
    }

    /**
     * Check if this response is enthusiastic consent (green).
     *
     * @return bool
     */
    public function isEnthusiastic(): bool
    {
        return $this->comfort_level === self::COMFORT_GREEN;
    }
}

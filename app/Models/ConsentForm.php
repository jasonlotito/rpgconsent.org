<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * ConsentForm Model
 *
 * Represents a player's RPG consent form containing their comfort levels
 * with various topics and themes that may appear in the game.
 */
class ConsentForm extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'movie_rating',
        'movie_rating_other',
        'follow_up_response',
        'is_shared',
        'share_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_shared' => 'boolean',
    ];

    /**
     * Boot the model and set up event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically generate a unique share token when creating a new form
        static::creating(function ($consentForm) {
            if (empty($consentForm->share_token)) {
                $consentForm->share_token = Str::random(32);
            }
        });
    }

    /**
     * Get the user that owns the consent form.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all consent responses for this form.
     */
    public function responses(): HasMany
    {
        return $this->hasMany(ConsentResponse::class);
    }

    /**
     * Get responses grouped by category.
     *
     * @return array
     */
    public function getResponsesByCategory(): array
    {
        return $this->responses()
            ->get()
            ->groupBy('topic_category')
            ->toArray();
    }

    /**
     * Get only custom responses.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function customResponses()
    {
        return $this->responses()->where('is_custom', true)->get();
    }

    /**
     * Get only predefined (non-custom) responses.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function predefinedResponses()
    {
        return $this->responses()->where('is_custom', false)->get();
    }

    /**
     * Check if the form has been completed (has responses).
     *
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->responses()->count() > 0;
    }

    /**
     * Generate a shareable URL for this consent form.
     *
     * @return string
     */
    public function getShareUrl(): string
    {
        return route('consent-forms.shared', ['token' => $this->share_token]);
    }
}

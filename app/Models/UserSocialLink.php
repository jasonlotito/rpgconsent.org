<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * UserSocialLink Model
 *
 * Represents a social media or external link on a user's profile.
 * Users can add up to 5 custom links to their public profile.
 */
class UserSocialLink extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'url',
        'order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the user that owns the social link.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

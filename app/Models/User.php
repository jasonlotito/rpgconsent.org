<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'google_avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all consent forms created by this user.
     */
    public function consentForms()
    {
        return $this->hasMany(ConsentForm::class);
    }

    /**
     * Get all games where this user is the DM.
     */
    public function gamesAsDm()
    {
        return $this->hasMany(Game::class, 'dm_user_id');
    }

    /**
     * Get all games this user is playing in.
     */
    public function gamesAsPlayer()
    {
        return $this->belongsToMany(Game::class, 'game_players')
            ->withPivot('consent_form_id', 'joined_at', 'status')
            ->withTimestamps();
    }

    /**
     * Get the user's active consent form (most recent).
     */
    public function activeConsentForm()
    {
        return $this->consentForms()->latest()->first();
    }
}

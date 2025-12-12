<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserSocialLink;
use Illuminate\Auth\Access\Response;

class UserSocialLinkPolicy
{
    /**
     * Determine whether the user can create models.
     * Users can create social links for themselves (enforced in controller).
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     * Users can only update their own social links.
     */
    public function update(User $user, UserSocialLink $userSocialLink): bool
    {
        return $user->id === $userSocialLink->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     * Users can only delete their own social links.
     */
    public function delete(User $user, UserSocialLink $userSocialLink): bool
    {
        return $user->id === $userSocialLink->user_id;
    }
}

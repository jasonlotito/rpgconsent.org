<?php

namespace App\Policies;

use App\Models\ConsentForm;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConsentFormPolicy
{
    /**
     * Determine whether the user can view any models.
     * All authenticated users can view their own consent forms.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * Users can only view their own consent forms.
     */
    public function view(User $user, ConsentForm $consentForm): bool
    {
        return $user->id === $consentForm->user_id;
    }

    /**
     * Determine whether the user can create models.
     * All authenticated users can create consent forms.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     * Users can only update their own consent forms.
     */
    public function update(User $user, ConsentForm $consentForm): bool
    {
        return $user->id === $consentForm->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     * Users can only delete their own consent forms.
     */
    public function delete(User $user, ConsentForm $consentForm): bool
    {
        return $user->id === $consentForm->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     * Users can only restore their own consent forms.
     */
    public function restore(User $user, ConsentForm $consentForm): bool
    {
        return $user->id === $consentForm->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     * Users can only permanently delete their own consent forms.
     */
    public function forceDelete(User $user, ConsentForm $consentForm): bool
    {
        return $user->id === $consentForm->user_id;
    }
}

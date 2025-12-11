<?php

namespace App\Policies;

use App\Models\Game;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GamePolicy
{
    /**
     * Determine whether the user can view any models.
     * All authenticated users can view games.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * Users can view games they are DM of or playing in.
     */
    public function view(User $user, Game $game): bool
    {
        // User is the DM
        if ($user->id === $game->dm_user_id) {
            return true;
        }

        // User is a player in the game
        return $game->gamePlayers()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     * All authenticated users can create games.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     * Only the DM can update the game.
     */
    public function update(User $user, Game $game): bool
    {
        return $user->id === $game->dm_user_id;
    }

    /**
     * Determine whether the user can delete the model.
     * Only the DM can delete the game.
     */
    public function delete(User $user, Game $game): bool
    {
        return $user->id === $game->dm_user_id;
    }

    /**
     * Determine whether the user can restore the model.
     * Only the DM can restore the game.
     */
    public function restore(User $user, Game $game): bool
    {
        return $user->id === $game->dm_user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     * Only the DM can permanently delete the game.
     */
    public function forceDelete(User $user, Game $game): bool
    {
        return $user->id === $game->dm_user_id;
    }
}

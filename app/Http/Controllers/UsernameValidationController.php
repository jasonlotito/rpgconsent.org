<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * UsernameValidationController
 *
 * Handles real-time username validation for registration and profile updates.
 */
class UsernameValidationController extends Controller
{
    /**
     * Check if a username is available.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkAvailability(Request $request): JsonResponse
    {
        $username = $request->input('username');
        $userId = $request->input('user_id'); // For profile updates

        // Validate format first
        $validator = Validator::make(['username' => $username], [
            'username' => User::usernameRules($userId),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'available' => false,
                'errors' => $validator->errors()->get('username'),
            ]);
        }

        // Check availability
        $query = User::where('username', strtolower($username));
        
        // Exclude current user if updating profile
        if ($userId) {
            $query->where('id', '!=', $userId);
        }

        $exists = $query->exists();

        return response()->json([
            'available' => !$exists,
            'errors' => $exists ? ['This username is already taken.'] : [],
        ]);
    }
}


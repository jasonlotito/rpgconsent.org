<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Replace the 'name' column with 'username' column.
     * For existing users, generate usernames from their names.
     */
    public function up(): void
    {
        // First, add the username column (nullable temporarily)
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 30)->nullable()->after('id');
        });

        // Generate usernames for existing users
        $users = DB::table('users')->get();
        $usedUsernames = [];

        foreach ($users as $user) {
            // Generate base username from name
            $baseName = $user->name ?? 'user';
            $baseUsername = Str::slug($baseName, '');
            $baseUsername = strtolower(preg_replace('/[^a-z0-9_-]/', '', $baseUsername));

            // Ensure minimum length
            if (strlen($baseUsername) < 3) {
                $baseUsername = 'user' . $baseUsername;
            }

            // Ensure maximum length
            if (strlen($baseUsername) > 30) {
                $baseUsername = substr($baseUsername, 0, 30);
            }

            // Make unique by adding numbers if needed
            $username = $baseUsername;
            $counter = 1;
            while (in_array($username, $usedUsernames)) {
                $suffix = (string) $counter;
                $maxBaseLength = 30 - strlen($suffix);
                $username = substr($baseUsername, 0, $maxBaseLength) . $suffix;
                $counter++;
            }

            $usedUsernames[] = $username;

            // Update the user with the generated username
            DB::table('users')
                ->where('id', $user->id)
                ->update(['username' => $username]);
        }

        // Now make username required and unique
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 30)->nullable(false)->unique()->change();
        });

        // Finally, drop the name column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back the name column
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id');
        });

        // Copy username to name for existing users
        DB::table('users')->get()->each(function ($user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['name' => $user->username]);
        });

        // Drop the username column
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
        });
    }
};

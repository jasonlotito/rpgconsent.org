<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     *
     * Adds Google OAuth fields to the users table for Socialite integration.
     * Allows users to login with Google in addition to email/password.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Google OAuth ID
            $table->string('google_id')->nullable()->unique()->after('email');

            // Avatar URL from Google (if not using local avatar)
            $table->string('google_avatar')->nullable()->after('google_id');

            // Make password nullable since Google users won't have a password
            $table->string('password')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * Removes Google OAuth fields from the users table.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'google_avatar']);

            // Note: We don't reverse the password nullable change to avoid data loss
        });
    }
};

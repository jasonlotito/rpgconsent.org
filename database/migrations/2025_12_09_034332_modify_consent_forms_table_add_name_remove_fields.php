<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Modifies the consent_forms table to:
     * - Add 'name' column for form identification
     * - Remove 'gm_name', 'player_name', and 'game_theme' columns
     *   (these are contextual to games, not the reusable consent form)
     */
    public function up(): void
    {
        Schema::table('consent_forms', function (Blueprint $table) {
            // Add name column for form identification with a default value for existing records
            $table->string('name')->default('Untitled Form')->after('user_id');

            // Remove fields that are contextual to specific games
            $table->dropColumn(['gm_name', 'player_name', 'game_theme']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consent_forms', function (Blueprint $table) {
            // Restore the removed columns
            $table->string('gm_name')->nullable()->after('user_id');
            $table->string('player_name')->nullable()->after('gm_name');
            $table->text('game_theme')->nullable()->after('player_name');

            // Remove the name column
            $table->dropColumn('name');
        });
    }
};

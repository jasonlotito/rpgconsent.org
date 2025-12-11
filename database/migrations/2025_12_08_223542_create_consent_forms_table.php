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
     * Creates the consent_forms table to store player consent form data.
     * Each form belongs to a user and contains basic information about the game.
     */
    public function up(): void
    {
        Schema::create('consent_forms', function (Blueprint $table) {
            $table->id();

            // Foreign key to the user who owns this consent form
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // GM Name - the name of the Game Master for this game
            $table->string('gm_name')->nullable();

            // Player Name - optional, can be left blank for anonymity
            $table->string('player_name')->nullable();

            // Planned Game Theme - description of the game's theme/setting
            $table->text('game_theme')->nullable();

            // Movie Rating - G, PG, PG-13, NC-17, or Other
            $table->enum('movie_rating', ['G', 'PG', 'PG-13', 'NC-17', 'Other'])->nullable();
            $table->string('movie_rating_other')->nullable(); // For "Other" option

            // Follow-up question response
            $table->text('follow_up_response')->nullable();

            // Sharing settings
            $table->boolean('is_shared')->default(false); // Whether the form is shared
            $table->string('share_token', 64)->unique()->nullable(); // Unique token for sharing

            $table->timestamps();

            // Indexes for performance
            $table->index('user_id');
            $table->index('share_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consent_forms');
    }
};

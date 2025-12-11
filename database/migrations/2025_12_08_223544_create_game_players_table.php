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
     * Creates the game_players table to track which players are in which games.
     * Links players to games and optionally to their shared consent forms.
     */
    public function up(): void
    {
        Schema::create('game_players', function (Blueprint $table) {
            $table->id();

            // Foreign key to the game
            $table->foreignId('game_id')->constrained()->onDelete('cascade');

            // Foreign key to the player (user)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Foreign key to the consent form (nullable - player may not have shared yet)
            $table->foreignId('consent_form_id')->nullable()->constrained()->onDelete('set null');

            // When the player joined the game
            $table->timestamp('joined_at')->useCurrent();

            // Player status in the game
            $table->enum('status', ['invited', 'joined', 'left'])->default('joined');

            $table->timestamps();

            // Ensure a player can only join a game once
            $table->unique(['game_id', 'user_id']);

            // Indexes for performance
            $table->index('game_id');
            $table->index('user_id');
            $table->index('consent_form_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_players');
    }
};

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
     * Creates the games table to store DM-created games/campaigns.
     * Each game has a unique code that players can use to join.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();

            // Foreign key to the user who is the DM (Dungeon Master)
            $table->foreignId('dm_user_id')->constrained('users')->onDelete('cascade');

            // Game details
            $table->string('name'); // Name of the game/campaign
            $table->text('description')->nullable(); // Description of the game

            // Unique game code for players to join (e.g., "DRAGON-2024")
            $table->string('game_code', 20)->unique();

            // Game status
            $table->enum('status', ['active', 'completed', 'archived'])->default('active');

            $table->timestamps();

            // Indexes for performance
            $table->index('dm_user_id');
            $table->index('game_code');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};

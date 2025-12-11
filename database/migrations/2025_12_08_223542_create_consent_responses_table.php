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
     * Creates the consent_responses table to store individual topic responses.
     * Each response represents a player's comfort level with a specific topic.
     */
    public function up(): void
    {
        Schema::create('consent_responses', function (Blueprint $table) {
            $table->id();

            // Foreign key to the consent form this response belongs to
            $table->foreignId('consent_form_id')->constrained()->onDelete('cascade');

            // Category of the topic (Horror, Mental and Physical Health, Relationships, etc.)
            $table->string('topic_category');

            // Specific topic name (e.g., "Bugs", "Blood", "Romance", etc.)
            $table->string('topic_name');

            // Comfort level: green (enthusiastic), yellow (okay if discussed), red (hard line)
            $table->enum('comfort_level', ['green', 'yellow', 'red']);

            // Flag to distinguish custom entries from predefined topics
            $table->boolean('is_custom')->default(false);

            $table->timestamps();

            // Indexes for performance
            $table->index('consent_form_id');
            $table->index(['consent_form_id', 'topic_category']);
            $table->index('comfort_level');
            $table->index('is_custom');

            // Ensure unique responses per topic per form
            // Custom name to avoid MySQL's 64-character identifier limit
            $table->unique(['consent_form_id', 'topic_category', 'topic_name'], 'consent_responses_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consent_responses');
    }
};

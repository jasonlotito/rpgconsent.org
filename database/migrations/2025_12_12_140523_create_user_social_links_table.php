<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_social_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 50); // Display name for the link (e.g., "Twitter", "Discord")
            $table->string('url', 255); // The actual URL
            $table->unsignedTinyInteger('order')->default(0); // For sorting/ordering the links
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'order']); // For efficient ordering queries
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_social_links');
    }
};

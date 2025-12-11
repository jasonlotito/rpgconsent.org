<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add 'R' rating to the movie_rating ENUM column in consent_forms table.
     */
    public function up(): void
    {
        // MySQL doesn't support adding values to ENUM directly, so we need to use raw SQL
        DB::statement("ALTER TABLE consent_forms MODIFY COLUMN movie_rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17', 'Other') NULL");
    }

    /**
     * Reverse the migrations.
     *
     * Remove 'R' rating from the movie_rating ENUM column.
     */
    public function down(): void
    {
        // Revert back to the original ENUM values
        DB::statement("ALTER TABLE consent_forms MODIFY COLUMN movie_rating ENUM('G', 'PG', 'PG-13', 'NC-17', 'Other') NULL");
    }
};

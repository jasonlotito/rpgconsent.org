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
     * This migration fixes the consent_responses table in production by:
     * 1. Adding the is_custom column if it doesn't exist
     * 2. Adding the unique constraint with a proper short name if it doesn't exist
     * 3. Adding missing indexes
     */
    public function up(): void
    {
        Schema::table('consent_responses', function (Blueprint $table) {
            // Add is_custom column if it doesn't exist
            if (!Schema::hasColumn('consent_responses', 'is_custom')) {
                $table->boolean('is_custom')->default(false)->after('comfort_level');
            }
        });

        // Check if the unique constraint exists
        $indexExists = DB::select("
            SELECT COUNT(*) as count
            FROM information_schema.statistics
            WHERE table_schema = DATABASE()
            AND table_name = 'consent_responses'
            AND index_name = 'consent_responses_unique'
        ");

        // Add unique constraint if it doesn't exist
        if ($indexExists[0]->count == 0) {
            Schema::table('consent_responses', function (Blueprint $table) {
                $table->unique(['consent_form_id', 'topic_category', 'topic_name'], 'consent_responses_unique');
            });
        }

        // Check if is_custom index exists
        $isCustomIndexExists = DB::select("
            SELECT COUNT(*) as count
            FROM information_schema.statistics
            WHERE table_schema = DATABASE()
            AND table_name = 'consent_responses'
            AND index_name = 'consent_responses_is_custom_index'
        ");

        // Add is_custom index if it doesn't exist
        if ($isCustomIndexExists[0]->count == 0) {
            Schema::table('consent_responses', function (Blueprint $table) {
                $table->index('is_custom');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consent_responses', function (Blueprint $table) {
            // Drop the unique constraint if it exists
            $table->dropUnique('consent_responses_unique');

            // Drop the is_custom index if it exists
            $table->dropIndex(['is_custom']);

            // Drop the is_custom column if it exists
            if (Schema::hasColumn('consent_responses', 'is_custom')) {
                $table->dropColumn('is_custom');
            }
        });
    }
};

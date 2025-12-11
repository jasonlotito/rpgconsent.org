<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds is_custom flag to consent_responses table to distinguish
     * custom entries from predefined topics.
     */
    public function up(): void
    {
        Schema::table('consent_responses', function (Blueprint $table) {
            $table->boolean('is_custom')->default(false)->after('comfort_level');
            $table->index('is_custom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consent_responses', function (Blueprint $table) {
            $table->dropIndex(['is_custom']);
            $table->dropColumn('is_custom');
        });
    }
};

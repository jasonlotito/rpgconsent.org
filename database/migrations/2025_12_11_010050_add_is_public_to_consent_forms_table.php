<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add is_public column to consent_forms table to allow users
     * to make their consent forms visible on their public profile.
     */
    public function up(): void
    {
        Schema::table('consent_forms', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consent_forms', function (Blueprint $table) {
            $table->dropColumn('is_public');
        });
    }
};

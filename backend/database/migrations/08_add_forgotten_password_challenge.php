<?php

use App\Support\DefaultChallenges;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Seeding moved to 09_add_url_to_challenges_table to ensure the 'url' column is added first
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Keep challenge data on rollback; this migration only ensures defaults exist.
    }
};

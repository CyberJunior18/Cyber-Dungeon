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
        DefaultChallenges::seed();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Keep challenge data on rollback; this migration only ensures defaults exist.
    }
};

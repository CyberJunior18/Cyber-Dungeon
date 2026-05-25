<?php

namespace Database\Seeders\Challenges;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Challenge1Seeder extends Seeder
{
    public function run(): void
    {
        DB::table('staff_users')->updateOrInsert(
            ['username' => 'admin'],
            ['password' => md5('Sup3rS3cr3t!'), 'role' => 'admin', 'updated_at' => now(), 'created_at' => now()]
        );

        DB::table('admin_secrets')->updateOrInsert(
            ['secret_name' => 'internal_flag'],
            ['flag' => 'Cyber{sql_1nj3ct10n_byp4ss}', 'updated_at' => now(), 'created_at' => now()]
        );
    }
}

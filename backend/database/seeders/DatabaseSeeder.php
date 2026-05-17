<?php

namespace Database\Seeders;

use App\Models\Challenge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed challenges first if empty
        if (Challenge::count() === 0) {
            Challenge::create([
                'title' => 'Hidden Information',
                'category' => 'Forensics',
                'difficulty' => 'Easy',
                'points' => 100,
                'description' => 'Files can always be changed in a secret way. Can you find the flag?',
                'flag' => 'Cyber{the_m3tadata_1s_modified}',
                'hint' => 'Look at the details and metadata of the file',
            ]);
            Challenge::create([
                'title' => 'rotation',
                'category' => 'Crypto',
                'difficulty' => 'Easy',
                'points' => 100,
                'description' => 'You will find the flag after decrypting this: UQTWJ{j0lsl1gf_v3ujqhl3v_429sx00x}',
                'flag' => 'Cyber{caesar_d3cr9pt3d_f0212758}',
                'hint' => 'Sometimes rotation is right (ROT13 / Caesar Cipher)',
            ]);
            Challenge::create([
                'title' => 'interencdec',
                'category' => 'Crypto',
                'difficulty' => 'Medium',
                'points' => 200,
                'description' => 'Can you get the real meaning from this file.',
                'flag' => 'Cyber{pwn_th3_dung30n_c0r3}',
                'hint' => 'Engaging in various decoding processes like Base64 is of utmost importance',
            ]);
            Challenge::create([
                'title' => 'Log Hunt',
                'category' => 'General Knowledge',
                'difficulty' => 'Medium',
                'points' => 200,
                'description' => 'A compiled binary was found in the dungeon. Analyze its logic to extract the secret protocol key.',
                'flag' => 'Cyber{r3v3rs3_3ng1n33r1ng_pro}',
                'hint' => 'The key is XORed with 0x42 inside the log lines.',
            ]);
            Challenge::create([
                'title' => 'Database Breach',
                'category' => 'Web',
                'difficulty' => 'Hard',
                'points' => 300,
                'description' => 'The user database has a vulnerable search field. Extract the flag from the "system_secrets" table.',
                'flag' => 'Cyber{sql_1nj3ct10n_succ3ss}',
                'hint' => 'Vulnerable search parameter! Try SQL injections.',
            ]);
        }
    }
}

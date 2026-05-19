<?php

namespace App\Support;

use App\Models\Challenge;

class DefaultChallenges
{
    public static function seed(): void
    {
        foreach (self::all() as $challenge) {
            Challenge::updateOrCreate(
                ['title' => $challenge['title']],
                $challenge
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function all(): array
    {
        return [
            [
                'title' => 'Hidden Information',
                'category' => 'Forensics',
                'difficulty' => 'Easy',
                'points' => 100,
                'description' => 'Files can always be changed in a secret way. Can you find the flag?',
                'flag' => 'Cyber{the_m3tadata_1s_modified}',
                'hint' => 'Look at the details and metadata of the file',
            ],
            [
                'title' => 'rotation',
                'category' => 'Crypto',
                'difficulty' => 'Easy',
                'points' => 100,
                'description' => 'You will find the flag after decrypting this: UQTWJ{j0lsl1gf_v3ujqhl3v_429sx00x}',
                'flag' => 'Cyber{caesar_d3cr9pt3d_f0212758}',
                'hint' => 'Sometimes rotation is right (ROT13 / Caesar Cipher)',
            ],
            [
                'title' => 'interencdec',
                'category' => 'Crypto',
                'difficulty' => 'Medium',
                'points' => 200,
                'description' => 'Can you get the real meaning from this file.',
                'flag' => 'Cyber{pwn_th3_dung30n_c0r3}',
                'hint' => 'Engaging in various decoding processes like Base64 is of utmost importance',
            ],
            [
                'title' => 'Log Hunt',
                'category' => 'General Knowledge',
                'difficulty' => 'Medium',
                'points' => 200,
                'description' => 'A compiled binary was found in the dungeon. Analyze its logic to extract the secret protocol key.',
                'flag' => 'Cyber{r3v3rs3_3ng1n33r1ng_pro}',
                'hint' => 'The key is XORed with 0x42 inside the log lines.',
            ],
            [
                'title' => 'Forgotten Password',
                'category' => 'Web',
                'difficulty' => 'Medium',
                'points' => 200,
                'description' => 'You forgot your password to the Al Maaref University Student Portal. IT support sent you a 4-digit OTP to reset it. But something feels off about how the server responds. Some codes get answered just a little slower than others... Can you figure out your OTP before it is too late?',
                'url' => 'http://muctf.tech/forgottenPassword',
                'flag' => 'MUCTF{t1m1ng_1s_3v3ryth1ng}',
                'hint' => 'The server checks your code one digit at a time.',
            ],
            [
                'title' => 'Academic Records',
                'category' => 'Web',
                'difficulty' => 'Hard',
                'points' => 300,
                'description' => 'You have just enrolled at Al Maaref University and gained access to the student portal. Poke around; your grades are looking great, but something else might be hiding in the database. The developers were careful. Login is safe. Search is safe. But somewhere in the academic records system, they forgot that not all user input can be parameterized. The secret is stored in the flags table. Can you retrieve it without direct query output? Username: ahmad.khalil Password: supersecret123',
                'url' => 'https://muctf.tech/sqlchallenge',
                'flag' => 'MUCTF{sql_1nj3ct10n_g03s_brrrr}',
                'hint' => 'Not every feature on the portal is as secure as the login page. Try interacting with all of them. The table name is flags and the flag is on row secret. You cannot read data directly from this injection point, but you can ask the database a yes/no question and watch how the response changes. ORDER BY cannot be parameterized. A CASE WHEN expression inside it behaves like an if/else; true and false produce different row orders.',
            ],
        ];
    }
}

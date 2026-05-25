<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

if (! function_exists('ensureAdminSeeded')) {
    function ensureAdminSeeded(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@cyberdungeon.local'],
            [
                'name' => 'admin',
                'password' => Hash::make('admin123'),
                'points' => 0,
                'avatar' => null,
                'role' => 'admin',
                'can_create_challenges' => true,
            ]
        );
    }
}

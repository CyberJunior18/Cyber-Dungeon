<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

if (!function_exists('ensureAdminSeeded')) {
    function ensureAdminSeeded(): void
    {
        // Seed/Repair admin@gmail.com
        $admin = User::where('email', 'admin@gmail.com')->first();
        if (!$admin) {
            User::create([
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'points' => 0,
                'avatar' => null,
                'role' => 'admin',
                'can_create_challenges' => true,
            ]);
        } else {
            if (!Hash::check('admin123', $admin->password)) {
                $admin->password = Hash::make('admin123');
                $admin->save();
            }
        }
    }
}

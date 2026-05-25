<?php

namespace Database\Seeders\Challenges;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class Challenge2Seeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@corp.internal'],
            [
                'name' => 'Admin',
                'password' => Hash::make('adminpassword'),
                'role' => 'admin',
            ]
        );

        $alice = User::updateOrCreate(
            ['email' => 'alice@corp.internal'],
            [
                'name' => 'Alice',
                'password' => Hash::make('alice123'),
                'role' => 'user',
            ]
        );

        $bob = User::updateOrCreate(
            ['email' => 'bob@corp.internal'],
            [
                'name' => 'Bob',
                'password' => Hash::make('bob123'),
                'role' => 'user',
            ]
        );

        Report::updateOrCreate(
            ['user_id' => $alice->id, 'title' => 'Q1 metrics'],
            [
                'body' => 'Traffic up 12% this quarter.',
                'is_sensitive' => false,
                'flag' => null,
            ]
        );

        Report::updateOrCreate(
            ['user_id' => $bob->id, 'title' => 'Bug report #42'],
            [
                'body' => 'Login page errors on mobile.',
                'is_sensitive' => false,
                'flag' => null,
            ]
        );

        Report::updateOrCreate(
            ['user_id' => $admin->id, 'title' => 'Internal Security Audit - CONFIDENTIAL'],
            [
                'body' => 'This document is restricted to admin personnel only.',
                'is_sensitive' => true,
                'flag' => 'Cyber{bac_n0_p0l1cy_ch3ck}',
            ]
        );
    }
}

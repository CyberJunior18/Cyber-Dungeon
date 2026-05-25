<?php

namespace App\Http\Controllers\Challenges;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Challenge1Controller extends Controller
{
    public function page()
    {
        return view('challenges.challenge1.index');
    }

    public function login(Request $request)
    {
        $username = $request->input('username', '');
        $password = $request->input('password', '');

        // Intentionally vulnerable for CTF training only.
        $query = "SELECT * FROM staff_users WHERE username = '$username' AND password = '".md5($password)."'";

        $users = DB::select($query);

        if (empty($users)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $secret = DB::select('SELECT flag FROM admin_secrets LIMIT 1');

        return response()->json([
            'success' => true,
            'message' => 'Welcome to the staff portal.',
            'flag' => $secret[0]->flag ?? null,
            'user' => $users[0]->username,
        ]);
    }

    public function hint()
    {
        return response()->json([
            'hints' => [
                'The login query is built with string concatenation.',
                "Try terminating the string early with a single quote '",
                'SQL comments can ignore the rest of a clause.',
            ],
        ]);
    }
}

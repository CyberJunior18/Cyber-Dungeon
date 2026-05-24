<?php

use App\Models\User;
use App\Models\Challenge;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

if (!function_exists('ensureAdminSeeded')) {
    function ensureAdminSeeded() {
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

Route::post('/register', function (Request $request) {
    ensureAdminSeeded();

    $validated = $request->validate([
        'username' => 'required|string|max:255|unique:users,name',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name' => $validated['username'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'points' => 0,
        'avatar' => null,
        'role' => 'user',
        'can_create_challenges' => false,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => [
            'username' => $user->name,
            'email' => $user->email,
            'points' => $user->points,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'can_create_challenges' => (bool)$user->can_create_challenges,
            'solved_challenges' => [],
        ],
        'token' => $token,
    ]);
});

Route::post('/login', function (Request $request) {
    ensureAdminSeeded();

    $validated = $request->validate([
        'login' => 'required|string',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $validated['login'])
        ->orWhere('name', $validated['login'])
        ->first();

    if (! $user || ! Hash::check($validated['password'], $user->password)) {
        throw ValidationException::withMessages([
            'login' => ['Invalid credentials.'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;
    $solved = Submission::where('user_id', $user->id)->where('is_correct', true)->pluck('challenge_id')->toArray();

    return response()->json([
        'user' => [
            'username' => $user->name,
            'email' => $user->email,
            'points' => $user->points,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'can_create_challenges' => (bool)$user->can_create_challenges,
            'solved_challenges' => $solved,
        ],
        'token' => $token,
    ]);
});

// Logout endpoint - requires authentication
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out successfully']);
});
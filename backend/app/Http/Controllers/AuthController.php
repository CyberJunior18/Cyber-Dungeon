<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
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
    }

    public function login(Request $request)
    {
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
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}

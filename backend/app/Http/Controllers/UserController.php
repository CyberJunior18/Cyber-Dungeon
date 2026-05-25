<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $solved = Submission::where('user_id', $user->id)->where('is_correct', true)->pluck('challenge_id')->toArray();
        return response()->json([
            'username' => $user->name,
            'email' => $user->email,
            'points' => $user->points,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'can_create_challenges' => (bool)$user->can_create_challenges,
            'solved_challenges' => $solved,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,name,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'avatar' => 'nullable|string',
        ]);

        $user->name = $validated['username'];
        $user->email = $validated['email'];
        if ($request->has('avatar')) {
            $user->avatar = $validated['avatar'];
        }
        $user->save();

        $solved = Submission::where('user_id', $user->id)->where('is_correct', true)->pluck('challenge_id')->toArray();
        return response()->json([
            'username' => $user->name,
            'email' => $user->email,
            'points' => $user->points,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'can_create_challenges' => (bool)$user->can_create_challenges,
            'solved_challenges' => $solved,
        ]);
    }

    public function clearProgress(Request $request)
    {
        $user = $request->user();
        Submission::where('user_id', $user->id)->delete();
        $user->points = 0;
        $user->save();

        return response()->json([
            'username' => $user->name,
            'email' => $user->email,
            'points' => $user->points,
            'avatar' => $user->avatar,
            'role' => $user->role,
            'can_create_challenges' => (bool)$user->can_create_challenges,
            'solved_challenges' => [],
        ]);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}

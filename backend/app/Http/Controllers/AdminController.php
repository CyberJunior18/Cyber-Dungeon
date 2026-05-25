<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function searchUsers(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $q = $request->query('q', '');
        if (strlen($q) < 1) {
            return response()->json([]);
        }

        $users = User::where('id', '!=', $user->id)
            ->where(function($query) use ($q) {
                $query->where('name', 'LIKE', "%{$q}%")
                      ->orWhere('email', 'LIKE', "%{$q}%");
            })
            ->get()
            ->map(function($u) {
                return [
                    'id' => $u->id,
                    'username' => $u->name,
                    'email' => $u->email,
                    'points' => $u->points,
                    'avatar' => $u->avatar,
                    'role' => $u->role,
                    'can_create_challenges' => (bool)$u->can_create_challenges,
                ];
            });

        return response()->json($users);
    }

    public function toggleApproveCreator(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $target = User::findOrFail($validated['user_id']);
        $target->can_create_challenges = ! $target->can_create_challenges;
        $target->save();

        return response()->json([
            'id' => $target->id,
            'username' => $target->name,
            'email' => $target->email,
            'points' => $target->points,
            'avatar' => $target->avatar,
            'role' => $target->role,
            'can_create_challenges' => (bool)$target->can_create_challenges,
        ]);
    }
}

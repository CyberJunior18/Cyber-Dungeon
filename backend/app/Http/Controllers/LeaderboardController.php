<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index()
    {
        ensureAdminSeeded();
        $users = User::where('role', '!=', 'admin')
            ->orderBy('points', 'desc')
            ->get();

        $leaderboard = $users->map(function ($u, $index) {
            $solvedCount = Submission::where('user_id', $u->id)->where('is_correct', true)->count();
            $solvedIds = Submission::where('user_id', $u->id)->where('is_correct', true)->pluck('challenge_id')->toArray();
            return [
                'rank' => $index + 1,
                'username' => $u->name,
                'points' => $u->points,
                'solved' => $solvedCount,
                'avatar' => $u->avatar,
                'solved_challenges' => $solvedIds,
            ];
        });

        return response()->json($leaderboard);
    }
}

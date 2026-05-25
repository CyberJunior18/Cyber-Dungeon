<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function solve(Request $request)
    {
        $validated = $request->validate([
            'challenge_id' => 'required|integer',
            'flag' => 'required|string',
        ]);

        $user = $request->user();
        $challenge = Challenge::findOrFail($validated['challenge_id']);

        $isCorrect = (trim($validated['flag']) === trim($challenge->flag));

        Submission::create([
            'user_id' => $user->id,
            'challenge_id' => $challenge->id,
            'submitted_flag' => $validated['flag'],
            'is_correct' => $isCorrect,
        ]);

        if ($isCorrect) {
            $state = \App\Models\ChallengeUserState::firstOrCreate(
                ['user_id' => $user->id, 'challenge_id' => $challenge->id]
            );

            if (! $state->is_solved) {
                $pointsToAward = $challenge->points;

                if ($challenge->creator_id === $user->id) {
                    $pointsToAward = 0;
                    $state->viewed_answer = true;
                } elseif ($state->viewed_answer) {
                    $pointsToAward = 0;
                } elseif ($state->viewed_hint) {
                    $pointsToAward = (int) floor($challenge->points / 2);
                }

                $state->is_solved = true;
                $state->points_awarded = $pointsToAward;
                $state->save();

                $user->points += $pointsToAward;
                $user->save();
            }
        }

        $solved = \App\Models\ChallengeUserState::where('user_id', $user->id)
            ->where('is_solved', true)
            ->pluck('challenge_id')
            ->toArray();

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
}

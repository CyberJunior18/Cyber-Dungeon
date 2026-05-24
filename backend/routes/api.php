<?php

use App\Models\User;
use App\Models\Challenge;
use App\Models\Submission;
use App\Support\DefaultChallenges;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

if (!function_exists('ensureAdminSeeded')) {
    function ensureAdminSeeded() { // if no admin account exists with specific email, create one 
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


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
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
    });

    Route::post('/user/update', function (Request $request) {
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
    });

    Route::post('/user/clear-progress', function (Request $request) {
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
    });

    Route::delete('/user', function (Request $request) {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    });

    Route::post('/solve', function (Request $request) {
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

            if (!$state->is_solved) {
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
    });

    // Challenge Creation Gateway
    Route::post('/challenges', function (Request $request) {
        $user = $request->user();
        if ($user->role !== 'admin' && !$user->can_create_challenges) {
            return response()->json(['message' => 'Unauthorized challenge contribution'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'nullable|url|max:2048',
            'category' => 'required|string|max:255',
            'difficulty' => 'required|string|max:255',
            'points' => 'required|integer|min:1',
            'flag' => ['required', 'string', 'max:255', 'regex:/^(Cyber|MUCTF)\{.*\}$/'],
            'hint' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $attachment = $request->file('attachment');
        $attachmentData = [];

        if ($attachment) {
            $attachmentData = [
                'attachment_path' => $attachment->store('challenge-files', 'public'),
                'attachment_name' => $attachment->getClientOriginalName(),
                'attachment_mime' => $attachment->getClientMimeType(),
                'attachment_size' => $attachment->getSize(),
            ];
        }

        $challenge = Challenge::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'] ?? null,
            'category' => $validated['category'],
            'difficulty' => $validated['difficulty'],
            'points' => $validated['points'],
            'is_approved' => ($user->role === 'admin'),
            'flag' => $validated['flag'],
            'creator_id' => $user->id,
            'hint' => $validated['hint'] ?? null,
        ] + $attachmentData);

        return response()->json($challenge->load('creator')->append('attachment_url'));
    });

    Route::post('/challenges/{id}/view-hint', function (Request $request, $id) {
        $user = $request->user();
        $state = \App\Models\ChallengeUserState::firstOrCreate(
            ['user_id' => $user->id, 'challenge_id' => $id]
        );
        $state->viewed_hint = true;
        $state->save();

        return response()->json(['message' => 'Hint viewed recorded']);
    });

    Route::post('/challenges/{id}/view-answer', function (Request $request, $id) {
        $user = $request->user();
        $state = \App\Models\ChallengeUserState::firstOrCreate(
            ['user_id' => $user->id, 'challenge_id' => $id]
        );
        $state->viewed_answer = true;
        $state->save();

        return response()->json(['message' => 'Answer viewed recorded']);
    });

    Route::post('/challenges/{id}/approve', function (Request $request, $id) {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $challenge = Challenge::findOrFail($id);
        $challenge->is_approved = true;
        $challenge->save();

        return response()->json(['message' => 'Challenge approved successfully', 'challenge' => $challenge]);
    });

    Route::delete('/challenges/{id}', function (Request $request, $id) {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);
        if ($user->role !== 'admin' && $challenge->creator_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized deletion'], 403);
        }

        // Deduct points only from those who solved it and exactly by the amount they took from it
        $userStates = \App\Models\ChallengeUserState::where('challenge_id', $challenge->id)
            ->where('is_solved', true)
            ->get();

        foreach ($userStates as $state) {
            $solver = User::find($state->user_id);
            if ($solver) {
                $solver->points = max(0, $solver->points - $state->points_awarded);
                $solver->save();
            }
        }

        // Delete submissions and states to automatically decrement solved amount/lists
        Submission::where('challenge_id', $challenge->id)->delete();
        \App\Models\ChallengeUserState::where('challenge_id', $challenge->id)->delete();

        if ($challenge->attachment_path) {
            Storage::disk('public')->delete($challenge->attachment_path);
        }

        $challenge->delete();
        return response()->json(['message' => 'Challenge deleted successfully']);
    });

    // Admin searches user profiles
    Route::get('/admin/users/search', function (Request $request) {
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
    });

    // Admin toggles creator approval for a user
    Route::post('/admin/users/approve-creator', function (Request $request) {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $target = User::findOrFail($validated['user_id']);
        $target->can_create_challenges = !$target->can_create_challenges;
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
    });
});

Route::get('/challenges', function (Request $request) {
    ensureAdminSeeded();
    DefaultChallenges::seed();

    $user = $request->user('sanctum');
    $query = Challenge::with('creator');

    if (!$user) {
        // Guests only see approved ones
        $query->where('is_approved', true);
    } elseif ($user->role === 'admin') {
        // Admin sees all (both pending and approved)
    } else {
        // Creators see all approved challenges OR their own pending challenges
        $query->where(function ($q) use ($user) {
            $q->where('is_approved', true)
              ->orWhere('creator_id', $user->id);
        });
    }

    $challenges = $query->get()->append('attachment_url');

    if ($user) {
        $states = \App\Models\ChallengeUserState::where('user_id', $user->id)->get()->keyBy('challenge_id');
        foreach ($challenges as $c) {
            $state = $states->get($c->id);
            $c->viewed_hint = $state ? (bool)$state->viewed_hint : false;
            $c->viewed_answer = $state ? (bool)$state->viewed_answer : false;
        }
    } else {
        foreach ($challenges as $c) {
            $c->viewed_hint = false;
            $c->viewed_answer = false;
        }
    }

    return response()->json($challenges);
});

Route::get('/challenges/{challenge}/attachment', function (Challenge $challenge) {
    if (!$challenge->attachment_path || !Storage::disk('public')->exists($challenge->attachment_path)) {
        abort(404);
    }

    return Storage::disk('public')->download(
        $challenge->attachment_path,
        $challenge->attachment_name ?? basename($challenge->attachment_path)
    );
});

Route::get('/leaderboard', function () {
    ensureAdminSeeded();
    // Exclude admin role from leaderboard
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
});

require __DIR__.'/auth.php';

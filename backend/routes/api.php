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

function ensureAdminSeeded() {
    if (!User::where('email', 'admin@gmail.com')->exists()) {
        User::create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
            'points' => 0,
            'avatar' => null,
            'role' => 'admin',
            'can_create_challenges' => true,
        ]);
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

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    });

    Route::post('/solve', function (Request $request) {
        $validated = $request->validate([
            'challenge_id' => 'required|integer',
            'flag' => 'required|string',
        ]);

        $user = $request->user();
        $challenge = Challenge::findOrFail($validated['challenge_id']);
        
        $isCorrect = (trim($validated['flag']) === trim($challenge->flag));

        // Create submission record
        Submission::create([
            'user_id' => $user->id,
            'challenge_id' => $challenge->id,
            'submitted_flag' => $validated['flag'],
            'is_correct' => $isCorrect,
        ]);

        if ($isCorrect) {
            // Check if player has already solved this challenge correctly before
            $alreadySolvedCount = Submission::where('user_id', $user->id)
                ->where('challenge_id', $challenge->id)
                ->where('is_correct', true)
                ->count();

            if ($alreadySolvedCount === 1) { // this was the first correct one!
                // If a privileged user made the challenge, their points won't be appended (no self-solve points!)
                if ($challenge->creator_id !== $user->id) {
                    $user->points += $challenge->points;
                    $user->save();
                }
            }
        }

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
            'flag' => $validated['flag'],
            'creator_id' => $user->id,
            'hint' => $validated['hint'] ?? null,
        ] + $attachmentData);

        return response()->json($challenge->load('creator')->append('attachment_url'));
    });

    Route::delete('/challenges/{id}', function (Request $request, $id) {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);
        if ($user->role !== 'admin' && $challenge->creator_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized deletion'], 403);
        }

        // Find all users who solved this challenge correctly and subtract points
        $solverUserIds = Submission::where('challenge_id', $challenge->id)
            ->where('is_correct', true)
            ->pluck('user_id')
            ->unique();

        foreach ($solverUserIds as $solverId) {
            $solver = User::find($solverId);
            if ($solver) {
                $solver->points = max(0, $solver->points - $challenge->points);
                $solver->save();
            }
        }

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

Route::get('/challenges', function () {
    ensureAdminSeeded();
    DefaultChallenges::seed();

    return response()->json(Challenge::with('creator')->get()->append('attachment_url'));
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

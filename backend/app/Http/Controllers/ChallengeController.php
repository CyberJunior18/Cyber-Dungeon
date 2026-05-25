<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Support\DefaultChallenges;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\Submission;
use App\Models\User;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        ensureAdminSeeded();
        DefaultChallenges::seed();

        $user = $request->user('sanctum');
        $query = Challenge::with('creator');

        if (! $user) {
            // Guests only see approved ones
            $query->where('is_approved', true);
        } elseif ($user->role === 'admin') {
            // Admin sees all
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
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && ! $user->can_create_challenges) {
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
    }

    public function viewHint(Request $request, $id)
    {
        $user = $request->user();
        $state = \App\Models\ChallengeUserState::firstOrCreate(
            ['user_id' => $user->id, 'challenge_id' => $id]
        );
        $state->viewed_hint = true;
        $state->save();

        return response()->json(['message' => 'Hint viewed recorded']);
    }

    public function viewAnswer(Request $request, $id)
    {
        $user = $request->user();
        $state = \App\Models\ChallengeUserState::firstOrCreate(
            ['user_id' => $user->id, 'challenge_id' => $id]
        );
        $state->viewed_answer = true;
        $state->save();

        return response()->json(['message' => 'Answer viewed recorded']);
    }

    public function approve(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $challenge = Challenge::findOrFail($id);
        $challenge->is_approved = true;
        $challenge->save();

        return response()->json(['message' => 'Challenge approved successfully', 'challenge' => $challenge]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $challenge = Challenge::findOrFail($id);
        if ($user->role !== 'admin' && $challenge->creator_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized deletion'], 403);
        }

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

        Submission::where('challenge_id', $challenge->id)->delete();
        \App\Models\ChallengeUserState::where('challenge_id', $challenge->id)->delete();

        if ($challenge->attachment_path) {
            Storage::disk('public')->delete($challenge->attachment_path);
        }

        $challenge->delete();
        return response()->json(['message' => 'Challenge deleted successfully']);
    }

    public function attachment(Challenge $challenge)
    {
        if (! $challenge->attachment_path || ! Storage::disk('public')->exists($challenge->attachment_path)) {
            abort(404);
        }

        return Storage::disk('public')->download(
            $challenge->attachment_path,
            $challenge->attachment_name ?? basename($challenge->attachment_path)
        );
    }
}

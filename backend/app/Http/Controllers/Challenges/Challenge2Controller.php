<?php

namespace App\Http\Controllers\Challenges;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class Challenge2Controller extends Controller
{
    public function page()
    {
        return view('challenges.challenge2.index');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
        ]);

        $token = $user->createToken('challenge2')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $token = $user->createToken('challenge2')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
        ]);
    }

    public function myReports(Request $request)
    {
        return Report::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    public function createReport(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:4000'],
        ]);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'body' => $validated['body'],
            'is_sensitive' => false,
            'flag' => null,
        ]);

        return response()->json($report, 201);
    }

    // Intentionally vulnerable for BAC challenge: no role/ownership check.
    public function adminReports()
    {
        return Report::query()
            ->where('is_sensitive', true)
            ->latest()
            ->get();
    }


}

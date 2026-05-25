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
use App\Http\Controllers\UserController;
 use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\ChallengeController as ApiChallengeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LeaderboardController;




Route::middleware('auth:sanctum')->group(function () {


    Route::get('/user', [UserController::class, 'show']);
    Route::post('/user/update', [UserController::class, 'update']);
    Route::post('/user/clear-progress', [UserController::class, 'clearProgress']);
    Route::delete('/user', [UserController::class, 'destroy']);

    Route::post('/solve', [SubmissionController::class, 'solve']);

    // Challenge creation & actions
    Route::post('/challenges', [ApiChallengeController::class, 'store']);
    Route::post('/challenges/{id}/view-hint', [ApiChallengeController::class, 'viewHint']);
    Route::post('/challenges/{id}/view-answer', [ApiChallengeController::class, 'viewAnswer']);
    Route::post('/challenges/{id}/approve', [ApiChallengeController::class, 'approve']);
    Route::delete('/challenges/{id}', [ApiChallengeController::class, 'destroy']);

    Route::get('/admin/users/search', [AdminController::class, 'searchUsers']);
    Route::post('/admin/users/approve-creator', [AdminController::class, 'toggleApproveCreator']);
});



Route::get('/challenges', [ApiChallengeController::class, 'index']);
Route::get('/challenges/{challenge}/attachment', [ApiChallengeController::class, 'attachment']);
Route::get('/leaderboard', [LeaderboardController::class, 'index']);

require __DIR__.'/auth.php';

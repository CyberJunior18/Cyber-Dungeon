<?php

use App\Models\User;
use App\Models\Challenge;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Logout endpoint - requires authentication
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
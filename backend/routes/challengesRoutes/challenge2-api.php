<?php

use App\Http\Controllers\Challenges\Challenge2Controller;
use Illuminate\Support\Facades\Route;

Route::post('/challenge2/login', [Challenge2Controller::class, 'login']);
Route::post('/challenge2/register', [Challenge2Controller::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/challenge2/reports', [Challenge2Controller::class, 'myReports']);
    Route::post('/challenge2/reports', [Challenge2Controller::class, 'createReport']);
    Route::get('/challenge2/admin/reports', [Challenge2Controller::class, 'adminReports']);
    Route::get('/challenge2/hint', [Challenge2Controller::class, 'hint']);
});

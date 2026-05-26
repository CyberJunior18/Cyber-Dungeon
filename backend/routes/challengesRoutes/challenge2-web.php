<?php

use App\Http\Controllers\Challenges\Challenge2Controller;
use Illuminate\Support\Facades\Route;

Route::get('/challenges/challenge2', [Challenge2Controller::class, 'page']);
Route::get('/challenges/challenge2/profile', [Challenge2Controller::class, 'page']);
Route::get('/challenges/challenge2/reports', [Challenge2Controller::class, 'page']);

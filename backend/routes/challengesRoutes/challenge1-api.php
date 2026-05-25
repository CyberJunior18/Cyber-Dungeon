<?php

use App\Http\Controllers\Challenges\Challenge1Controller;
use Illuminate\Support\Facades\Route;

Route::post('/challenge1/login', [Challenge1Controller::class, 'login']);
Route::get('/challenge1/hint', [Challenge1Controller::class, 'hint']);

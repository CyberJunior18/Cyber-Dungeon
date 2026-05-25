<?php

use App\Http\Controllers\Challenges\Challenge1Controller;
use Illuminate\Support\Facades\Route;

Route::get('/challenges/challenge1', [Challenge1Controller::class, 'page']);

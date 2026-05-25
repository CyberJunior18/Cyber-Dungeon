<?php

use App\Http\Controllers\Challenges\Challenge2Controller;
use Illuminate\Support\Facades\Route;

Route::get('/challenges/challenge2', [Challenge2Controller::class, 'page']);

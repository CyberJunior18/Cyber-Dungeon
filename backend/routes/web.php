<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

require __DIR__.'/challengesRoutes/challenge1-web.php';
require __DIR__.'/challengesRoutes/challenge2-web.php';

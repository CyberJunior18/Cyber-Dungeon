<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Manually require helpers to safeguard against missing composer dump-autoload
require_once __DIR__.'/../helpers.php';

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

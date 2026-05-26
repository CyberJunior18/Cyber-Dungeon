<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Challenge 2 - CorpReports Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('challenges_assets/challenge2/style.css') }}">
</head>
<body data-page="{{ request()->is('challenges/challenge2/reports') ? 'reports' : (request()->is('challenges/challenge2/profile') ? 'profile' : 'auth') }}">
    <div class="grid-overlay" aria-hidden="true"></div>

    <main class="challenge-shell container py-4 py-md-5">
        <section class="surface-card p-3 p-md-4" id="auth-shell">
            <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
                <div>
                    <p class="eyebrow mb-2">[CHALLENGE 02] INTERNAL REPORTING</p>
                    <h2 class="display-title mb-0">Login or register to continue</h2>
                </div>
                <div class="mode-toggle" role="tablist" aria-label="Authentication mode">
                    <button type="button" class="btn btn-ghost mode-btn active" data-mode="login">Login</button>
                    <button type="button" class="btn btn-ghost mode-btn" data-mode="register">Register</button>
                </div>
            </div>

            <form id="auth-form" class="vstack gap-3" novalidate>
                <div class="hidden" id="name-field">
                    <label class="form-label tiny-label" for="name">FULL NAME</label>
                    <input class="form-control field-control" type="text" id="name" name="name" placeholder="Alice" autocomplete="name">
                </div>

                <div>
                    <label class="form-label tiny-label" for="email">EMAIL</label>
                    <input class="form-control field-control" type="email" id="email" name="email" placeholder="alice@corp.internal" autocomplete="email">
                </div>

                <div>
                    <label class="form-label tiny-label" for="password">PASSWORD</label>
                    <input class="form-control field-control" type="password" id="password" name="password" placeholder="password" autocomplete="current-password">
                </div>

                <button type="submit" id="auth-submit" class="btn btn-alert">Sign in</button>
            </form>

            <div id="auth-error" class="notice notice-error hidden" role="alert"></div>
        </section>

        <section class="surface-card p-3 p-md-4 hidden" id="profile-shell">
            <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
                <div>
                    <p class="eyebrow mb-2">PROFILE</p>
                    <h2 class="display-title mb-1">Your account</h2>
                    <p class="lead-copy mb-0">Name, email, and bearer token for the current session.</p>
                </div>
                <button type="button" id="logout-btn" class="btn btn-ghost">Logout</button>
            </div>

            <div class="profile-card-grid">
                <article class="surface-card p-3 profile-item">
                    <p class="eyebrow mb-2">Name</p>
                    <h3 class="h4 mb-0" id="profile-name">-</h3>
                </article>
                <article class="surface-card p-3 profile-item">
                    <p class="eyebrow mb-2">Email</p>
                    <h3 class="h4 mb-0" id="profile-email">-</h3>
                </article>
            </div>

            <div class="surface-card token-panel p-3 mt-3">
                <div>
                    <p class="eyebrow mb-1">Bearer token</p>
                    <p class="lead-copy mb-0">Copy this into any request that needs authentication.</p>
                </div>
                <code id="token-value" class="token-value"></code>
            </div>

            <div class="d-flex gap-2 flex-wrap mt-3">
                <a href="/challenges/challenge2/reports" class="btn btn-alert">Go to reports</a>
                <button type="button" id="profile-logout-btn" class="btn btn-ghost">Logout</button>
            </div>
        </section>

        <section class="surface-card p-3 p-md-4 hidden" id="reports-shell">
            <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
                <div>
                    <p class="eyebrow mb-2">REPORTS</p>
                    <h2 class="display-title mb-1">My reports</h2>
                    <p class="lead-copy mb-0">Your saved reports and the hidden admin endpoint live here.</p>
                    <p class="lead-copy mt-2 mb-0" id="session-summary"></p>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                    <a href="/challenges/challenge2/profile" class="btn btn-ghost">Profile</a>
                    <button type="button" id="logout-btn" class="btn btn-ghost">Logout</button>
                </div>
            </div>

            <div class="surface-card p-3 token-panel mb-3">
                <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    <div>
                        <p class="eyebrow mb-1">Session token</p>
                        <p class="lead-copy mb-0">Use this token in requests to protected report endpoints.</p>
                    </div>
                    <code id="token-value" class="token-value"></code>
                </div>
            </div>

            <div class="dashboard-grid reports-grid">
                <section class="surface-card p-3">
                    <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 class="h5 mb-0">Report feed</h3>
                        <button type="button" id="refresh-btn" class="btn btn-ghost btn-sm">Refresh</button>
                    </div>
                    <div id="reports-list" class="reports-list"></div>
                </section>

                <section class="surface-card p-3">
                    <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 class="h5 mb-0">Add report</h3>
                        <button type="button" id="report-open-btn" class="btn btn-alert rounded-circle report-plus-btn" aria-label="Add report">+</button>
                    </div>
                    <div id="report-popout" class="report-popout hidden">
                        <form id="report-form" class="stack-form">
                            <div>
                                <label class="form-label tiny-label" for="report-title">TITLE</label>
                                <input class="form-control field-control" type="text" id="report-title" placeholder="Weekly summary">
                            </div>
                            <div>
                                <label class="form-label tiny-label" for="report-body">BODY</label>
                                <textarea class="form-control field-control" id="report-body" rows="6" placeholder="Write the report body here..."></textarea>
                            </div>
                            <div class="d-flex gap-2 flex-wrap">
                                <button type="submit" class="btn btn-alert">Submit report</button>
                                <button type="button" id="report-close-btn" class="btn btn-ghost">Close</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>


            <div id="dashboard-error" class="notice notice-error hidden" role="alert"></div>
            <div id="dashboard-success" class="notice notice-success hidden"></div>
        </section>
    </main>

    <script src="{{ asset('challenges_assets/challenge2/app.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>

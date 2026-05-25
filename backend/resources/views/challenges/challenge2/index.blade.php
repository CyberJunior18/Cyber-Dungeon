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
<body>
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

        <section class="surface-card p-3 p-md-4 hidden" id="dashboard-shell">
            <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
                <div>
                    <p class="eyebrow mb-2">SESSION ACTIVE</p>
                    <h2 class="display-title mb-1">CorpReports dashboard</h2>
                    <p class="lead-copy mb-0" id="session-summary"></p>
                </div>
                <button type="button" id="logout-btn" class="btn btn-ghost">Logout</button>
            </div>

            <div class="surface-card token-panel p-3 mb-3">
                <div>
                    <p class="eyebrow mb-1">Bearer token</p>
                    <p class="lead-copy mb-0">Copy this into any request that needs authentication.</p>
                </div>
                <code id="token-value" class="token-value"></code>
            </div>

            <div class="dashboard-grid">
                <section class="surface-card p-3">
                    <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 class="h5 mb-0">My reports</h3>
                        <button type="button" id="refresh-btn" class="btn btn-ghost btn-sm">Refresh</button>
                    </div>
                    <div id="reports-list" class="reports-list"></div>
                </section>

                <section class="surface-card p-3">
                    <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 class="h5 mb-0">Submit report</h3>
                    </div>
                    <form id="report-form" class="stack-form">
                        <div>
                            <label class="form-label tiny-label" for="report-title">TITLE</label>
                            <input class="form-control field-control" type="text" id="report-title" placeholder="Weekly summary">
                        </div>
                        <div>
                            <label class="form-label tiny-label" for="report-body">BODY</label>
                            <textarea class="form-control field-control" id="report-body" rows="5" placeholder="Write the report body here..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-alert">Submit report</button>
                    </form>
                </section>
            </div>

            <section class="surface-card p-3 hint-panel mt-3">
                <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
                    <h3 class="h5 mb-0">Hints</h3>
                    <button type="button" id="hint-btn" class="btn btn-ghost btn-sm">Load hints</button>
                </div>
                <ul id="hint-list" class="hint-list"></ul>
            </section>

            <div id="dashboard-error" class="notice notice-error hidden" role="alert"></div>
            <div id="dashboard-success" class="notice notice-success hidden"></div>
        </section>
    </main>

    <script src="{{ asset('challenges_assets/challenge2/app.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Challenge 1 - Staff Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<link rel="stylesheet" href="{{ asset('challenges_assets/challenge1/style.css') }}">
</head>
<body>
    <div class="backdrop-grid" aria-hidden="true"></div>

    <main class="container challenge-wrap py-4 py-md-5">

        <section class="login-shell reveal reveal-delay-1">
            <div class="surface-card p-3 p-md-4">
                <div class="d-flex align-items-center justify-content-center gap-2 mb-3 section-title-wrap text-center">
                    <i class="bi bi-terminal"></i>
                    <h1 class="display-title mb-0">Staff Portal Login</h1>
                </div>

                <form id="login-form" novalidate class="vstack gap-3">
                    <div>
                        <label class="form-label tiny-label" for="username">USERNAME</label>
                        <input class="form-control field-control" id="username" name="username" type="text" placeholder="staff_username" autocomplete="off">
                    </div>

                    <div>
                        <label class="form-label tiny-label" for="password">PASSWORD</label>
                        <input class="form-control field-control" id="password" name="password" type="password" placeholder="password">
                    </div>

                    <button id="login-btn" type="submit" class="btn btn-alert">
                        <i class="bi bi-box-arrow-in-right me-2"></i>Login
                    </button>
                </form>

                <section id="error-box" class="panel-error mt-3 hidden" role="alert"></section>

                <section id="success-box" class="panel-success mt-3 hidden">
                    <p id="success-msg" class="mb-2"></p>
                    <p id="success-user" class="mb-3"></p>
                    <div class="flag-box">
                        <p class="flag-label mb-1">// FLAG</p>
                        <p id="flag-value" class="flag-value mb-0"></p>
                    </div>
                </section>
            </div>
        </section>
    </main>

    <script src="{{ asset('challenges_assets/challenge1/app.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>

const form = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const hintBtn = document.getElementById('hint-btn');
const hintList = document.getElementById('hint-list');

const errorBox = document.getElementById('error-box');
const successBox = document.getElementById('success-box');
const successMsg = document.getElementById('success-msg');
const successUser = document.getElementById('success-user');
const flagValue = document.getElementById('flag-value');

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

function clearError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}

function showSuccess(data) {
    successMsg.textContent = data.message;
    successUser.textContent = `Logged in as: ${data.user}`;
    flagValue.textContent = data.flag ?? '';
    successBox.classList.remove('hidden');
}

function clearSuccess() {
    successMsg.textContent = '';
    successUser.textContent = '';
    flagValue.textContent = '';
    successBox.classList.add('hidden');
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    clearError();
    clearSuccess();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Authenticating...';

    try {
        const response = await fetch('/api/challenge1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || 'Login failed.');
            return;
        }

        showSuccess(data);
    } catch (error) {
        showError('Network error. Could not reach challenge API.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login ->';
    }
});

hintBtn.addEventListener('click', async () => {
    clearError();

    try {
        const response = await fetch('/api/challenge1/hint', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        const data = await response.json();

        hintList.innerHTML = '';

        if (!Array.isArray(data.hints)) {
            return;
        }

        for (const hint of data.hints) {
            const item = document.createElement('li');
            item.textContent = `> ${hint}`;
            hintList.appendChild(item);
        }

        hintBtn.textContent = 'Hints:';
    } catch (error) {
        showError('Could not load hints.');
    }
});

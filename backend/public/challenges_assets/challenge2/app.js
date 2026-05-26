const STORAGE_TOKEN = 'ch2_token';
const STORAGE_USER = 'ch2_user';

const currentPage = document.body.dataset.page || 'auth';

const authShell = document.getElementById('auth-shell');
const profileShell = document.getElementById('profile-shell');
const reportsShell = document.getElementById('reports-shell');
const authForm = document.getElementById('auth-form');
const authSubmit = document.getElementById('auth-submit');
const authError = document.getElementById('auth-error');
const dashboardError = document.getElementById('dashboard-error');
const dashboardSuccess = document.getElementById('dashboard-success');
const reportsList = document.getElementById('reports-list');
const tokenValue = document.getElementById('token-value');
const sessionSummary = document.getElementById('session-summary');
const reportForm = document.getElementById('report-form');
const reportTitle = document.getElementById('report-title');
const reportBody = document.getElementById('report-body');
const refreshBtn = document.getElementById('refresh-btn');
const logoutBtns = Array.from(document.querySelectorAll('#logout-btn, #profile-logout-btn'));
const reportOpenBtn = document.getElementById('report-open-btn');
const reportCloseBtn = document.getElementById('report-close-btn');
const reportPopout = document.getElementById('report-popout');
const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
const nameField = document.getElementById('name-field');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const API_BASE = '/api/challenge2';

let authMode = 'login';

function getToken() {
	return localStorage.getItem(STORAGE_TOKEN) || '';
}

function getStoredUser() {
	const raw = localStorage.getItem(STORAGE_USER);
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function setStoredSession(token, user) {
	localStorage.setItem(STORAGE_TOKEN, token);
	localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function clearStoredSession() {
	localStorage.removeItem(STORAGE_TOKEN);
	localStorage.removeItem(STORAGE_USER);
}

function showError(box, message) {
	box.textContent = message;
	box.classList.remove('hidden');
}

function hideError(box) {
	box.textContent = '';
	box.classList.add('hidden');
}

function showSuccess(message) {
	dashboardSuccess.textContent = message;
	dashboardSuccess.classList.remove('hidden');
}

function hideSuccess() {
	dashboardSuccess.textContent = '';
	dashboardSuccess.classList.add('hidden');
}

function goToPage(page) {
	window.location.href = `/challenges/challenge2${page === 'auth' ? '' : `/${page}`}`;
}

function switchMode(nextMode) {
	authMode = nextMode;

	modeButtons.forEach((button) => {
		button.classList.toggle('active', button.dataset.mode === nextMode);
	});

	nameField.classList.toggle('hidden', nextMode !== 'register');
	authSubmit.textContent = nextMode === 'login' ? 'Sign in' : 'Create account';
	passwordInput.setAttribute('autocomplete', nextMode === 'login' ? 'current-password' : 'new-password');
	hideError(authError);
}

function authHeaders(includeJson = true) {
	const headers = {
		Accept: 'application/json',
	};

	if (includeJson) {
		headers['Content-Type'] = 'application/json';
	}

	const token = getToken();
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
}

async function requestJson(path, options = {}) {
	let response;

	try {
		response = await fetch(path, {
			...options,
			headers: authHeaders(options.body instanceof FormData ? false : true),
		});
	} catch {
		throw new Error('Cannot reach backend. Start Laravel on 127.0.0.1:8000.');
	}

	const raw = await response.text();
	let data = null;

	if (raw && raw.trim() !== '') {
		try {
			data = JSON.parse(raw);
		} catch {
			throw new Error(`Invalid JSON response (${response.status}).`);
		}
	}

	if (!response.ok) {
		const msg = (data && data.message) ? data.message : `Request failed (${response.status})`;
		throw new Error(msg);
	}

	return data;
}

function renderReports(reports) {
	if (!Array.isArray(reports) || reports.length === 0) {
		reportsList.innerHTML = '<div class="empty-state">No visible reports yet.</div>';
		return;
	}

	reportsList.innerHTML = reports.map((report) => {
		const createdAt = report.created_at ? new Date(report.created_at).toLocaleString() : 'just now';
		return `
			<article class="report-card">
				<div class="report-top">
					<h4>${escapeHtml(report.title)}</h4>
					<span>${createdAt}</span>
				</div>
				<p>${escapeHtml(report.body)}</p>
			</article>
		`;
	}).join('');
}



function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function setPageVisibility(page) {
	authShell.classList.toggle('hidden', page !== 'auth');
	profileShell.classList.toggle('hidden', page !== 'profile');
	reportsShell.classList.toggle('hidden', page !== 'reports');
}

function enterAuth() {
	setPageVisibility('auth');
	renderReports([]);
	hideSuccess();
}

function enterProfile(user) {
	setPageVisibility('profile');
	tokenValue.textContent = getToken();
	profileName.textContent = user?.name || 'User';
	profileEmail.textContent = user?.email || 'unknown@example.com';
}

function enterReports(user) {
	setPageVisibility('reports');
	tokenValue.textContent = getToken();
	sessionSummary.textContent = `${user?.name || 'User'} | ${user?.role || 'user'}`;
}

function closeReportPopout() {
	if (reportPopout) {
		reportPopout.classList.add('hidden');
	}
}

function openReportPopout() {
	if (reportPopout) {
		reportPopout.classList.remove('hidden');
	}
}

async function loadReports() {
	try {
		const reports = await requestJson(`${API_BASE}/reports`, { method: 'GET' });
		renderReports(reports);
	} catch (error) {
		showError(dashboardError, error.message || 'Unable to load reports.');
	}
}



async function bootstrapSession() {
	const token = getToken();
	const user = getStoredUser();

	if (!token) {
		if (currentPage !== 'auth') {
			goToPage('auth');
			return;
		}
		enterAuth();
		return;
	}

	try {
		if (currentPage === 'auth') {
			goToPage('profile');
			return;
		}

		if (currentPage === 'profile') {
			enterProfile(user || { name: 'User', email: 'unknown@example.com' });
			return;
		}

		enterReports(user || { name: 'User', role: 'user' });
		await loadReports();
	} catch (error) {
		clearStoredSession();
		if (currentPage !== 'auth') {
			goToPage('auth');
			return;
		}
		enterAuth();
		showError(authError, error.message || 'Session expired.');
	}
}

modeButtons.forEach((button) => {
	button.addEventListener('click', () => switchMode(button.dataset.mode));
});

authForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	hideError(authError);

	const endpoint = authMode === 'login' ? `${API_BASE}/login` : `${API_BASE}/register`;
	const payload = authMode === 'register'
		? {
			name: nameInput.value.trim(),
			email: emailInput.value.trim(),
			password: passwordInput.value,
		}
		: {
			email: emailInput.value.trim(),
			password: passwordInput.value,
		};

	authSubmit.disabled = true;
	authSubmit.textContent = authMode === 'login' ? 'Signing in...' : 'Creating account...';

	try {
		const data = await requestJson(endpoint, {
			method: 'POST',
			body: JSON.stringify(payload),
		});

		setStoredSession(data.token, data.user);
		goToPage('profile');
	} catch (error) {
		showError(authError, error.message || 'Authentication failed.');
	} finally {
		authSubmit.disabled = false;
		authSubmit.textContent = authMode === 'login' ? 'Sign in' : 'Create account';
	}
});

if (reportForm) {
	reportForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		hideError(dashboardError);
		hideSuccess();

		try {
			await requestJson(`${API_BASE}/reports`, {
				method: 'POST',
				body: JSON.stringify({
					title: reportTitle.value.trim(),
					body: reportBody.value.trim(),
				}),
			});

			reportTitle.value = '';
			reportBody.value = '';
			closeReportPopout();
			showSuccess('Report submitted. The dashboard still only shows your own entries.');
			await loadReports();
		} catch (error) {
			showError(dashboardError, error.message || 'Unable to submit report.');
		}
	});
}


if (refreshBtn) {
	refreshBtn.addEventListener('click', loadReports);
}

logoutBtns.forEach((button) => {
	button.addEventListener('click', () => {
		clearStoredSession();
		switchMode('login');
		emailInput.value = '';
		passwordInput.value = '';
		nameInput.value = '';
		goToPage('auth');
	});
});

if (reportOpenBtn) {
	reportOpenBtn.addEventListener('click', openReportPopout);
}

if (reportCloseBtn) {
	reportCloseBtn.addEventListener('click', closeReportPopout);
}

switchMode('login');
bootstrapSession();

const API_BASE_URL = 'http://localhost:3001/api';

// Dark Mode Toggle
const toggleDarkMode = () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', !isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
};

// Apply dark mode on load
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
});

// Handle Login and Registration
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleForms = document.getElementById('toggleForms');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (toggleForms) toggleForms.addEventListener('click', toggleFormDisplay);
});

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const success = await makeRequest('auth/login', { username, password });
    if (success) {
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const success = await makeRequest('auth/register', { username, password });
    if (success) {
        alert('Registration successful! You can now log in.');
        toggleFormDisplay();
    }
}

async function makeRequest(endpoint, data) {
    const url = `${API_BASE_URL}/${endpoint}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (response.ok) return true;

        alert(responseData.error || `Failed to ${endpoint}`);
        return false;
    } catch (error) {
        console.error(`[ERROR] ${endpoint} request failed:`, error);
        alert(`Error: Unable to ${endpoint}`);
        return false;
    }
}

function toggleFormDisplay() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginText = document.getElementById('loginText');
    const registerText = document.getElementById('registerText');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginText.classList.remove('hidden');
        registerText.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginText.classList.add('hidden');
        registerText.classList.remove('hidden');
    }
}

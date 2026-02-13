const API_BASE_URL = 'http://localhost:3001/api/v1';

// Store token in localStorage
const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

const getAuthToken = () => localStorage.getItem('authToken');

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
    
    // Check if user is already logged in
    const token = getAuthToken();
    if (token && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const emailOrUsername = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const result = await makeRequest('auth/login', { emailOrUsername, password });
    
    if (result && result.status === 'success') {
        setAuthToken(result.token);
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    } else if (result && result.status === 'mfa_required') {
        // Handle MFA flow
        alert('MFA required. Please enter your OTP.');
        // You could show an MFA input form here
        const otp = prompt('Enter your OTP:');
        if (otp) {
            const mfaResult = await makeRequest('auth/mfa/verify', { 
                token: otp, 
                userId: result.userId 
            });
            if (mfaResult && mfaResult.status === 'success') {
                setAuthToken(mfaResult.token);
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            }
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const result = await makeRequest('auth/register', { username, email, password });
    if (result && result.status === 'success') {
        alert('Registration successful! You can now log in.');
        toggleFormDisplay();
    }
}

async function makeRequest(endpoint, data, method = 'POST') {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
    
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const options = {
            method,
            headers
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        }

        alert(responseData.message || `Request failed: ${endpoint}`);
        return null;
    } catch (error) {
        console.error(`[ERROR] ${endpoint} request failed:`, error);
        alert(`Error: Unable to complete request`);
        return null;
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
        if (loginText) loginText.classList.remove('hidden');
        if (registerText) registerText.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        if (loginText) loginText.classList.add('hidden');
        if (registerText) registerText.classList.remove('hidden');
    }
}

// Logout function
function logout() {
    setAuthToken(null);
    window.location.href = 'index.html';
}

// Export for use in other scripts
window.API_BASE_URL = API_BASE_URL;
window.makeRequest = makeRequest;
window.getAuthToken = getAuthToken;
window.logout = logout;

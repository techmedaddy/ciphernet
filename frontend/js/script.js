const API_BASE_URL = 'http://localhost:3001/api';

// Event listener for the logout button
document.getElementById('logout')?.addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = 'index.html'; // Redirect to login page
});

// DOMContentLoaded event to initialize forms
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleForms = document.getElementById('toggleForms');

    // Show login form by default
    if (loginForm) {
        showLoginForm();
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener for registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Toggle between login and registration forms
    if (toggleForms) {
        toggleForms.addEventListener('click', toggleFormDisplay);
    }

    // Populate user info in profile page
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        const username = 'JohnDoe'; // Fetch or get the username from localStorage or an API
        usernameElement.innerText = username;
    }
});

// Function to handle login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    console.log('Attempting to log in with:', { username });
    const success = await makeRequest('login', { username, password });
    if (success) {
        window.location.href = 'dashboard.html'; // Redirect after successful login
    }
}

// Function to handle registration
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    console.log('Attempting to register with:', { username });
    const success = await makeRequest('register', { username, password });
    if (success) {
        alert('Registration successful! You can now log in.');
        showLoginForm(); // Show login form after successful registration
        registerForm.reset(); // Reset the registration form
    }
}

// Function to make API requests for login and register
async function makeRequest(type, data) {
    const endpoint = type === 'login' ? 'login' : 'register';
    const url = `${API_BASE_URL}/auth/${endpoint}`;
    console.log(`Attempting to fetch: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log(`Response status: ${response.status}`);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (response.ok) {
            if (type === 'login') {
                // Store token in localStorage and return true for success
                localStorage.setItem('token', responseData.token);
            }
            return true; // Return true to indicate success
        } else {
            alert(responseData.error || `${type} failed. Please try again.`);
            return false; // Return false for failure
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert(`An error occurred during ${type}. Please check the console for details.`);
        return false; // Return false for failure
    }
}

// Function to toggle between login and registration forms
function toggleFormDisplay() {
    if (loginForm.style.display === 'none') {
        showLoginForm();
    } else {
        showRegisterForm();
    }
}

// Show the login form and hide the registration form
function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    toggleForms.innerText = 'Don\'t have an account? Register here!';
}

// Show the registration form and hide the login form
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    toggleForms.innerText = 'Already have an account? Login here!';
}

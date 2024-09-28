// File: frontend/js/script.js
const API_BASE_URL = 'http://localhost:3001/api';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleForms = document.getElementById('toggleForms');

    // Show login form by default
    showLoginForm();

    // Event listener for login form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Logging in with', { username, password });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error details:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            alert('An error occurred. Please check the console for details.');
        }
    });

    // Event listener for registration form submission
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const regUsername = document.getElementById('regUsername').value;
        const regPassword = document.getElementById('regPassword').value;

        console.log('Registering with', { regUsername, regPassword });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: regUsername, password: regPassword })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please log in.');
                showLoginForm();
            } else {
                alert(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error details:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            alert('An error occurred. Please check the console for details.');
        }
    });

    // Function to toggle between login and registration forms
    toggleForms.addEventListener('click', function () {
        if (loginForm.style.display === 'none') {
            showLoginForm();
        } else {
            showRegisterForm();
        }
    });

    function showLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleForms.innerText = 'Need an account? Register here!';
    }

    function showRegisterForm() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleForms.innerText = 'Already have an account? Login here!';
    }
});
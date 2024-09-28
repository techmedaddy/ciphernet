// File: frontend/js/script.js

// Event listener for the login form
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get values from the form
  const username = document.getElementById('loginUsername').value; // Ensure ID matches your HTML
  const password = document.getElementById('loginPassword').value; // Ensure ID matches your HTML

  try {
      // Make a POST request to the login API
      const res = await fetch('http://localhost:3001/api/auth/login', { // Changed to port 3001
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });
    
      // Parse the JSON response
      const data = await res.json();
      if (data.token) {
          localStorage.setItem('token', data.token); // Store token in local storage
          window.location.href = 'dashboard.html'; // Redirect to dashboard
      } else {
          alert('Login failed');
      }
  } catch (error) {
      console.error('Error during login:', error); // Log any errors
      alert('An error occurred while logging in.');
  }
});

// Event listener for disconnect button
document.getElementById('disconnect')?.addEventListener('click', async () => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  try {
      // Make a POST request to disconnect from VPN
      const res = await fetch('http://localhost:3001/api/vpn/disconnect', { // Changed to port 3001
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
      });
    
      if (res.status === 200) {
          alert('VPN disconnected');
      } else {
          alert('Failed to disconnect');
      }
  } catch (error) {
      console.error('Error during disconnect:', error); // Log any errors
      alert('An error occurred while disconnecting.');
  }
});

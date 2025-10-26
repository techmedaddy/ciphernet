document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('serverMap').setView([20.0, 0.0], 2); // Initial world view

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap',
    }).addTo(map);

    // Define server locations
    const servers = [
        { name: 'New York', lat: 40.7128, lng: -74.0060 },
        { name: 'London', lat: 51.5074, lng: -0.1278 },
        { name: 'Tokyo', lat: 35.6895, lng: 139.6917 },
    ];

    // Add markers for each server
    servers.forEach(server => {
        const marker = L.marker([server.lat, server.lng]).addTo(map);
        marker.bindPopup(`<b>${server.name}</b><br><button onclick="connectToServer('${server.name}')">Connect</button>`);
    });
});

// Function to handle server connection
async function connectToServer(serverName) {
    try {
        const response = await fetch(`/api/vpn/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverName }),
        });
        const data = await response.json();
        alert(data.message || 'Connected to server!');
    } catch (error) {
        console.error('Failed to connect:', error);
        alert('Error connecting to server.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('serverMap').setView([20.0, 0.0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap',
    }).addTo(map);

    // Add server locations
    const servers = [
        { name: 'New York', lat: 40.7128, lng: -74.0060 },
        { name: 'London', lat: 51.5074, lng: -0.1278 },
        { name: 'Tokyo', lat: 35.6895, lng: 139.6917 },
    ];

    servers.forEach(server => {
        const marker = L.marker([server.lat, server.lng]).addTo(map);
        marker.bindPopup(`<b>${server.name}</b><br><button onclick="connectToServer('${server.name}')">Connect</button>`);
    });
});

async function connectToServer(serverName) {
    try {
        const response = await fetch('/api/vpn/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverName }),
        });
        const data = await response.json();
        alert(data.message || 'Connected to server!');
    } catch (error) {
        console.error('Error connecting to server:', error);
        alert('Connection failed.');
    }
}

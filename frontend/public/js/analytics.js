document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('dataUsageChart').getContext('2d');

    try {
        const response = await fetch('/api/analytics/data-usage'); // Backend API
        const data = await response.json();

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels, // e.g., ['Jan', 'Feb', 'Mar']
                datasets: [
                    {
                        label: 'Data Usage (MB)',
                        data: data.values, // Corresponding values
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Failed to fetch analytics data:', error);
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const dataUsageCtx = document.getElementById('dataUsageChart').getContext('2d');
    const sessionCtx = document.getElementById('sessionChart').getContext('2d');

    try {
        // Fetch data usage metrics
        const usageResponse = await fetch('/api/analytics/data-usage');
        const usageData = await usageResponse.json();

        // Data Usage Chart
        new Chart(dataUsageCtx, {
            type: 'line',
            data: {
                labels: usageData.labels,
                datasets: [
                    {
                        label: 'Data Usage (MB)',
                        data: usageData.values,
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        fill: true,
                    },
                ],
            },
            options: { responsive: true },
        });

        // Fetch session metrics
        const sessionResponse = await fetch('/api/analytics/sessions');
        const sessionData = await sessionResponse.json();

        // Active Sessions Chart
        new Chart(sessionCtx, {
            type: 'bar',
            data: {
                labels: sessionData.labels,
                datasets: [
                    {
                        label: 'Active Sessions',
                        data: sessionData.values,
                        backgroundColor: '#28a745',
                    },
                ],
            },
            options: { responsive: true },
        });
    } catch (error) {
        console.error('Error loading metrics:', error);
    }
});

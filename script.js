// AWS API Gateway URL (Your actual URL)
const AWS_API_URL = 'https://3o55x0epmc.execute-api.ap-south-1.amazonaws.com/prod/weather';

// Show loading immediately
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('api-status').innerHTML = '🔄 Connecting to AWS...';
    document.getElementById('temperature').textContent = 'Loading...';
    document.getElementById('humidity').textContent = 'Loading...';
    document.getElementById('condition').textContent = 'Loading...';
   
    // Load AWS data
    setTimeout(getAWSWeather, 100);
});

// Weather code mapping
const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    80: 'Light rain showers', 81: 'Moderate rain showers', 82: 'Heavy rain showers',
    95: 'Thunderstorm'
};

// Refresh settings
let refreshInterval = 60000; // 60 seconds for AWS
let autoRefreshEnabled = true;

async function getAWSWeather() {
    try {
        console.log('🔗 Fetching data from AWS API Gateway...');
        const response = await fetch(AWS_API_URL);
       
        if (!response.ok) {
            throw new Error(`AWS API Error: ${response.status}`);
        }
       
        const result = await response.json();
        console.log('✅ AWS data received:', result);
       
        updateAWSDisplay(result);
       
    } catch (error) {
        console.error('❌ AWS API failed:', error);
        // Fallback to direct API
        getDirectWeather();
    }
}

async function getDirectWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.68&longitude=75.92&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&timezone=auto');
        const data = await response.json();
       
        updateDisplay(data);
       
    } catch (error) {
        showFallbackData();
    }
}

function updateAWSDisplay(result) {
    const weatherData = result.data;
   
    // Update weather data from AWS
    document.getElementById('temperature').textContent = `${Math.round(weatherData.temperature)}°C`;
    document.getElementById('humidity').textContent = `${Math.round(weatherData.humidity)}%`;
    document.getElementById('condition').textContent = weatherCodes[weatherData.weather_code] || 'Unknown';
    document.getElementById('wind-speed').textContent = `${Math.round(weatherData.wind_speed)} km/h`;
    document.getElementById('pressure').textContent = `${Math.round(weatherData.pressure)} hPa`;
    document.getElementById('feels-like').textContent = `${Math.round(weatherData.temperature)}°C`;
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
   
    // Update location info
    document.getElementById('location').innerHTML =
        `📍 <strong>Solapur, Maharashtra, India</strong>`;
   
    // Update status
    document.getElementById('api-status').innerHTML =
        '✅ <strong>AWS CONNECTED</strong><br>Lambda + DynamoDB + API Gateway';
    document.getElementById('api-status').className = 'status-live';
    document.getElementById('data-source').textContent =
        `🌐 AWS Serverless Architecture • Real-time data`;
}

function updateDisplay(data) {
    const current = data.current;
   
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('condition').textContent = weatherCodes[current.weather_code] || 'Unknown';
    document.getElementById('wind-speed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('pressure').textContent = `${Math.round(current.surface_pressure)} hPa`;
    document.getElementById('feels-like').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
   
    document.getElementById('location').innerHTML =
        `📍 <strong>Solapur, Maharashtra, India</strong>`;
   
    document.getElementById('api-status').innerHTML =
        '⚠️ <strong>DIRECT API</strong><br>AWS temporarily unavailable';
    document.getElementById('data-source').textContent =
        `🌐 Open-Meteo API • Fallback mode`;
}

function showFallbackData() {
    document.getElementById('api-status').innerHTML =
        '❌ <strong>FALLBACK MODE</strong><br>All APIs unavailable';
    document.getElementById('location').innerHTML = '📍 Solapur, Maharashtra, India';
   
    document.getElementById('temperature').textContent = '30°C';
    document.getElementById('humidity').textContent = '55%';
    document.getElementById('condition').textContent = 'Partly cloudy';
    document.getElementById('wind-speed').textContent = '12 km/h';
    document.getElementById('pressure').textContent = '1015 hPa';
    document.getElementById('feels-like').textContent = '32°C';
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
}

// Refresh controls
function setRefreshRate(seconds) {
    refreshInterval = seconds * 1000;
    clearInterval(window.refreshTimer);
   
    if (autoRefreshEnabled) {
        window.refreshTimer = setInterval(getAWSWeather, refreshInterval);
        document.getElementById('refresh-status').textContent = `Auto-refresh: ${seconds}s`;
    }
}

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
   
    if (autoRefreshEnabled) {
        window.refreshTimer = setInterval(getAWSWeather, refreshInterval);
        document.getElementById('toggle-refresh').textContent = '⏸️ Pause Auto-Refresh';
        document.getElementById('refresh-status').textContent = `Auto-refresh: ${refreshInterval/1000}s`;
    } else {
        clearInterval(window.refreshTimer);
        document.getElementById('toggle-refresh').textContent = '▶️ Start Auto-Refresh';
        document.getElementById('refresh-status').textContent = 'Auto-refresh: PAUSED';
    }
}

// Start auto-refresh
window.refreshTimer = setInterval(getAWSWeather, refreshInterval);

// Make functions available globally
window.getAWSWeather = getAWSWeather;
window.setRefreshRate = setRefreshRate;
window.toggleAutoRefresh = toggleAutoRefresh;

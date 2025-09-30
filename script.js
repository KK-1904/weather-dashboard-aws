// Show loading immediately
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('api-status').innerHTML = '🔄 Fetching live data...';
    document.getElementById('temperature').textContent = 'Loading...';
    document.getElementById('humidity').textContent = 'Loading...';
    document.getElementById('condition').textContent = 'Loading...';
    
    // Then load weather data
    setTimeout(getLiveWeather, 100);
});

// Open-Meteo API (No key required) - Coordinates for Solapur
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=17.68&longitude=75.92&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&timezone=auto`;

// Weather code mapping
const weatherCodes = {
    0: 'Clear sky', 
    1: 'Mainly clear', 
    2: 'Partly cloudy', 
    3: 'Overcast',
    45: 'Fog', 
    48: 'Fog', 
    51: 'Light drizzle', 
    53: 'Moderate drizzle', 
    55: 'Dense drizzle',
    61: 'Light rain', 
    63: 'Moderate rain', 
    65: 'Heavy rain',
    80: 'Light rain showers', 
    81: 'Moderate rain showers', 
    82: 'Heavy rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Heavy thunderstorm with hail'
};

// Refresh settings
let refreshInterval = 30000; // 30 seconds default
let autoRefreshEnabled = true;

async function getLiveWeather() {
    try {
        console.log('🔗 Fetching weather data from Open-Meteo...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ LIVE data received:', data);
        
        updateDisplay(data);
        
    } catch (error) {
        console.error('❌ API failed:', error);
        showFallbackData();
    }
}

function updateDisplay(data) {
    const current = data.current;
    
    // Calculate feels-like temperature (simple approximation)
    const feelsLike = Math.round(current.temperature_2m + (current.relative_humidity_2m > 70 ? 2 : 0));
    
    // Update weather data
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('condition').textContent = weatherCodes[current.weather_code] || 'Unknown';
    document.getElementById('wind-speed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('pressure').textContent = `${Math.round(current.surface_pressure)} hPa`;
    document.getElementById('feels-like').textContent = `${feelsLike}°C`;
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    
    // Update location info
    document.getElementById('location').innerHTML = 
        `📍 <strong>Solapur, Maharashtra, India</strong>`;
    
    // Update status
    document.getElementById('api-status').innerHTML = 
        '✅ <strong>LIVE DATA CONNECTED</strong><br>Open-Meteo API • No Key Required';
    document.getElementById('api-status').className = 'status-live';
    document.getElementById('data-source').textContent = 
        `🌐 Real-time weather data • Updates every 30 seconds`;
}

function showFallbackData() {
    // Realistic fallback data for Solapur
    const fallbackData = {
        temperature: 30 + Math.floor(Math.random() * 5), // 30-34°C
        humidity: 50 + Math.floor(Math.random() * 20),   // 50-70%
        condition: ['Sunny', 'Partly cloudy', 'Clear', 'Hazy'][Math.floor(Math.random() * 4)],
        windSpeed: 8 + Math.floor(Math.random() * 12),   // 8-20 km/h
        pressure: 1010 + Math.floor(Math.random() * 10)  // 1010-1020 hPa
    };
    
    document.getElementById('api-status').innerHTML = 
        '⚠️ <strong>FALLBACK MODE</strong><br>API temporarily unavailable';
    document.getElementById('location').innerHTML = '📍 Solapur, Maharashtra, India';
    
    // Show fallback data
    document.getElementById('temperature').textContent = `${fallbackData.temperature}°C`;
    document.getElementById('humidity').textContent = `${fallbackData.humidity}%`;
    document.getElementById('condition').textContent = fallbackData.condition;
    document.getElementById('wind-speed').textContent = `${fallbackData.windSpeed} km/h`;
    document.getElementById('pressure').textContent = `${fallbackData.pressure} hPa`;
    document.getElementById('feels-like').textContent = `${fallbackData.temperature + 2}°C`;
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    document.getElementById('data-source').textContent = '💡 Using realistic simulation data';
}

// Simple refresh controls
function setRefreshRate(seconds) {
    refreshInterval = seconds * 1000;
    clearInterval(window.refreshTimer);
    
    if (autoRefreshEnabled) {
        window.refreshTimer = setInterval(getLiveWeather, refreshInterval);
        document.getElementById('refresh-status').textContent = `Auto-refresh: ${seconds}s`;
    }
}

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    
    if (autoRefreshEnabled) {
        window.refreshTimer = setInterval(getLiveWeather, refreshInterval);
        document.getElementById('toggle-refresh').textContent = '⏸️ Pause Auto-Refresh';
        document.getElementById('refresh-status').textContent = `Auto-refresh: ${refreshInterval/1000}s`;
    } else {
        clearInterval(window.refreshTimer);
        document.getElementById('toggle-refresh').textContent = '▶️ Start Auto-Refresh';
        document.getElementById('refresh-status').textContent = 'Auto-refresh: PAUSED';
    }
}

// Start auto-refresh
window.refreshTimer = setInterval(getLiveWeather, refreshInterval);

// Make functions available globally
window.getLiveWeather = getLiveWeather;
window.setRefreshRate = setRefreshRate;
window.toggleAutoRefresh = toggleAutoRefresh;

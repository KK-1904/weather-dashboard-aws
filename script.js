<script>
let currentTheme = 'light';
let refreshInterval = 30000; // default 30s
let refreshTimer;

// Toggle Dark/Light Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
}

// Alert Banner Control
function showAlert(message, level='high') {
    const banner = document.getElementById('alert-banner');
    const alertMsg = document.getElementById('alert-message');
    banner.style.display = 'block';
    alertMsg.textContent = message;
    banner.className = `alert-banner alert-${level}`;
}

function closeAlert() {
    document.getElementById('alert-banner').style.display = 'none';
}

// Refresh Rate Controls
function setRefreshRate(seconds) {
    refreshInterval = seconds * 1000;
    document.getElementById('refresh-status').textContent = `Auto-refresh: ${seconds}s`;
    if(refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(fetchAllData, refreshInterval);
}

function toggleAutoRefresh() {
    if(refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
        document.getElementById('toggle-refresh').textContent = '▶ Resume Auto-Refresh';
    } else {
        refreshTimer = setInterval(fetchAllData, refreshInterval);
        document.getElementById('toggle-refresh').textContent = '⏸ Pause Auto-Refresh';
    }
}

// Search Location
function searchLocation() {
    const query = document.getElementById('search-input').value;
    if(!query) return alert('Please enter a location');
    fetchGeocode(query);
}

// Geocoding API
async function fetchGeocode(location) {
    try {
        // Replace with your Geocoding API key
        const apiKey = 'YOUR_GEOCODING_API_KEY';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if(data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            document.getElementById('location').textContent = `📍 ${data.results[0].formatted}`;
            fetchAllData(lat, lng);
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
}

// Fetch All Data (Weather + Flood + Air + Elevation + Marine)
async function fetchAllData(lat, lon) {
    if(!lat || !lon) {
        // Default coordinates (Solapur)
        lat = 17.6599;
        lon = 75.9064;
    }
    fetchWeather(lat, lon);
    fetchFlood(lat, lon);
    fetchAirQuality(lat, lon);
    fetchElevation(lat, lon);
    fetchMarineForecast(lat, lon);
}

// Weather API
async function fetchWeather(lat, lon) {
    try {
        // Replace with your Weather API
        const apiKey = 'YOUR_WEATHER_API_KEY';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('condition').textContent = data.weather[0].description;
        document.getElementById('wind-speed').textContent = `${data.wind.speed} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('feels-like').textContent = `${data.main.feels_like}°C`;
        document.getElementById('weather-icon').textContent = getWeatherEmoji(data.weather[0].main);
        document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
    } catch (error) {
        console.error('Weather API error:', error);
    }
}

// Placeholder function to map weather to emoji
function getWeatherEmoji(condition) {
    switch(condition.toLowerCase()) {
        case 'clear': return '☀️';
        case 'clouds': return '☁️';
        case 'rain': return '🌧️';
        case 'thunderstorm': return '⛈️';
        case 'snow': return '❄️';
        default: return '⛅';
    }
}

// Flood API
async function fetchFlood(lat, lon) {
    console.log('Fetching flood data for', lat, lon);
    // Add your Flood API call here
}

// Air Quality API
async function fetchAirQuality(lat, lon) {
    console.log('Fetching air quality data for', lat, lon);
    // Add your Air Quality API call here
}

// Elevation API
async function fetchElevation(lat, lon) {
    console.log('Fetching elevation data for', lat, lon);
    // Add your Elevation API call here
}

// Marine Forecast API
async function fetchMarineForecast(lat, lon) {
    console.log('Fetching marine forecast data for', lat, lon);
    // Add your Marine Forecast API call here
}

// Initialize
window.onload = function() {
    fetchAllData();
    refreshTimer = setInterval(fetchAllData, refreshInterval);
}
</script>


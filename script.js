
// AWS API Gateway URL
const AWS_API_URL = 'https://3o55x0epmc.execute-api.ap-south-1.amazonaws.com/prod/weather';

// Theme management
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector('.theme-toggle').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle').textContent = '☀️ Light Mode';
    }
}

// Alert system
function showAlert(message, type = 'alert-medium') {
    const alertBanner = document.getElementById('alert-banner');
    const alertMessage = document.getElementById('alert-message');
    
    alertMessage.textContent = message;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (alertBanner.style.display === 'block') {
            closeAlert();
        }
    }, 10000);
}

function closeAlert() {
    document.getElementById('alert-banner').style.display = 'none';
}

function checkWeatherAlerts(weatherData) {
    const temp = weatherData.temperature;
    const humidity = weatherData.humidity;
    
    // Temperature alerts
    if (temp > 35) {
        showAlert(`🔥 HIGH TEMPERATURE ALERT! ${temp}°C - Stay hydrated and avoid direct sun.`, 'alert-high');
    } else if (temp > 32) {
        showAlert(`🌡️ Warm day: ${temp}°C - Perfect for outdoor activities.`, 'alert-medium');
    } else if (temp < 25) {
        showAlert(`❄️ Cool temperature: ${temp}°C - You might need a light jacket.`, 'alert-low');
    }
    
    // Humidity alerts
    if (humidity > 80) {
        showAlert(`💧 HIGH HUMIDITY: ${humidity}% - Muggy conditions expected.`, 'alert-medium');
    } else if (humidity < 30) {
        showAlert(`🏜️ LOW HUMIDITY: ${humidity}% - Stay hydrated.`, 'alert-low');
    }
    
    // Weather condition alerts
    const condition = weatherData.condition;
    if (condition.includes('rain') || condition.includes('drizzle')) {
        showAlert(`☔ RAIN ALERT: ${condition} - Don't forget your umbrella!`, 'alert-low');
    } else if (condition.includes('thunderstorm')) {
        showAlert(`⛈️ THUNDERSTORM ALERT: ${condition} - Stay indoors if possible.`, 'alert-high');
    } else if (condition.includes('clear') || condition.includes('sunny')) {
        showAlert(`😊 Perfect weather: ${condition} - Great day to go outside!`, 'alert-low');
    }
}

// Weather icons mapping
function getWeatherIcon(weatherCode, isDay = true) {
    const icons = {
        0: isDay ? '☀️' : '🌙',  // Clear sky
        1: isDay ? '🌤️' : '🌙', // Mainly clear
        2: '⛅',  // Partly cloudy
        3: '☁️',  // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Fog
        51: '🌦️', // Light drizzle
        53: '🌦️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        61: '🌧️', // Light rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        80: '🌦️', // Light showers
        81: '🌧️', // Moderate showers
        82: '⛈️',  // Heavy showers
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with hail
        99: '⛈️'   // Heavy thunderstorm
    };
    return icons[weatherCode] || '🌈';
}

function updateWeatherIcon(weatherCode) {
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 18;
    const icon = getWeatherIcon(weatherCode, isDay);
    document.getElementById('weather-icon').textContent = icon;
}

// Test function for alerts
function testAlerts() {
    const testConditions = [
        { temperature: 36, humidity: 45, condition: 'Clear sky' },
        { temperature: 28, humidity: 85, condition: 'Heavy rain' },
        { temperature: 22, humidity: 25, condition: 'Clear sky' }
    ];
    
    const randomCondition = testConditions[Math.floor(Math.random() * testConditions.length)];
    checkWeatherAlerts(randomCondition);
}

// Enhanced display function
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
    document.getElementById('location').innerHTML = `📍 <strong>Solapur, Maharashtra, India</strong>`;
    
    // Update weather icon
    updateWeatherIcon(weatherData.weather_code);
    
    // Check for alerts
    checkWeatherAlerts(weatherData);
    
    // Update status
    document.getElementById('api-status').innerHTML = '✅ <strong>AWS CONNECTED</strong><br>With Smart Alerts & Themes';
    document.getElementById('api-status').className = 'status-live';
    document.getElementById('data-source').textContent = `🌐 AWS Serverless • Real-time alerts enabled`;
}

// Weather code mapping (keep this)
const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    80: 'Light rain showers', 81: 'Moderate rain showers', 82: 'Heavy rain showers',
    95: 'Thunderstorm'
};

// Refresh settings and other existing functions
let refreshInterval = 60000;
let autoRefreshEnabled = true;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    document.getElementById('api-status').innerHTML = '🔄 Connecting to AWS...';
    setTimeout(getAWSWeather, 100);
});

// Keep all your existing AWS functions (getAWSWeather, getDirectWeather, etc.)
// ... [Your existing AWS functions remain exactly the same] ...

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
        getDirectWeather();
    }
}

async function getDirectWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.68&longitude=75.92&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&timezone=auto');
        const data = await response.json();
        
        // Create compatible data structure
        const compatibleData = {
            data: {
                temperature: data.current.temperature_2m,
                humidity: data.current.relative_humidity_2m,
                weather_code: data.current.weather_code,
                wind_speed: data.current.wind_speed_10m,
                pressure: data.current.surface_pressure,
                condition: weatherCodes[data.current.weather_code] || 'Unknown'
            }
        };
        
        updateAWSDisplay(compatibleData);
        
    } catch (error) {
        showFallbackData();
    }
}

function showFallbackData() {
    document.getElementById('api-status').innerHTML = '❌ <strong>FALLBACK MODE</strong><br>All APIs unavailable';
    document.getElementById('location').innerHTML = '📍 Solapur, Maharashtra, India';
    
    document.getElementById('temperature').textContent = '30°C';
    document.getElementById('humidity').textContent = '55%';
    document.getElementById('condition').textContent = 'Partly cloudy';
    document.getElementById('wind-speed').textContent = '12 km/h';
    document.getElementById('pressure').textContent = '1015 hPa';
    document.getElementById('feels-like').textContent = '32°C';
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    
    updateWeatherIcon(2); // Partly cloudy icon
}

// Keep your existing refresh control functions
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
window.testAlerts = testAlerts;
window.toggleTheme = toggleTheme;
window.closeAlert = closeAlert;

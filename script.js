// ========================
// AWS API Gateway URL
// ========================
const AWS_API_URL = 'https://3o55x0epmc.execute-api.ap-south-1.amazonaws.com/prod/weather';

// ========================
// Theme Management
// ========================
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

// ========================
// Alert System
// ========================
function showAlert(message, type = 'alert-medium') {
    const alertBanner = document.getElementById('alert-banner');
    const alertMessage = document.getElementById('alert-message');
    
    alertMessage.textContent = message;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.style.display = 'block';
    
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
    const condition = weatherData.condition.toLowerCase();

    // Temperature alerts
    if (temp > 35) showAlert(`🔥 HIGH TEMPERATURE ALERT! ${temp}°C - Stay hydrated and avoid direct sun.`, 'alert-high');
    else if (temp > 32) showAlert(`🌡️ Warm day: ${temp}°C - Perfect for outdoor activities.`, 'alert-medium');
    else if (temp < 25) showAlert(`❄️ Cool temperature: ${temp}°C - You might need a light jacket.`, 'alert-low');

    // Humidity alerts
    if (humidity > 80) showAlert(`💧 HIGH HUMIDITY: ${humidity}% - Muggy conditions expected.`, 'alert-medium');
    else if (humidity < 30) showAlert(`🏜️ LOW HUMIDITY: ${humidity}% - Stay hydrated.`, 'alert-low');

    // Weather condition alerts
    if (condition.includes('rain') || condition.includes('drizzle')) showAlert(`☔ RAIN ALERT: ${weatherData.condition} - Don't forget your umbrella!`, 'alert-low');
    else if (condition.includes('thunderstorm')) showAlert(`⛈️ THUNDERSTORM ALERT: ${weatherData.condition} - Stay indoors if possible.`, 'alert-high');
    else if (condition.includes('clear') || condition.includes('sunny')) showAlert(`😊 Perfect weather: ${weatherData.condition} - Great day to go outside!`, 'alert-low');
}

// ========================
// Weather Icons
// ========================
function getWeatherIcon(weatherCode, isDay = true) {
    const icons = {
        0: isDay ? '☀️' : '🌙',  
        1: isDay ? '🌤️' : '🌙',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌧️',
        61: '🌧️',
        63: '🌧️',
        65: '🌧️',
        80: '🌦️',
        81: '🌧️',
        82: '⛈️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };
    return icons[weatherCode] || '🌈';
}

function updateWeatherIcon(weatherCode) {
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 18;
    const icon = getWeatherIcon(weatherCode, isDay);
    document.getElementById('weather-icon').textContent = icon;
}

// ========================
// AWS Display Update
// ========================
function updateAWSDisplay(result) {
    const weatherData = result.data;
    
    document.getElementById('temperature').textContent = `${Math.round(weatherData.temperature)}°C`;
    document.getElementById('humidity').textContent = `${Math.round(weatherData.humidity)}%`;
    document.getElementById('condition').textContent = weatherCodes[weatherData.weather_code] || weatherData.condition || 'Unknown';
    document.getElementById('wind-speed').textContent = `${Math.round(weatherData.wind_speed)} km/h`;
    document.getElementById('pressure').textContent = `${Math.round(weatherData.pressure)} hPa`;
    document.getElementById('feels-like').textContent = `${Math.round(weatherData.temperature)}°C`;
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    document.getElementById('location').innerHTML = `📍 <strong>Solapur, Maharashtra, India</strong>`;

    updateWeatherIcon(weatherData.weather_code);
    checkWeatherAlerts(weatherData);

    document.getElementById('api-status').innerHTML = '✅ <strong>AWS CONNECTED</strong><br>With Smart Alerts & Themes';
    document.getElementById('api-status').className = 'status-live';
    document.getElementById('data-source').textContent = `🌐 AWS Serverless • Real-time alerts enabled`;
}

// ========================
// Weather Codes Mapping
// ========================
const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    80: 'Light rain showers', 81: 'Moderate rain showers', 82: 'Heavy rain showers',
    95: 'Thunderstorm'
};

// ========================
// Refresh Settings
// ========================
let refreshInterval = 60000;
let autoRefreshEnabled = true;

// ========================
// AWS Fetch Functions
// ========================
async function getAWSWeather() {
    try {
        console.log('🔗 Fetching data from AWS API Gateway...');
        const response = await fetch(AWS_API_URL);
        if (!response.ok) throw new Error(`AWS API Error: ${response.status}`);
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
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.68&longitude=75.92&current_weather=true&timezone=auto');
        const data = await response.json();
        const compatibleData = {
            data: {
                temperature: data.current_weather.temperature,
                humidity: data.current_weather.relative_humidity || 50,
                weather_code: data.current_weather.weathercode,
                condition: weatherCodes[data.current_weather.weathercode] || 'Unknown',
                wind_speed: data.current_weather.windspeed,
                pressure: 1013
            }
        };
        updateAWSDisplay(compatibleData);
        document.getElementById('api-status').innerHTML = '⚠️ <strong>Direct Weather API</strong><br>Fallback Mode';
        document.getElementById('api-status').className = 'status-fallback';
    } catch (error) {
        console.error('❌ Direct Weather API failed:', error);
        document.getElementById('api-status').innerHTML = '❌ <strong>Weather Data Unavailable</strong>';
        document.getElementById('api-status').className = 'status-error';
    }
}

// ========================
// Test Alerts Function
// ========================
function testAlerts() {
    const testConditions = [
        { temperature: 36, humidity: 45, condition: 'Clear sky' },
        { temperature: 28, humidity: 85, condition: 'Heavy rain' },
        { temperature: 22, humidity: 25, condition: 'Clear sky' }
    ];
    const randomCondition = testConditions[Math.floor(Math.random() * testConditions.length)];
    checkWeatherAlerts(randomCondition);
}

// ========================
// Initialize on Page Load
// ========================
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    document.getElementById('api-status').innerHTML = '🔄 Connecting to AWS...';
    setTimeout(getAWSWeather, 100);

    // Auto-refresh weather
    if (autoRefreshEnabled) {
        setInterval(getAWSWeather, refreshInterval);
    }
});

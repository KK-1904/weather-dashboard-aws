// Free Weather API - Real-time data for Solapur
const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=17.68&longitude=75.92&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto';

// Weather code to text mapping
const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
    61: 'Rain', 63: 'Rain', 65: 'Rain', 80: 'Rain showers', 81: 'Rain showers', 
    82: 'Rain showers', 95: 'Thunderstorm'
};

async function getLiveWeather() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const current = data.current;
        
        // Update the webpage with REAL data
        document.getElementById('temperature').textContent = 
            Math.round(current.temperature_2m) + '°C';
        document.getElementById('humidity').textContent = 
            current.relative_humidity_2m + '%';
        document.getElementById('condition').textContent = 
            weatherCodes[current.weather_code] || 'Unknown';
        document.getElementById('wind-speed').textContent = 
            Math.round(current.wind_speed_10m) + ' km/h';
        document.getElementById('last-updated').textContent = 
            new Date().toLocaleString();
            
        document.getElementById('api-status').textContent = 
            '✅ Live Data from Open-Meteo API';
        document.getElementById('api-status').className = 'status connected';
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('api-status').textContent = 
            '❌ Error loading live data';
        document.getElementById('api-status').className = 'status disconnected';
    }
}

// Load weather when page opens
document.addEventListener('DOMContentLoaded', function() {
    getLiveWeather();
});

// Refresh every 5 minutes
setInterval(getLiveWeather, 300000);

// Manual refresh function
window.getLiveWeather = getLiveWeather;

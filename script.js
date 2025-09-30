// Your REAL API Key from WeatherAPI.com
const WEATHER_API_KEY = 'e2ad8f40b825445d9f763522253009';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Solapur&aqi=no`;

class RealWeatherService {
    constructor() {
        this.isLive = false;
    }

    async fetchRealWeather() {
        try {
            console.log('🔗 Fetching LIVE weather data from WeatherAPI...');
            const response = await fetch(WEATHER_API_URL);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ LIVE data received:', data);
            return this.parseRealData(data);
            
        } catch (error) {
            console.error('❌ API failed:', error);
            // Fallback to realistic simulation if API fails
            return this.getRealisticSimulation();
        }
    }

    parseRealData(data) {
        const current = data.current;
        const location = data.location;
        
        return {
            temperature: Math.round(current.temp_c),
            humidity: current.humidity,
            condition: current.condition.text,
            windSpeed: Math.round(current.wind_kph),
            pressure: current.pressure_mb,
            feelsLike: Math.round(current.feelslike_c),
            uvIndex: current.uv,
            visibility: current.vis_km,
            windDirection: current.wind_dir,
            cloudCover: current.cloud,
            source: 'WeatherAPI.com - LIVE',
            isLive: true,
            location: location.name,
            region: location.region,
            country: location.country,
            localTime: location.localtime
        };
    }

    getRealisticSimulation() {
        // Fallback data (in case API fails)
        return {
            temperature: 30,
            humidity: 55,
            condition: 'Partly cloudy',
            windSpeed: 12,
            pressure: 1015,
            feelsLike: 32,
            uvIndex: 7,
            visibility: 10,
            source: 'Simulation (API Failed)',
            isLive: false,
            location: 'Solapur',
            region: 'Maharashtra',
            country: 'India'
        };
    }
}

// Initialize service
const weatherService = new RealWeatherService();

async function getLiveWeather() {
    try {
        const weatherData = await weatherService.fetchRealWeather();
        
        // Update ALL display elements with REAL data
        document.getElementById('temperature').textContent = `${weatherData.temperature}°C`;
        document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
        document.getElementById('condition').textContent = weatherData.condition;
        document.getElementById('wind-speed').textContent = `${weatherData.windSpeed} km/h`;
        document.getElementById('pressure').textContent = `${weatherData.pressure} hPa`;
        document.getElementById('feels-like').textContent = `${weatherData.feelsLike}°C`;
        document.getElementById('uv-index').textContent = `${weatherData.uvIndex}`;
        document.getElementById('visibility').textContent = `${weatherData.visibility} km`;
        document.getElementById('last-updated').textContent = new Date().toLocaleString();
        
        // Update location info
        document.getElementById('location').innerHTML = 
            `📍 <strong>${weatherData.location}, ${weatherData.region}, ${weatherData.country}</strong>`;
        
        // Update status based on live data
        if (weatherData.isLive) {
            document.getElementById('api-status').innerHTML = 
                '✅ <strong>LIVE DATA CONNECTED</strong><br>Real-time weather from WeatherAPI.com';
            document.getElementById('api-status').className = 'status-live';
            document.getElementById('data-source').textContent = 
                `🌐 Live API • ${weatherData.localTime || 'Real-time data'}`;
        } else {
            document.getElementById('api-status').innerHTML = 
                '⚠️ <strong>SIMULATION MODE</strong><br>API connection failed - using realistic data';
            document.getElementById('api-status').className = 'status-demo';
            document.getElementById('data-source').textContent = '💡 Realistic simulation data';
        }
        
    } catch (error) {
        console.error('Error in getLiveWeather:', error

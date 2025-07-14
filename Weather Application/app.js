let getBox = document.getElementById("box");

// Get weather by city name
function getDataByCity() {
    let getSearchBox = document.getElementById("search");
    if (!getSearchBox.value.trim()) {
        getBox.innerHTML = `<div class="alert alert-danger">Please enter a city name</div>`;
        return;
    }

    fetchWeatherData(getSearchBox.value);
    getSearchBox.value = "";
}

// Get weather by coordinates
function getDataByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=75cb19307266fe10359ee88f3c66aef6`)
    .then(handleResponse)
    .then(displayWeather)
    .catch(handleError);
}

// Main fetch function
function fetchWeatherData(query) {
    getBox.innerHTML = `<div class="loading">Loading weather data...</div>`;
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=75cb19307266fe10359ee88f3c66aef6`)
    .then(handleResponse)
    .then(displayWeather)
    .catch(handleError);
}

// Handle API response
function handleResponse(response) {
    if (!response.ok) {
        throw new Error('City not found');
    }
    return response.json();
}

// Handle errors
function handleError(err) {
    console.log(err);
    getBox.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    document.body.className = 'theme-default';
}

// Display weather data
function displayWeather(data) {
    console.log(data);
    
    // Determine theme based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    let themeClass = 'theme-default';
    
    if (weatherCondition.includes('rain')) {
        themeClass = 'theme-rainy';
    } else if (weatherCondition.includes('cloud')) {
        themeClass = 'theme-cloudy';
    } else if (weatherCondition.includes('clear') || weatherCondition.includes('sun')) {
        themeClass = 'theme-sunny';
    }
    
    // Apply theme to body
    document.body.className = themeClass;
    
    // Get current date and format it
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    
    getBox.innerHTML = `
        <div class="weather-card">
            <div class="current-day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" class="weather-icon" alt="Weather icon">
            <h1 class="city-name">${data.name}</h1>
            <div class="current-date">${month} ${date}</div>
            <div class="current-temp">${Math.round(data.main.temp)}°</div>
            <div class="weather-desc">${data.weather[0].main}</div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <p>FEELS LIKE</p>
                    <p>${Math.round(data.main.feels_like)}°</p>
                </div>
                <div class="detail-item">
                    <p>HUMIDITY</p>
                    <p>${data.main.humidity}%</p>
                </div>
                <div class="detail-item">
                    <p>WIND SPEED</p>
                    <p>${data.wind.speed} m/s</p>
                </div>
            </div>
            
            <div class="forecast">
                <div class="forecast-item">
                    <div class="forecast-day">TUE</div>
                    <div class="forecast-temp">25°</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-day">WED</div>
                    <div class="forecast-temp">28°</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-day">THU</div>
                    <div class="forecast-temp">23°</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-day">FRI</div>
                    <div class="forecast-temp">19°</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-day">SAT</div>
                    <div class="forecast-temp">15°</div>
                </div>
                <div class="forecast-item">
                    <div class="forecast-day">SUN</div>
                    <div class="forecast-temp">20°</div>
                </div>
            </div>
        </div>
    `;
}

// Get user's location when page loads
window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getDataByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                // Default to a popular city if geolocation fails
                fetchWeatherData("London");
            }
        );
    } else {
        // Browser doesn't support Geolocation
        fetchWeatherData("London");
    }
};
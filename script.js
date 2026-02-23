const inputBox = document.getElementById('input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

async function checkWeather(city) {
    if (city.trim() === "") return;

    // Note: It's best practice to keep API keys secure, but for frontend projects it's standard to expose them.
    const api_key = "c726cb73761f4a0d82b172742232411"; 
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`;

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (response.status === 404 || response.status === 400) {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            speakText("Sorry, location not found.");
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        
        // Update DOM Elements
        temperature.innerHTML = `${Math.round(weather_data.current.temp_c)}<span>°C</span>`;
        description.innerHTML = `${weather_data.current.condition.text}`;
        humidity.innerHTML = `${weather_data.current.humidity}%`;
        wind_speed.innerHTML = `${weather_data.current.wind_kph} Km/H`;

        // Update Image based on Condition Codes
        // IMPORTANT FIX: Removed the leading '/' so it works on GitHub Pages!
        const weatherCondition = weather_data.current.condition.code;
        
        if (weatherCondition === 1000) {
            weather_img.src = "assets/clear.png";
        } else if (weatherCondition === 1003) {
            weather_img.src = "assets/cloud.png";
        } else if ([1063, 1150, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1240, 1243, 1246].includes(weatherCondition)) {
            weather_img.src = "assets/rain.png";
        } else {
            // Default fallback
            weather_img.src = "assets/cloud.png"; 
        }

        // Trigger Text-to-Speech only on success
        speakText(`It is currently ${Math.round(weather_data.current.temp_c)} degrees and ${weather_data.current.condition.text} in ${weather_data.location.name}`);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to speak out text
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const speech = new SpeechSynthesisUtterance(text);
        
        // Try to find a natural-sounding English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => voice.lang.includes('en-'));
        if (preferredVoice) speech.voice = preferredVoice;

        window.speechSynthesis.speak(speech);
    }
}

// Event Listeners for Button Click and "Enter" Key
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

inputBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});
const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather-body');

async function checkWeather(city) {
    const api_key = "c726cb73761f4a0d82b172742232411";
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`;

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (response.status === 404) {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            console.log("error");
            return;
        }

        console.log("run");
        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        temperature.innerHTML = `${Math.round(weather_data.current.temp_c)}°C`;
        description.innerHTML = `${weather_data.current.condition.text}`;

        humidity.innerHTML = `${weather_data.current.humidity}%`;
        wind_speed.innerHTML = `${weather_data.current.wind_kph}Km/H`;

        const weatherCondition = weather_data.current.condition.code;
        switch (weatherCondition) {
            case 1000:
                weather_img.src = "/assets/clear.png";
                break;
            case 1003:
                weather_img.src = "/assets/cloud.png";
                break;
            case 1063:
            case 1150:
            case 1183:
            case 1186:
            case 1189:
            case 1192:
            case 1195:
            case 1198:
            case 1201:
            case 1204:
            case 1240:
            case 1243:
            case 1246:
                weather_img.src = "/assets/rain.png";
                break;
            // Add more cases for different weather conditions based on the weather API's condition code
            default:
                weather_img.src = "/assets/default.png";
                break;
        }

        console.log(weather_data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// ... (your existing code)

// Function to speak out text
function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0]; // You can change the voice if multiple voices are available

    // Speak the text
    window.speechSynthesis.speak(speech);
}

// Add an event listener to the search button to trigger text-to-speech
searchBtn.addEventListener('click', () => {
    const city = inputBox.value;
    checkWeather(city);

    // Speak the entered city
    speakText(`Fetching weather for ${city}`);
});
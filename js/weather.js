const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const statusMessage = document.getElementById("weather-status");
const result = document.getElementById("weather-result");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a city name.";
        return;
    }

    statusMessage.textContent = "Loading weather...";
    result.hidden = true;

    try {
        // Find the city's coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Check the spelling and try again.");
        }

        const location = geoData.results[0];

        // Get weather for the selected city
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        if (!current) {
            throw new Error("Weather information is unavailable.");
        }

        document.getElementById("city-name").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `🌡️ Temperature: ${current.temperature_2m} °C`;

        document.getElementById("humidity").textContent =
            `💧 Humidity: ${current.relative_humidity_2m}%`;

        document.getElementById("wind-speed").textContent =
            `💨 Wind Speed: ${current.wind_speed_10m} km/h`;

        document.getElementById("weather-description").textContent =
            getWeatherDescription(current.weather_code);

        result.hidden = false;
        statusMessage.textContent = "Weather updated successfully.";

    } catch (error) {
        statusMessage.textContent =
            error.message || "Something went wrong. Please try again.";
    }
});

function getWeatherDescription(code) {
    if (code === 0) return "☀️ Clear sky";
    if ([1, 2, 3].includes(code)) return "🌤️ Partly cloudy or overcast";
    if ([45, 48].includes(code)) return "🌫️ Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️ Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "🌧️ Rain";
    if ([71, 73, 75, 77].includes(code)) return "❄️ Snow";
    if ([80, 81, 82].includes(code)) return "🌧️ Rain showers";
    if ([85, 86].includes(code)) return "🌨️ Snow showers";
    if ([95, 96, 99].includes(code)) return "⛈️ Thunderstorm";

    return "Weather conditions unavailable";
}
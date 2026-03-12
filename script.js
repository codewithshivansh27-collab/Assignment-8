const cities = [
    { name: "Delhi", latitude: 28.6139, longitude: 77.2090 },
    { name: "London", latitude: 51.5072, longitude: -0.1276 },
    { name: "New York", latitude: 40.7128, longitude: -74.0060 }
];

const weatherContainer = document.getElementById("weather-container");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function hideError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}

function getWeatherInfo(code) {
    if (code === 0) {
        return { text: "Clear Sky", emoji: "☀️" };
    } else if ([1, 2, 3].includes(code)) {
        return { text: "Partly Cloudy", emoji: "⛅" };
    } else if ([45, 48].includes(code)) {
        return { text: "Foggy", emoji: "🌫️" };
    } else if ([51, 53, 55, 56, 57].includes(code)) {
        return { text: "Drizzle", emoji: "🌦️" };
    } else if ([61, 63, 65, 66, 67].includes(code)) {
        return { text: "Rain", emoji: "🌧️" };
    } else if ([71, 73, 75, 77].includes(code)) {
        return { text: "Snow", emoji: "❄️" };
    } else if ([80, 81, 82].includes(code)) {
        return { text: "Rain Showers", emoji: "🌦️" };
    } else if ([85, 86].includes(code)) {
        return { text: "Snow Showers", emoji: "🌨️" };
    } else if ([95, 96, 99].includes(code)) {
        return { text: "Thunderstorm", emoji: "⛈️" };
    } else {
        return { text: "Unknown", emoji: "🌍" };
    }
}

function createWeatherCard(cityName, temperature, weatherCode) {
    const { text, emoji } = getWeatherInfo(weatherCode);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <h2 class="city">${cityName}</h2>
    <div class="emoji">${emoji}</div>
    <div class="temp">${temperature}&deg;C</div>
    <p class="condition">${text}</p>
  `;

    weatherContainer.appendChild(card);
}

async function fetchCityWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch weather for ${city.name}`);
    }

    const data = await response.json();

    return {
        name: city.name,
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code
    };
}

async function loadWeather() {
    showLoader();
    hideError();
    weatherContainer.innerHTML = "";

    try {
        const weatherPromises = cities.map((city) => fetchCityWeather(city));
        const results = await Promise.all(weatherPromises);

        results.forEach((cityWeather) => {
            createWeatherCard(
                cityWeather.name,
                cityWeather.temperature,
                cityWeather.weatherCode
            );
        });
    } catch (error) {
        showError("Unable to load weather data. Please try again later.");
        console.error(error);
    } finally {
        hideLoader();
    }
}

loadWeather();
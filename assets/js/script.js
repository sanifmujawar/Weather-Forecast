// DOM ELEMENTS

// user input
const searchedButtons = document.querySelector('#search-buttons');
const searchButton = document.querySelector('#city-search-btn');
const searchInput = document.querySelector('#city-search');
const searchedCitiesButton = document.querySelectorAll('.searched-cities-btn');
// main card
const mainCardCity = document.querySelector('#main-card-city');
const mainCardDate = document.querySelector('#main-card-date');
const mainCardIcon = document.querySelector('#main-card-icon');
const mainCardTemp = document.querySelector('#main-card-temp');
const mainCardWind = document.querySelector('#main-card-wind');
const mainCardHumidity = document.querySelector('#main-card-humidity');
const mainCardUv = document.querySelector('#main-card-uv');
// forecast cards
const forecastCard = document.querySelectorAll('.forecast-card');
const forecastCardDate = document.querySelectorAll('.forecast-date');
const forecastCardIcon = document.querySelectorAll('.forecast-icon');
const forecastCardTemp = document.querySelectorAll('.forecast-temp');
const forecastCardWind = document.querySelectorAll('.forecast-wind');
const forecastCardHumidity = document.querySelectorAll('.forecast-humidity');

// GLOBAL VARIABLES

let weatherApiUrl = 'https://api.openweathermap.org';
let weatherApiKey = '&appid=3dcebf80294bbadbeab3a3d24374fc77';
let oneCallEndpoint = '/data/2.5/onecall?';
let defaultSearch = [
    'London',
    'Birmingham',
    'Edinburgh',
    'New York',
    'Manchester',
    'Mumbai',
    'New Delhi',
    'Sydney',
];
let today = moment().format('M/DD/YYYY');

// LOCAL STORAGE
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

let cityName;

// Function to convert Fahrenheit to Celsius
convertToFahrenheitToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5/9).toFixed(1);
}

// FUNCTIONS

fetchCoordinates = () => {
    let geocodingEndpoint = '/geo/1.0/direct?';
    let apiParam = `q=${cityName}`;

    // calls for the coordinates from the geocode api
    fetch(`${weatherApiUrl}${geocodingEndpoint}${apiParam}${weatherApiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fetchWeather(data);
        })
        .catch(function (error) {
            alert('please enter a valid city name');
        });
};

fetchWeather = (weatherData) => {
    let latParam = weatherData[0].lat;
    let lonParam = weatherData[0].lon;

    // calls for weather information with collected lat and lon coordinates
    fetch(
        `${weatherApiUrl}${oneCallEndpoint}lat=${latParam}&lon=${lonParam}&units=imperial${weatherApiKey}`
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            appendToSearchHistory(weatherData);
            renderCurrentWeather(weatherData, data);
            renderForecast(data);
        });
};

renderCurrentWeather = (coordinatesData, openWeatherData) => {
    // sets card content
    mainCardCity.textContent = coordinatesData[0].name;
    mainCardIcon.src = `http://openweathermap.org/img/wn/${openWeatherData.current.weather[0].icon}@2x.png`;
    mainCardTemp.textContent = `${convertToFahrenheitToCelsius(openWeatherData.current.temp)}\xB0C`;
    mainCardWind.textContent = `${openWeatherData.current.wind_speed} mph`;
    mainCardHumidity.textContent = `${openWeatherData.current.humidity}%`;
    mainCardUv.textContent = Math.trunc(openWeatherData.current.uvi);

    // clears previous classes
    mainCardUv.parentElement.classList.remove('favorable');
    mainCardUv.parentElement.classList.remove('moderate');
    mainCardUv.parentElement.classList.remove('severe');

    // adds class based on uv index
    if (mainCardUv.textContent <= 2) {
        mainCardUv.parentElement.classList.add('favorable');
    } else if (mainCardUv.textContent <= 7) {
        mainCardUv.parentElement.classList.add('moderate');
    } else {
        mainCardUv.parentElement.classList.add('severe');
    }
}

renderForecast = (openWeatherData) => {
    for (let i = 0; i < forecastCard.length; i++) {
        // sets forecast card content
        forecastCardDate[i].textContent = moment()
            .add(i + 1, 'days')
            .format('M/DD/YYYY');
        forecastCardIcon[
            i
        ].src = `http://openweathermap.org/img/wn/${openWeatherData.daily[i].weather[0].icon}@2x.png`;
        forecastCardTemp[i].textContent = `${convertToFahrenheitToCelsius(openWeatherData.daily[i].temp.day)}\xB0C`;
        forecastCardWind[
            i
        ].textContent = `${openWeatherData.daily[i].wind_speed} mph`;
        forecastCardHumidity[
            i
        ].textContent = `${openWeatherData.daily[i].humidity}%`;
    }
};

appendToSearchHistory = (weatherData) => {
	let city = weatherData[0].name;
	let searchArray = JSON.parse(localStorage.getItem('searchHistory'));

	// checks to see if the city is already in search history
	if (!searchArray.includes(city)) {
		searchArray.unshift(city);
		searchArray.pop();
		localStorage.setItem('searchHistory', JSON.stringify(searchArray));
		searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	}
	renderSearchHistory();
};

renderSearchHistory = () => {
	searchedButtons.textContent = '';

	if (searchHistory === undefined || searchHistory === null) {
		localStorage.setItem('searchHistory', JSON.stringify(defaultSearch));
	}

	searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	cityName = searchHistory[0];

	// creates a button for each entry
	for (let i = 0; i < searchHistory.length; i++) {
		let button = document.createElement('button');
		button.textContent = searchHistory[i];

		button.classList.add('btn');
		button.classList.add('btn-secondary');
		button.classList.add('btn-block');
		button.classList.add('mb-2');
		button.classList.add('searched-cities-btn');
		button.addEventListener('click', function (event) {
			cityName = event.target.textContent;
			fetchCoordinates();
		});
		searchedButtons.appendChild(button);
	}
};

// EVENT LISTENERS
searchButton.addEventListener('click', function (event) {
	event.preventDefault();

	cityName = searchInput.value.toLowerCase().trim();
	fetchCoordinates();

	searchInput.value = '';
});

// INIT

init = () => {
	mainCardDate.textContent = `${today}`;
	renderSearchHistory();
	fetchCoordinates();
};

init();
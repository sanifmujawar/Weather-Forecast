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
var APIKEY = 'e4674172eca777d00a7f445d19b450a9'
var searchButton = document.getElementById('searchButton')
var searchInput = document.getElementById('searchInput')
var weather = []
function getCityCoordinates() {
    var city = searchInput.value
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city +'&appid='+ APIKEY;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        coordinates = {lat: data[0].lat, lon: data[0].lon};
        getWeatherData(coordinates);
      });
}

function getWeatherData(coordinates) {
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+ coordinates.lat +'&lon='+ coordinates.lon +'&appid='+ APIKEY +'&units=metric';
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ coordinates.lat +'&lon='+ coordinates.lon +'&appid='+ APIKEY +'&units=metric';
    
    fetch(currentUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        currentWeather = {
          date: '', 
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          icon: data.weather[0].icon
        }
        console.log(currentWeather)
      });
    
  
    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        forecastData = data.list
        for (var i = 0; i < forecastData.length; i++) {
            if (forecastData[i].dt_txt.split(" ")[1] === '12:00:00'){
                weather.push(
                    {
                        date: forecastData[i].dt_txt.split(" ")[0], 
                        temp: forecastData[i].main.temp,
                        humidity: forecastData[i].main.humidity,
                        wind: forecastData[i].wind.speed,
                        icon: forecastData[i].weather[0].icon
                    });
            }
        }
        console.log(weather)
      });
}

searchButton.addEventListener('click', getCityCoordinates);
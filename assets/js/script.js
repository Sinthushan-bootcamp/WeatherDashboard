var APIKEY = 'e4674172eca777d00a7f445d19b450a9';
var searchButton = $('#searchButton');
var searchInput = $('#searchInput');
var forecast = $('#forecast');


function createForecastCards(weather) {
    var cardEL = $('<div>');
    cardEL.addClass('card');
    cardEL.addClass('w-25');
    cardEL.addClass('m-2');
    cardEL.appendTo(forecast);
    var cardName = $('<h5>').addClass('card-header custom-card-header').text(weather.date);
    cardName.appendTo(cardEL);
    cardImage = $('<img>')
    cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png')
    cardImage.appendTo(cardEL);
    var cardBodyEL = $('<div>');
    cardBodyEL.addClass('card-body');
    cardBodyEL.appendTo(cardEL);
    var cardComment = $('<p>').addClass('card-text').text('Temp: ' + weather.temp);
    cardComment.appendTo(cardBodyEL);
    var cardComment = $('<p>').addClass('card-text').text('Wind: ' + weather.wind);
    cardComment.appendTo(cardBodyEL);
    var cardComment = $('<p>').addClass('card-text').text('Humidity: ' + weather.humidity);
    cardComment.appendTo(cardBodyEL);
}

function createCurrentCard(weather){
  var cardEL = $('<div>');
  cardEL.addClass('card');
  cardEL.appendTo(current);
  var cardName = $('<h5>').addClass('card-header custom-card-header').text(weather.date);
  cardName.appendTo(cardEL);
  cardImage = $('<img>')
  cardImage.addClass('w-2')
  cardImage.addClass('h-3')
  cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png')
  cardImage.appendTo(cardEL);
  var cardBodyEL = $('<div>');
  cardBodyEL.addClass('card-body');
  cardBodyEL.appendTo(cardEL);
  var cardComment = $('<p>').addClass('card-text').text('Temp: ' + weather.temp);
  cardComment.appendTo(cardBodyEL);
  var cardComment = $('<p>').addClass('card-text').text('Wind: ' + weather.wind);
  cardComment.appendTo(cardBodyEL);
  var cardComment = $('<p>').addClass('card-text').text('Humidity: ' + weather.humidity);
  cardComment.appendTo(cardBodyEL);
}

function getCityCoordinates() {
    var city = searchInput.val();
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
          date: dayjs().format('M/D/YYYY'), 
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          icon: data.weather[0].icon
        }
        createCurrentCard(currentWeather)
      });
    
  
    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        forecastData = data.list
        for (var i = 0; i < forecastData.length; i++) {
            if (forecastData[i].dt_txt.split(" ")[1] === '12:00:00'){
              var weather = 
                    {
                        date: forecastData[i].dt_txt.split(" ")[0], 
                        temp: forecastData[i].main.temp,
                        humidity: forecastData[i].main.humidity,
                        wind: forecastData[i].wind.speed,
                        icon: forecastData[i].weather[0].icon
                    };
              console.log(weather);
              createForecastCards(weather)
            }
        }
      });
}

searchButton.on('click', getCityCoordinates);
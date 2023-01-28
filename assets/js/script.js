var APIKEY = 'e4674172eca777d00a7f445d19b450a9';
var searchButton = $('#searchButton');
var searchInput = $('#searchInput');
var forecast = $('#forecast');

function clearCards() {
  var cards = $('.card');
  cards.remove();
}

function createForecastCards(weather) {
    var cardEL = $('<div>');
    cardEL.addClass('card text-white bg-info w-lg-25 m-2');
    cardEL.appendTo(forecast);
    var cardName = $('<h5>').addClass('card-title').text(weather.date).css("padding","1rem");
    cardName.appendTo(cardEL);
    var cardImage = $('<img>')
    cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png')
    cardImage.appendTo(cardEL);
    var cardBodyEL = $('<div>');
    cardBodyEL.addClass('card-body');
    cardBodyEL.appendTo(cardEL);
    var cardComment = $('<p>').addClass('card-text').text('Temp: ' + weather.temp + '℃');
    cardComment.appendTo(cardBodyEL);
    var cardComment = $('<p>').addClass('card-text').text('Wind: ' + weather.wind + ' Meters/Sec');
    cardComment.appendTo(cardBodyEL);
    var cardComment = $('<p>').addClass('card-text').text('Humidity: ' + weather.humidity + '%');
    cardComment.appendTo(cardBodyEL);
}

function createCurrentCard(weather){
  var cardEL = $('<div>');
  cardEL.addClass('card text-white bg-info');;
  cardEL.appendTo(current);
  
  var cardName = $('<h2>').addClass('card-title').text(weather.city + " - " + weather.date).css("padding","1rem");
  cardName.appendTo(cardEL);
 
  var cardBodyEL = $('<div>');
  cardBodyEL.addClass('card-body d-flex flex-column flex-lg-row');
  cardBodyEL.appendTo(cardEL);

  var cardImage = $('<img>')
  cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png').css({"width":"20rem", "height":"15rem"});
  cardImage.appendTo(cardBodyEL);
  
  var cardBodyText = $('<div>');
  cardBodyText.appendTo(cardBodyEL);

  var cardComment = $('<p>').addClass('card-text fs-1').text('Temp: ' + weather.temp + '℃');
  cardComment.appendTo(cardBodyText);
  var cardComment = $('<p>').addClass('card-text fs-1').text('Wind: ' + weather.wind + ' Meters/Sec');
  cardComment.appendTo(cardBodyText);
  var cardComment = $('<p>').addClass('card-text fs-1').text('Humidity: ' + weather.humidity + '%');
  cardComment.appendTo(cardBodyText);
}

function getCityCoordinates() {
    clearCards()
    var city = searchInput.val();
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city +'&appid='+ APIKEY;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        coordinates = {lat: data[0].lat, lon: data[0].lon};
        getWeatherData(city, coordinates);
      });
}

function getWeatherData(city, coordinates) {
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+ coordinates.lat +'&lon='+ coordinates.lon +'&appid='+ APIKEY +'&units=metric';
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ coordinates.lat +'&lon='+ coordinates.lon +'&appid='+ APIKEY +'&units=metric';
    
    fetch(currentUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        currentWeather = {
          city: city,
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
                        date: dayjs(forecastData[i].dt_txt.split(" ")[0]).format('M/D/YYYY'), 
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
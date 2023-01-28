var APIKEY = 'e4674172eca777d00a7f445d19b450a9';
var searchButton = $('#searchButton');
var searchInput = $('#searchInput');
var forecast = $('#forecast');
var pastSearches = $('#pastSearches');
var forecastTitle = $('#forecastTitle')
var searches = [];

function clearCards() {
  var cards = $('.card');
  cards.remove();
}

function createForecastCards(weather) {
    var cardEL = $('<div>');
    cardEL.addClass('card text-white bg-info my-2 px-3 shadow-lg');
    cardEL.appendTo(forecast);
    var cardName = $('<h5>').addClass('card-title').text(weather.date).css("padding","1rem");
    cardName.appendTo(cardEL);
    var cardImage = $('<img>')
    cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png').css({"width":"10rem", "height":"10rem"})
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
  cardEL.addClass('card text-white bg-info shadow');
  cardEL.appendTo(current);
  
  var cardName = $('<h2>').addClass('card-title').text(weather.city + " - " + weather.date).css("padding","1rem");
  cardName.appendTo(cardEL);
 
  var cardBodyEL = $('<div>');
  cardBodyEL.addClass('card-body d-flex flex-column flex-lg-row');
  cardBodyEL.appendTo(cardEL);

  var cardImage = $('<img>')
  cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png').css({"width":"10rem", "height":"10rem"});
  cardImage.appendTo(cardBodyEL);
  
  var cardBodyText = $('<div>');
  cardBodyText.appendTo(cardBodyEL);

  var cardComment = $('<p>').addClass('card-text fs-3').text('Temp: ' + weather.temp + '℃');
  cardComment.appendTo(cardBodyText);
  var cardComment = $('<p>').addClass('card-text fs-3').text('Wind: ' + weather.wind + ' Meters/Sec');
  cardComment.appendTo(cardBodyText);
  var cardComment = $('<p>').addClass('card-text fs-3').text('Humidity: ' + weather.humidity + '%');
  cardComment.appendTo(cardBodyText);
}

function initSearches(){
  var storedSearches = JSON.parse(localStorage.getItem("pastSearches")); //get all stored searches from the localStorage
  if (storedSearches !== null) {
      for (var i = 0; i < storedSearches.length; i++) {
        createQuickSearchButton(storedSearches[i])
      }
      searches =  storedSearches; 
  }
}

function wasSearched(city){
  for(var i = 0; i < searches.length; i++) {
    if (searches[i].city.toUpperCase() === city.toUpperCase()){
      return searches[i];
    }
  }
  return false;
}

function createQuickSearchButton(search){
  var pastSearch = $('<li>');
  var pastSearchButton = $('<button>')
  pastSearchButton.text(search.city)
  pastSearchButton.attr('data-lat', search.coordinates.lat)
  pastSearchButton.attr('data-lon', search.coordinates.lon)
  pastSearchButton.addClass('pastSearchButton btn btn-warning btn-lg btn-block w-100 my-2 shadow');
  pastSearchButton.appendTo(pastSearch)
  pastSearch.appendTo(pastSearches)
}

function startPastSearch(event){
  buttonClicked = $(event.target);
  searchInput.val(buttonClicked.text());
  startSearch();
}

function startSearch(){
  clearCards()
  forecastTitle.text('5 Day Forecast')
  var city = searchInput.val();
  var previousSearch = wasSearched(city)
  if (previousSearch){
    getWeatherData(previousSearch.city, previousSearch.coordinates)
  } else {
    getCityCoordinates(city)
  }
}

function getCityCoordinates(city) {
  var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city +'&appid='+ APIKEY;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      coordinates = {lat: data[0].lat, lon: data[0].lon};
      search = {city: city, coordinates: coordinates}
      console.log('here');
      createQuickSearchButton(search)
      searches.push(search);
      localStorage.setItem('pastSearches', JSON.stringify(searches));
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
              createForecastCards(weather)
            }
        }
      });
}

window.addEventListener("load", initSearches);
searchButton.on('click', startSearch);
pastSearches.on('click', '.pastSearchButton', startPastSearch);
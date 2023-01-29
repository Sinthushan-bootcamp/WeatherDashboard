
// initialize global variables
var APIKEY = 'e4674172eca777d00a7f445d19b450a9';
var searchButton = $('#searchButton');
var searchInput = $('#searchInput');
var forecast = $('#forecast');
var pastSearches = $('#pastSearches');
var forecastTitle = $('#forecastTitle')
var searches = [];



// Utility functions

function createForecastCards(weather) {
  // this function creates a list of cards for the 5 day forecast
  // each card consist of a card-title, image, and card body which contains three data points
  // the card title will have the date, the image will represent the days forecast, and the card body will have the temperature, wind speed and humidity
  var cardEL = $('<div>');
  cardEL.addClass('card text-white bg-info my-2 px-3 shadow-lg');
  cardEL.appendTo(forecast);
  // create card title, add date and add to card
  var cardName = $('<h5>').addClass('card-title').text(weather.date).css("padding","1rem");
  cardName.appendTo(cardEL);
  // add image to card
  // the image is sourced from the openweathermap using the icon code retrieved from the forecast api
  var cardImage = $('<img>')
  cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png').css({"width":"10rem", "height":"10rem"})
  cardImage.appendTo(cardEL);
  // create card body
  var cardBodyEL = $('<div>');
  cardBodyEL.addClass('card-body');
  cardBodyEL.appendTo(cardEL);
  // create weather data points and add to card body
  var cardComment = $('<p>').addClass('card-text').text('Temp: ' + weather.temp + '℃');
  cardComment.appendTo(cardBodyEL);
  var cardComment = $('<p>').addClass('card-text').text('Wind: ' + weather.wind + ' Meters/Sec');
  cardComment.appendTo(cardBodyEL);
  var cardComment = $('<p>').addClass('card-text').text('Humidity: ' + weather.humidity + '%');
  cardComment.appendTo(cardBodyEL);
}

function createCurrentCard(weather){
  // this function creates a list of cards for the current weather
  // the card consist of a card-title and card body which contains an image of the current weather and three data points
  // the card title will have the date, the image will represent the current weather, and the card body will have the temperature, wind speed and humidity
  var cardEL = $('<div>');
  cardEL.addClass('card text-white bg-info shadow');
  cardEL.appendTo(current);
  // create card title, add the city name and date, and add to card
  var cardName = $('<h2>').addClass('card-title').text(weather.city + " - " + weather.date).css("padding","1rem");
  cardName.appendTo(cardEL);
 // create card body
  var cardBodyEL = $('<div>');
  cardBodyEL.addClass('card-body d-flex flex-column flex-lg-row');
  cardBodyEL.appendTo(cardEL);

  // the image is sourced from the openweathermap using the icon code retrieved from the current weather api
  var cardImage = $('<img>')
  cardImage.attr('src','http://openweathermap.org/img/wn/'+ weather.icon +'@2x.png').css({"width":"10rem", "height":"10rem"});
  cardImage.appendTo(cardBodyEL);
  // separate div to contain data points
  var cardBodyText = $('<div>');
  cardBodyText.appendTo(cardBodyEL);
  // create weather data points and add to card body
  var cardComment = $('<p>').addClass('card-text fs-3').text('Temp: ' + weather.temp + '℃');
  cardComment.appendTo(cardBodyText);
  var cardComment = $('<p>').addClass('card-text fs-3').text('Wind: ' + weather.wind + ' Meters/Sec');
  cardComment.appendTo(cardBodyText);
  var cardComment = $('<p>').addClass('card-text fs-3').text('Humidity: ' + weather.humidity + '%');
  cardComment.appendTo(cardBodyText);
}

function createQuickSearchButton(search){
  // this function is triggers whenever the page loads for each existing search in the users search history
  // as well as whenever a new search is done and creates a button that is added to the past search section
  var pastSearch = $('<li>');
  var pastSearchButton = $('<button>')
  pastSearchButton.text(search.city)
  pastSearchButton.attr('data-lat', search.coordinates.lat)
  pastSearchButton.attr('data-lon', search.coordinates.lon)
  pastSearchButton.addClass('pastSearchButton btn btn-warning btn-lg btn-block w-100 my-2 shadow');
  pastSearchButton.appendTo(pastSearch)
  pastSearch.appendTo(pastSearches)
}

function clearCards() {
  // clear all existing cards, triggered whenever a new search is done
  var cards = $('.card');
  cards.remove();
}

function wasSearched(city){
  // checks the searches array if current city search was searched before
  // if so returns the stored object with coordinate data
  // else returns false
  for(var i = 0; i < searches.length; i++) {
    if (searches[i].city.toUpperCase() === city.toUpperCase()){
      return searches[i];
    }
  }
  return false;
}

// API Calls

function getCityCoordinates(city) {
  // This function calls the openweathermap's geolocation api to get the coordinates from the city name
  var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+ city +'&appid='+ APIKEY;
  fetch(requestUrl).then(function (response) {
    if (response.ok) { // check response status === 200
      response.json().then(function (data) {
        if (data.length) { // for unknown cities api still returns status ok so additional check needed to see if data exists
          coordinates = {lat: data[0].lat, lon: data[0].lon}; //store coordinates in object
          search = {city: city, coordinates: coordinates} // store coordinates and city name in object
          createQuickSearchButton(search) // create quick search button in the past searches
          searches.push(search); // add search object with city and coordinates to the searches array
          localStorage.setItem('pastSearches', JSON.stringify(searches)); // update localstorage
          getWeatherData(city, coordinates); 
        } else {
          // if the data is empty (i.e. searched city is not available) a warning appear in the dashboard body informing the user
          forecastTitle.text('The searched city is not available').addClass('mt-3 text-danger text-center') 
        }
      });
    } else {
      alert('Error: ' + response.statusText); // alert the user when api returns anything but status 200
    }
  });
}

function getWeatherData(city, coordinates) {
  // function does api calls on both the current and 5 day forecast API from openweathermap api
  // data is then passed to their respective utility functions to create the appropriate card elements
  var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+ coordinates.lat +'&lon='+ coordinates.lon +'&appid='+ APIKEY +'&units=metric';
  var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ coordinates.lat +'&lon='+ coordinates.lon +'&appid='+ APIKEY +'&units=metric';
  forecastTitle.text('5 Day Forecast').addClass('mt-3 text-left text-white') // create the header for the forecast section
  fetch(currentUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        currentWeather = { // when response status is 200 proceed with parsing current weather data
          city: city, // city name passed into function and originally from the input to avoid discrepancies between openWeather's naming and users input
          date: dayjs().format('M/D/YYYY'), // using dayJS api to get and format current date
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          icon: data.weather[0].icon
        }
        createCurrentCard(currentWeather) // pass current weather object to createCurrentCard utility function
      });
    } else {
      alert('Error: ' + response.statusText); // alert the user when api returns anything but status 200
    }
  });
    
  fetch(forecastUrl).then(function (response) {
    if (response.ok) {  
      response.json().then(function (data) { // when response status is 200 proceed with parsing current weather data
        forecastData = data.list
        for (var i = 0; i < forecastData.length; i++) { 
          // API returns 40 data points, 8 per day. In order to get one weather reading for each day we will only pull the data points at 12pm
          // pulling the data at the midpoint of the day will help get a good approximation of the day's weather
          if (forecastData[i].dt_txt.split(" ")[1] === '12:00:00'){ 
            var weather = 
                  {
                      date: dayjs(forecastData[i].dt_txt.split(" ")[0]).format('M/D/YYYY'), 
                      temp: forecastData[i].main.temp,
                      humidity: forecastData[i].main.humidity,
                      wind: forecastData[i].wind.speed,
                      icon: forecastData[i].weather[0].icon
                  };
            createForecastCards(weather) // pass current weather object to createForecastCards utility function
          }
        }
      });
    } else {
      alert('Error: ' + response.statusText); // alert the user when api returns anything but status 200
    }
  });
}


// Event handling Functions

function initSearches(){
  // This function is called once the webpage is loaded
  // the function gets all the past seaches if exist and calls a function to create individual buttons for each search
  // it then stores the past search object into an array called searches
  var storedSearches = JSON.parse(localStorage.getItem("pastSearches")); //get all stored searches from the localStorage
  if (storedSearches !== null) { // check is there was any previous search
      for (var i = 0; i < storedSearches.length; i++) { // if there was any previous search create buttons and store in searches array
        createQuickSearchButton(storedSearches[i])
      }
      searches =  storedSearches; 
  }
}

function startPastSearch(event){
  // When one of the buttons in the past search section is clicked
  // function will retrieve the city name from the button and place it in the searchInput and call startSearch
  // This is to imitate a person inputting a city name in the search and searching in order to prevent code repeating
  buttonClicked = $(event.target); // get city name from the triggering button
  searchInput.val(buttonClicked.text()); // add the city name to the search input
  startSearch();
}

function startSearch(){
  // When the search button is clicked this function is called
  // it will start the appropriate API call by first determining if the city was searched before
  // if city was searched before then coordinates are already known and no API call is needed to get coordinates
  
  // clear dashboard of cards and headings
  clearCards()
  forecastTitle.text('').removeClass() // forecast title may read as '5 Day forecast' or give warning that searched city can not be found

  var city = searchInput.val(); // get searched city from input
  var previousSearch = wasSearched(city) // check if city is in localstorage
  if (previousSearch){ // if previously searched get weather information with stored coordinates else get coordinates
    getWeatherData(previousSearch.city, previousSearch.coordinates)
  } else {
    getCityCoordinates(city)
  }
}


// Event listeners
window.addEventListener("load", initSearches);
searchButton.on('click', startSearch);
pastSearches.on('click', '.pastSearchButton', startPastSearch);
//Define Global Vars
var currentCity = "";
var searchHistory = JSON.parse(localStorage.getItem("location")) || [];
var apiKey = "6a13c0be5285df65c709a8ea0f1f8378";
var coords = {};
var uvIndex = 0;
var icon;

//Call for History
renderHistory();

//Check to get last stored.
var lastStored = localStorage.getItem("last-Search")
if (lastStored) {
  currentCity = lastStored;
  getCurrent();
}

//Click Event
$("#search-form").submit(function (event) {
  currentCity = $("#form-search").val();
  getCurrent();
  event.preventDefault();
});

//Clickable History
$(document).on("click", "li", function () {
  currentCity = $(this).text()
  getCurrent();
})

//Gets the UV Index
function getUV() {
  var URI = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${coords.lat}&lon=${coords.lon}`;
  $.ajax({
    url: URI,
    method: "GET"
  }).then(function (response) {
    uvIndex = response.value;
    var uvColor = "";
    if(uvIndex >=8){
      uvColor = "bg-danger"
    }else if(uvIndex >=3){
      uvColor = "bg-warning"
    }else{
      uvColor = "bg-succes"
    }
    $("#uv").html(`UV Index: <span class="${uvColor} p-1 rounded">${uvIndex}</span>`);
    
    getForecast();
  });
}

//This gets the Current Forecast
function getCurrent() {

  var URI = `http://api.openweathermap.org/data/2.5/weather?units=imperial&q=${currentCity}&appid=${apiKey}`;
  $.ajax({
    url: URI,
    method: "GET"
  }).then(function (response) {
    $("#currentDay").empty();
    if (!searchHistory.find((element) => { return element === currentCity })) {
      searchHistory.push(currentCity);
      localStorage.setItem("location", JSON.stringify(searchHistory));
      renderHistory();
    }
    localStorage.setItem("last-Search", currentCity);
    coords = response.coord;
    var img = `<img src="http://openweathermap.org/img/wn/${response.weather[0].icon}.png">`;
    var currentDay = `<h3 id="cityName">${response.name} (${new Date().toLocaleDateString()}) ${img}</h3>
                      <p>Temperature: ${Math.floor(response.main.temp)}&deg;</p>
                      <p>Humidity: ${response.main.humidity}%</p>
                      <p>Wind Speed: ${Math.floor(response.wind.speed)} MPH</p>
                      <p id="uv"></p>`
    $("#currentDay").append(currentDay);
    getUV();
  });
}

//Returns 5 Day Forecast
function getForecast() {
  var URI = `http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${currentCity}&appid=${apiKey}`;
  $.ajax({
    url: URI,
    method: "GET"
  }).then(function (response) {
    $("#fiveDay").empty();
    //Loop Here for Display
    for (var i = 0; i < response.list.length; i += 8) {
      var forecast = response.list[i];
      var fiveDayDiv = `<div class="card-header col-8 offset-2 offset-lg-0 col-lg-2 mr-3 bg-primary text-light">
                          <h5>${new Date(forecast.dt_txt).toLocaleDateString()}</h5>
                          <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png">
                          <p>Temp: ${Math.floor(forecast.main.temp)}&deg;</p>
                          <p>Humidity: ${forecast.main.humidity}%</p>
                        </div>`
      $("#fiveDay").append(fiveDayDiv);
    }
  });
}

//Display History
function renderHistory() {
  var historyEl = $("#history");
  historyEl.html("");
  var cities = JSON.parse(localStorage.getItem("location"))
  $.each(cities, function (i, city) {
    var li = $("<li>").text(city).addClass("list-group-item list-group-item-action");
    historyEl.append(li)
  })
}

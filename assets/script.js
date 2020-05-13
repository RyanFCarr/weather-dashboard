
var currentCity = "";
var searchHistory = JSON.parse(localStorage.getItem("location")) || [];
var apiKey = "6a13c0be5285df65c709a8ea0f1f8378";
var coords = {};
var uvIndex = 0;

//click listner
$( "#search-form" ).submit(function(event) {
  currentCity = $("#form-search").val();
  getCurrent();
  event.preventDefault();
});

function getForecast(){
  var URI = `http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${currentCity}&appid=${apiKey}`;
  $.ajax({
    url: URI,
    method: "GET"
  }).then(function(response) {

    var weeklyForecast = $("#weekly-forecast")
    render();
  });
}

function getCurrent(){
  var URI = `http://api.openweathermap.org/data/2.5/weather?units=imperial&q=${currentCity}&appid=${apiKey}`;
  var currentForecast = $("#current-forecast")

  $.ajax({
    url: URI,
    method: "GET"
  }).then(function(response) {
    searchHistory.push(currentCity); 
    localStorage.setItem("location", JSON.stringify(searchHistory));
    coords = response.coord;
    getUV();
  });
}

function getUV(){
  var URI = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${coords.lat}&lon=${coords.lon}`;
  $.ajax({
    url: URI,
    method: "GET"
  }).then(function(response){
    uvIndex = response.value;
    getForecast();
  });   
}

render();
function render(){
  var historyEl = $("#history");
  historyEl.html("");
  var cities = JSON.parse(localStorage.getItem("location"))
  $.each(cities, function(i, city){
      var li = $("<li>").text(city).addClass("list-group-item list-group-item-action");
      historyEl.append(li)
  })
}

  






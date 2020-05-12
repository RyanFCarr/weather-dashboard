

var city = "";

$( "#btnSearch" ).click(function() {
    city = $("#form-search").val();
getWeather()
});

function getWeather(){
    var apiKey = "6a13c0be5285df65c709a8ea0f1f8378";
    // var URI2 = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    var URI = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    $.ajax({
      url: URI,
      method: "GET"
    }).then(function(response) {
        console.log(response)
      
    });
  }
  

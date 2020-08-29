$(document).ready(function() {

var count = 0 ;
var lat;
var lon;
var tempf ;
var tempc ;
var description ;
var current_aqi ;
var weather_url ;
var weatherlink ;
var current_aqi_url ;
var body ;
var body2 = "test";
var location ;
var phone ;
var minutes ;


  $(document).bind("keypress", function(e) {
    if (e.which === 13) {
      // return
      $(".formSubmit").trigger("click");
    }
  });

  var aqi_checked = false;
  var rain_checked = false;

  var aqi = document.querySelector('input[id="aqi"]');
  var rain = document.querySelector('input[id="rain"]');
  
  aqi.addEventListener('click', updateAQIDisplay);
  rain.addEventListener('click', updateRainDisplay);
    function updateAQIDisplay() {
    aqi_checked = aqi.checked
    $("#display-aqi-data").html(aqi_checked);
  }

  function updateRainDisplay() {
    rain_checked = rain.checked
    $("#display-rain-data").html(rain_checked);
  }

//find coordinates and make url 
if (navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(function(pos) {

    lat  = pos.coords.latitude;
    lon = pos.coords.longitude;
  });
}


function go () {
  count++

  weather_url = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid=76aa4cb2e2b53b603516bce13382a600";

    //json stuff with url
    $.getJSON(weather_url,function(data){
      location = data.name ;
      $(".weather").html("Location: " + data.name);

      tempf = data.main.temp.toFixed(1) + " degrees fahrenheit"
      tempc = ((data.main.temp-32)*(5/9)).toFixed(1) + " degrees celsius"
      $(".weather2").html("Temperature: "+tempf);


 //weather data
 description = data.weather[0].description ;
 $(".weather3").html("Weather description is "+ description);

//weather images
$(".weather4").html(function() 
{         weatherlink = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
return "<img src="+ weatherlink +">";
});



//end of brackets
});   

    current_aqi_url = "http://api.airvisual.com/v2/nearest_city?lat="+lat+"&lon="+lon+"&key=71270c59-114c-4a35-b948-025988b30f33" ;
    
    $.getJSON(current_aqi_url,function(data){
      current_aqi = data.data.current.pollution.aqius.toFixed(1) ;
    });

    $(".weather5").html("Current air quality index is "+current_aqi); 
    $(".weather6").html("Refresh count: "+count); 
    body = current_aqi ; 
    body2 = "Current temperature today in " + location+" is " + tempf;

    if (aqi_checked == true) {
    body2 = body2 + ", "+ "current air quality is "+current_aqi ;
  }

    if (rain_checked == true) {
    body2 = body2 + ", " + "weather description is "+description;
  }
    if (location===undefined || tempf === undefined || current_aqi === undefined || description === undefined) {

    } else {
          $(".weather7").html("Summary: " +body2);
    text();
    }
  }



$(".formSubmit").click(function() {
      phone = document.getElementsByName("phone")[0].value;
      minutes = document.getElementsByName("minutes")[0].value;
      setInterval(go,minutes*1000*60) ;
  });

  //$(".btnSubmit").click(function()

  function text() {

          // Your Twilio credentials
          var SID = "SID" ;
          var Key = "KEY" ; 

          $.ajax({
            type: 'POST',
            url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
            data: {
              "To" : phone,
              "From" : "TWILIO PHONE #",
              "Body" : body2
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Basic " + btoa(SID + ':' + Key));
            },
            success: function(data) {
              console.log(data);
            },
            error: function(data) {
              console.log(data);
            }
          });
        }

        //);





  //setInterval(go,15000) ;

});
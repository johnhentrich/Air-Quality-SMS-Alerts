$(document).ready(function () {
  var TWILIO_SID = "your sid";
  var TWILIO_PHONE = "your phone";
  var TWILIO_KEY = "your key";
  var count = 0;
  var lat;
  var lon;
  var tempf;
  var description;
  var current_aqi;
  var weather_url;
  var weatherlink;
  var current_aqi_url;
  var body2 = "text message";
  var location;
  var phone;
  var minutes;
  var text_on = false;
  var btn = document.getElementById("submit-button");
  var interval = null;

  $(document).bind("keypress", function (e) {
    if (e.which === 13) {
      $(".formSubmit").trigger("click");
    }
  });

  // get checkbox status for AQI and Weather Description
  var aqi = document.querySelector('input[id="aqi"]');
  var desc = document.querySelector('input[id="desc"]');

  //find coordinates and make url 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {

      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    });
  }

  // after clicked on the button, regularly provide alerts
  // if clicked on the button again, will pause alerts
  $(".formSubmit").click(function () {
    if (!text_on){
      btn.innerHTML = "Signed up for alerts";
      text_on = true

      go()
      phone = document.getElementsByName("phone")[0].value;
      minutes = document.getElementsByName("minutes")[0].value;
      interval = setInterval(go, minutes * 1000 * 60);

    } else {
      clearInterval(interval);
      btn.innerHTML = "Alert Paused";
      text_on = false
    }    
  });

  // executed at regular intervals to provide update
  function go() {
    count++;
    
    // get data from openweather api
    weather_url = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=76aa4cb2e2b53b603516bce13382a600";

    $.getJSON(weather_url, function (data) {
      location = data.name;
      $(".weather").html("Location: " + data.name);

      tempf = data.main.temp.toFixed(1) + " degrees fahrenheit"
      $(".weather2").html("Temperature: " + tempf);

      //weather description
      description = data.weather[0].description;
      $(".weather3").html("Weather description is " + description);

      //weather images
      $(".weather4").html(function () {
        weatherlink = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        return "<img src=" + weatherlink + ">";
      });

    });

    // get air quality index from air visual api
    current_aqi_url = "http://api.airvisual.com/v2/nearest_city?lat=" + lat + "&lon=" + lon + "&key=71270c59-114c-4a35-b948-025988b30f33";

    $.getJSON(current_aqi_url, function (data) {
      current_aqi = data.data.current.pollution.aqius.toFixed(1);
    });

    $(".weather5").html("Current air quality index is " + current_aqi);
    $(".weather6").html("Refresh count: " + count);

    // prepare text message
    body2 = "Current temperature today in " + location + " is " + tempf;

    if (aqi.checked == true) {
      body2 = body2 + ", " + "current air quality is " + current_aqi;
    }

    if (desc.checked == true) {
      body2 = body2 + ", " + "weather description is " + description;
    }

    // send text messange to user
    if (location === undefined || tempf === undefined || current_aqi === undefined || description === undefined) {
      // API sometimes does not respond; pass and don't send text message
    } else {
      $(".weather7").html("Summary: " + body2);
      text();
    }
  }

  // send text message using Twilio API
  function text() {

    $.ajax({
      type: 'POST',
      url: 'https://api.twilio.com/2010-04-01/Accounts/' + TWILIO_SID + '/Messages.json',
      data: {
        "To": phone,
        "From": TWILIO_PHONE,
        "Body": body2
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(TWILIO_SID + ':' + TWILIO_KEY));
      },
      success: function (data) {
        console.log(data);
      },
      error: function (data) {
        console.log(data);
      }
    });
  }

});

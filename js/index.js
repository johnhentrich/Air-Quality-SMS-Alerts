$(document).ready(function() {

  var count = 0 ;
  var lat;
  var lon;
  var current_aqi ;
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

    var weather_url = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid=76aa4cb2e2b53b603516bce13382a600";

      //json stuff with url
      
      $.getJSON(weather_url,function(data){
        $(".weather").html("location: " + data.name);

        var tempf = data.main.temp.toFixed(1) + " degrees fahrenheit"
        var tempc = ((data.main.temp-32)*(5/9)).toFixed(1) + " degrees celsius"

        $(".weather2").html(tempf);

             //toggle button   

             $(".cfbutton").click(function() 
             { 
              if ($(".weather2").html() == tempf) 
              { 
               $(".weather2").html(tempc); 
             } 
             else 
             { 
               $(".weather2").html(tempf); 
             }; 
           });

   //weather data

   $(".weather3").html("weather: "+ data.weather[0].description);

 //weather images


 $(".weather4").html(function() 
  {         var weatherlink = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
  return "<img src="+ weatherlink +">";
});



 //end of brackets
});   

      
      var current_aqi_url = "http://api.airvisual.com/v2/nearest_city?lat="+lat+"&lon="+lon+"&key=98c0be17-7b1f-4418-ad95-8bd91cfca02c" ;

      //var url2 = "https://cors-anywhere.herokuapp.com/http://www.airnowapi.org/aq/forecast/latLong/?format=application/json&latitude="+pos.coords.latitude+"&longitude="+pos.coords.longitude+"&distance=25&API_KEY=098A0234-7F48-41F3-BAF5-EC8AF849DB05" ;
      $.getJSON(current_aqi_url,function(data){
        current_aqi = "current air quality index: "+data.data.current.pollution.aqius.toFixed(1) ;
        $(".weather5").html(current_aqi); 
        $(".weather6").html("refresh count: "+count); 

      });


      var body = current_aqi ; 
      $(".weather7").html("body: "+body);

      $(".btnSubmit").click(function(){
            // Your Twilio credentials
            var SID = "SID HERE"
            var Key = "KEY HERE"

            $.ajax({
              type: 'POST',
              url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
              data: {
                "To" : "# HERE",
                "From" : "# HERE",
                "Body" : body
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
          });

    }


    setInterval(go,10000) ;

  });
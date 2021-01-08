const https = require("https");

module.exports = getWeather();


function getWeather(){
  const API_KEY = "34538dd7e7b8dca98778592aa134911e";
  const city = "Katowice";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=" + units + "&lang=pl";

  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const weatherObject = {
        weatherDescription : String,
        outsideTemperature : String,
        feelTemperature : String,
        pressure : String,
        humidity : String,
        windSpeed : String,
        icon : String,
        imageUrl : String
      }

      weatherObject.weatherDescription = weatherData.weather[0].description;
      weatherObject.outsideTemperature = weatherData.main.temp;
      weatherObject.feelTemperature = weatherData.main.feels_like;
      weatherObject.pressure = weatherData.main.pressure;
      weatherObject.humidity = weatherData.main.humidity;
      weatherObject.windSpeed = weatherData.wind.speed;
      weatherObject.icon = weatherData.weather[0].icon;
      weatherObject.imageUrl = "http://openweathermap.org/img/wn/" + weatherObject.icon + "@2x.png";

      return weatherObject;

      // res.render("index", {
      //   icon: imageUrl,
      //   weather: weatherDescription,
      //   outTemp: outsideTemperature,
      //   feelTemp: feelTemperature,
      //   pressure: pressure,
      //   humidity: humidity,
      //   windSpeed: windSpeed,
      //   currentDateAndHour:currentDateAndHour,
      //   currentDate:currentDate,
      //   newItemsList: dailyItems,
      //   title: "Dzisiaj"
      // });
    })
  });
}

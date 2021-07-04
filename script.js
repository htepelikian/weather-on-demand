function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // Assigning API to a value
    const APIKey = "84b79da5e5d7c92085660485702f4ce8";

    function getWeather(cityName) {
        // Link weather API to obtain current weather
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

            todayweatherEl.classList.remove("d-none");

    // Display current weather 
    const currentDate = new Date(response.data.dt * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
    let weatherPic = response.data.weather[0].icon;
    currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    currentPicEl.setAttribute("alt", response.data.weather[0].description);
    currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
    currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
    currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
                
    // Get UV Index
    let lat = response.data.coord.lat;
    let lon = response.data.coord.lon;
    let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
    axios.get(UVQueryURL)
        .then(function (response) {
            let UVIndex = document.createElement("span");
                        
    // UV index color code: red = severe, green = favorable, yellow = moderate
            if (response.data[0].value < 4 ) {
                UVIndex.setAttribute("class", "badge badge-success");
            }
            else if (response.data[0].value < 8) {
                UVIndex.setAttribute("class", "badge badge-warning");
            }
            else {
                UVIndex.setAttribute("class", "badge badge-danger");
            }
            console.log(response.data[0].value)
            UVIndex.innerHTML = response.data[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);
        });
                
    // Get 5 day forecast for this city
    let cityID = response.data.id;
    let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
    axios.get(forecastQueryURL)
        .then(function (response) {
            fivedayEl.classList.remove("d-none");
                        
    //  Display 5 day forecast
        const forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            const forecastIndex = i * 8 + 4;
            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
            const forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth() + 1;
            const forecastYear = forecastDate.getFullYear();
            const forecastDateEl = document.createElement("p");
            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEls[i].append(forecastDateEl);

    // Current forecast/weather
        const forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
        forecastEls[i].append(forecastWeatherEl);
        const forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
        forecastEls[i].append(forecastTempEl);
        const forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
        forecastEls[i].append(forecastHumidityEl);
        }
    })
});
}
main();

const searchBox = document.querySelector(".search input");
const btnSearch = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const cityA = document.querySelector(".city");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");




async function getCurrentCity() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;



                    const apiKey = 'e475efdfd2db442fbcf24061103c4040';
                    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

                    console.log(apiUrl);

                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            const city = data.results[0].components.city;
                            const suburb = data.results[0].components.suburb;
                            document.querySelector(".suburb").innerHTML = suburb;
                            resolve(city);
                        })
                        .catch(error => {
                            reject(error);
                        });
                },
                error => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}


async function main() {
    try {
        const currentCity = await getCurrentCity();
        if (currentCity) {
            checkWeather(currentCity);
        } else {
            console.log("Unable to retrieve current city.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



async function checkWeather(city) {
    const apiKey = "2f6568b7ad51ea0cd379e55fbc1404d2";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404){
        document.querySelector(".error").style.display = "block";
        const currentCity = await getCurrentCity();
        checkWeather(currentCity);
        

    }else{
        var data = await response.json();
        cityA.innerHTML = data.name;
        temp.innerHTML = Math.round(data.main.temp) + "°C";
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + " km/h";
    
        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        } else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "images/snow.png";
        }
        document.querySelector(".error").style.display = "none";
    }   
}

btnSearch.addEventListener("click", () => {
    checkWeather(searchBox.value);
    document.querySelector(".suburb").innerHTML = "";
})

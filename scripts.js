$(document).ready(function() {
        var locationStr = $("#location").val();
        var temp_unit = "f";
        var speed_unit = "km/h";
        var speed = 0;
        var temp = "";
        var icons = {
            "clear-day": "wi-day-sunny",
            "clear-night": "wi-night-clear",
            "partly-cloudy-day": "wi-day-cloudy",
            "partly-cloudy-night": "wi-night-cloudy",
            "cloudy": "wi-cloudy",
            "rain": "wi-rain",
            "thunderstorm": "wi-thunderstorm",
            "snow": "wi-snow",
            "fog": "wi-fog",
            "smoke":"wi-smoke",
            'sleet':'wi-sleet',
            'wind':'wi-strong-wind',
            'sandstorm' : 'wi-sandstorm',
            'tornado':'wi-tornado'

        };

        showCurrentWeather();
        $("#unit").on("click", function() {
            convertUnits();
        });

        $(".speed").on("click", convertSpeed);

        $(".btn-details").on("click", function() {
            var text = $(".btn-details-text").text();
            $(".details").slideToggle();
            if (text == "More") {
                text = "Less";
            } else {
                text = "More";
            }
            $(".btn-details-text").text(text);
        });




        function showCurrentWeather() {
            $(".error").hide();
            $(".loader").show();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var coords = position.coords;
                    var apikey = "bafbe5b328e484ee4e234bfca1b1abf7";
                    
                    $.ajax({
                        url: "https://api.forecast.io/forecast/" + apikey + "/" + coords.latitude + "," + coords.longitude,
                        type: 'GET',
                        dataType: 'jsonp',
                        crossDomain: true,
                        success: success
                    });
                });

                
    }
}

function success(data) {
    console.log(data);
        locationStr = data["timezone"];
        var currently =data["currently"]; 
        temp = currently["temperature"];
        speed = currently["windSpeed"];
        $("#location").text(locationStr);
        setTemp(temp);
        setIcon(currently["icon"], currently["summary"]);
        setSummary(currently['summary']);
        setHumidity(currently["humidity"]);
        setPressure(currently["pressure"]);
        setWind(currently['windBearing'], speed);
    $(".loader").hide();
}


function convertUnits() {
    if (temp_unit == "c") {
        temp_unit = "f";
        temp = (9 / 5 * temp) + 32;
    } else {
        temp_unit = "c";
        temp = (temp - 32) * 5 / 9;
    }
    setTemp(temp);
    $("#unit").text(temp_unit);
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function setTemp(temperature) {
    $("#temp").text(round(temperature, 1));
}

function setIcon(icon, description) {
    var iconClassName = "wi " + icons[icon];
    $("#weather-icon").attr({
        "class": iconClassName,
        "title": description
    });

}

function setHumidity(humidity) {
    $(".humidity").text(round(humidity * 100, 1) + "%");
}


function setPressure(pressure) {
    $(".pressure").text(round(pressure, 1) + " hPa");
}
function setSummary(text){
    $('.summary').text(text);
}
function setWind(degrees, speed) {
    $("#direction").css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        '-o-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
    });
    $(".speed").text(speed + " " + speed_unit);
}

function convertSpeed() {
    if (speed_unit == "m/s") {
        speed_unit = "km/h";
        speed = 18 / 5 * speed;
    } else {
        speed_unit = "m/s";
        speed = 5 / 18 * speed;
    }
    $(".speed").text(round(speed, 1) + " " + speed_unit);
}
});
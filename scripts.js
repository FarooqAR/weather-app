$(document).ready(function() {
    var locationStr = $("#location").val();
    var temp_unit = "c";
    var speed_unit = "m/s";
    var speed  = 0;
    var temp = "";
    var icons = {
        "01d": "wi-day-sunny",
        "01n": "wi-night-clear",
        "02d": "wi-day-cloudy",
        "02n": "wi-night-cloudy",
        "03d": "wi-cloud",
        "03n": "wi-cloud",
        "04d": "wi-cloudy",
        "04n": "wi-cloudy",
        "09d": "wi-rain",
        "09n": "wi-rain",
        "10d": "wi-day-rain",
        "10n": "wi-night-alt-rain",
        "11d": "wi-day-thunderstorm",
        "11n": "wi-night-alt-thunderstorm",
        "13d": "wi-day-snow",
        "13n": "wi-night-alt-snow",
        "50d": "wi-fog",
        "50n": "wi-fog"

    };

    showCurrentWeather();

    $("#location").on("focus", function() {
        enableEdit();
    });
    $("#location").on("focusout", function() {
        disableEdit();
    });

    $("#unit").on("click", function() {
        convertUnits();
    });
    $("#btn-search-location").on("click", function() {
        
        locationStr = $("#location").val();
        searchWeather(locationStr);
    })

    $(".speed").on("click",convertSpeed);

    $(".btn-details").on("click",function(){
        var text = $(".btn-details-text").text();
        $(".details").slideToggle();
        if(text == "More"){
            text = "Less";
        }
        else{
            text= "More";
        }
        $(".btn-details-text").text(text);
    });


    function searchWeather(city) {
        $(".error").hide();
        $(".loader").show();
        $.getJSON("https://api.openweathermap.org/data/2.5/weather", {
            "q": city,
            "units": "metric",
            "apikey": "5557fb723ced09517bc5551cd212e30a"
        }, success);
    }

    function showCurrentWeather() {
        $(".error").hide();
        $(".loader").show();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var coords = position.coords;
                $.getJSON("https://api.openweathermap.org/data/2.5/weather", {
                    "lat": coords.latitude,
                    "lon": coords.longitude,
                    "units": "metric",
                    "apikey": "5557fb723ced09517bc5551cd212e30a"
                }, success);
            });
        }
    }

    function success(data) {
        console.log(data);
        if (data["cod"] == 200) {
            locationStr = data["name"] + ", " + data["sys"]["country"];
            temp = data["main"]["temp"];
            speed = data["wind"]["speed"];
            $("#location").val(locationStr);
            setTemp(temp);
            setIcon(data["weather"][0]["icon"], data["weather"][0]["description"]);
            setHumidity(data["main"]["humidity"]);
            setPressure(data["main"]["pressure"]);
            setMinMax(data["main"]["temp_min"], data["main"]["temp_max"]);
            setWind(data["wind"]["deg"],speed);
        } else {
            $(".error").text("Please enter a valid city").show();
        }
        $(".loader").hide();
    }

    function enableEdit() {
        $("#location").removeClass("disabled");
        $("#btn-search-location").animate({
            width: ["toggle", "swing"]
        }, 300);
    }

    function disableEdit() {
        $("#location").addClass("disabled");
        $("#btn-search-location").animate({
            width: ["toggle", "swing"]
        }, 300);
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
        $(".humidity").text(round(humidity, 1) + "%");
    }

    function setMinMax(min, max) {
        $(".minmax").text(round(min, 1) + "/" + round(max, 1));
    }

    function setPressure(pressure) {
        $(".pressure").text(round(pressure, 1)+ " hPa");
    }

    function setWind(degrees, speed) {
        $("#direction").css({
            '-webkit-transform' : 'rotate('+degrees+'deg)',
            '-moz-transform' : 'rotate('+degrees+'deg)',  
            '-ms-transform' : 'rotate('+degrees+'deg)',  
            '-o-transform' : 'rotate('+degrees+'deg)',  
            'transform' : 'rotate('+degrees+'deg)'
        });
        $(".speed").text(speed + " m/s");

    }
    function convertSpeed(){
        if(speed_unit == "m/s"){
            speed_unit = "km/h";
            speed = 18/5 * speed;
        }
        else{
            speed_unit = "m/s";
            speed = 5/18 * speed;
        }
        $(".speed").text(round(speed,1)+" "+speed_unit);
    }
});
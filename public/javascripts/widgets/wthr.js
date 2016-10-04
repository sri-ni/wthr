(function(global){

  // add array index of for old browsers (IE<9)
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      var i, j;
      i = start || 0;
      j = this.length;
      while (i < j) {
        if (this[i] === obj) {
          return i;
        }
        i++;
      }
      return -1;
    };
  }

  var div = document.createElement('div');
  div.id = 'wthr-widget';
  div.className = 'wthr widget'; //cleanslate

  var scriptTags = document.getElementsByTagName('script');
  var requestUrl = 'widgets/wthr';

  for(var i = 0; i < scriptTags.length; i++) {
    var scriptTag = scriptTags[i];
    if (scriptTag.src.indexOf(requestUrl)>=0) {
      scriptTag.parentNode.insertBefore(div, scriptTag);
    }
  }

  var styleLinks = [
      "https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css",
      // "../../stylesheets/cleanslate.css",
      "../../stylesheets/style.css"
    ],
    styleTags = [];
  if(styleTags.length == 0) {
    var styleTag;
    for (var i=0; i<styleLinks.length; i++) {
      styleTag = document.createElement("link");
      styleTag.rel = "stylesheet";
      styleTag.type = "text/css";
      styleTag.href = styleLinks[i];
      styleTag.media = "all";
      document.getElementsByTagName('head')[0].appendChild(styleTag);
      styleTags.push(styleTag);
    }
  }

  function parseWeather(data) {
    var currentConditionObj = data.query.results.channel.item.condition;
    var forecastObj = data.query.results.channel.item.forecast;
    var unitsObj = data.query.results.channel.units;
    var locationObj = data.query.results.channel.location;
    var parsedWeatherObj = {
      'condition': currentConditionObj,
      'forecast': forecastObj,
      'units': unitsObj,
      'location': locationObj
    }

    renderWeather(parsedWeatherObj);
  }

  function renderWeather(weatherObj) {
    var currentConditionTmpl = renderCondition(weatherObj);
    var forecastTmpl = renderForecast(weatherObj.forecast);
    var finalTmpl = '<article id="wthr-container">'
    + '<section class="current-weather">'
    + currentConditionTmpl
    + '</section>'
    + '<aside class="forecast">'
    + forecastTmpl
    + '</aside>'
    + '</article>';

    div.innerHTML = finalTmpl;
  }

  function renderCondition(weatherObj) {
    var condition = weatherObj.condition;
    var units = weatherObj.units;
    var location = weatherObj.location;
    var currentConditionTmpl = '<h3>'
      + location.city + ', ' + location.region
      + '</h3>'
      + '<h2>' + condition.temp
      + '° '
      + '</h2>'
      + '<span>' + units.temperature + '</span>'
      + '<figure>'
      + '<i class="wi wi-yahoo-'+ condition.code +'"></i>'
      + '<figcaption>' + condition.text + '</figcaption>'
      + '</figure>';

    return currentConditionTmpl;
  }

  function renderForecast(forecastObj) {
    var forecastTmpl = '';

    for (var i=0; i<5; i++) {
      forecastTmpl += '<article class="forecast-item">'
        + '<header>' + forecastObj[i].day + '</header>'
        + '<span class="readings">'
        + forecastObj[i].high + '°' + '/' + forecastObj[i].low + '°'
        + '</span>'
        + '<figure>'
        + '<i class="wi wi-yahoo-'+ forecastObj[i].code +'"></i>'
        + '</figure>'
        + '</article>';
    }

    return '<section class="forecast-list">' + forecastTmpl + '</section>';
  }

  var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="austin, tx")&format=json&env=store://datatables.org/alltableswithke';

  div.innerHTML = '<article id="wthr-container">'
  + '<section class="current-weather loader">'
  + '<header class="loader"></header>'
  + '<article class="loader"></article>'
  + '</section>'
  + '<aside class="forecast loader">'
  + '</aside>'
  + '</article>';

  get(weatherUrl).then(function(response) {
    var weatherData = JSON.parse(response);
    parseWeather(weatherData);
  }, function(error) {
    console.error("Failed!", error);
  });

  function get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error("Network Error"));
      };

      req.send();
    });
  }

})(this);

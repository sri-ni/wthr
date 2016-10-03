(function(global){

  console.log('wthr widget is here!');

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
  div.className = 'wthr widget';

  var scriptTags = document.getElementsByTagName('script');
  var requestUrl = 'widgets/wthr';

  for(var i = 0; i < scriptTags.length; i++) {
    var scriptTag = scriptTags[i];
    if (scriptTag.src.indexOf(requestUrl)>=0) {
      scriptTag.parentNode.insertBefore(div, scriptTag);
    }
  }

  var styleTags = [];
  if(styleTags.length == 0) {
    var styleTag = document.createElement("link");
    styleTag.rel = "stylesheet";
    styleTag.type = "text/css";
    styleTag.href =  "https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css";
    styleTag.media = "all";
    document.getElementsByTagName('head')[0].appendChild(styleTag);
    styleTags.push(styleTag);
  }

  function parseWeather(data) {
    var currentConditionObj = data.query.results.channel.item.condition;
    var forecastObj = data.query.results.channel.item.forecast;
    var unitsObj = data.query.results.channel.units;
    var locationObj = data.query.results.channel.location;
    console.log('currentConditionObj = ', currentConditionObj);
    console.log('forecastObj = ', forecastObj);
    console.log('unitsObj = ', unitsObj);
    console.log('locationObj = ', locationObj);

    var currentConditionTmpl = '<h3>'
      + locationObj.city + ', ' + locationObj.region
      + '</h3>'
      + '<i class="wi wi-yahoo-'+ currentConditionObj.code +'"></i>'
      + '<h2>' + currentConditionObj.temp
      + '° ' + unitsObj.temperature + '</h2>'
      + '<h5>' + currentConditionObj.text + '</h5>';

    var forecastTmpl = '',
      forecaseItemTmpl = '';

    for (var i=0; i<5; i++) {
      forecaseItemTmpl = '<div class="forecast-item">'
        + '<h4>' + forecastObj[i].day + '</h4>'
        + '<i class="wi wi-yahoo-'+ forecastObj[i].code +'"></i>'
        + forecastObj[i].high + '/' + forecastObj[i].low
        + '</div>';
      forecastTmpl+=forecaseItemTmpl;
    }

    div.innerHTML = currentConditionTmpl + forecastTmpl;
  }


  var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="austin, tx")&format=json&env=store://datatables.org/alltableswithke';

  get(weatherUrl).then(function(response) {
    var weatherData = JSON.parse(response);
    console.log('weatherData = ', weatherData);
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

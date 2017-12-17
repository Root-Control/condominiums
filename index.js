  var soap = require('soap');
  var url = 'http://www.webservicex.net/globalweather.asmx?WSDL';
  var args = { CountryName: 'Chile', CityName: 'Santiago' };

  soap.createClientAsync(url).then((client) => {
    return client.GetWeatherAsync(args);
  }).then((result) => {
    console.log(result);
  });


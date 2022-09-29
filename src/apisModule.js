import {
  encontradoDOM,
  errorLugarAcoordenadasDOM,
  errorInfoMeteoDOM,
  mostrarInfoMeteoDOM,
  mostrarInfoMeteoPronosticoDOM,
  errorInfoMeteoPronosticoDOM
} from "./domModule";

const apiKey = "a89d97a5f8156e276d76abbdc33383e3";
let unidades = "metric";
// ó imperial

function lugarAcoordenadas(lugar) {
  let promesaData = fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${lugar}&limit=5&appid=${apiKey}`,
    { mode: "cors" }
  );

  promesaData
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      encontradoDOM(response);
      return response;
    })
    .catch(function(error) {
      errorLugarAcoordenadasDOM(error);
      return "error";
    });
}

function infoMeteo(lat, lon) {
  let promesaData = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unidades}&lang=sp&appid=${apiKey}`,
    { mode: "cors" }
  );

  promesaData
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      mostrarInfoMeteoDOM(response);
      return response;
    })
    .catch(function(error) {
      errorInfoMeteoDOM(error);
      return error;
    });
}

function infoMeteoPronostico(lat, lon) {
  let promesaData = fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unidades}&lang=sp&appid=${apiKey}`,
    { mode: "cors" }
  );

  promesaData
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      mostrarInfoMeteoPronosticoDOM(response);
      return response;
    })
    .catch(function(error) {
      errorInfoMeteoPronosticoDOM(error);
      return error;
    });
}

export { lugarAcoordenadas, infoMeteo, infoMeteoPronostico, unidades };

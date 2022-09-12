import {
  lugarAcoordenadas,
  infoMeteo,
  infoMeteoPronostico,
  unidades
} from "./apisModule";

import { format, fromUnixTime } from "date-fns";

const buscarInput = document.querySelector("input");

const contenedorInfo = document.createElement("div");
contenedorInfo.classList.add("contenedorInfo");
const divBuscar = document.querySelector(".buscarLugar");
divBuscar.appendChild(contenedorInfo);

function buscarDOM() {
  const resultados = document.querySelector(".resultados");
  if (resultados) {
    resultados.remove();
  }
  contenedorInfo.textContent = "Cargando...";

  lugarAcoordenadas(buscarInput.value);
}

function encontradoDOM(response) {
  if (response.length === 0) {
    contenedorInfo.textContent = "No se encontró el lugar.";
  } else if (response.length === 1) {
    let nombre;
    if (response[0].hasOwnProperty("local_names")) {
      if (response[0].local_names.hasOwnProperty("es")) {
        nombre = response[0].local_names.es;
      } else {
        nombre = response[0].name;
      }
    } else {
      nombre = response[0].name;
    }

    if (response[0].hasOwnProperty("state")) {
      nombre = `${nombre}, ${response[0].state}`;
    }

    if (response[0].hasOwnProperty("country")) {
      nombre = `${nombre}, ${response[0].country}`;
    }

    requestInfoMeteoDOM(nombre, response[0].lat, response[0].lon);
  } else if (response.length > 1) {
    contenedorInfo.textContent = `Se encontraron ${response.length} resultados:`;
    const resultados = document.createElement("div");
    resultados.classList.add("resultados");
    for (let index = 0; index < response.length; index++) {
      let nombre;
      if (response[index].hasOwnProperty("local_names")) {
        if (response[index].local_names.hasOwnProperty("es")) {
          nombre = response[index].local_names.es;
        } else {
          nombre = response[index].name;
        }
      } else {
        nombre = response[index].name;
      }
      const resultado = document.createElement("div");
      resultado.classList.add("resultado");
      resultado.dataset.lat = response[index].lat;
      resultado.dataset.lon = response[index].lon;

      resultado.addEventListener("click", llamarRequestInfoMeteoDOM);

      resultado.textContent = `${nombre}`;
      if (response[index].hasOwnProperty("state")) {
        resultado.textContent =
          resultado.textContent + `, ${response[index].state}`;
      }
      if (response[index].hasOwnProperty("country")) {
        resultado.textContent =
          resultado.textContent + `, ${response[index].country}`;
      }
      resultados.appendChild(resultado);
    }
    divBuscar.appendChild(resultados);
  }
}

function llamarRequestInfoMeteoDOM() {
  requestInfoMeteoDOM(this.textContent, this.dataset.lat, this.dataset.lon);
}

function requestInfoMeteoDOM(lugar, lat, lon) {
  const resultados = document.querySelector(".resultados");
  if (resultados) {
    resultados.remove();
  }

  contenedorInfo.textContent = "";

  const primerDiv = document.createElement("div");
  primerDiv.classList.add("primerDiv");
  const lugarDiv = document.createElement("div");
  lugarDiv.classList.add("lugar");
  lugarDiv.textContent = lugar;
  primerDiv.appendChild(lugarDiv);
  contenedorInfo.appendChild(primerDiv);

  const divCargando = document.createElement("div");
  divCargando.classList.add("divCargando");
  divCargando.textContent = "Cargando...";
  contenedorInfo.appendChild(divCargando);

  infoMeteo(lat, lon);
}

function mostrarInfoMeteoDOM(response) {
  document.querySelector(".divCargando").remove();

  // primerDiv
  const primerDiv = document.querySelector(".primerDiv");

  if (response.hasOwnProperty("weather")) {
    response.weather.forEach(element => {
      if (element.hasOwnProperty("description")) {
        const descripcion = element.description;
        const enMayus =
          descripcion.slice(0, 1).toUpperCase() + descripcion.slice(1);
        const divDescripcion = document.createElement("div");
        divDescripcion.textContent = enMayus;
        primerDiv.appendChild(divDescripcion);
      }

      const icon = document.createElement("div");
      icon.classList.add("icon");
      if (element.hasOwnProperty("icon")) {
        const img = document.createElement("img");
        img.src = `http://openweathermap.org/img/wn/${element.icon}@4x.png`;
        icon.appendChild(img);
      }
      primerDiv.appendChild(icon);
    });
  }

  let grados = "";
  if (response.hasOwnProperty("main")) {
    if (response.main.hasOwnProperty("temp")) {
      if (unidades === "metric") {
        grados = "°C";
      } else if (unidades === "imperial") {
        grados = "°F";
      }
    }

    const temperatura = document.createElement("div");
    temperatura.classList.add("temperatura");
    temperatura.textContent = `${response.main.temp.toFixed(1)} ${grados}`;
    primerDiv.appendChild(temperatura);
  }
  if (
    response.hasOwnProperty("main") &&
    response.main.hasOwnProperty("feels_like")
  ) {
    const sensTerm = document.createElement("div");
    sensTerm.textContent = `Sensación de: ${response.main.feels_like.toFixed(
      1
    )} ${grados}`;
    primerDiv.appendChild(sensTerm);
  }

  contenedorInfo.appendChild(primerDiv);

  // segundoDiv
  const segundoDiv = document.createElement("div");
  segundoDiv.classList.add("segundoDiv");

  if (
    response.hasOwnProperty("clouds") &&
    response.clouds.hasOwnProperty("all")
  ) {
    const nubosidadContenedor = document.createElement("div");
    nubosidadContenedor.classList.add("contenedor");

    const nubosidadIcon = document.createElement("img");
    nubosidadIcon.src = "./weather-cloudy-48-regular.svg";
    nubosidadContenedor.appendChild(nubosidadIcon);

    const nubosidadTitulo = document.createElement("div");
    nubosidadTitulo.classList.add("titulo");
    nubosidadTitulo.textContent = "Nubosidad";
    nubosidadContenedor.appendChild(nubosidadTitulo);

    const nubosidadValor = document.createElement("div");
    nubosidadValor.classList.add("valor");
    nubosidadValor.textContent = `${response.clouds.all}%`;
    nubosidadContenedor.appendChild(nubosidadValor);

    segundoDiv.appendChild(nubosidadContenedor);
  }

  if (
    response.hasOwnProperty("main") &&
    response.main.hasOwnProperty("humidity")
  ) {
    const humedadContenedor = document.createElement("div");
    humedadContenedor.classList.add("contenedor");

    const humedadIcon = document.createElement("img");
    humedadIcon.src = "./humedad.svg";
    humedadContenedor.appendChild(humedadIcon);

    const humedadTitulo = document.createElement("div");
    humedadTitulo.classList.add("titulo");
    humedadTitulo.textContent = "Humedad";
    humedadContenedor.appendChild(humedadTitulo);

    const humedadValor = document.createElement("div");
    humedadValor.classList.add("valor");
    humedadValor.textContent = `${response.main.humidity}%`;
    humedadContenedor.appendChild(humedadValor);

    segundoDiv.appendChild(humedadContenedor);
  }

  if (
    response.hasOwnProperty("main") &&
    response.main.hasOwnProperty("pressure")
  ) {
    const presionContenedor = document.createElement("div");
    presionContenedor.classList.add("contenedor");

    const presionIcon = document.createElement("img");
    presionIcon.src = "./pressure.svg";
    presionContenedor.appendChild(presionIcon);

    const presionTitulo = document.createElement("div");
    presionTitulo.classList.add("titulo");
    presionTitulo.textContent = "Presión";
    presionContenedor.appendChild(presionTitulo);

    const presionValor = document.createElement("div");
    presionValor.classList.add("valor");
    presionValor.textContent = `${response.main.pressure} hPa`;
    presionContenedor.appendChild(presionValor);

    segundoDiv.appendChild(presionContenedor);
  }

  contenedorInfo.appendChild(segundoDiv);

  // tercerDiv
  let unidadVelocidad = "";
  if (unidades === "metric") {
    unidadVelocidad = "km/h";
  } else if (unidades === "imperial") {
    unidadVelocidad = "m/h";
  }

  const tercerDiv = document.createElement("div");
  tercerDiv.classList.add("tercerDiv");

  const vientoContenedor = document.createElement("div");
  vientoContenedor.classList.add("contenedor");

  const vientoIcon = document.createElement("img");
  vientoIcon.src = "./wind.svg";
  vientoContenedor.appendChild(vientoIcon);

  const tituloViento = document.createElement("div");
  tituloViento.classList.add("tituloViento");
  tituloViento.textContent = "Viento";
  vientoContenedor.appendChild(tituloViento);

  tercerDiv.appendChild(vientoContenedor);

  if (
    response.hasOwnProperty("wind") &&
    response.wind.hasOwnProperty("speed")
  ) {
    let speedConverted = "";
    if ((unidadVelocidad = "km/h")) {
      speedConverted = response.wind.speed * 3.6;
    } else if ((unidadVelocidad = "m/h")) {
      speedConverted = response.wind.speed;
    }

    const speedContenedor = document.createElement("div");
    speedContenedor.classList.add("contenedor");

    const speedIcon = document.createElement("img");
    speedIcon.src = "./wind-stream.svg";
    speedContenedor.appendChild(speedIcon);

    const speedTitulo = document.createElement("div");
    speedTitulo.classList.add("titulo");
    speedTitulo.textContent = "Constante";
    speedContenedor.appendChild(speedTitulo);

    const speedValor = document.createElement("div");
		speedValor.classList.add("valor");
		speedValor.textContent = `${speedConverted.toFixed(
      0
		)} ${unidadVelocidad}`;
		speedContenedor.appendChild(speedValor);

		tercerDiv.appendChild(speedContenedor);

  }

  if (response.hasOwnProperty("wind") && response.wind.hasOwnProperty("deg")) {
    const deg = response.wind.deg;
    let direccionViento = "";
    if (deg > 337.5 && deg <= 22.5) {
      direccionViento = "Norte";
    } else if (deg > 22.5 && deg <= 67.5) {
      direccionViento = "Nor-Este";
    } else if (deg > 67.5 && deg <= 112.5) {
      direccionViento = "Este";
    } else if (deg > 112.5 && deg <= 157.5) {
      direccionViento = "Sur-Este";
    } else if (deg > 157.5 && deg <= 202.5) {
      direccionViento = "Sur";
    } else if (deg > 202.5 && deg <= 247.5) {
      direccionViento = "Sur-Oeste";
    } else if (deg > 247.5 && deg <= 292.5) {
      direccionViento = "Oeste";
    } else if (deg > 292.5 && deg <= 337.5) {
      direccionViento = "Nor-Oeste";
    }

    const direccion = document.createElement("div");
    direccion.textContent = `Desde el ${direccionViento}`;
    tercerDiv.appendChild(direccion);
  }

  if (response.hasOwnProperty("wind") && response.wind.hasOwnProperty("gust")) {
    let speedConverted = "";
    if ((unidadVelocidad = "km/h")) {
      speedConverted = response.wind.gust * 3.6;
    } else if ((unidadVelocidad = "m/h")) {
      speedConverted = response.wind.gust;
    }

    const gust = document.createElement("div");
    gust.textContent = `Ráfagas de: ${speedConverted.toFixed(
      0
    )} ${unidadVelocidad}`;
    tercerDiv.appendChild(gust);
  }

  contenedorInfo.appendChild(tercerDiv);

  // cuartoDiv
  const cuartoDiv = document.createElement("div");
  cuartoDiv.classList.add("cuartoDiv");

  const salidaSol = document.createElement("div");
  salidaSol.textContent = `Salida del Sol: ${format(
    fromUnixTime(response.sys.sunrise),
    "h:mm aa"
  )}`;
  cuartoDiv.appendChild(salidaSol);

  const puestaSol = document.createElement("div");
  puestaSol.textContent = `Puesta del Sol: ${format(
    fromUnixTime(response.sys.sunset),
    "h:mm aa"
  )}`;
  cuartoDiv.appendChild(puestaSol);

  const latitud = document.createElement("div");
  latitud.textContent = `Latitud: ${response.coord.lat}`;
  cuartoDiv.appendChild(latitud);

  const longitud = document.createElement("div");
  longitud.textContent = `Longitud: ${response.coord.lon}`;
  cuartoDiv.appendChild(longitud);

  const zonaHoraria = document.createElement("div");
  let zH;
  if (response.timezone > 0) {
    zH = `+${response.timezone / 3600}`;
  } else if (response.timezone < 0) {
    zH = response.timezone / 3600;
  }
  zonaHoraria.textContent = `Zona Horaria: GMT${zH}`;
  cuartoDiv.appendChild(zonaHoraria);

  contenedorInfo.appendChild(cuartoDiv);

  console.log(response);
  infoMeteoPronostico(response.coord.lat, response.coord.lon);
}

function mostrarInfoMeteoPronosticoDOM(response) {
  console.log(response);
}

function errorLugarAcoordenadasDOM() {
  contenedorInfo.textContent = `Hubo un error buscando el lugar, intente nuevamente. ${error}`;
}

function errorInfoMeteoDOM(error) {
  contenedorInfo.textContent = `Hubo un error cargando la información meteorológica, intente nuevamente. ${error}`;
}

function errorInfoMeteoPronosticoDOM() {
  contenedorInfo.textContent = `Hubo un error cargando el pronóstico meteorológico, intente nuevamente. ${error}`;
}

export {
  buscarDOM,
  encontradoDOM,
  mostrarInfoMeteoDOM,
  mostrarInfoMeteoPronosticoDOM,
  errorLugarAcoordenadasDOM,
  errorInfoMeteoDOM,
  errorInfoMeteoPronosticoDOM
};

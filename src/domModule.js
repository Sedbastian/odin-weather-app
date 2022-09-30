import {
  lugarAcoordenadas,
  infoMeteo,
  infoMeteoPronostico,
  unidades,
} from "./apisModule";

import { format, fromUnixTime } from "date-fns";

const contenedorInfo = document.createElement("div");
contenedorInfo.classList.add("contenedorInfo");
const divBuscar = document.querySelector("main");
divBuscar.appendChild(contenedorInfo);

function buscarLugarDOM(event) {
  if (event.key !== undefined) {
    if (event.key !== "Enter") {
      return;
    }
  }

  const resultados = document.querySelector(".resultados");
  if (resultados) {
    resultados.remove();
  }
  contenedorInfo.textContent = "Buscando lugar...";

  const buscarInput = document.querySelector("input");

  if (buscarInput.value.toLocaleLowerCase().includes("venancia")) {
    requestInfoMeteoDOM(
      "Finca La Venancia, Santa Vera Cruz",
      "-28.678611",
      "-66.958122"
    );
  } else if (
    buscarInput.value.toLocaleLowerCase().includes("vera cruz") ||
    buscarInput.value.toLocaleLowerCase().includes("veracruz")
  ) {
    requestInfoMeteoDOM(
      "Santa Vera Cruz, La Rioja",
      "-28.678611",
      "-66.958122"
    );
  } else if (buscarInput.value.toLocaleLowerCase().includes("constancia")) {
    requestInfoMeteoDOM(
      "La Constancia, Delta del Tigre",
      "-34.308113",
      "-58.567997"
    );
  } else {
    lugarAcoordenadas(buscarInput.value);
  }
}

function llamarBuscarCoordenadasDOM(event) {
  if (event.key !== undefined) {
    if (event.key !== "Enter") {
      return;
    }
  }

  const lat = document.querySelector("#latitud").value;
  const lon = document.querySelector("#longitud").value;
  requestInfoMeteoDOM(`Latidud: ${lat}, Longitud: ${lon}`, lat, lon);
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
  divCargando.textContent = "Cargando información meteorológica...";
  contenedorInfo.appendChild(divCargando);

  infoMeteo(lat, lon);
}

function mostrarInfoMeteoDOM(response) {
  document.querySelector(".divCargando").remove();

  // primerDiv
  const primerDiv = document.querySelector(".primerDiv");

  if (response.hasOwnProperty("weather")) {
    response.weather.forEach((element) => {
      if (element.hasOwnProperty("description")) {
        const descripcion = element.description;
        const enMayus =
          descripcion.slice(0, 1).toUpperCase() + descripcion.slice(1);
        const divDescripcion = document.createElement("div");
        divDescripcion.textContent = enMayus;
        primerDiv.appendChild(divDescripcion);
      }

      const descriptionIcon = document.createElement("div");
      descriptionIcon.classList.add("icon");
      if (element.hasOwnProperty("icon")) {
        const img = document.createElement("img");
        img.src = `https://openweathermap.org/img/wn/${element.icon}@4x.png`;
        descriptionIcon.appendChild(img);
      }
      primerDiv.appendChild(descriptionIcon);
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
    segundoDiv.appendChild(
      crearContenedor(
        "./resources/weather-cloudy-48-regular.svg",
        "Nubosidad",
        `${response.clouds.all}%`
      )
    );
  }

  if (
    response.hasOwnProperty("main") &&
    response.main.hasOwnProperty("humidity")
  ) {
    segundoDiv.appendChild(
      crearContenedor(
        "./resources/humedad.svg",
        "Humedad",
        `${response.main.humidity}%`
      )
    );
  }

  if (
    response.hasOwnProperty("main") &&
    response.main.hasOwnProperty("pressure")
  ) {
    segundoDiv.appendChild(
      crearContenedor(
        "./resources/pressure.svg",
        "Presión",
        `${response.main.pressure} hPa`
      )
    );
  }

  contenedorInfo.appendChild(segundoDiv);

  // tercerDiv
  const tercerDiv = document.createElement("div");
  tercerDiv.classList.add("tercerDiv");

  const vientoContenedor = document.createElement("div");
  vientoContenedor.classList.add("contenedor");

  const vientoIcon = document.createElement("img");
  vientoIcon.src = "./resources/wind.svg";
  vientoContenedor.appendChild(vientoIcon);

  const tituloViento = document.createElement("div");
  tituloViento.classList.add("tituloViento");
  tituloViento.textContent = "Viento";
  vientoContenedor.appendChild(tituloViento);

  if (response.hasOwnProperty("wind") && response.wind.hasOwnProperty("deg")) {
    const direccionContenedor = document.createElement("div");
    direccionContenedor.classList.add("valor");

    const flechaDiv = document.createElement("div");
    flechaDiv.classList.add("flecha");

    const flechaSvg = document.createElement("img");
    flechaSvg.src = "./resources/navigation.svg";

    flechaDiv.appendChild(flechaSvg);
    direccionContenedor.appendChild(flechaDiv);

    const deg = response.wind.deg;
    let direccionViento = "";

    if ((deg > 337.5 && deg <= 360) || (deg >= 0 && deg <= 22.5)) {
      direccionViento = "Norte";
      flechaDiv.style.transform = "rotate(180deg)";
    } else if (deg > 22.5 && deg <= 67.5) {
      direccionViento = "Nor-Este";
      flechaDiv.style.transform = "rotate(225deg)";
    } else if (deg > 67.5 && deg <= 112.5) {
      direccionViento = "Este";
      flechaDiv.style.transform = "rotate(270deg)";
    } else if (deg > 112.5 && deg <= 157.5) {
      direccionViento = "Sur-Este";
      flechaDiv.style.transform = "rotate(315deg)";
    } else if (deg > 157.5 && deg <= 202.5) {
      direccionViento = "Sur";
      flechaDiv.style.transform = "rotate(0deg)";
    } else if (deg > 202.5 && deg <= 247.5) {
      direccionViento = "Sur-Oeste";
      flechaDiv.style.transform = "rotate(45deg)";
    } else if (deg > 247.5 && deg <= 292.5) {
      direccionViento = "Oeste";
      flechaDiv.style.transform = "rotate(90deg)";
    } else if (deg > 292.5 && deg <= 337.5) {
      direccionViento = "Nor-Oeste";
      flechaDiv.style.transform = "rotate(135deg)";
    }

    const direccion = document.createElement("div");
    direccion.classList.add("direccion");
    direccion.textContent = `Desde el ${direccionViento}`;
    direccionContenedor.appendChild(direccion);

    vientoContenedor.appendChild(direccionContenedor);
  }

  tercerDiv.appendChild(vientoContenedor);

  let unidadVelocidad = "";
  if (unidades === "metric") {
    unidadVelocidad = "km/h";
  } else if (unidades === "imperial") {
    unidadVelocidad = "m/h";
  }

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

    tercerDiv.appendChild(
      crearContenedor(
        "./resources/wind-stream.svg",
        "Constante",
        `${speedConverted.toFixed(0)} ${unidadVelocidad}`
      )
    );
  }

  if (response.hasOwnProperty("wind") && response.wind.hasOwnProperty("gust")) {
    let speedConverted = "";
    if ((unidadVelocidad = "km/h")) {
      speedConverted = response.wind.gust * 3.6;
    } else if ((unidadVelocidad = "m/h")) {
      speedConverted = response.wind.gust;
    }

    tercerDiv.appendChild(
      crearContenedor(
        "./resources/wind-gusts.svg",
        "Ráfagas de",
        `${speedConverted.toFixed(0)} ${unidadVelocidad}`
      )
    );
  }

  contenedorInfo.appendChild(tercerDiv);

  // cuartoDiv
  const cuartoDiv = document.createElement("div");
  cuartoDiv.classList.add("cuartoDiv");

  cuartoDiv.appendChild(
    crearContenedor(
      "./resources/sunrise.svg",
      "Salida del Sol",
      format(fromUnixTime(response.sys.sunrise), "h:mm aa")
    )
  );

  cuartoDiv.appendChild(
    crearContenedor(
      "./resources/sunset.svg",
      "Puesta del Sol",
      format(fromUnixTime(response.sys.sunset), "h:mm aa")
    )
  );

  cuartoDiv.appendChild(
    crearContenedor(
      "./resources/world-latitude.svg",
      "Latitud",
      response.coord.lat
    )
  );

  cuartoDiv.appendChild(
    crearContenedor(
      "./resources/world-longitude.svg",
      "Longitud",
      response.coord.lon
    )
  );

  let zonaHoraria;
  if (response.timezone > 0) {
    zonaHoraria = `+${response.timezone / 3600}`;
  } else if (response.timezone < 0) {
    zonaHoraria = response.timezone / 3600;
  }

  cuartoDiv.appendChild(
    crearContenedor(
      "./resources/moment-timezone.svg",
      "Zona Horaria",
      `GMT${zonaHoraria}`
    )
  );

  contenedorInfo.appendChild(cuartoDiv);

  console.log(response);
  infoMeteoPronostico(response.coord.lat, response.coord.lon);
}

function crearContenedor(iconLocation, tituloString, valorString) {
  const contenedor = document.createElement("div");
  contenedor.classList.add("contenedor");

  const icon = document.createElement("img");
  icon.src = iconLocation;
  contenedor.appendChild(icon);

  const titulo = document.createElement("div");
  titulo.textContent = tituloString;
  contenedor.appendChild(titulo);

  const valor = document.createElement("div");
  valor.classList.add("valor");
  valor.textContent = valorString;
  contenedor.appendChild(valor);

  return contenedor;
}

function mostrarInfoMeteoPronosticoDOM(response) {
  console.log(response);
}

function errorLugarAcoordenadasDOM(error) {
  contenedorInfo.textContent = `Hubo un error buscando el lugar, intente nuevamente. ${error}`;
}

function errorInfoMeteoDOM(error) {
  contenedorInfo.textContent = `Hubo un error cargando la información meteorológica, intente nuevamente. ${error}`;
}

function errorInfoMeteoPronosticoDOM(error) {
  contenedorInfo.textContent = `Hubo un error cargando el pronóstico meteorológico, intente nuevamente. ${error}`;
}

export {
  buscarLugarDOM,
  llamarBuscarCoordenadasDOM,
  encontradoDOM,
  mostrarInfoMeteoDOM,
  mostrarInfoMeteoPronosticoDOM,
  errorLugarAcoordenadasDOM,
  errorInfoMeteoDOM,
  errorInfoMeteoPronosticoDOM,
};

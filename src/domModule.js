import { lugarAcoordenadas, infoMeteo } from "./apisModule";

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
  console.log(response);
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

  const h2lugar = document.createElement("h2");
  h2lugar.textContent = lugar;
	contenedorInfo.appendChild(h2lugar);
	
	const divCargando = document.createElement("div");
	divCargando.classList.add("divCargando");
	divCargando.textContent = "Cargando...";
	contenedorInfo.appendChild(divCargando);

  infoMeteo(lat, lon);
}

function mostrarInfoMeteoDOM(response) {
	document.querySelector(".divCargando").remove();
	console.log(response);
}

function errorLugarAcoordenadasDOM(error) {
  contenedorInfo.textContent =
    "Hubo un error buscando el lugar, intente nuevamente.";
}

function errorInfoMeteoDOM(error) {
  contenedorInfo.textContent =
    "Hubo un error cargando la información meteorológica, intente nuevamente.";
}

export {
  buscarDOM,
  encontradoDOM,
  errorLugarAcoordenadasDOM,
  errorInfoMeteoDOM,
  mostrarInfoMeteoDOM
};

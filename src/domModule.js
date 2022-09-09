import { lugarAcoordenadas, infoMeteo } from "./apisModule";

const buscarInput = document.querySelector("input");

const divCargando = document.createElement("div");
divCargando.classList.add("divCargando");
const divBuscar = document.querySelector(".buscarLugar");
divBuscar.appendChild(divCargando);

function buscarDOM() {
  divCargando.textContent = "Cargando...";
  
	lugarAcoordenadas(buscarInput.value);
}

function encontradoDOM(response) {
	if (response.length === 0) {
		divCargando.textContent = "No se encontró el lugar." 
	} else if (response.length === 1){
		infoMeteo (response[0].lat, response[0].lon);
	} else if (response.length > 1) {
		divCargando.textContent = `Se encontraron ${response.length} resultados:`;
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
			resultado.textContent = `${nombre}`;
			if (response[index].hasOwnProperty("state")) {
				resultado.textContent = resultado.textContent + `, ${response[index].state}`;
			};
			if (response[index].hasOwnProperty("country")) {
				resultado.textContent = resultado.textContent + `, ${response[index].country}`;
			}
			divBuscar.appendChild(resultado);
			
		}
		
	}
	console.log(response);
}

export { buscarDOM, encontradoDOM };

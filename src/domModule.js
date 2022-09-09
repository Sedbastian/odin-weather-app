import { lugarAcoordenadas } from "./apisModule";

const buscarInput = document.querySelector("input");

function buscar () {
	lugarAcoordenadas(buscarInput.value);
}

export { buscar };
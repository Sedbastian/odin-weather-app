import "./style.css";
import { buscarLugarDOM, llamarBuscarCoordenadasDOM } from "./domModule";

const botonBuscarLugar = document.querySelector(".lugarBoton");
botonBuscarLugar.addEventListener("click", buscarLugarDOM);

const botonBuscarCoordenadas = document.querySelector(".coordenadasBoton");
botonBuscarCoordenadas.addEventListener("click", llamarBuscarCoordenadasDOM);
import "./style.css";
import { buscarLugarDOM, llamarBuscarCoordenadasDOM } from "./domModule";

const botonBuscarLugar = document.querySelector(".lugarBoton");
botonBuscarLugar.addEventListener("click", buscarLugarDOM);

const buscarInput = document.querySelector("#lugar");
buscarInput.addEventListener("keydown", buscarLugarDOM);

const botonBuscarCoordenadas = document.querySelector(".coordenadasBoton");
botonBuscarCoordenadas.addEventListener("click", llamarBuscarCoordenadasDOM);

const latitudInput = document.querySelector("#latitud");
latitudInput.addEventListener("keydown", llamarBuscarCoordenadasDOM);

const longitudInput = document.querySelector("#longitud");
longitudInput.addEventListener("keydown", llamarBuscarCoordenadasDOM);
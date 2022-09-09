import "./style.css";
import { buscar } from "./domModule";

import { dropDown } from "@lifrimorlon/uxlifri";

const botonBuscar = document.querySelector("button");
botonBuscar.addEventListener("click", buscar);



const menuSegundo = {
	Name: "Rarísimo",
  "Corchi Polin": "leindk",
  "Chacul Manen": "leika",
  "Carpit Lonmon": "lonm"
};

dropDown("buscarLugar", "2", menuSegundo);

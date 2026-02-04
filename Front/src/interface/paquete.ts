import { Ciudad } from "./ciudad.js";
import { Comentario } from "./comentario.js";
import { Estadia } from "./estadia.js";
import { paqueteExcursion } from "./paqueteExcursion.js";
import { PaqueteTransporte } from "./paqueteTransporte.js";

export interface Paquete {
  id: number;
  nombre: string;
  estado: number;
  descripcion: string;
  detalle: string;
  imagen: string;
  ciudad: Ciudad;
  comentarios?: Comentario[];
  estadias?: Estadia[];
  paqueteExcursiones?: paqueteExcursion[];
  paqueteTransportes?: PaqueteTransporte[];
}

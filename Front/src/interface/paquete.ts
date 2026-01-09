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
  precio: number;
  fecha_ini: string;
  fecha_fin: string;
  imagen: string;
  comentarios?: Comentario[];
  estadias?: Estadia[];
  paqueteExcursiones?: paqueteExcursion[];
  paqueteTransportes?: PaqueteTransporte[];
}

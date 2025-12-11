import { Hotel } from "./hotel";

export interface Estadia {
  id: number;
  id_paquete: number;
  fecha_ini: string;
  fecha_fin: string;
  precio_x_dia: number;
  hotel: Hotel;
}
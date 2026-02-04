import { Hotel } from "./hotel";

export interface Estadia {
  id: number;
  id_paquete?: number;
  paquete?: any;
  fecha_ini: string;
  fecha_fin: string;
  hotel: Hotel;
}

import { Paquete } from "./paquete";
import { Transporte } from "./transporte";

export interface PaqueteTransporte {
  id: number;
  paquete: Paquete;
  transporte: Transporte;
  dia: string;
  horario: string;
  precio: number;
  es_ida: boolean;
}

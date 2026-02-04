import { Paquete } from "./paquete";
import { Transporte } from "./transporte";

export interface PaqueteTransporte {
  id: number;
  paquete: Paquete;
  transporte: Transporte;
  fecha: string;
  tipo: "IDA" | "VUELTA";
}

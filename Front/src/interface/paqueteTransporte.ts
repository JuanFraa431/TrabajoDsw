import { Paquete } from "./paquete";
import { TipoTransporte } from "./tipoTransporte";
import { Ciudad } from "./ciudad";

export interface PaqueteTransporte {
  id: number;
  paquete: Paquete;
  tipoTransporte: TipoTransporte;
  ciudadOrigen: Ciudad;
  ciudadDestino: Ciudad;
  fecha_salida: string;
  fecha_llegada: string;
  nombre_empresa: string;
  mail_empresa: string;
  capacidad: number;
  asientos_disponibles: number;
  precio: number;
  tipo: "IDA" | "VUELTA";
  activo?: boolean;
}

import { Ciudad } from "./ciudad";
import { TipoTransporte } from "./tipoTransporte";
import { Paquete } from "./paquete";

export interface Transporte {
  id: number;
  paquete?: Paquete;
  tipoTransporte?: TipoTransporte;
  ciudadOrigen?: Ciudad;
  ciudadDestino?: Ciudad;
  fecha_salida?: string;
  fecha_llegada?: string;
  nombre?: string;
  descripcion?: string;
  nombre_empresa: string;
  mail_empresa: string;
  capacidad: number;
  asientos_disponibles?: number;
  precio?: number;
  tipo?: "IDA" | "VUELTA";
  activo?: boolean;
  estado?: number;
}

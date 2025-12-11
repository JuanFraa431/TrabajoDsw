import { Ciudad } from './ciudad';
import { TipoTransporte } from './tipoTransporte';

export interface Transporte {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  tipoTransporte?: TipoTransporte;
  nombre_empresa: string;
  mail_empresa: string;
  ciudadOrigen?: Ciudad;
  ciudadDestino?: Ciudad;
  fecha_salida?: string;
  fecha_llegada?: string;
  precio?: number;
  asientos_disponibles?: number;
  activo?: boolean;
}

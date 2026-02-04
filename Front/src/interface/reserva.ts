export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_nacimiento: string;
}

export type ReservaEstado = "PENDIENTE" | "PAGADA" | "CANCELADA";
export type PagoEstado = "PENDIENTE" | "APROBADO" | "RECHAZADO";

export interface Pago {
  id: number;
  monto: number;
  metodoDePago: string;
  fecha: string;
  estado?: PagoEstado;
  tipoFactura?: string;
  nombreFacturacion?: string;
  apellidoFacturacion?: string;
  dniFacturacion?: string;
  telefonoFacturacion?: string;
  emailFacturacion?: string;
  nombreTitular?: string;
  ultimos4?: string;
  proveedor?: string;
  transaccionId?: string;
}

export interface Ciudad {
  id: number;
  nombre: string;
  pais: string;
}

export interface Hotel {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  ciudad: Ciudad;
}

export interface Estadia {
  id: number;
  fecha_ini: string;
  fecha_fin: string;
  hotel: Hotel;
}

export interface Excursion {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  ciudad: Ciudad;
}

export interface PaqueteExcursion {
  id: number;
  excursion: Excursion;
  fecha?: string;
}

export interface PaqueteTransporte {
  id: number;
  transporte: any;
  fecha?: string;
  tipo?: "IDA" | "VUELTA";
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  detalle: string;
  imagen: string;
  ciudad: Ciudad;
  estadias: Estadia[];
  paqueteExcursiones: PaqueteExcursion[];
  paqueteTransportes?: PaqueteTransporte[];
}

export interface ReservaPaquete {
  id: number;
  fecha: string;
  fecha_cancelacion?: string;
  motivo_cancelacion?: string;
  estado: ReservaEstado;
  paquete: Paquete;
  personas: Persona[];
  pago: Pago;
  usuario?: any; // Usuario que hizo la reserva
}

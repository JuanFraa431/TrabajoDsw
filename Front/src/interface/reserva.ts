export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_nacimiento: string;
}

export interface Pago {
  id: number;
  monto: number;
  metodo_pago: string;
  fecha: string;
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
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  detalle: string;
  fecha_ini: string;
  fecha_fin: string;
  precio: number;
  imagen: string;
  estadias: Estadia[];
  paqueteExcursiones: PaqueteExcursion[];
}

export interface ReservaPaquete {
  id: number;
  fecha: string;
  fecha_cancelacion?: string;
  motivo_cancelacion?: string;
  estado: string;
  paquete: Paquete;
  personas: Persona[];
  pago: Pago;
}

import { Ciudad } from './ciudad';

export interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  descripcion: string;
  telefono: string;
  email: string;
  estrellas: number;
  precio_x_dia: number;
  id_ciudad?: number; // For form data
  ciudad?: Ciudad; // For populated data from backend
}
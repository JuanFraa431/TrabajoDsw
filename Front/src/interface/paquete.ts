import { Comentario } from "./comentario.js";
import { Estadia } from "./estadia.js";

export interface Paquete {
    id: number;
    nombre: string;
    estado: number;
    descripcion: string;
    detalle: string;
    precio: number;
    fecha_ini: string;
    fecha_fin: string;
    imagen: string;
    comentarios: Comentario[];
    estadias: Estadia[];
}
export interface Comentario {
  id: number;
  paquete: number;
  fecha: string;
  descripcion: string;
  estrellas: number;
  cliente: {
    id: number;
    username: string;
    imagen: string;
  };
}
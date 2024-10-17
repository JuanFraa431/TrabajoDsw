export interface Comentario {
  id: number;
  id_cliente: number;
  id_paquete: number;
  fecha: string;
  descripcion: string;
  estrellas: number;
  cliente: {
    username: string;
    imagen: string;
  };
}
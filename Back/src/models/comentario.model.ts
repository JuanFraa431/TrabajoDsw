export class Comentario {
  constructor(
    public id: number,
    public id_cliente: number,
    public id_paquete: number,
    public fecha: string, 
    public descripcion: string,
    public estrellas: number
  ) {}
}
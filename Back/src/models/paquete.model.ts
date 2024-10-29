export class Paquete {
  constructor(
    public id: number,
    public nombre: string,
    public estado: string,
    public descripcion: string,
    public detalle: string,
    public precio: number,
    public fecha_ini : string,
    public fecha_fin : string,
    public imagen: string
  ) {}
}
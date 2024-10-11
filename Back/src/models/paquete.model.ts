export class Paquete {
  constructor(
    public id: number,
    public estado: string,
    public descripcion: string,
    public precio: number,
    public fecha_ini : string,
    public fecha_fin : string,
    public imagen: string
  ) {}
}